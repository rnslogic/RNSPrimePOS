<!-- Copyright (c) 2026, Ravindu Gajanayaka -->
<!-- Licensed under GPLv3. See license.txt -->
<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from "vue";
import { call } from "frappe-ui";
import { usePosSessionStore } from "@/stores/posSession";
import { useCurrency } from "@/composables/useCurrency";
import { X, Search, RotateCcw, Loader2 } from "lucide-vue-next";
const emit = defineEmits<{
	close: [];
	select: [order: any];
}>();
const sessionStore = usePosSessionStore();
const { formatCurrency } = useCurrency();

// Order search
const searchInput = ref("");
const searchResults = ref<any[]>([]);
const searchLoading = ref(false);
const error = ref("");
let debounceTimer: ReturnType<typeof setTimeout>;
const searchInputRef = ref<HTMLInputElement | null>(null);
const selectedIndex = ref(0);

onMounted(() => {
	// Ensure the input is focused when the dialog opens
	setTimeout(() => {
		searchInputRef.value?.focus();
	}, 100);
});

// Search for paid orders
async function searchOrders() {
	if (!searchInput.value.trim()) {
		searchResults.value = [];
		return;
	}
	searchLoading.value = true;
	error.value = "";
	try {
		const data = await call("pos_prime.api.orders.get_past_orders", {
			start: 0,
			limit: 10,
			search_term: searchInput.value,
			status: "Paid", // Only return paid/submitted orders, not drafts or already returned
			pos_profile: sessionStore.posProfile,
		});
		searchResults.value = data || [];
		selectedIndex.value = 0;
	} catch (e: any) {
		searchResults.value = [];
		error.value = e.messages?.[0] || e.message || "Search failed";
	} finally {
		searchLoading.value = false;
	}
}

watch(searchInput, () => {
	clearTimeout(debounceTimer);
	debounceTimer = setTimeout(searchOrders, 300);
});

onUnmounted(() => {
	clearTimeout(debounceTimer);
});

const loadingDetail = ref(false);

async function selectOrder(invoiceName: string) {
	loadingDetail.value = true;
	error.value = "";
	try {
		const detail = await call("pos_prime.api.orders.get_order_detail", {
			invoice_name: invoiceName,
		});
		emit("select", detail);
	} catch (e: any) {
		error.value = e.messages?.[0] || e.message || "Failed to load order details";
	} finally {
		loadingDetail.value = false;
	}
}

function handleKeyDown(e: KeyboardEvent) {
	if (!searchResults.value.length) return;
	if (e.key === "ArrowDown") {
		e.preventDefault();
		if (selectedIndex.value < searchResults.value.length - 1) {
			selectedIndex.value++;
		}
	} else if (e.key === "ArrowUp") {
		e.preventDefault();
		if (selectedIndex.value > 0) {
			selectedIndex.value--;
		}
	} else if (e.key === "Enter") {
		e.preventDefault();
		const order = searchResults.value[selectedIndex.value];
		if (order) {
			selectOrder(order.name);
		}
	}
}
</script>
<template>
	<div
		class="fixed inset-0 z-[60] flex items-center justify-center p-4"
		role="dialog"
		aria-modal="true"
		:aria-label="__('Search Bill to Return')"
		@keydown.escape="emit('close')"
	>
		<div class="absolute inset-0 bg-black/30 dark:bg-black/50" @click="emit('close')" />
		<div
			class="relative bg-white dark:bg-gray-900 rounded-xl shadow-xl dark:shadow-black/30 w-full max-w-md max-h-[90vh] flex flex-col"
		>
			<!-- Header -->
			<div
				class="border-b border-gray-200 dark:border-gray-800 px-5 py-3 flex items-center justify-between rounded-t-xl shrink-0"
			>
				<div class="flex items-center gap-2">
					<RotateCcw :size="18" class="text-red-600 dark:text-red-400" />
					<h3 class="text-base font-semibold text-gray-900 dark:text-gray-100">
						{{ __("Find Bill / Receipt") }}
					</h3>
				</div>
				<button
					@click="emit('close')"
					class="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
				>
					<X :size="18" />
				</button>
			</div>
			<div class="p-5 space-y-4 relative">
				<div
					v-if="loadingDetail"
					class="absolute inset-0 bg-white/80 dark:bg-gray-900/80 z-30 flex flex-col items-center justify-center rounded-b-xl"
				>
					<Loader2
						:size="32"
						class="animate-spin text-blue-600 dark:text-blue-500 mb-2"
					/>
					<span class="text-sm font-medium text-gray-600 dark:text-gray-400">{{
						__("Loading Bill Details...")
					}}</span>
				</div>
				<!-- Error -->
				<div
					v-if="error"
					class="p-3 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-sm"
				>
					{{ error }}
				</div>
				<p class="text-sm text-gray-500 dark:text-gray-400">
					{{
						__(
							"Scan the barcode on the receipt, or type the bill number to start a return.",
						)
					}}
				</p>
				<!-- Order search -->
				<div class="relative">
					<Search
						class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none"
						:size="14"
					/>
					<input
						ref="searchInputRef"
						v-model="searchInput"
						@keydown="handleKeyDown"
						type="text"
						:placeholder="__('e.g. 00019')"
						autofocus
						class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 pl-8 pr-3 py-3 text-sm focus:outline-none placeholder-gray-400 dark:placeholder-gray-500 font-medium"
					/>
					<!-- Search dropdown -->
					<div
						v-if="searchInput.trim() && (searchResults.length > 0 || searchLoading)"
						class="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto"
					>
						<div v-if="searchLoading" class="flex items-center justify-center py-4">
							<Loader2 :size="16" class="animate-spin text-gray-400" />
						</div>
						<button
							v-else
							v-for="(order, index) in searchResults"
							:key="order.name"
							@click="selectOrder(order.name)"
							class="w-full text-left px-3 py-3 transition-colors flex items-center justify-between border-b border-gray-100 dark:border-gray-800 last:border-0"
							:class="
								selectedIndex === index
									? 'bg-blue-50 dark:bg-blue-900/30'
									: 'hover:bg-gray-50 dark:hover:bg-gray-700'
							"
						>
							<div class="min-w-0">
								<div class="text-sm font-bold text-gray-800 dark:text-gray-200">
									{{ order.name }}
								</div>
								<div
									class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate"
								>
									{{ order.customer_name }}
								</div>
							</div>
							<div class="text-right shrink-0 ml-2">
								<div
									class="text-sm font-semibold text-gray-900 dark:text-gray-100"
								>
									{{ formatCurrency(order.grand_total) }}
								</div>
								<div class="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
									{{ order.posting_date }}
								</div>
							</div>
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
