<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { call } from "frappe-ui";
import { useDeskMode } from "@/composables/useDeskMode";
import {
	PackagePlus,
	ListTree,
	PackageSearch,
	Building2,
	CircleDollarSign,
} from "lucide-vue-next";
const router = useRouter();
const { isDeskMode } = useDeskMode();
const loading = ref(true);
const dashboardData = ref({ total_active_items: 0, total_warehouses: 0, total_stock_value: 0 });
onMounted(async () => {
	try {
		const data = await call("pos_prime.api.stock.get_dashboard_data");
		if (data) {
			dashboardData.value = data;
		}
	} catch (e) {
		console.error("Failed to fetch stock dashboard data", e);
	} finally {
		loading.value = false;
	}
});
function formatCurrency(amount: number) {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "PKR",
		minimumFractionDigits: 0,
	}).format(amount);
}
</script>
<template>
	<div class="h-full flex flex-col bg-gray-50 dark:bg-gray-900 overflow-y-auto">
		<!-- Header -->
		<header class="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div class="flex justify-between items-center py-4">
					<div>
						<h1 class="text-2xl font-bold text-gray-900 dark:text-white">
							{{ __("Stock Dashboard") }}
						</h1>
						<p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
							{{ __("Manage your inventory, receipts, and stock entries") }}
						</p>
					</div>
				</div>
			</div>
		</header>
		<main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
			<!-- Quick Actions -->
			<section>
				<h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
					{{ __("Quick Actions") }}
				</h2>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<!-- Stock Entry Action -->
					<button
						@click="router.push({ name: 'StockEntry' })"
						class="flex items-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-blue-500 hover:shadow-md transition-all group text-left"
					>
						<div
							class="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform"
						>
							<PackagePlus :size="28" />
						</div>
						<div class="ml-5">
							<h3
								class="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
							>
								{{ __("Add Stock") }}
							</h3>
							<p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
								{{ __("Create Purchase Receipts or Material Receipts directly.") }}
							</p>
						</div>
					</button>
					<!-- Stock List Action -->
					<button
						@click="router.push({ name: 'StockList' })"
						class="flex items-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-purple-500 hover:shadow-md transition-all group text-left"
					>
						<div
							class="w-14 h-14 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform"
						>
							<ListTree :size="28" />
						</div>
						<div class="ml-5">
							<h3
								class="text-lg font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors"
							>
								{{ __("Stock List") }}
							</h3>
							<p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
								{{ __("View history of recent stock entries and purchases.") }}
							</p>
						</div>
					</button>
				</div>
			</section>
			<!-- Key Metrics -->
			<section>
				<h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
					{{ __("Overview") }}
				</h2>
				<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div
						class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex items-center"
					>
						<div
							class="w-12 h-12 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center shrink-0"
						>
							<PackageSearch :size="24" />
						</div>
						<div class="ml-4">
							<p class="text-sm font-medium text-gray-500 dark:text-gray-400">
								{{ __("Total Active Items") }}
							</p>
							<div class="flex items-baseline mt-1">
								<span class="text-2xl font-bold text-gray-900 dark:text-white">
									<span
										v-if="loading"
										class="animate-pulse bg-gray-200 dark:bg-gray-700 h-8 w-16 rounded block"
									></span>
									<span v-else>{{ dashboardData.total_active_items }}</span>
								</span>
							</div>
						</div>
					</div>
					<div
						class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex items-center"
					>
						<div
							class="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center shrink-0"
						>
							<Building2 :size="24" />
						</div>
						<div class="ml-4">
							<p class="text-sm font-medium text-gray-500 dark:text-gray-400">
								{{ __("Total Warehouses") }}
							</p>
							<div class="flex items-baseline mt-1">
								<span class="text-2xl font-bold text-gray-900 dark:text-white">
									<span
										v-if="loading"
										class="animate-pulse bg-gray-200 dark:bg-gray-700 h-8 w-16 rounded block"
									></span>
									<span v-else>{{ dashboardData.total_warehouses }}</span>
								</span>
							</div>
						</div>
					</div>
					<div
						class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex items-center"
					>
						<div
							class="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center shrink-0"
						>
							<CircleDollarSign :size="24" />
						</div>
						<div class="ml-4">
							<p class="text-sm font-medium text-gray-500 dark:text-gray-400">
								{{ __("Total Stock Value") }}
							</p>
							<div class="flex items-baseline mt-1">
								<span class="text-2xl font-bold text-gray-900 dark:text-white">
									<span
										v-if="loading"
										class="animate-pulse bg-gray-200 dark:bg-gray-700 h-8 w-32 rounded block"
									></span>
									<span v-else>{{
										formatCurrency(dashboardData.total_stock_value)
									}}</span>
								</span>
							</div>
						</div>
					</div>
				</div>
			</section>
		</main>
	</div>
</template>
