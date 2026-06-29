export const SECURITY_KEYS = {
  LICENSE_EXPIRY: "pos_license_expiry_date",
  LAST_ACTIVITY: "pos_last_activity_time",
  IS_TAMPERED: "pos_time_tampered_locked",
};

/**
 * Initializes or updates the offline license validity.
 * This should be called whenever the app connects to the internet/backend.
 * @param daysValid How many days the POS can be used offline. Default is 7.
 */
export function syncOfflineLicense(daysValid: number = 7) {
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + daysValid);
  localStorage.setItem(
    SECURITY_KEYS.LICENSE_EXPIRY,
    expiryDate.getTime().toString(),
  );

  // If tampered flag was set, connecting online and syncing should clear it.
  localStorage.removeItem(SECURITY_KEYS.IS_TAMPERED);
  updateLastActivityTime();
}

/**
 * Checks if the offline license has expired.
 * @returns {boolean} True if expired, false if valid.
 */
export function isLicenseExpired(): boolean {
  const expiryStr = localStorage.getItem(SECURITY_KEYS.LICENSE_EXPIRY);
  if (!expiryStr) {
    // If no license exists, assume we need to sync online. For testing, we can return false,
    // but in a strict system we'd return true. We'll return false here for backward compatibility
    // until syncOfflineLicense is called for the first time.
    return false;
  }

  const expiryTime = parseInt(expiryStr, 10);
  return Date.now() > expiryTime;
}

/**
 * Updates the monotonic time tracker. Should be called on user actions (e.g. creating invoice).
 * If it detects time going backward, it flags the system as tampered.
 */
export function updateLastActivityTime() {
  const now = Date.now();
  const lastStr = localStorage.getItem(SECURITY_KEYS.LAST_ACTIVITY);

  if (lastStr) {
    const lastTime = parseInt(lastStr, 10);
    // If current time is less than last recorded time, time has been rolled back!
    if (now < lastTime) {
      localStorage.setItem(SECURITY_KEYS.IS_TAMPERED, "true");
    }
  }

  // Only update to the new time if we haven't tampered with time,
  // or update anyway so we have a new baseline, but the lock is already set.
  localStorage.setItem(SECURITY_KEYS.LAST_ACTIVITY, now.toString());
}

/**
 * Checks if time tampering was detected.
 */
export function isTimeTampered(): boolean {
  return localStorage.getItem(SECURITY_KEYS.IS_TAMPERED) === "true";
}

/**
 * Comprehensive check for offline validity.
 * Use this before allowing the creation of an invoice.
 * @throws Error if locked or expired.
 */
export function validateOfflineSecurity() {
  // 1. Update activity tracker and check for tampering
  updateLastActivityTime();

  if (isTimeTampered()) {
    throw new Error("SYSTEM_LOCKED_TIME_TAMPERING");
  }

  // 2. Check if the offline period has expired
  if (isLicenseExpired()) {
    throw new Error("OFFLINE_LICENSE_EXPIRED");
  }
}
