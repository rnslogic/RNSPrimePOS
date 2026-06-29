<script setup lang="ts">
import { computed, onMounted, onUnmounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import AppShell from "@/components/layout/AppShell.vue";
import {
	Package,
	PackagePlus,
	Receipt,
	ArrowLeft,
	ClipboardList,
	LayoutDashboard,
} from "lucide-vue-next";

const router = useRouter();
const route = useRoute();

const menuItems = [
	{ name: __("Dashboard"), routeName: "StockDashboard", icon: LayoutDashboard },
	{ name: __("Stock Entry"), routeName: "StockEntry", icon: PackagePlus },
	{ name: __("New Stock"), routeName: "NewStock", icon: PackagePlus },
	{ name: __("Stock Invoices"), routeName: "StockInvoices", icon: Receipt },
	{ name: __("Items List"), routeName: "StockList", icon: Package },
];

const currentRouteName = computed(() => route.name as string);

function navigate(routeName: string) {
	router.push({ name: routeName });
}

function navigateNext() {
	const currentIndex = menuItems.findIndex((i) => i.routeName === currentRouteName.value);
	if (currentIndex < menuItems.length - 1) {
		navigate(menuItems[currentIndex + 1].routeName);
	}
}

function navigatePrev() {
	const currentIndex = menuItems.findIndex((i) => i.routeName === currentRouteName.value);
	if (currentIndex > 0) {
		navigate(menuItems[currentIndex - 1].routeName);
	}
}

function handleKeydown(e: KeyboardEvent) {
	// Do not trigger if typing in an input/textarea
	if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
		return;
	}
	if (e.key === "ArrowDown") {
		e.preventDefault();
		navigateNext();
	} else if (e.key === "ArrowUp") {
		e.preventDefault();
		navigatePrev();
	}
}

onMounted(() => {
	window.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
	window.removeEventListener("keydown", handleKeydown);
});
</script>
<template>
	<AppShell>
		<div class="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
			<!-- Header -->
			<div
				class="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center gap-3"
			>
				<button
					@click="router.push({ name: 'POS' })"
					class="lg:hidden text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
				>
					<ArrowLeft :size="20" />
				</button>
				<h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
					{{ __("Stock") }}
				</h2>
			</div>
			<div class="flex-1 flex overflow-hidden">
				<!-- Left: Subsections Menu -->
				<div
					class="w-full lg:w-[360px] shrink-0 flex flex-col border-e border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hidden lg:flex"
				>
					<div class="flex-1 overflow-y-auto p-3 space-y-2">
						<button
							v-for="(item, index) in menuItems"
							:key="item.routeName"
							@click="navigate(item.routeName)"
							class="w-full flex items-center gap-3 p-3 rounded-lg border transition-all duration-150 text-left focus:outline-none"
							:class="
								currentRouteName === item.routeName
									? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-500'
									: 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
							"
						>
							<component
								:is="item.icon"
								:size="20"
								:class="
									currentRouteName === item.routeName
										? 'text-blue-500 dark:text-blue-400'
										: 'text-gray-400 dark:text-gray-500'
								"
							/>
							<div class="flex-1">
								<div
									class="font-medium text-sm"
									:class="
										currentRouteName === item.routeName
											? 'text-blue-700 dark:text-blue-400'
											: 'text-gray-900 dark:text-gray-100'
									"
								>
									{{ item.name }}
								</div>
							</div>
						</button>
					</div>
				</div>
				<!-- Right: Content area (Router View) -->
				<div class="flex-1 relative overflow-hidden bg-white dark:bg-gray-900">
					<router-view v-slot="{ Component }">
						<transition name="fade" mode="out-in">
							<component :is="Component" />
						</transition>
					</router-view>
				</div>
			</div>
		</div>
	</AppShell>
</template>
