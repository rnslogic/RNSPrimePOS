<!-- Copyright (c) 2026, Ravindu Gajanayaka -->
<!-- Licensed under GPLv3. See license.txt -->

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { call } from "frappe-ui";
import { useDraftsStore } from "@/stores/drafts";
import { usePosSessionStore } from "@/stores/posSession";
import { session as userSession } from "@/stores/session";
import { useDeskMode } from "@/composables/useDeskMode";
import { useCashiersStore } from "@/stores/cashiers";
import { useAuthStore } from "@/stores/auth";
import {
	Grid3x3,
	ClipboardList,
	LogOut,
	Menu,
	X,
	PauseCircle,
	Users,
	Maximize,
	Minimize,
	RotateCcw,
	Monitor,
	Settings,
	Package,
	PackagePlus,
	Receipt,
} from "lucide-vue-next";
import FrappeImage from "@/components/FrappeImage.vue";
import DisplayControls from "@/components/display/DisplayControls.vue";

const { isDeskMode } = useDeskMode();
const router = useRouter();
const route = useRoute();
const draftsStore = useDraftsStore();
const sessionStore = usePosSessionStore();
const cashiersStore = useCashiersStore();
const authStore = useAuthStore();
const sidebarOpen = ref(false);
const showDisplayPopover = ref(false);

const companyLogo = ref<string | null>(null);
const brandingAbbr = ref<string | null>(null);

const companyAbbr = computed(() => {
	if (brandingAbbr.value) return brandingAbbr.value;
	if (sessionStore.company) return sessionStore.company.substring(0, 2).toUpperCase();
	return "P";
});

const userFullName = ref("");
const userImage = ref<string | null>(null);

const navItems = computed(() => {
	return [{ name: __("POS"), routeName: "POS", icon: Grid3x3 }];
});

const showStockButton = computed(() => {
	return (
		cashiersStore.currentCashier?.title === "Admin" ||
		cashiersStore.currentCashier?.cashier_name === "Admin"
	);
});

const currentRouteName = computed(() => {
	if (route.name === "CustomerDetail") return "Customers";
	if (typeof route.name === "string" && route.name.startsWith("Stock")) return "Stock";
	if (route.name === "NewStock") return "Stock";
	return route.name as string;
});
const draftCount = computed(() => draftsStore.drafts.length);

const userInitials = computed(() => {
	const name =
		cashiersStore.currentCashier?.cashier_name ||
		cashiersStore.currentCashier?.title ||
		userFullName.value ||
		"?";
	const parts = name.trim().split(/\s+/);
	if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
	return parts[0][0].toUpperCase();
});

function setFavicon(url: string) {
	let link = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
	if (!link) {
		link = document.createElement("link");
		link.rel = "icon";
		document.head.appendChild(link);
	}
	link.href = url;
}
function goToDesk() {
	window.location.href = "/app";
}
onMounted(async () => {
	if (sessionStore.posProfile) {
		await draftsStore.fetchDrafts(sessionStore.posProfile);
	}

	// Fetch app logo & favicon via backend endpoint (no Website Settings permission needed)
	try {
		const branding = await call("pos_prime.api.pos_session.get_branding", {
			company: sessionStore.company || "",
		});
		if (branding?.app_logo) {
			companyLogo.value = authStore.resolveUrl(branding.app_logo);
		} else if (branding?.company_logo) {
			companyLogo.value = authStore.resolveUrl(branding.company_logo);
		}
		if (branding?.favicon) {
			setFavicon(authStore.resolveUrl(branding.favicon)!);
		} else if (branding?.company_logo) {
			setFavicon(authStore.resolveUrl(branding.company_logo)!);
		}
		if (branding?.company_abbr) {
			brandingAbbr.value = branding.company_abbr;
		}
	} catch {
		/* ignore */
	}

	// Fetch user info via backend endpoint (skip in desk mode — navbar shows user)
	if (!isDeskMode.value && userSession.user?.data) {
		try {
			const userInfo = await call("pos_prime.api.pos_session.get_user_info");
			if (userInfo) {
				userFullName.value = userInfo.full_name || userSession.user.data;
				userImage.value = authStore.resolveUrl(userInfo.user_image) || null;
			}
		} catch {
			userFullName.value = userSession.user.data;
		}
	}
});

function navigate(routeName: string) {
	router.push({ name: routeName });
	sidebarOpen.value = false;
}
function closeShift() {
	router.push({ name: "CloseShift" });
	sidebarOpen.value = false;
}
const isFullscreen = ref(false);
const zoomLevel = ref(120); // Default from index.css

