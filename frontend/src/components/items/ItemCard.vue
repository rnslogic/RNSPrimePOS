<!-- Copyright (c) 2026, Ravindu Gajanayaka -->
<!-- Licensed under GPLv3. See license.txt -->
<script setup lang="ts">
import { Package, Plus } from "lucide-vue-next";
import { useSettingsStore } from "@/stores/settings";
import { useAuthStore } from "@/stores/auth";
import FrappeImage from "@/components/FrappeImage.vue";
import { useCurrency } from "@/composables/useCurrency";
import type { Item } from "@/types";
const props = defineProps<{ item: Item }>();
const emit = defineEmits<{ select: [item: Item] }>();
const settingsStore = useSettingsStore();
const authStore = useAuthStore();
const { formatCurrency } = useCurrency();
</script>
<template>
	<button
		@click="emit('select', props.item)"
		:aria-label="`Add ${props.item.item_name} to cart`"
		class="pos-card group relative flex rounded-lg overflow-hidden hover:scale-[1.02] transition-all duration-200 text-left bg-white dark:bg-gray-800"
		:class="[
			settingsStore.viewMode === 'list'
				? 'flex-row items-center border border-gray-100 dark:border-gray-800'
				: 'flex-col',
			settingsStore.viewMode === 'compact'
				? 'h-auto min-h-[4.5rem] py-1'
				: settingsStore.viewMode !== 'list'
					? 'h-full'
					: '',
		]"
	>
		<!-- Image -->
		<div
			v-if="settingsStore.viewMode !== 'compact'"
			class="relative bg-gray-50 dark:bg-gray-800 flex items-center justify-center overflow-hidden shrink-0"
			:class="settingsStore.viewMode === 'list' ? 'w-20 h-20' : 'h-32 min-h-[8rem] w-full'"
		>
			<FrappeImage
				v-if="item.image"
				:src="item.image"
				:alt="item.item_name"
				class="w-full h-full max-w-full max-h-full object-contain"
			/>
			<Package v-else class="text-gray-200 dark:text-gray-700" :size="36" />
			<!-- Hover overlay -->
			<div
				class="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/10 transition-colors duration-200 flex items-center justify-center"
			>
				<div
					class="w-8 h-8 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-200"
				>
					<Plus :size="16" class="text-blue-600 dark:text-blue-400" />
				</div>
			</div>
		</div>
		<!-- Stock badge (only for stock items, not services) -->
		<span
			v-if="(item.is_stock_item || item.is_product_bundle) && item.actual_qty !== undefined"
			class="absolute top-1.5 right-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-md backdrop-blur-sm shadow-sm"
			:class="
				item.actual_qty > 10
					? 'bg-green-500/90 text-white'
					: item.actual_qty > 0
						? 'bg-amber-500/90 text-white'
						: 'bg-red-500/90 text-white'
			"
		>
			{{ item.actual_qty > 0 ? item.actual_qty : __("Out") }}
		</span>
		<!-- Bundle badge -->
		<span
			v-if="item.is_product_bundle"
			class="absolute top-1.5 left-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-md backdrop-blur-sm bg-indigo-500/90 text-white shadow-sm"
		>
			{{ __("Bundle") }}
		</span>
		<!-- Item Info -->
		<div
			class="px-2 py-1.5 flex-1 flex flex-col"
			:class="settingsStore.viewMode === 'list' ? 'h-full justify-center' : 'min-h-[3rem]'"
		>
			<div
				class="text-xs font-semibold text-gray-800 dark:text-gray-200 line-clamp-2 leading-snug"
			>
				{{ item.item_name }}
			</div>
			<div class="mt-auto pt-1 flex items-center">
				<span class="text-sm font-bold text-gray-900 dark:text-gray-100">
					{{ formatCurrency(item.rate) }}
				</span>
				<span
					v-if="item.stock_uom"
					class="text-[10px] text-gray-400 dark:text-gray-500 ml-0.5"
				>
					/ {{ item.stock_uom }}
				</span>
			</div>
		</div>
	</button>
</template>
