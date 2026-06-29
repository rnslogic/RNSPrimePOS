<script setup lang="ts">
import { ref } from "vue";
import { Button, call } from "frappe-ui";
import { useCashiersStore } from "@/stores/cashiers";
import AppShell from "@/components/layout/AppShell.vue";
const cashiersStore = useCashiersStore();
const isSyncing = ref(false);

async function syncCashiers() {
	isSyncing.value = true;
	try {
		const cashiersRes = await call("frappe.client.get_list", {
			doctype: "POS Cashier",
			fields: ["title", "cashier_name", "pin"],
			limit_page_length: 100,
		});
		if (cashiersRes) {
			cashiersStore.setCashiers(cashiersRes);
			if (cashiersStore.cashiers.length === 0) {
				alert("No cashiers found in ERPNext. Please create them first.");
			} else {
				alert("Cashiers synced successfully.");
			}
		}
	} catch (error) {
		console.error("Error syncing cashiers:", error);
		alert("Failed to sync cashiers.");
	} finally {
		isSyncing.value = false;
	}
}
</script>
<template>
	<AppShell>
		<div class="h-full bg-gray-50 dark:bg-gray-900 p-6">
			<div class="max-w-4xl mx-auto">
				<div class="flex items-center justify-between mb-6">
					<h1 class="text-2xl font-bold text-gray-900 dark:text-white">
						Settings - Cashiers
					</h1>
					<Button variant="solid" :loading="isSyncing" @click="syncCashiers">
						Sync Cashiers from ERPNext
					</Button>
				</div>
				<div
					class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
				>
					<table class="w-full text-left text-sm text-gray-600 dark:text-gray-400">
						<thead
							class="bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700"
						>
							<tr>
								<th class="px-6 py-3 font-semibold">Title</th>
								<th class="px-6 py-3 font-semibold">Cashier Name</th>
								<th class="px-6 py-3 font-semibold">PIN</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-200 dark:divide-gray-700">
							<tr v-for="c in cashiersStore.cashiers" :key="c.title">
								<td class="px-6 py-4 font-medium">{{ c.title }}</td>
								<td class="px-6 py-4">{{ c.cashier_name || "Admin" }}</td>
								<td class="px-6 py-4 tracking-widest">{{ c.pin }}</td>
							</tr>
							<tr v-if="cashiersStore.cashiers.length === 0">
								<td colspan="3" class="px-6 py-8 text-center text-gray-500">
									No cashiers found. Click 'Sync Cashiers from ERPNext' to fetch.
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</AppShell>
</template>
