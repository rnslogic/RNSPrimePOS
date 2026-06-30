<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import { call } from "frappe-ui";
import { usePosSessionStore } from "@/stores/posSession";
import { useSwipeToBack } from "@/composables/useSwipeToBack";
import { ArrowLeft, PackagePlus, Save, X } from "lucide-vue-next";

const router = useRouter();
const posSessionStore = usePosSessionStore();

useSwipeToBack("StockDashboard");

const itemGroups = ref<any[]>([]);
const brands = ref<any[]>([]);

onMounted(async () => {
	try {
		const [groupData, brandData] = await Promise.all([
			call("frappe.client.get_list", { doctype: "Item Group", filters: { is_group: 0 }, fields: ["name"], limit_page_length: 100 }),
			call("frappe.client.get_list", { doctype: "Brand", fields: ["name"], limit_page_length: 100 })
		]);
		itemGroups.value = groupData || [];
		brands.value = brandData || [];
	} catch (e) {
		console.error("Failed to fetch groups/brands", e);
	}
});

const showGroupDropdown = ref(false);
const activeGroupIndex = ref(-1);
const filteredGroups = computed(() => {
	const q = form.value.item_group.toLowerCase();
	return itemGroups.value.filter(g => g.name.toLowerCase().includes(q));
});

const showBrandDropdown = ref(false);
const activeBrandIndex = ref(-1);
const filteredBrands = computed(() => {
	const q = form.value.brand.toLowerCase();
	return brands.value.filter(b => b.name.toLowerCase().includes(q));
});

function selectGroup(name: string) {
	form.value.item_group = name;
	showGroupDropdown.value = false;
	activeGroupIndex.value = -1;
}

function selectBrand(name: string) {
	form.value.brand = name;
	showBrandDropdown.value = false;
	activeBrandIndex.value = -1;
}

function handleGroupKeydown(e: KeyboardEvent) {
	if (!showGroupDropdown.value) return;
	if (e.key === 'ArrowDown') {
		e.preventDefault();
		if (activeGroupIndex.value < filteredGroups.value.length - 1) activeGroupIndex.value++;
	} else if (e.key === 'ArrowUp') {
		e.preventDefault();
		if (activeGroupIndex.value > 0) activeGroupIndex.value--;
	} else if (e.key === 'Enter' && activeGroupIndex.value >= 0) {
		e.preventDefault();
		const grp = filteredGroups.value[activeGroupIndex.value];
		if (grp) selectGroup(grp.name);
	}
}

function handleBrandKeydown(e: KeyboardEvent) {
	if (!showBrandDropdown.value) return;
	if (e.key === 'ArrowDown') {
		e.preventDefault();
		if (activeBrandIndex.value < filteredBrands.value.length - 1) activeBrandIndex.value++;
	} else if (e.key === 'ArrowUp') {
		e.preventDefault();
		if (activeBrandIndex.value > 0) activeBrandIndex.value--;
	} else if (e.key === 'Enter' && activeBrandIndex.value >= 0) {
		e.preventDefault();
		const brnd = filteredBrands.value[activeBrandIndex.value];
		if (brnd) selectBrand(brnd.name);
	}
}

const form = ref({
	item_code: "",
	item_name: "",
	item_group: "",
	brand: "",
	uom: "Nos",
	purchase_price: "",
	selling_price: "",
	max_discount: "",
	opening_qty: "",
});

watch([() => form.value.purchase_price, () => form.value.max_discount], ([newPurchase, newDiscount]) => {
	const pp = parseFloat(newPurchase) || 0;
	const md = parseFloat(newDiscount) || 0;
	if (pp > 0) {
		const sp = pp + (pp * (md / 100));
		form.value.selling_price = Math.round(sp).toString();
	}
});

const submitting = ref(false);
const successMessage = ref("");
const errorMessage = ref("");

function formatNumberField(field: keyof typeof form.value) {
	let val = form.value[field];
	if (typeof val === "string") {
		// Remove existing commas
		val = val.replace(/,/g, "");
		const num = parseFloat(val);
		if (!isNaN(num)) {
			form.value[field] = num.toLocaleString("en-US", { maximumFractionDigits: 2 });
		}
	} else if (typeof val === "number") {
		form.value[field] = val.toLocaleString("en-US", { maximumFractionDigits: 2 });
	}
}

