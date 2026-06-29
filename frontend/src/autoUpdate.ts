import { Capacitor } from "@capacitor/core";
import { CapacitorUpdater } from "@capgo/capacitor-updater";
import packageJson from "../package.json";

const GITHUB_REPO = "rnslogic/RNSPrimePOS";

// A simple semantic version comparison function
function isNewerVersion(current: string, latest: string): boolean {
  const currentParts = current.replace(/^v/, "").split(".").map(Number);
  const latestParts = latest.replace(/^v/, "").split(".").map(Number);

  for (let i = 0; i < Math.max(currentParts.length, latestParts.length); i++) {
    const c = currentParts[i] || 0;
    const l = latestParts[i] || 0;
    if (l > c) return true;
    if (l < c) return false;
  }
  return false;
}

export async function checkForOTAUpdates() {
  // OTA updates are only relevant for the native Capacitor wrapper
  if (!Capacitor.isNativePlatform()) {
    return;
  }

  try {
    // Notify Capgo that the app has successfully started
    // (Prevents reverting to previous version if this update was just applied)
    await CapacitorUpdater.notifyAppReady();

    const currentVersion = packageJson.version;
    console.log(`[OTA] Current version: ${currentVersion}`);

    // Fetch latest release from GitHub API
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`,
    );
    if (!response.ok) {
      console.warn(`[OTA] Failed to check for updates: ${response.statusText}`);
      return;
    }

    const data = await response.json();
    const latestVersion = data.tag_name; // e.g., "v1.0.1"

    if (isNewerVersion(currentVersion, latestVersion)) {
      console.log(
        `[OTA] New version found: ${latestVersion}. Searching for dist.zip...`,
      );

      // Find the zip asset
      const zipAsset = data.assets?.find((a: any) => a.name === "dist.zip");

      if (zipAsset && zipAsset.browser_download_url) {
        console.log(
          `[OTA] Downloading update from ${zipAsset.browser_download_url}...`,
        );

        // Download the zip file
        const downloadRes = await CapacitorUpdater.download({
          version: latestVersion,
          url: zipAsset.browser_download_url,
        });

        console.log(`[OTA] Update downloaded successfully. Applying...`);

        // Apply the update (this will cause the WebView to reload with the new assets)
        await CapacitorUpdater.set({
          id: downloadRes.id,
        });
      } else {
        console.warn(`[OTA] No 'dist.zip' asset found in the latest release.`);
      }
    } else {
      console.log(`[OTA] App is up to date.`);
    }
  } catch (error) {
    console.error(`[OTA] Error checking or applying update:`, error);
  }
}
