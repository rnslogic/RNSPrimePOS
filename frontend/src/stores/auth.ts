import { defineStore } from "pinia";
import { ref } from "vue";
import { db } from "@/database/db";
import { setConfig, frappeRequest } from "frappe-ui";

export const useAuthStore = defineStore("auth", () => {
  const serverUrl = ref("");
  const apiKey = ref("");
  const apiSecret = ref("");
  const isConfigured = ref(false);

  async function loadSettings() {
    const urlSetting = await db.settings.get("serverUrl");
    const keySetting = await db.settings.get("apiKey");
    const secretSetting = await db.settings.get("apiSecret");

    if (urlSetting?.value && keySetting?.value && secretSetting?.value) {
      serverUrl.value = urlSetting.value;
      apiKey.value = keySetting.value;
      apiSecret.value = secretSetting.value;
      isConfigured.value = true;
      configureFrappeUI();
    } else {
      isConfigured.value = false;
    }
  }

  async function saveSettings(url: string, key: string, secret: string) {
    // Strip trailing slash
    url = url.replace(/\/$/, "");

    await db.settings.put({ key: "serverUrl", value: url });
    await db.settings.put({ key: "apiKey", value: key });
    await db.settings.put({ key: "apiSecret", value: secret });

    serverUrl.value = url;
    apiKey.value = key;
    apiSecret.value = secret;
    isConfigured.value = true;

    configureFrappeUI();
  }

  function configureFrappeUI() {
    // Override frappe-ui's resourceFetcher to inject the base URL and auth headers
    setConfig("resourceFetcher", async (options: any) => {
      // Append the absolute URL if it's a relative frappe API call
      if (options.url.startsWith("/api/") || options.url.startsWith("api/")) {
        options.url = `${serverUrl.value}${options.url.startsWith("/") ? "" : "/"}${options.url}`;
      }

      // Inject API keys and strip unsupported CORS headers
      options.headers = {
        ...options.headers,
        Authorization: `token ${apiKey.value}:${apiSecret.value}`,
      };
      delete options.headers["X-Frappe-Site-Name"];
      delete options.headers["X-Frappe-CSRF-Token"];

      // We still use frappeRequest under the hood
      return await frappeRequest(options);
    });

    // frappe-ui's `call()` uses native fetch directly, bypassing resourceFetcher.
    // We monkey-patch fetch here to ensure it uses the correct serverUrl and Authorization headers
    // when running in the standalone Electron app.
    if (!(window as any).__fetchPatched) {
      const originalFetch = window.fetch;
      window.fetch = async function (
        input: RequestInfo | URL,
        init?: RequestInit,
      ) {
        if (
          typeof input === "string" &&
          (input.startsWith("/api/") || input.startsWith("api/"))
        ) {
          input = `${serverUrl.value}${input.startsWith("/") ? "" : "/"}${input}`;

          if (!init) init = {};

          if (init.headers) {
            // Delete headers that frappe-ui adds but which break CORS because
            // Frappe backend does not allow them in Access-Control-Allow-Headers
            if (init.headers instanceof Headers) {
              init.headers.delete("X-Frappe-Site-Name");
              init.headers.delete("X-Frappe-CSRF-Token");
            } else {
              delete (init.headers as any)["X-Frappe-Site-Name"];
              delete (init.headers as any)["X-Frappe-CSRF-Token"];
            }
          }

          init.headers = {
            ...init.headers,
            Authorization: `token ${apiKey.value}:${apiSecret.value}`,
          };
        }
        return originalFetch.call(window, input, init);
      };
      (window as any).__fetchPatched = true;
    }
  }

  async function logout() {
    await db.settings.clear();
    await db.items.clear();
    await db.itemPrices.clear();
    await db.customers.clear();
    isConfigured.value = false;
    serverUrl.value = "";
    apiKey.value = "";
    apiSecret.value = "";
  }

  function resolveUrl(url: string | null | undefined): string | null {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    if (url.startsWith("/")) {
      return `${serverUrl.value}${url}`;
    }
    // If it's a relative path like files/... or private/files/...
    if (url.includes("/")) {
      return `${serverUrl.value}/${url}`;
    }
    // If it's just a filename, assume public file
    return `${serverUrl.value}/files/${url}`;
  }

  return {
    serverUrl,
    apiKey,
    apiSecret,
    isConfigured,
    loadSettings,
    saveSettings,
    configureFrappeUI,
    logout,
    resolveUrl,
  };
});
