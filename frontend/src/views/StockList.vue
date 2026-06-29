<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { call } from "frappe-ui";
import { useSettingsStore } from "@/stores/settings";
import { usePosSessionStore } from "@/stores/posSession";
import FrappeImage from "@/components/FrappeImage.vue";
import { Package, Search, X, ArrowUp, ArrowDown } from "lucide-vue-next";

const router = useRouter();
const settingsStore = useSettingsStore();
const posSessionStore = usePosSessionStore();
const items = ref<any[]>([]);
const loading = ref(true);
const searchTerm = ref("");
const sortColumn = ref("");
const sortOrder = ref<"asc" | "desc">("asc");

async function loadItems() {
	loading.value = true;
	try {
		const data = await call("pos_prime.api.items.get_items", { 
			start: 0, 
			page_length: 100,
			search_term: searchTerm.value,
			pos_profile: posSessionStore.posProfile,
			hide_unavailable: 0
		});
		items.value = data?.items || [];
	} catch (e) {
		console.error("Failed to load items", e);
	} finally {
		loading.value = false;
	}
}

onMounted(() => {
	loadItems();
});

let searchTimeout: any = null;
function onSearchInput() {
	if (searchTimeout) clearTimeout(searchTimeout);
	searchTimeout = setTimeout(() => {
		loadItems();
	}, 300);
}

function clearSearch() {
	searchTerm.value = "";
	loadItems();
}

function formatCurrency(amount: number) {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: settingsStore.posProfile?.currency || "PKR",
		minimumFractionDigits: 0,
	}).format(amount);
}

function sortBy(column: string) {
	if (sortColumn.value === column) {
		sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
	} else {
		sortColumn.value = column;
		sortOrder.value = "asc";
	}
}

