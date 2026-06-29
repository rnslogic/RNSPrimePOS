<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { call } from "frappe-ui";
import { usePosSessionStore } from "@/stores/posSession";
import { useSettingsStore } from "@/stores/settings";
import { ArrowLeft, Plus, Search, Trash2, PackagePlus, Receipt, Save } from "lucide-vue-next";
import SupplierSelector from "@/components/stock/SupplierSelector.vue";
const router = useRouter();
const sessionStore = usePosSessionStore();
const settingsStore = useSettingsStore();
const supplier = ref<string | null>(null);
const targetWarehouse = ref<string>("");
const warehouses = ref<string[]>([]);
const loading = ref(false);
const submitting = ref(false);
const itemSearchTerm = ref("");
const itemSearchResults = ref<any[]>([]);
const showItemDropdown = ref(false);
const searchingItems = ref(false);
const items = ref<{ item_code: string; item_name: string; qty: number; rate: number }[]>([]); // Load Warehouses
onMounted(async () => {
	loading.value = true;
	try {
		const data = await call("frappe.client.get_list", {
			doctype: "Warehouse",
			filters: { is_group: 0, company: sessionStore.company },
			fields: ["name"],
		});
		warehouses.value = data?.map((w: any) => w.name) || [];
		if (settingsStore.posProfile?.warehouse) {
			targetWarehouse.value = settingsStore.posProfile.warehouse;
		} else if (warehouses.value.length > 0) {
			targetWarehouse.value = warehouses.value[0];
		}
	} catch (e) {
		console.error("Failed to load warehouses", e);
	} finally {
		loading.value = false;
	}
});
let searchTimer: any = null;
async function handleItemSearch() {
	if (!itemSearchTerm.value) {
		itemSearchResults.value = [];
		showItemDropdown.value = false;
		return;
	}
	clearTimeout(searchTimer);
	searchTimer = setTimeout(async () => {
		searchingItems.value = true;
		try {
			const data = await call("pos_prime.api.pos.search_items", {
				search_term: itemSearchTerm.value,
				pos_profile: settingsStore.posProfile?.name,
			});
			itemSearchResults.value = data || [];
			showItemDropdown.value = itemSearchResults.value.length > 0;
		} catch (e) {
			console.error(e);
		} finally {
			searchingItems.value = false;
		}
	}, 300);
}
function selectItem(item: any) {
	const existing = items.value.find((i) => i.item_code === item.item_code);
	if (existing) {
		existing.qty += 1;
	} else {
		items.value.push({
			item_code: item.item_code,
			item_name: item.item_name,
			qty: 1,
			rate: item.standard_rate || 0,
		});
	}
	itemSearchTerm.value = "";
	itemSearchResults.value = [];
	showItemDropdown.value = false;
}
function removeItem(index: number) {
	items.value.splice(index, 1);
}
const totalAmount = computed(() => {
	return items.value.reduce((sum, item) => sum + item.qty * item.rate, 0);
});
function formatCurrency(amount: number) {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: settingsStore.posProfile?.currency || "PKR",
		minimumFractionDigits: 0,
	}).format(amount);
}
async function submitReceipt() {
	if (items.value.length === 0) return;
	if (!targetWarehouse.value) {
		alert(__("Please select a target warehouse"));
		return;
	}
	submitting.value = true;
	try {
		const receiptName = await call("pos_prime.api.stock.make_stock_receipt", {
			data: {
				supplier: supplier.value,
				target_warehouse: targetWarehouse.value,
				company: sessionStore.company,
				items: items.value,
			},
		});
		alert(
			__("Successfully created {0}: {1}", [
				supplier.value ? "Purchase Receipt" : "Material Receipt",
				receiptName,
			]),
		);
		router.push({ name: "StockDashboard" });
	} catch (e: any) {
		console.error(e);
		alert(e.message || __("Failed to submit receipt"));
	} finally {
		submitting.value = false;
	}
}
</script>
<template>
	<div class="h-full flex flex-col bg-gray-50 dark:bg-gray-900 overflow-hidden">
		<!-- Header -->
		<header class="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10 flex-none">
			<div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
				<div class="flex items-center justify-between py-4">
					<div class="flex items-center gap-4">
						<div>
							<h1
								class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2"
							>
								<Receipt v-if="supplier" class="text-blue-500" :size="20" />
								<PackagePlus v-else class="text-purple-500" :size="20" />
								{{ supplier ? __("Purchase Receipt") : __("Material Receipt") }}
							</h1>
							<p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
								{{
									supplier
										? __("Adding stock against a supplier.")
										: __("Adding stock directly.")
								}}
							</p>
						</div>
					</div>
					<button
						@click="submitReceipt"
						:disabled="items.length === 0 || submitting"
						class="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors"
					>
						<span
							v-if="submitting"
							class="animate-spin w-4 h-4 border-2 border-white/20 border-t-white rounded-full"
						></span>
						<Save v-else :size="18" /> {{ __("Submit") }}
					</button>
				</div>
			</div>
		</header>
		<main class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
			<div class="max-w-6xl mx-auto space-y-6">
				<!-- Configuration Section -->
				<div
					class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6"
				>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<label
								class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
								>{{ __("Supplier (Optional)") }}</label
							>
							<SupplierSelector v-model="supplier" />
						</div>
						<div>
							<label
								class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
								>{{ __("Target Warehouse") }}</label
							>
							<select
								v-model="targetWarehouse"
								class="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-xl focus:border-blue-500 p-3"
							>
								<option v-for="wh in warehouses" :key="wh" :value="wh">
									{{ wh }}
								</option>
							</select>
						</div>
					</div>
				</div>
				<!-- Items Section -->
				<div
					class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col min-h-[400px]"
				>
					<div class="p-4 border-b border-gray-100 dark:border-gray-700">
						<div class="relative w-full max-w-md">
							<div
								class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none text-gray-400"
							>
								<Search :size="18" />
							</div>
							<input
								v-model="itemSearchTerm"
								@input="handleItemSearch"
								type="text"
								class="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-xl focus:border-blue-500 block w-full ps-10 p-3"
								:placeholder="__('Scan barcode or search item...')"
								autocomplete="off"
							/>
							<!-- Item Dropdown -->
							<div
								v-if="showItemDropdown"
								class="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 max-h-64 overflow-y-auto"
							>
								<ul class="py-1">
									<li
										v-if="searchingItems"
										class="px-4 py-3 text-sm text-gray-500 text-center"
									>
										{{ __("Searching...") }}
									</li>
									<li
										v-else-if="itemSearchResults.length === 0"
										class="px-4 py-3 text-sm text-gray-500 text-center"
									>
										{{ __("No items found") }}
									</li>
									<li
										v-for="item in itemSearchResults"
										:key="item.item_code"
										@click="selectItem(item)"
										class="px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 flex justify-between items-center"
									>
										<div>
											<div
												class="text-sm font-semibold text-gray-900 dark:text-white"
											>
												{{ item.item_name }}
											</div>
											<div class="text-xs text-gray-500">
												{{ item.item_code }}
											</div>
										</div>
										<div
											class="text-sm font-bold text-gray-900 dark:text-white"
										>
											{{ formatCurrency(item.standard_rate || 0) }}
										</div>
									</li>
								</ul>
							</div>
						</div>
					</div>
					<!-- Items Table -->
					<div class="flex-1 overflow-x-auto">
						<table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
							<thead
								class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-900/50 dark:text-gray-300"
							>
								<tr>
									<th scope="col" class="px-6 py-3 w-12">#</th>
									<th scope="col" class="px-6 py-3">{{ __("Item") }}</th>
									<th scope="col" class="px-6 py-3 w-32">{{ __("Qty") }}</th>
									<th scope="col" class="px-6 py-3 w-40">{{ __("Rate") }}</th>
									<th scope="col" class="px-6 py-3 w-40 text-right">
										{{ __("Amount") }}
									</th>
									<th scope="col" class="px-6 py-3 w-16"></th>
								</tr>
							</thead>
							<tbody>
								<tr v-if="items.length === 0">
									<td colspan="6" class="px-6 py-12 text-center text-gray-500">
										<PackagePlus
											class="mx-auto mb-3 text-gray-300"
											:size="32"
										/>
										<p>{{ __("Search and add items to receive stock") }}</p>
									</td>
								</tr>
								<tr
									v-for="(item, index) in items"
									:key="index"
									class="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
								>
									<td class="px-6 py-4 font-medium">{{ index + 1 }}</td>
									<td class="px-6 py-4">
										<div class="font-semibold text-gray-900 dark:text-white">
											{{ item.item_name }}
										</div>
										<div class="text-xs text-gray-500">
											{{ item.item_code }}
										</div>
									</td>
									<td class="px-6 py-4">
										<input
											type="number"
											v-model.number="item.qty"
											class="w-20 bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:border-blue-500 block p-2"
											min="1"
										/>
									</td>
									<td class="px-6 py-4">
										<input
											type="number"
											v-model.number="item.rate"
											class="w-28 bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:border-blue-500 block p-2"
											min="0"
										/>
									</td>
									<td
										class="px-6 py-4 text-right font-bold text-gray-900 dark:text-white"
									>
										{{ formatCurrency(item.qty * item.rate) }}
									</td>
									<td class="px-6 py-4 text-right">
										<button
											@click="removeItem(index)"
											class="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
										>
											<Trash2 :size="18" />
										</button>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div
						class="p-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700 flex justify-end items-center rounded-b-2xl"
					>
						<div class="text-right">
							<div class="text-sm text-gray-500 dark:text-gray-400 mb-1">
								{{ __("Total Amount") }}
							</div>
							<div class="text-3xl font-bold text-blue-600 dark:text-blue-400">
								{{ formatCurrency(totalAmount) }}
							</div>
						</div>
					</div>
				</div>
			</div>
		</main>
	</div>
</template>