const isValid = computed(() => {
	return form.value.item_code.trim() && form.value.item_name.trim() && form.value.item_group.trim();
});

async function submitItem() {
	if (!isValid.value) return;
	
	submitting.value = true;
	successMessage.value = "";
	try {
		await call("pos_prime.api.items.create_item", {
			item_data: {
				item_code: form.value.item_code,
				item_name: form.value.item_name,
				item_group: form.value.item_group,
				brand: form.value.brand,
				uom: form.value.uom,
				purchase_price: form.value.purchase_price,
				selling_price: form.value.selling_price,
				max_discount: form.value.max_discount,
				opening_qty: form.value.opening_qty,
			},
			pos_profile: posSessionStore.posProfile
		});
		
		successMessage.value = "Item created successfully!";
		
		setTimeout(() => {
			router.push({ name: 'StockDashboard' });
		}, 1500);
		
	} catch (error: any) {
		console.error("Failed to create item:", error);
		let msg = error.message || "Failed to create item";
		if (error.messages && Array.isArray(error.messages) && error.messages.length > 0) {
			try {
				msg = JSON.parse(error.messages[0]).message || error.messages[0];
			} catch (e) {
				msg = error.messages[0];
			}
		}
		errorMessage.value = msg;
	} finally {
		submitting.value = false;
	}
}
</script>