function applyZoom() {
	if (typeof document !== "undefined") {
		document.documentElement.style.fontSize = `${zoomLevel.value}%`;
	}
}
function toggleFullscreen() {
	if (!document.fullscreenElement) {
		document.documentElement.requestFullscreen();
	} else {
		document.exitFullscreen();
	}
}
function onFullscreenChange() {
	isFullscreen.value = !!document.fullscreenElement;
}
if (typeof document !== "undefined") {
	document.addEventListener("fullscreenchange", onFullscreenChange);
}
function onKeyDown(e: KeyboardEvent) {
	if (e.key === "Escape" && sidebarOpen.value) {
		sidebarOpen.value = false;
	}

	// Handle Zoom and other global shortcuts
	if (e.ctrlKey || e.metaKey) {
		if (e.key.toLowerCase() === "l") {
			e.preventDefault();
			closeShift();
		} else if (e.key === "=" || e.key === "+") {
			e.preventDefault();
			zoomLevel.value = Math.min(zoomLevel.value + 10, 200);
			applyZoom();
		} else if (e.key === "-") {
			e.preventDefault();
			zoomLevel.value = Math.max(zoomLevel.value - 10, 50);
			applyZoom();
		} else if (e.key === "0") {
			e.preventDefault();
			zoomLevel.value = 120;
			applyZoom();
		}
	}
}
if (typeof window !== "undefined") {
	window.addEventListener("keydown", onKeyDown);
}
onUnmounted(() => {
	if (typeof document !== "undefined") {
		document.removeEventListener("fullscreenchange", onFullscreenChange);
	}
	if (typeof window !== "undefined") {
		window.removeEventListener("keydown", onKeyDown);
	}
});

const emit = defineEmits<{
	toggleHeldOrders: [];
	toggleReturn: [];
}>();
</script>

