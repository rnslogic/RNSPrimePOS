import { db } from "@/database/db";
import { call } from "frappe-ui";
import { useAuthStore } from "@/stores/auth";

export class SyncManager {
  static async fullInitialSync(
    onProgress: (status: string, percent: number) => void,
  ) {
    const authStore = useAuthStore();
    if (!authStore.isConfigured) throw new Error("Not configured");

    try {
      // 1. Fetch Items
      onProgress("Downloading Items...", 10);
      const itemsRes = await call("pos_prime.api.items.get_items", {
        start: 0,
        page_length: 100000,
        search_term: "",
        item_group: "",
      });
      if (itemsRes?.items) {
        await db.items.clear();
        await db.items.bulkAdd(itemsRes.items);
      }

      // 2. Fetch Customers
      onProgress("Downloading Customers...", 40);
      const custRes = await call("pos_prime.api.customers.search_customers", {
        search_term: "",
      });
      if (custRes) {
        await db.customers.clear();
        await db.customers.bulkAdd(custRes);
      }

      // 3. Fetch Settings / POS Profiles
      onProgress("Downloading POS Profiles...", 70);
      const profileRes = await call(
        "pos_prime.api.pos_session.get_opening_data",
      );
      if (profileRes?.pos_profiles) {
        await db.settings.put({
          key: "pos_profiles",
          value: profileRes.pos_profiles,
        });
      }
      if (profileRes?.companies) {
        await db.settings.put({
          key: "companies",
          value: profileRes.companies,
        });
      }

      // 4. Fetch Cashiers
      onProgress("Downloading Cashiers...", 85);
      try {
        const cashiersRes = await call("frappe.client.get_list", {
          doctype: "POS Cashier",
          fields: ["title", "cashier_name", "pin"],
          limit_page_length: 100,
        });
        if (cashiersRes && cashiersRes.length > 0) {
          const { useCashiersStore } = await import("@/stores/cashiers");
          const cashiersStore = useCashiersStore();
          cashiersStore.setCashiers(cashiersRes);
          cashiersStore.syncOfflineLogs();
        }
      } catch (err) {
        console.warn("Failed to fetch cashiers, using local cache", err);
      }

      onProgress("Sync Complete!", 100);
    } catch (e: any) {
      console.error("Sync failed", e);
      throw new Error(e.message || "Failed to sync data from server");
    }
  }
}
