// Copyright (c) 2026, Ravindu Gajanayaka
// Licensed under GPLv3. See license.txt

import {
  createRouter,
  createWebHistory,
  createMemoryHistory,
  createWebHashHistory,
} from "vue-router";

const routes = [
  {
    path: "/setup",
    component: () => import("./views/Setup.vue"),
    name: "Setup",
  },
  {
    path: "/sync",
    component: () => import("./views/InitialSync.vue"),
    name: "InitialSync",
  },
  {
    path: "/login-pin",
    component: () => import("./views/LoginPin.vue"),
    name: "LoginPin",
  },
  {
    path: "/",
    component: () => import("./views/POS.vue"),
    name: "POS",
    meta: { requiresShift: true },
  },
  {
    path: "/open",
    component: () => import("./views/OpenShift.vue"),
    name: "OpenShift",
  },
  {
    path: "/close",
    component: () => import("./views/CloseShift.vue"),
    name: "CloseShift",
    meta: { requiresShift: true },
  },
  {
    path: "/orders",
    component: () => import("./views/Orders.vue"),
    name: "Orders",
    meta: { requiresShift: true },
  },
  {
    path: "/display",
    component: () => import("./views/CustomerPoleDisplay.vue"),
    name: "PoleDisplay",
  },
  {
    path: "/customers",
    component: () => import("./views/CustomerDisplay.vue"),
    name: "Customers",
  },
  {
    path: "/customers/:id",
    component: () => import("./views/CustomerDisplay.vue"),
    name: "CustomerDetail",
  },
  {
    path: "/stock",
    name: "Stock",
    redirect: { name: "StockDashboard" },
    component: () => import("./views/Stock.vue"),
    meta: { requiresShift: true },
    children: [
      {
        path: "",
        name: "StockDashboard",
        component: () => import("./views/StockDashboard.vue"),
      },
      {
        path: "entry",
        name: "StockEntry",
        component: () => import("./views/StockEntry.vue"),
      },
      {
        path: "new",
        name: "NewStock",
        component: () => import("./views/StockEntry.vue"),
      },
      {
        path: "invoices",
        name: "StockInvoices",
        component: () => import("./views/StockList.vue"),
      },
      {
        path: "list",
        name: "StockList",
        component: () => import("./views/StockList.vue"),
      },
    ],
  },
  {
    path: "/kiosk",
    component: () => import("./views/SelfCheckout.vue"),
    name: "SelfCheckout",
  },
  {
    path: "/settings",
    component: () => import("./views/Settings.vue"),
    name: "Settings",
    meta: { requiresShift: true },
  },
];

export function createAppRouter(isDeskMode: boolean) {
  // Desk mode: memory history — URL stays as /app/pos-terminal, routing is in-memory
  // Standalone mode: history routing with /pos-prime base
  // Electron mode: hash routing since file:// protocol does not support pushState
  const isElectron =
    typeof window !== "undefined" && !!(window as any).ipcRenderer;
  const historyMode = isDeskMode
    ? createMemoryHistory()
    : isElectron
      ? createWebHashHistory()
      : createWebHistory("/pos-prime");

  const router = createRouter({
    history: historyMode,
    routes,
  });

  router.beforeEach(async (to) => {
    if (to.meta.requiresShift) {
      const { usePosSessionStore } = await import("./stores/posSession");
      const { useSettingsStore } = await import("./stores/settings");
      const sessionStore = usePosSessionStore();
      // 1. Check for Cashier Login
      const { useCashiersStore } = await import("./stores/cashiers");
      const cashiersStore = useCashiersStore();
      if (!cashiersStore.currentCashier) {
        return { name: "LoginPin" };
      }

      // 2. Check for Open Shift
      if (!sessionStore.hasOpenShift && !sessionStore.loading) {
        try {
          await sessionStore.checkOpeningEntry();
        } catch {
          // ignore
        }
        if (!sessionStore.hasOpenShift) {
          return { name: "OpenShift" };
        }
      }

      // After attempting to sync online (if needed), check if we are allowed to proceed offline
      try {
        const { validateOfflineSecurity } = await import("./utils/security");
        validateOfflineSecurity();
      } catch (err: any) {
        cashiersStore.logout();
        const reason =
          err.message === "SYSTEM_LOCKED_TIME_TAMPERING"
            ? "system_locked"
            : "license_expired";
        return { name: "LoginPin", query: { error: reason } };
      }

      // 3. Ensure POS Profile (and currency) is loaded for all shift-required pages
      const settingsStore = useSettingsStore();
      if (!settingsStore.posProfile && sessionStore.posProfile) {
        try {
          await settingsStore.loadPOSProfile(sessionStore.posProfile);
        } catch {
          // ignore — POS view will retry
        }
      }
    }
  });

  return router;
}
