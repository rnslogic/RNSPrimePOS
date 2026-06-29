<!-- Copyright (c) 2026, Ravindu Gajanayaka -->
<!-- Licensed under GPLv3. See license.txt -->
<script setup lang="ts">
import { computed } from "vue";
import { useItemsStore } from "@/stores/items";
import { useSettingsStore } from "@/stores/settings";
import { List, LayoutGrid, AlignJustify } from "lucide-vue-next";
const props = defineProps<{
	groups: string[];
	selected: string;
	mode?: "desktop" | "mobile";
}>();
const emit = defineEmits<{
	select: [group: string];
}>();
const itemsStore = useItemsStore();
const settingsStore = useSettingsStore();

const filteredGroups = computed(() => {
	if (!itemsStore.searchTerm) return props.groups;
	const term = itemsStore.searchTerm.toLowerCase();
	return props.groups.filter((g) => g.toLowerCase().includes(term));
});
</script>
<template>
	<!-- Desktop sidebar list -->
	<div
		v-if="mode === 'desktop'"
		class="shrink-0 w-44 bg-white dark:bg-gray-900 border-e border-gray-100 dark:border-gray-800 flex flex-col"
	>
		<div class="p-2 flex flex-col min-h-0 flex-1">
			<div class="flex items-center justify-between px-3 py-1.5 mb-1">
				<span
					class="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest"
				>
					{{ __("Categories") }}
				</span>
			</div>
			<div class="overflow-y-auto flex-1 no-scrollbar px-1.5 pt-1 pb-2">
				<button
					v-for="group in filteredGroups"
					:key="group"
					@click="emit('select', group)"
					class="w-full text-left px-2 py-1.5 text-xs rounded-lg transition-all duration-150 mb-0.5"
					:class="[
						selected === group
							? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-semibold'
							: 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-800 dark:hover:text-gray-200',
					]"
				>
					{{ group }}
				</button>
				<div
					v-if="filteredGroups.length === 0"
					class="px-3 py-2 text-xs text-gray-400 dark:text-gray-500"
				>
					{{ __("No match") }}
				</div>
			</div>
		</div>
	</div>
	<!-- Mobile/tablet horizontal scroll -->
	<div v-else class="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
		<div class="flex items-center gap-1.5 overflow-x-auto px-3 py-2 no-scrollbar">
			<button
				v-for="group in filteredGroups"
				:key="group"
				@click="emit('select', group)"
				class="shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150"
				:class="
					selected === group
						? 'bg-blue-600 text-white shadow-sm shadow-blue-600/20'
						: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
				"
			>
				{{ group }}
			</button>
			<div
				v-if="filteredGroups.length === 0"
				class="text-xs text-gray-400 dark:text-gray-500 py-1"
			>
				No match
			</div>
		</div>
	</div>
</template>
<style scoped>
.no-scrollbar::-webkit-scrollbar {
	display: none;
}
.no-scrollbar {
	-ms-overflow-style: none;
	scrollbar-width: none;
}
</style>
