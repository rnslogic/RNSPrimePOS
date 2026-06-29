import { defineStore } from "pinia";
import { ref, watch } from "vue";

export interface Cashier {
  title: string;
  cashier_name: string;
  pin: string;
}

export const useCashiersStore = defineStore("cashiers", () => {
  const cashiers = ref<Cashier[]>([]);
  const currentCashier = ref<Cashier | null>(null);
  const offlineLogs = ref<any[]>([]);

  // Initialize from localStorage
  const savedCashiers = localStorage.getItem("pos_cashiers");
  if (savedCashiers) {
    try {
      cashiers.value = JSON.parse(savedCashiers);
    } catch (e) {
      console.error("Failed to parse saved cashiers", e);
    }
  }

  // Restore offline logs
  const savedLogs = localStorage.getItem("pos_cashier_logs");
  if (savedLogs) {
    try {
      offlineLogs.value = JSON.parse(savedLogs);
    } catch (e) {
      console.error("Failed to parse offline logs", e);
    }
  }

  const defaultAdmin = { title: "Admin", cashier_name: "Admin", pin: "1234" };

  // Ensure Admin exists on load
  if (cashiers.value.length === 0) {
    cashiers.value = [defaultAdmin];
    localStorage.setItem("pos_cashiers", JSON.stringify(cashiers.value));
  } else if (
    !cashiers.value.find(
      (c) => c.title === "Admin" || c.cashier_name === "Admin",
    )
  ) {
    cashiers.value.push(defaultAdmin);
    localStorage.setItem("pos_cashiers", JSON.stringify(cashiers.value));
  }

  // Restore current cashier session
  const savedCurrent = sessionStorage.getItem("pos_current_cashier");
  if (savedCurrent) {
    try {
      currentCashier.value = JSON.parse(savedCurrent);
    } catch (e) {
      console.error("Failed to parse current cashier", e);
    }
  }

  // Watch for changes to save back to localStorage
  watch(
    cashiers,
    (newVal) => {
      localStorage.setItem("pos_cashiers", JSON.stringify(newVal));
    },
    { deep: true },
  );

  watch(
    currentCashier,
    (newVal) => {
      if (newVal) {
        sessionStorage.setItem("pos_current_cashier", JSON.stringify(newVal));
      } else {
        sessionStorage.removeItem("pos_current_cashier");
      }
    },
    { deep: true },
  );

  watch(
    offlineLogs,
    (newVal) => {
      localStorage.setItem("pos_cashier_logs", JSON.stringify(newVal));
    },
    { deep: true },
  );

  async function pushCashierLog(
    cashier_title: string,
    log_type: "Check-in" | "Check-out",
  ) {
    const logDoc = {
      doctype: "POS Cashier Log",
      cashier: cashier_title,
      log_type: log_type,
      time: new Date().toISOString().replace("T", " ").split(".")[0],
      offline_id: crypto.randomUUID(),
    };

    try {
      const { call } = await import("frappe-ui");
      await call("frappe.client.insert", { doc: logDoc });
      syncOfflineLogs();
    } catch (e) {
      console.warn("Network error, queueing cashier log:", log_type);
      offlineLogs.value.push(logDoc);
    }
  }

  async function syncOfflineLogs() {
    if (offlineLogs.value.length === 0) return;
    try {
      const { call } = await import("frappe-ui");
      const pending = [...offlineLogs.value];
      offlineLogs.value = []; // Clear early to prevent duplicates on concurrent calls

      for (const logDoc of pending) {
        try {
          await call("frappe.client.insert", { doc: logDoc });
        } catch (e: any) {
          if (
            e &&
            e.messages &&
            typeof e.messages[0] === "string" &&
            e.messages[0].includes("Duplicate")
          ) {
            // Already exists, discard
            continue;
          }
          // Put back on failure
          offlineLogs.value.push(logDoc);
        }
      }
    } catch (err) {
      console.warn("Failed to sync offline logs", err);
    }
  }

  async function fetchCashiers() {
    try {
      const { call } = await import("frappe-ui");
      const cashiersRes = await call("frappe.client.get_list", {
        doctype: "POS Cashier",
        fields: ["title", "cashier_name", "pin"],
        limit_page_length: 100,
      });
      if (cashiersRes && cashiersRes.length > 0) {
        setCashiers(cashiersRes);
      }
    } catch (e: any) {
      console.error("Failed to fetch cashiers from backend", e);
      throw e.message || e.exc_type || JSON.stringify(e) || "Unknown error";
    }
  }

  function login(title: string, pin: string): boolean {
    const cashier = cashiers.value.find(
      (c) => c.title === title && c.pin === pin,
    );
    if (cashier) {
      currentCashier.value = cashier;
      pushCashierLog(cashier.title, "Check-in");
      return true;
    }
    return false;
  }

  function logout() {
    if (currentCashier.value) {
      pushCashierLog(currentCashier.value.title, "Check-out");
    }
    currentCashier.value = null;
  }

  function addCashier(cashier: Cashier) {
    if (!cashiers.value.find((c) => c.title === cashier.title)) {
      cashiers.value.push(cashier);
    }
  }

  function updateCashier(oldTitle: string, updatedCashier: Cashier) {
    const index = cashiers.value.findIndex((c) => c.title === oldTitle);
    if (index !== -1) {
      cashiers.value[index] = updatedCashier;
      if (currentCashier.value?.title === oldTitle) {
        currentCashier.value = updatedCashier;
      }
    }
  }

  function deleteCashier(title: string) {
    cashiers.value = cashiers.value.filter((c) => c.title !== title);
  }

  function setCashiers(newCashiers: Cashier[]) {
    cashiers.value = newCashiers;
    if (
      !newCashiers.find(
        (c) => c.title === "Admin" || c.cashier_name === "Admin",
      )
    ) {
      cashiers.value.push({
        title: "Admin",
        cashier_name: "Admin",
        pin: "1234",
      });
    }
  }

  return {
    cashiers,
    currentCashier,
    login,
    logout,
    addCashier,
    updateCashier,
    deleteCashier,
    setCashiers,
    pushCashierLog,
    syncOfflineLogs,
    fetchCashiers,
  };
});
