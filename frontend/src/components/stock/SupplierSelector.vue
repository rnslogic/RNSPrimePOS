<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from "vue";
import { call } from "frappe-ui";
import { Building2, Search, X } from "lucide-vue-next";
const props = defineProps<{
  modelValue: string | null;
}>();
const emit = defineEmits<{
  "update:modelValue": [value: string | null];
  change: [value: string | null];
}>();

const searchTerm = ref("");
const results = ref<{ name: string; supplier_name: string }[]>([]);
const showDropdown = ref(false);
const selectedIndex = ref(-1);
const loading = ref(false);
let debounceTimer: ReturnType<typeof setTimeout>;

watch(searchTerm, (term) => {
	clearTimeout(debounceTimer);
	debounceTimer = setTimeout(async () => {
		await searchSuppliers(term);
	}, 300);
});

async function searchSuppliers(term: string) {
	loading.value = true;
	try {
		const filters: any = {};
		if (term) {
			filters.supplier_name = ["like", `%${term}%`];
		}
		const data = await call("frappe.client.get_list", {
			doctype: "Supplier",
			filters,
			fields: ["name", "supplier_name"],
			limit_page_length: 20,
		});
		results.value = data || [];
		showDropdown.value = results.value.length > 0;
		selectedIndex.value = -1;
	} catch (e) {
		console.error("Failed to fetch suppliers", e);
	} finally {
		loading.value = false;
	}
}

async function onFocus() {
	if (results.value.length === 0 && !searchTerm.value) {
		await searchSuppliers("");
	}
	showDropdown.value = results.value.length > 0;
}

function selectSupplier(name: string) {
	emit("update:modelValue", name);
	emit("change", name);
	searchTerm.value = "";
	results.value = [];
	showDropdown.value = false;
	selectedIndex.value = -1;
}

function clearSupplier() {
	emit("update:modelValue", null);
	emit("change", null);
}

function onArrowDown() {
	if (!showDropdown.value) {
		if (results.value.length > 0) showDropdown.value = true;
		return;
	}
	if (selectedIndex.value < results.value.length - 1) {
		selectedIndex.value++;
	}
}

function onArrowUp() {
	if (!showDropdown.value) return;
	if (selectedIndex.value > 0) {
		selectedIndex.value--;
	} else {
		selectedIndex.value = -1;
	}
}

function onEnter() {
	if (
		showDropdown.value &&
		selectedIndex.value >= 0 &&
		selectedIndex.value < results.value.length
	) {
		selectSupplier(results.value[selectedIndex.value].name);
	}
}

function onEscape() {
	showDropdown.value = false;
	selectedIndex.value = -1;
}

function handleClickOutside(e: MouseEvent) {
	const target = e.target as HTMLElement;
	if (!target.closest(".supplier-selector")) {
		showDropdown.value = false;
	}
}

onMounted(() => {
	document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
	document.removeEventListener("click", handleClickOutside);
	clearTimeout(debounceTimer);
});
</script>
<template>
	<div class="relative supplier-selector w-full z-20">
		<div v-if="!modelValue" class="relative">
			<div
				class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none text-gray-400 dark:text-gray-500"
			>
				<Search :size="16" />
			</div>
			<input
				v-model="searchTerm"
				@focus="onFocus"
				@keydown.down.prevent="onArrowDown"
				@keydown.up.prevent="onArrowUp"
				@keydown.enter.prevent="onEnter"
				@keydown.esc.prevent="onEscape"
				type="text"
				class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-xl focus:border-blue-500 block w-full ps-9 p-3 placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
				:placeholder="__('Search supplier...')"
				autocomplete="off"
			/>
		</div>
		<!-- Selected State -->
		<div
			v-else
			class="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-xl p-3 flex items-center justify-between"
		>
			<div class="flex items-center gap-3 overflow-hidden">
				<div
					class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0"
				>
					<Building2 :size="16" />
				</div>
				<div class="flex flex-col min-w-0">
					<span class="text-sm font-bold text-gray-900 dark:text-white truncate">
						{{ modelValue }}
					</span>
					<span
						class="text-[11px] font-medium text-gray-500 dark:text-gray-400 truncate"
					>
						{{ __("Supplier Selected") }}
					</span>
				</div>
			</div>
			<button
				@click="clearSupplier"
				class="p-2 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors shrink-0"
				:title="__('Clear Supplier')"
			>
				<X :size="18" />
			</button>
		</div>
		<!-- Dropdown -->
		<div
			v-if="showDropdown && !modelValue"
			class="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 max-h-64 overflow-y-auto"
		>
			<ul class="py-1">
				<li
					v-if="loading"
					class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center"
				>
					{{ __("Loading...") }}
				</li>
				<li
					v-else-if="results.length === 0"
					class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center"
				>
					{{ __("No suppliers found") }}
				</li>
				<li
					v-for="(supplier, index) in results"
					:key="supplier.name"
					@click="selectSupplier(supplier.name)"
					class="px-4 py-3 cursor-pointer transition-colors"
					:class="[
						index === selectedIndex
							? 'bg-blue-50 dark:bg-blue-900/30'
							: 'hover:bg-gray-50 dark:hover:bg-gray-700/50',
					]"
				>
					<div class="flex items-center gap-3">
						<div
							class="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400"
						>
							<Building2 :size="16" />
						</div>
						<div class="flex flex-col min-w-0">
							<span
								class="text-sm font-semibold text-gray-900 dark:text-white truncate"
							>
								{{ supplier.supplier_name }}
							</span>
						</div>
					</div>
				</li>
			</ul>
		</div>
	</div>
</template>
