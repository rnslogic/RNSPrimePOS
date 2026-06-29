<!-- Copyright (c) 2026, Ravindu Gajanayaka -->
<!-- Licensed under GPLv3. See license.txt -->
<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useOrdersStore } from "@/stores/orders";
import { usePosSessionStore } from "@/stores/posSession";
import { useSettingsStore } from "@/stores/settings";
import AppShell from "@/components/layout/AppShell.vue";
import OrderList from "@/components/orders/OrderList.vue";
import OrderDetail from "@/components/orders/OrderDetail.vue";
import ReturnDialog from "@/components/orders/ReturnDialog.vue";
import ReturnSearchDialog from "@/components/orders/ReturnSearchDialog.vue";
import HeldOrdersDrawer from "@/components/orders/HeldOrdersDrawer.vue";
import { useKeyboardShortcuts } from "@/composables/useKeyboardShortcuts";
import { ArrowLeft, Search, X, ClipboardList, LayoutGrid, ShoppingCart } from "lucide-vue-next";
import { useCartStore } from "@/stores/cart";
const router = useRouter();
const ordersStore = useOrdersStore();
const sessionStore = usePosSessionStore();
const settingsStore = useSettingsStore();
const cartStore = useCartStore();
const searchInput = ref("");
const showReturnDialog = ref(false);
const showGlobalReturnDialog = ref(false);
const showHeldOrders = ref(false);
const returnOrder = ref<Record<string, any> | null>(null);
const mobileShowDetail = ref(false);
let debounceTimer: ReturnType<typeof setTimeout>;
onUnmounted(() => {
	clearTimeout(debounceTimer);
	window.removeEventListener("keydown", handleKeydown);
});
const statusTabs = [
	{ label: __("All"), value: "" },
	{ label: __("Paid"), value: "Paid" },
	{ label: __("Return"), value: "Return" },
	{ label: __("Draft"), value: "Draft" },
];
function handleKeydown(e: KeyboardEvent) {
	if (e.key === "ArrowDown" || e.key === "ArrowUp") {
		if (ordersStore.orders.length === 0) return;
		const currentIndex = ordersStore.orders.findIndex(
			(o: any) => o.name === ordersStore.selectedOrder?.name,
		);
		if (e.key === "ArrowDown") {
			e.preventDefault();
			if (currentIndex < ordersStore.orders.length - 1) {
				selectOrder(ordersStore.orders[currentIndex + 1].name);
			} else if (currentIndex === -1) {
				selectOrder(ordersStore.orders[0].name);
			}
		} else if (e.key === "ArrowUp") {
			e.preventDefault();
			if (currentIndex > 0) {
				selectOrder(ordersStore.orders[currentIndex - 1].name);
			}
		}
	}
}
onMounted(() => {
	if (sessionStore.posProfile) {
		ordersStore.fetchOrders(sessionStore.posProfile);
	}
	window.addEventListener("keydown", handleKeydown);
});
useKeyboardShortcuts({
	onCloseDialog: () => {
		if (showHeldOrders.value) showHeldOrders.value = false;
		else if (showGlobalReturnDialog.value) showGlobalReturnDialog.value = false;
		else if (showReturnDialog.value) showReturnDialog.value = false;
		else if (mobileShowDetail.value) mobileShowDetail.value = false;
		else if (searchInput.value || ordersStore.statusFilter) {
			searchInput.value = "";
			ordersStore.setSearchTerm("");
			ordersStore.setStatusFilter("");
			ordersStore.fetchOrders(sessionStore.posProfile);
		} else router.push({ name: "POS" });
	},
	onOpenOrders: () => {
		/* Already on Orders page */
	},
	onFocusSearch: () => {
		const el = document.querySelector(
			'input[placeholder="Search orders..."]',
		) as HTMLInputElement;
		el?.focus();
	},
	onToggleHeldOrders: () => {
		showHeldOrders.value = !showHeldOrders.value;
	},
	onToggleReturn: () => {
		showGlobalReturnDialog.value = !showGlobalReturnDialog.value;
	},
});
watch(searchInput, (term) => {
	clearTimeout(debounceTimer);
	debounceTimer = setTimeout(() => {
		ordersStore.setSearchTerm(term);
		ordersStore.fetchOrders(sessionStore.posProfile);
	}, 300);
});
function selectStatus(status: string) {
	ordersStore.setStatusFilter(status);
	ordersStore.fetchOrders(sessionStore.posProfile);
}
async function selectOrder(name: string) {
	await ordersStore.loadOrderDetail(name);
	mobileShowDetail.value = true;
}
function handleReturn(name: string) {
	returnOrder.value = ordersStore.selectedOrder;
	showReturnDialog.value = true;
}
function onReturnCompleted() {
	showReturnDialog.value = false;
	showGlobalReturnDialog.value = false;
	returnOrder.value = null;
	ordersStore.fetchOrders(sessionStore.posProfile);
}
function handleResumeDraft(invoiceName: string) {
	showHeldOrders.value = false;
	router.push({ name: "POS", query: { resumeDraft: invoiceName } });
}
function clearSearch() {
	searchInput.value = "";
	ordersStore.setSearchTerm("");
	ordersStore.fetchOrders(sessionStore.posProfile);
}
function handlePrint(invoiceName: string) {}
</script>
<template>
	<AppShell
		@toggle-return="showGlobalReturnDialog = true"
		@toggle-held-orders="showHeldOrders = !showHeldOrders"
	>
		<div class="h-full flex flex-col sm:pb-0 pb-[calc(3.5rem+env(safe-area-inset-bottom))]">
			<div
				class="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center gap-3"
			>
				<button
					@click="
						mobileShowDetail
							? (mobileShowDetail = false)
							: router.push({ name: 'POS' })
					"
					class="lg:hidden text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
				>
					<ArrowLeft :size="20" />
				</button>
				<h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
					{{ __("Past Orders") }}
				</h2>
			</div>
			<div class="flex-1 flex overflow-hidden">
				<!-- Left: Search + List -->
				<div
					class="w-full lg:w-[360px] shrink-0 flex flex-col border-e border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
					:class="{ 'hidden lg:flex': mobileShowDetail }"
				>
					<!-- Search -->
					<div class="p-3 border-b border-gray-200 dark:border-gray-800">
						<div class="relative">
							<Search
								class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none"
								:size="14"
							/>
							<input
								v-model="searchInput"
								type="text"
								:placeholder="__('Search orders...')"
								class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 pl-8 pr-8 py-2 text-sm focus:outline-none placeholder-gray-400 dark:placeholder-gray-500"
							/>
							<button
								v-if="searchInput"
								@click="clearSearch"
								class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
							>
								<X :size="14" />
							</button>
						</div>
					</div>
					<!-- Status tabs -->
					<div
						class="flex gap-1 px-3 py-2 border-b border-gray-200 dark:border-gray-800"
					>
						<button
							v-for="tab in statusTabs"
							:key="tab.value"
							@click="selectStatus(tab.value)"
							class="px-3 py-1 rounded-full text-xs font-medium transition-colors"
							:class="
								ordersStore.statusFilter === tab.value
									? 'bg-blue-600 text-white'
									: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
							"
						>
							{{ tab.label }}
						</button>
					</div>
					<!-- Order list -->
					<div class="flex-1 overflow-y-auto p-3">
						<OrderList
							:orders="ordersStore.orders"
							:selected-name="ordersStore.selectedOrder?.name || null"
							:loading="ordersStore.loading"
							@select="selectOrder"
						/>
					</div>
				</div>
				<!-- Right: Detail -->
				<div
					class="flex-1 bg-gray-50 dark:bg-gray-900"
					:class="{ 'hidden lg:block': !mobileShowDetail }"
				>
					<OrderDetail
						:order="ordersStore.selectedOrder"
						:loading="ordersStore.loadingDetail"
						@print="handlePrint"
						@return="handleReturn"
					/>
				</div>
			</div>
		</div>
		<!-- Return dialog -->
		<ReturnDialog
			v-if="showReturnDialog && returnOrder"
			:order="returnOrder"
			@close="showReturnDialog = false"
			@completed="onReturnCompleted"
		/>
		<!-- Global Return Search dialog -->
		<ReturnSearchDialog
			v-if="showGlobalReturnDialog"
			@close="showGlobalReturnDialog = false"
			@select="
				(order) => {
					showGlobalReturnDialog = false;
					returnOrder = order;
					showReturnDialog = true;
				}
			"
		/>
		<!-- Held orders drawer -->
		<HeldOrdersDrawer
			v-if="showHeldOrders"
			@close="showHeldOrders = false"
			@resume="handleResumeDraft"
		/>
		<!-- Mobile tab switcher -->
		<div
			class="sm:hidden fixed bottom-0 left-0 right-0 flex items-center justify-around bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 z-10 h-[calc(3.5rem+env(safe-area-inset-bottom))] pb-[env(safe-area-inset-bottom)]"
		>
			<button
				@click="mobileShowDetail = false"
				class="flex-1 flex flex-col items-center justify-center h-full transition-colors text-blue-600 dark:text-blue-400"
			>
				<ClipboardList :size="18" :stroke-width="2.5" />
				<span class="text-[9px] mt-0.5 font-semibold">{{ __("Orders") }}</span>
			</button>
			<button
				@click="router.push({ name: 'POS', query: { tab: 'items' } })"
				class="flex-1 flex flex-col items-center justify-center h-full transition-colors text-gray-400 dark:text-gray-500 hover:text-blue-600"
			>
				<LayoutGrid :size="18" :stroke-width="2" />
				<span class="text-[9px] mt-0.5 font-semibold">{{ __("Items") }}</span>
			</button>
			<button
				@click="router.push({ name: 'POS', query: { tab: 'cart' } })"
				class="flex-1 flex flex-col items-center justify-center h-full transition-colors relative text-gray-400 dark:text-gray-500 hover:text-blue-600"
			>
				<ShoppingCart :size="18" :stroke-width="2" />
				<span class="text-[9px] mt-0.5 font-semibold">{{ __("Cart") }}</span>
				<span
					v-if="cartStore.totalItems > 0"
					class="absolute top-1 right-[calc(50%-16px)] bg-blue-600 text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-0.5"
				>
					{{ cartStore.totalItems > 9 ? "9+" : cartStore.totalItems }}
				</span>
			</button>
		</div>
	</AppShell>
</template>
