<!-- Copyright (c) 2026, Ravindu Gajanayaka -->
<!-- Licensed under GPLv3. See license.txt -->

import { ref, onMounted, watch } from 'vue' import { session } from './stores/session' import {
useAuthStore } from './stores/auth' import { useRTL } from './composables/useRTL' import {
useDeskMode } from './composables/useDeskMode' import { useRouter } from 'vue-router' import {
Loader2, Store } from 'lucide-vue-next' import ToastContainer from
'./components/layout/ToastContainer.vue' import { checkForOTAUpdates } from './autoUpdate'; { isRTL
} = useRTL() const { isDeskMode } = useDeskMode() const router = useRouter() const initialized =
ref(false) watch(initialized, (val) => {; (val) { router.isReady().then(() => { setTimeout(() => {
document.getElementById('splash-screen')?.remove() }, 100) }).catch(() => { // Force remove splash
screen even; router navigation fails setTimeout(() => {
document.getElementById('splash-screen')?.remove() }, 100) }) } }) onMounted(async () => { // Start
OTA update check for Capacitor apps checkForOTAUpdates(); (isDeskMode.value) { // In desk mode,
user is already authenticated; (session.isLoggedIn) { session.user.reload().catch(() => {}); {; {
await session.user.reload(); { /* ignore */ } } initialized.value = true; } // Standalone mode —
check configuration; isNativeApp = !!(window as any).ipcRenderer || !!(window as any).Capacitor;;
isFrappeEnvironment = !!(window as any).frappe?.boot; // If we are in a browser, we assume Hosted
mode unless we are explicitly a Native App. // We don't rely on isFrappeEnvironment being true
because offline service workers; cached HTML without it.; isDecoupled = isNativeApp;; authStore =
useAuthStore(); (isDecoupled) {; (!!(window as any).Capacitor) {
import('@capacitor/status-bar').then(({ StatusBar }) => { StatusBar.hide().catch(() => {})
}).catch(() => {}) }; { await authStore.loadSettings(); (e) { console.warn('Could not load settings
(maybe in private browsing mode)', e) }; (!authStore.isConfigured) { router.push('/setup').catch(()
=> {}) initialized.value = true; } // For decoupled offline apps, don't block startup on network
requests. initialized.value = true session.user.reload().catch(() => { /* ignore offline errors */
}); } // Hosted Standalone mode — verify authentication; (session.isLoggedIn) { // If we have a
cached user, don't block the UI. Reload in the background. session.user.reload().catch((e) => { //
Only redirect to login; it's an explicit 401/403 auth error. // If it's a network error (offline),
allow the user to continue using cached data.; (e.messages || e.httpStatus === 401 || e.httpStatus
=== 403) { window.location.href = '/login?redirect-to=/pos-prime' } }) initialized.value = true; {;
{ await session.user.reload(); (!session.isLoggedIn) { window.location.href =
'/login?redirect-to=/pos-prime'; } initialized.value = true; (e: any) { // If network error while
attempting to check login, and we had no cached session, // we can't do much but redirect to login
or show error. window.location.href = '/login?redirect-to=/pos-prime'; } } })

<div
	v-if="initialized"
	:dir="isRTL ? 'rtl' : 'ltr'"
	:class="isDeskMode ? 'h-full' : ''"
> <router-view /> <ToastContainer /> </div>