<template>
	<div
		:class="[
			'flex overflow-hidden bg-gray-100 dark:bg-gray-900',
			isDeskMode ? 'h-full' : 'h-screen',
		]"
	>
		<!-- Mobile Sidebar Backdrop -->
		<Transition name="fade">
			<div
				v-if="sidebarOpen"
				class="fixed inset-0 bg-black/20 dark:bg-black/40 z-40 lg:hidden"
				@click="sidebarOpen = false"
			></div>
		</Transition>

		<!-- Sidebar -->
		<aside
			class="fixed inset-y-0 left-0 z-50 flex flex-col items-center bg-gray-100 dark:bg-gray-900 transition-transform duration-200 lg:relative lg:translate-x-0"
			:class="[
				isDeskMode ? 'lg:w-[3.75rem] py-1.5 gap-1' : 'w-[4.25rem] py-3 gap-1.5',
				sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:flex',
			]"
		>
			<!-- Company Logo (hidden in desk mode — ERPNext navbar has it) -->
			<div
				v-if="!isDeskMode"
				class="mb-3 block mt-1"
				:title="sessionStore.company || 'POS Prime'"
			>
				<FrappeImage
					v-if="companyLogo"
					:src="companyLogo"
					:alt="sessionStore.company"
					@error="companyLogo = null"
					class="w-8 h-8 object-contain"
				/>
				<div
					v-else
					class="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center shadow-sm shadow-blue-600/20"
				>
					<span class="text-white font-bold text-xs">{{ companyAbbr }}</span>
				</div>
			</div>

			<!-- Nav items -->
			<button
				v-for="item in navItems"
				:key="item.routeName"
				@click="navigate(item.routeName)"
				:aria-label="item.name"
				:title="item.routeName === 'Orders' ? __('Orders') + ' (F5 or Ctrl+O)' : item.name"
				class="relative flex flex-col items-center justify-center rounded-xl transition-all duration-150"
				:class="[
					isDeskMode ? 'w-11 h-11' : 'w-12 h-12',
					currentRouteName === item.routeName
						? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shadow-sm shadow-blue-100 dark:shadow-blue-900/20'
						: 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-gray-800 dark:hover:text-gray-300',
				]"
			>
				<component
					:is="item.icon"
					:size="isDeskMode ? 18 : 20"
					:stroke-width="
						currentRouteName === item.routeName ||
						(item.routeName === 'StockDashboard' && currentRouteName.includes('Stock'))
							? 2.5
							: 2
					"
				/>
				<span class="text-[10px] mt-0.5 font-semibold leading-none">{{ item.name }}</span>
			</button>



			<!-- Stock -->
			<button
				v-if="showStockButton"
				@click="navigate('Stock')"
				aria-label="Stock"
				:title="__('Stock')"
				class="relative flex flex-col items-center justify-center rounded-xl transition-all duration-150"
				:class="[
					isDeskMode ? 'w-11 h-11' : 'w-12 h-12',
					currentRouteName === 'Stock' || currentRouteName === 'StockDashboard'
						? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shadow-sm shadow-blue-100 dark:shadow-blue-900/20'
						: 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-gray-800 dark:hover:text-gray-300',
				]"
			>
				<Package
					:size="isDeskMode ? 18 : 20"
					:stroke-width="
						currentRouteName === 'Stock' || currentRouteName === 'StockDashboard'
							? 2.5
							: 2
					"
				/>
				<span class="text-[10px] mt-0.5 font-semibold leading-none">{{
					__("Stock")
				}}</span>
			</button>

			<div class="flex-1" />

			<!-- Display -->
			<div class="relative mb-0.5">
				<button
					@click="showDisplayPopover = !showDisplayPopover"
					aria-label="Customer Display"
					:title="__('Customer Display')"
					class="relative flex flex-col items-center justify-center rounded-xl text-gray-600 dark:text-gray-400 hover:bg-purple-100 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-150"
					:class="[
						isDeskMode ? 'w-11 h-11' : 'w-12 h-12',
						showDisplayPopover
							? 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 shadow-sm shadow-purple-100 dark:shadow-purple-900/20'
							: '',
					]"
				>
					<Monitor :size="isDeskMode ? 18 : 20" />
					<span class="text-[10px] mt-0.5 font-semibold leading-none">{{
						__("Display")
					}}</span>
				</button>
				<Transition name="fade">
					<div
						v-if="showDisplayPopover"
						class="fixed inset-0 z-40"
						@click="showDisplayPopover = false"
					/>
				</Transition>
				<Transition name="fade">
					<div v-if="showDisplayPopover" class="absolute left-full bottom-0 ml-2 z-50">
						<DisplayControls />
					</div>
				</Transition>
			</div>

			<!-- Fullscreen toggle -->
			<button
				@click="toggleFullscreen"
				:aria-label="isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'"
				:title="isFullscreen ? __('Exit fullscreen') : __('Enter fullscreen')"
				class="flex flex-col items-center justify-center rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-gray-800 dark:hover:text-gray-300 transition-all duration-150 mb-0.5"
				:class="isDeskMode ? 'w-11 h-11' : 'w-12 h-12'"
			>
				<Minimize v-if="isFullscreen" :size="isDeskMode ? 18 : 20" />
				<Maximize v-else :size="isDeskMode ? 18 : 20" />
				<span class="text-[10px] mt-0.5 font-semibold leading-none">{{ __("Full") }}</span>
			</button>

			<!-- Settings -->
			<button
				v-if="cashiersStore.currentCashier?.title === 'Admin'"
				@click="navigate('Settings')"
				aria-label="Settings"
				:title="__('Settings')"
				class="relative flex flex-col items-center justify-center rounded-xl transition-all duration-150 mb-0.5"
				:class="[
					isDeskMode ? 'w-11 h-11' : 'w-12 h-12',
					currentRouteName === 'Settings'
						? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shadow-sm shadow-blue-100 dark:shadow-blue-900/20'
						: 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-gray-800 dark:hover:text-gray-300',
				]"
			>
				<Settings
					:size="isDeskMode ? 18 : 20"
					:stroke-width="currentRouteName === 'Settings' ? 2.5 : 2"
				/>
				<span class="text-[10px] mt-0.5 font-semibold leading-none">{{
					__("Settings")
				}}</span>
			</button>

			<!-- User profile (hidden in desk mode — ERPNext navbar has it) -->
			<div
				v-if="!isDeskMode"
				class="flex flex-col items-center gap-1 mb-1 mt-auto"
				:title="userFullName || userSession.user?.data || ''"
			>
				<FrappeImage
					v-if="userImage"
					:src="userImage"
					:alt="userFullName"
					class="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-gray-700"
				/>
				<div
					v-else
					class="w-8 h-8 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center"
				>
					<span class="text-[10px] font-bold text-blue-600 dark:text-blue-400">{{
						userInitials
					}}</span>
				</div>
				<span
					class="text-[11px] mt-0.5 font-bold text-center leading-none max-w-[56px] truncate"
					:class="(cashiersStore.currentCashier?.title === 'Admin' || cashiersStore.currentCashier?.cashier_name === 'Admin') ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'"
				>
					{{
						cashiersStore.currentCashier?.cashier_name ||
						cashiersStore.currentCashier?.title ||
						userFullName.split(" ")[0] ||
						userSession.user?.data
					}}
				</span>
			</div>



		</aside>

		<!-- Main content area -->
		<div class="flex-1 flex flex-col overflow-hidden">
			<!-- Mobile & Desktop header (Desktop: POS only) -->
			<header
				class="flex items-center justify-between border-b border-gray-200/50 dark:border-gray-800 px-3 h-[calc(3.5rem+env(safe-area-inset-top))] pt-[env(safe-area-inset-top)]"
			>
				<div class="flex items-center gap-2">
					<button
						@click="sidebarOpen = true"
						class="lg:hidden p-1 -ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
					>
						<Menu :size="20" />
					</button>
					<!-- Company Name in App Bar -->
					<div
						class="flex items-center gap-2 lg:-ml-1"
						:title="sessionStore.company || 'POS Prime'"
					>
						<FrappeImage
							v-if="companyLogo"
							:src="companyLogo"
							:alt="sessionStore.company"
							@error="companyLogo = null"
							class="w-8 h-8 object-contain lg:hidden"
						/>
						<div
							v-else
							class="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center lg:hidden shadow-sm"
						>
							<span class="text-white font-bold text-[10px]">{{ companyAbbr }}</span>
						</div>
						<span class="font-bold text-gray-800 dark:text-gray-100 text-xl tracking-tight">{{
							sessionStore.company || "POS Prime"
						}}</span>
					</div>
				</div>
				<div
					v-if="currentRouteName === 'POS'"
					class="flex items-center gap-1 ml-auto"
				>
					<button
						aria-label="Return"
						:title="__('Return') + ' (F10)'"
						class="relative w-12 h-12 rounded-lg flex flex-col items-center justify-center text-orange-500 dark:text-orange-400 hover:text-orange-600 dark:hover:text-orange-300 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors"
					>
						<RotateCcw :size="20" />
						<span class="text-[10px] mt-1 font-semibold leading-none">{{
							__("Return")
						}}</span>
					</button>
					<button
						@click="emit('toggleHeldOrders')"
						aria-label="Held Orders"
						:title="__('Held Orders') + ' (F2)'"
						class="relative w-12 h-12 rounded-lg flex flex-col items-center justify-center text-amber-500 dark:text-amber-400 hover:text-amber-600 dark:hover:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
					>
						<PauseCircle :size="20" />
						<span class="text-[10px] mt-1 font-semibold leading-none">{{
							__("Held")
						}}</span>
						<span
							v-if="draftCount > 0"
							class="absolute top-0.5 end-0.5 bg-amber-500 text-white text-[8px] font-bold rounded-full w-4 h-4 flex items-center justify-center"
						>
							{{ draftCount }}
						</span>
					</button>
					<button
						@click="navigate('Orders')"
						aria-label="Orders"
						:title="__('Orders') + ' (F5)'"
						class="relative w-12 h-12 rounded-lg flex flex-col items-center justify-center text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
					>
						<ClipboardList :size="20" />
						<span class="text-[10px] mt-1 font-semibold leading-none">{{
							__("Orders")
						}}</span>
					</button>
					<button
						@click="navigate('Customers')"
						aria-label="Customers"
						:title="__('Customers')"
						class="relative w-12 h-12 rounded-lg flex flex-col items-center justify-center text-emerald-500 dark:text-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
					>
						<Users :size="20" />
						<span class="text-[10px] mt-1 font-semibold leading-none">{{
							__("Cust")
						}}</span>
					</button>
					<button
						@click="closeShift"
						aria-label="Close Shift"
						:title="__('Close Shift') + ' (Ctrl+L)'"
						class="relative w-12 h-12 rounded-lg flex flex-col items-center justify-center text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors ml-1"
					>
						<LogOut :size="20" />
						<span class="text-[10px] mt-1 font-semibold leading-none">{{
							__("Close")
						}}</span>
					</button>
				</div>
			</header>

			<main
				class="flex-1 overflow-hidden bg-white dark:bg-[#0b141a] lg:rounded-tl-xl border-t border-l border-gray-200/50 dark:border-gray-800"
			>
				<slot />
			</main>
		</div>
	</div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}

.slide-right-enter-active {
	transition:
		transform 0.2s ease-out,
		opacity 0.2s ease-out;
}
.slide-right-leave-active {
	transition:
		transform 0.15s ease-in,
		opacity 0.15s ease-in;
}
.slide-right-enter-from {
	transform: translateX(100%);
	opacity: 0;
}
.slide-right-leave-to {
	transform: translateX(100%);
	opacity: 0;
}
</style>