const sortedItems = computed(() => {
	if (!sortColumn.value) return items.value;

	return [...items.value].sort((a, b) => {
		let valA = a[sortColumn.value] || "";
		let valB = b[sortColumn.value] || "";

		if (typeof valA === "string") valA = valA.toLowerCase();
		if (typeof valB === "string") valB = valB.toLowerCase();

		if (valA < valB) return sortOrder.value === "asc" ? -1 : 1;
		if (valA > valB) return sortOrder.value === "asc" ? 1 : -1;
		return 0;
	});
});
</script>
<template>
	<div class="h-full flex flex-col bg-gray-50 dark:bg-gray-900 overflow-hidden">
		<!-- Header -->
		<header class="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10 flex-none border-b border-gray-100 dark:border-gray-700">
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4">
					<div>
						<h1
							class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2"
						>
							<Package class="text-blue-500" :size="24" />
							{{ __("Items List") }}
						</h1>
						<p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
							{{ __("List of all available items in stock.") }}
						</p>
					</div>
					
					<div class="relative max-w-sm w-full">
						<Search
							class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
							:size="18"
						/>
						<input
							type="text"
							v-model="searchTerm"
							@input="onSearchInput"
							@keydown.esc="clearSearch"
							:placeholder="__('Search items...')"
							class="w-full pl-10 pr-10 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm transition-all"
						/>
						<button
							v-if="searchTerm"
							@click="clearSearch"
							class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
							aria-label="Clear search"
						>
							<X :size="16" />
						</button>
					</div>
				</div>
			</div>
		</header>
		<main class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
			<div class="max-w-7xl mx-auto">
				<div
					class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
				>
					<div class="overflow-x-auto">
						<table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
							<thead
								class="text-xs text-gray-700 uppercase bg-white dark:bg-gray-800 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700"
							>
								<tr>
									<th scope="col" class="px-6 py-4 w-16"></th>
									<th scope="col" class="px-6 py-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors select-none" @click="sortBy('item_code')">
										<div class="flex items-center gap-1">
											{{ __("Item Code") }}
											<ArrowUp v-if="sortColumn === 'item_code' && sortOrder === 'asc'" class="w-4 h-4 text-blue-500" />
											<ArrowDown v-if="sortColumn === 'item_code' && sortOrder === 'desc'" class="w-4 h-4 text-blue-500" />
										</div>
									</th>
									<th scope="col" class="px-6 py-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors select-none" @click="sortBy('item_name')">
										<div class="flex items-center gap-1">
											{{ __("Item Name") }}
											<ArrowUp v-if="sortColumn === 'item_name' && sortOrder === 'asc'" class="w-4 h-4 text-blue-500" />
											<ArrowDown v-if="sortColumn === 'item_name' && sortOrder === 'desc'" class="w-4 h-4 text-blue-500" />
										</div>
									</th>
									<th scope="col" class="px-6 py-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors select-none" @click="sortBy('item_group')">
										<div class="flex items-center gap-1">
											{{ __("Item Group") }}
											<ArrowUp v-if="sortColumn === 'item_group' && sortOrder === 'asc'" class="w-4 h-4 text-blue-500" />
											<ArrowDown v-if="sortColumn === 'item_group' && sortOrder === 'desc'" class="w-4 h-4 text-blue-500" />
										</div>
									</th>
									<th scope="col" class="px-6 py-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors select-none" @click="sortBy('stock_uom')">
										<div class="flex items-center gap-1">
											{{ __("UOM") }}
											<ArrowUp v-if="sortColumn === 'stock_uom' && sortOrder === 'asc'" class="w-4 h-4 text-blue-500" />
											<ArrowDown v-if="sortColumn === 'stock_uom' && sortOrder === 'desc'" class="w-4 h-4 text-blue-500" />
										</div>
									</th>
									<th scope="col" class="px-6 py-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors select-none text-right" @click="sortBy('actual_qty')">
										<div class="flex items-center justify-end gap-1">
											{{ __("Stock Qty") }}
											<ArrowUp v-if="sortColumn === 'actual_qty' && sortOrder === 'asc'" class="w-4 h-4 text-blue-500" />
											<ArrowDown v-if="sortColumn === 'actual_qty' && sortOrder === 'desc'" class="w-4 h-4 text-blue-500" />
										</div>
									</th>
									<th scope="col" class="px-6 py-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors select-none text-right" @click="sortBy('rate')">
										<div class="flex items-center justify-end gap-1">
											{{ __("Price") }}
											<ArrowUp v-if="sortColumn === 'rate' && sortOrder === 'asc'" class="w-4 h-4 text-blue-500" />
											<ArrowDown v-if="sortColumn === 'rate' && sortOrder === 'desc'" class="w-4 h-4 text-blue-500" />
										</div>
									</th>
								</tr>
							</thead>
							<tbody>
								<tr v-if="loading">
									<td colspan="7" class="px-6 py-12 text-center text-gray-500">
										<span
											class="animate-spin w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full inline-block"
										></span>
										<p class="mt-4">{{ __("Loading items...") }}</p>
									</td>
								</tr>
								<tr v-else-if="items.length === 0">
									<td colspan="7" class="px-6 py-12 text-center text-gray-500">
										<Package
											class="mx-auto mb-3 text-gray-300"
											:size="32"
										/>
										<p>{{ __("No items found.") }}</p>
									</td>
								</tr>
								<tr
									v-for="item in sortedItems"
									:key="item.item_code"
									class="odd:bg-gray-50 even:bg-white dark:odd:bg-gray-800/50 dark:even:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
								>
									<td class="px-6 py-2">
										<FrappeImage
											v-if="item.image"
											:src="item.image"
											:alt="item.item_name"
											class="w-10 h-10 object-contain rounded-md"
										/>
										<div
											v-else
											class="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center text-gray-400"
										>
											<Package :size="16" />
										</div>
									</td>
									<td class="px-6 py-4 font-mono text-xs text-gray-500 dark:text-gray-400">
										{{ item.item_code }}
									</td>
									<td class="px-6 py-4 font-bold text-gray-900 dark:text-white">
										{{ item.item_name }}
									</td>
									<td class="px-6 py-4">
										<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
											{{ item.item_group }}
										</span>
									</td>
									<td class="px-6 py-4">
										{{ item.stock_uom }}
									</td>
									<td class="px-6 py-4 text-right font-bold"
										:class="item.actual_qty > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'"
									>
										{{ item.actual_qty || 0 }}
									</td>
									<td
										class="px-6 py-4 text-right font-bold text-gray-900 dark:text-white"
									>
										{{ formatCurrency(item.rate || 0) }}
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</main>
	</div>
</template>
