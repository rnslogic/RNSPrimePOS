<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { Input, Button, ErrorMessage } from "frappe-ui";
import { useAuthStore } from "@/stores/auth";
const router = useRouter();
const authStore = useAuthStore();
const serverUrl = ref("");
const apiKey = ref("");
const apiSecret = ref("");
const error = ref("");
const loading = ref(false);
async function connect() {
	if (!serverUrl.value || !apiKey.value || !apiSecret.value) {
		error.value = "All fields are required.";
		return;
	}
	error.value = "";
	loading.value = true;
	try {
		let url = serverUrl.value;
		if (!url.startsWith("http://") && !url.startsWith("https://")) {
			url = `https://${url}`;
		}
		await authStore.saveSettings(url, apiKey.value, apiSecret.value);
		const response = await fetch(`${url}/api/method/frappe.auth.get_logged_user`, {
			method: "GET",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: `token ${apiKey.value}:${apiSecret.value}`,
			},
		});
		if (!response.ok) {
			throw new Error("Connection failed. Please check your credentials and server URL.");
		}
		const data = await response.json();
		if (data.message) {
			router.push("/sync");
		} else {
			throw new Error("Invalid response from server.");
		}
	} catch (err: any) {
		console.error("Connection error:", err);
		let msg = err.message || "An error occurred while connecting.";
		if (msg.includes("Failed to fetch")) {
			msg =
				"CORS Error or Network Failure. Please ensure the server allows CORS for this domain, or check your internet connection.";
		}
		error.value = msg;
		alert(msg);
		authStore.isConfigured = false;
	} finally {
		loading.value = false;
	}
}
</script>
<template>
	<div class="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
		<div class="w-full max-w-md rounded-xl bg-white p-8 shadow-xl dark:bg-gray-800">
			<div class="mb-8 text-center">
				<h1 class="text-2xl font-bold text-gray-900 dark:text-white">POS Prime Setup</h1>
				<p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
					Connect your offline POS terminal to your ERPNext server.
				</p>
			</div>
			<div class="space-y-6">
				<div>
					<Input
						v-model="serverUrl"
						type="text"
						label="Server URL"
						placeholder="http://erp_pos.local"
						:disabled="loading"
					/>
				</div>
				<div>
					<Input
						v-model="apiKey"
						type="text"
						label="API Key"
						placeholder="Enter User API Key"
						:disabled="loading"
					/>
				</div>
				<div>
					<Input
						v-model="apiSecret"
						type="password"
						label="API Secret"
						placeholder="Enter User API Secret"
						:disabled="loading"
					/>
				</div>
				<div
					v-if="error"
					class="text-sm font-medium text-red-500 bg-red-50 dark:bg-red-900/30 p-3 rounded-lg border border-red-200 dark:border-red-800"
				>
					{{ error }}
				</div>
				<Button :loading="loading" class="w-full" variant="solid" @click="connect">
					Connect & Sync Data
				</Button>
			</div>
		</div>
	</div>
</template>