<template>
	<div class="h-full flex flex-col bg-gray-50 dark:bg-gray-900 overflow-hidden">
		<!-- Header -->
		<header class="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10 flex-none border-b border-gray-100 dark:border-gray-700">
			<div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
				<div class="flex items-center justify-between py-4">
					<div class="flex items-center gap-4">
						<button
							@click="router.push({ name: 'StockDashboard' })"
							class="p-2 -ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors lg:hidden shrink-0"
						>
							<ArrowLeft :size="24" />
						</button>
						<button
							@click="router.push({ name: 'StockDashboard' })"
							class="hidden lg:block p-1.5 -ml-1.5 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-md shrink-0"
						>
							<ArrowLeft :size="18" />
						</button>
						<div class="flex items-start gap-2 sm:gap-3">
							<PackagePlus class="text-blue-500 mt-0.5" :size="24" />
							<div>
								<h1 class="text-xl font-bold text-gray-900 dark:text-white">
									{{ __("New Stock Item") }}
								</h1>
								<p class="text-xs text-gray-500 dark:text-gray-400 mt-1 sm:mt-1.5">
									{{ __("Create a new item in the system.") }}
								</p>
							</div>
						</div>
					</div>
					<button
						@click="submitItem"
						:disabled="!isValid || submitting"
						class="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors"
					>
						<span
							v-if="submitting"
							class="animate-spin w-4 h-4 border-2 border-white/20 border-t-white rounded-full"
						></span>
						<Save v-else :size="18" /> {{ __("Save Item") }}
					</button>
				</div>
			</div>
		</header>

		<!-- Main Content -->
		<main class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
			<div class="max-w-6xl mx-auto space-y-6">
				
				<div v-if="successMessage" class="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 p-4 rounded-xl text-center font-medium border border-green-200 dark:border-green-900/50">
					{{ successMessage }}
				</div>

				<!-- Error Message -->
			<div v-if="errorMessage" class="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl border border-red-100 dark:border-red-900/50 flex items-center justify-between">
				<span>{{ errorMessage }}</span>
				<button @click="errorMessage = ''" class="text-red-400 hover:text-red-600 transition-colors focus:outline-none">
					<X :size="16" />
				</button>
			</div>

			<!-- Form Container -->
				<div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sm:p-8">
					<div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
						
						<!-- Item Code / Barcode -->
						<div class="col-span-1 md:col-span-2">
							<label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{{ __("Barcode / Item Code") }} <span class="text-red-500">*</span></label>
							<input
								v-model="form.item_code"
								type="text"
								class="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 block w-full p-3 transition-colors"
								:placeholder="__('Scan barcode or type item code...')"
								autofocus
							/>
						</div>

						<!-- Item Name -->
						<div class="col-span-1 md:col-span-2">
							<label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{{ __("Item Name") }} <span class="text-red-500">*</span></label>
							<input
								v-model="form.item_name"
								type="text"
								class="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 block w-full p-3 transition-colors"
								:placeholder="__('e.g. Google Pixel 9 Pro')"
							/>
						</div>

						<!-- Item Group -->
						<div class="relative">
							<label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{{ __("Item Group") }} <span class="text-red-500">*</span></label>
							<input
								v-model="form.item_group"
								@focus="showGroupDropdown = true; showBrandDropdown = false; activeGroupIndex = -1"
								@blur="setTimeout(() => showGroupDropdown = false, 200)"
								@keydown="handleGroupKeydown"
								type="text"
								class="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 block w-full p-3 transition-colors"
								:placeholder="__('e.g. Mobile')"
							/>
							<ul
								v-if="showGroupDropdown && filteredGroups.length > 0"
								class="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg max-h-60 overflow-y-auto py-1 text-sm text-gray-800 dark:text-gray-200"
							>
								<li
									v-for="(group, index) in filteredGroups"
									:key="group.name"
									@mousedown="selectGroup(group.name)"
									class="px-4 py-2 cursor-pointer transition-colors"
									:class="index === activeGroupIndex ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'"
								>
									{{ group.name }}
								</li>
							</ul>
						</div>

						<!-- Brand -->
						<div class="relative">
							<label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{{ __("Brand") }}</label>
							<input
								v-model="form.brand"
								@focus="showBrandDropdown = true; showGroupDropdown = false; activeBrandIndex = -1"
								@blur="setTimeout(() => showBrandDropdown = false, 200)"
								@keydown="handleBrandKeydown"
								type="text"
								class="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 block w-full p-3 transition-colors"
								:placeholder="__('e.g. Google')"
							/>
							<ul
								v-if="showBrandDropdown && filteredBrands.length > 0"
								class="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg max-h-60 overflow-y-auto py-1 text-sm text-gray-800 dark:text-gray-200"
							>
								<li
									v-for="(brand, index) in filteredBrands"
									:key="brand.name"
									@mousedown="selectBrand(brand.name)"
									class="px-4 py-2 cursor-pointer transition-colors"
									:class="index === activeBrandIndex ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'"
								>
									{{ brand.name }}
								</li>
							</ul>
						</div>

						<!-- UOM -->
						<div>
							<label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{{ __("UOM") }}</label>
							<input
								v-model="form.uom"
								type="text"
								class="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 block w-full p-3 transition-colors"
								:placeholder="__('e.g. Nos, Piece, Packet')"
							/>
						</div>
						
						<!-- Opening Qty -->
						<div>
							<label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{{ __("Opening Qty") }}</label>
							<input
								v-model="form.opening_qty"
								@blur="formatNumberField('opening_qty')"
								type="text"
								class="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 block w-full p-3 transition-colors"
								:placeholder="__('e.g. 10')"
							/>
						</div>

						<!-- Max Discount -->
						<div>
							<label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{{ __("Max Discount (%)") }}</label>
							<input
								v-model="form.max_discount"
								@blur="formatNumberField('max_discount')"
								type="text"
								class="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 block w-full p-3 transition-colors"
								:placeholder="__('e.g. 10')"
							/>
						</div>

						<!-- Purchase Price -->
						<div>
							<label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{{ __("Purchase Price") }}</label>
							<input
								v-model="form.purchase_price"
								@blur="formatNumberField('purchase_price')"
								type="text"
								class="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 block w-full p-3 transition-colors"
								:placeholder="__('0.00')"
							/>
						</div>

						<!-- Selling Price -->
						<div>
							<label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{{ __("Selling Price") }}</label>
							<input
								v-model="form.selling_price"
								@blur="formatNumberField('selling_price')"
								type="text"
								class="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 block w-full p-3 transition-colors"
								:placeholder="__('0.00')"
							/>
						</div>

					</div>
				</div>

			</div>
		</main>
	</div>
</template>
