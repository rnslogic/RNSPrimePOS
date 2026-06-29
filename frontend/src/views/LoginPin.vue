<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Input, Button, ErrorMessage } from "frappe-ui";
import { RefreshCcw } from "lucide-vue-next";
import { useCashiersStore } from "@/stores/cashiers";
const router = useRouter();
const route = useRoute();
const cashiersStore = useCashiersStore();
const selectedTitle = ref(cashiersStore.cashiers[0]?.title || "");
const selectedCashier = computed(() =>
	cashiersStore.cashiers.find((c) => c.title === selectedTitle.value),
);
const showDropdown = ref(false);
const pin = ref("");
const error = ref("");
const isLoading = ref(false);
const pinInput = ref();
onMounted(() => {
	if (route.query.error === "license_expired") {
		error.value = "Offline validity period has expired. Please contact your service provider.";
	} else if (route.query.error === "system_locked") {
		error.value =
			"System locked due to time tampering detected. Please contact your service provider.";
	}
	focusPinInput();
});
function focusPinInput() {
	nextTick(() => {
		const inputEl =
			pinInput.value?.$el?.querySelector?.("input") ||
			pinInput.value?.$el ||
			pinInput.value?.el ||
			pinInput.value;
		if (inputEl && inputEl.focus) {
			inputEl.focus();
		}
	});
}
function selectCashier(c: any) {
	selectedTitle.value = c.title;
	showDropdown.value = false;
	focusPinInput();
}
function navigateDropdown(direction: number) {
	if (!cashiersStore.cashiers.length) return;
	const currentIndex = cashiersStore.cashiers.findIndex((c) => c.title === selectedTitle.value);
	let newIndex = currentIndex + direction;
	if (newIndex < 0) newIndex = cashiersStore.cashiers.length - 1;
	if (newIndex >= cashiersStore.cashiers.length) newIndex = 0;
	selectedTitle.value = cashiersStore.cashiers[newIndex].title;
}
async function login() {
	if (!pin.value) {
		error.value = "Please enter your PIN";
		return;
	}
	isLoading.value = true;
	error.value = "";
	try {
		const success = cashiersStore.login(selectedTitle.value, pin.value);
		if (success) {
			router.push("/");
		} else {
			error.value = "Invalid PIN";
			pin.value = "";
			focusPinInput();
		}
	} catch (err: any) {
		error.value = err.message || "Login failed";
		pin.value = "";
		focusPinInput();
	} finally {
		isLoading.value = false;
	}
}
async function syncCashiers() {
	isLoading.value = true;
	error.value = "";
	try {
		await cashiersStore.fetchCashiers();
	} catch (err: any) {
		error.value = "Failed to sync cashiers.";
	} finally {
		isLoading.value = false;
	}
}
</script>
<template>
	<div class="flex h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
		<div
			class="w-full max-w-sm rounded-xl bg-white p-8 shadow-xl dark:bg-gray-800 text-center"
		>
			<div class="mb-8">
				<h1 class="text-2xl font-bold text-gray-900 dark:text-white">Cashier Login</h1>
				<p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
					Select user and enter 4-digit PIN
				</p>
			</div>
			<div class="space-y-6 text-left">
				<div class="relative">
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
						>User</label
					>
					<div
						class="w-full !h-12 px-3 rounded-xl border border-gray-300 shadow-sm hover:border-gray-400 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 cursor-pointer bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm flex justify-between items-center transition-colors"
					>
						<div
							tabindex="0"
							class="flex-1 outline-none"
							@click="showDropdown = !showDropdown"
							@keydown.down.prevent="navigateDropdown(1)"
							@keydown.up.prevent="navigateDropdown(-1)"
							@keydown.enter.prevent="showDropdown = !showDropdown"
							@keydown.escape.prevent="showDropdown = false"
						>
							<span>{{
								selectedCashier
									? `${selectedCashier.title} (${selectedCashier.cashier_name})`
									: "Select User"
							}}</span>
						</div>
						<button
							@click.stop="syncCashiers"
							:disabled="isSyncing"
							class="p-1 text-gray-400 hover:text-gray-600 focus:outline-none rounded transition-colors"
						>
							<RefreshCcw
								class="w-4 h-4"
								:class="{ 'animate-spin text-blue-500': isSyncing }"
							/>
						</button>
					</div>
					<div
						v-if="showDropdown"
						@click="showDropdown = false"
						class="fixed inset-0 z-0"
					></div>
					<div
						v-if="showDropdown"
						class="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg max-h-60 overflow-auto"
					>
						<div
							v-for="c in cashiersStore.cashiers"
							:key="c.title"
							@click="selectCashier(c)"
							class="px-3 py-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 text-sm transition-colors"
							:class="{
								'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium':
									selectedTitle === c.title,
								'text-gray-900 dark:text-gray-100': selectedTitle !== c.title,
							}"
						>
							{{ c.title }} ({{ c.cashier_name }})
						</div>
					</div>
				</div>
				<div>
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
						>PIN</label
					>
					<input
						ref="pinInput"
						v-model="pin"
						type="password"
						placeholder="****"
						class="w-full !h-12 px-3 rounded-xl border border-gray-300 shadow-sm hover:border-gray-400 focus:border-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white text-center text-2xl tracking-[0.5em] transition-colors outline-none"
						maxlength="4"
						autofocus
						@keyup.enter="login"
					/>
				</div>
				<ErrorMessage v-if="error" :message="error" />
				<Button
					class="!w-full !h-12 !rounded-xl text-base"
					variant="solid"
					:loading="isLoading"
					:disabled="isLoading"
					@click="login"
				>
					{{ isLoading ? "Please wait..." : "Login" }}
				</Button>
			</div>
		</div>
	</div>
</template>
