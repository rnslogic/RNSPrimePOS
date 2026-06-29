<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { SyncManager } from "@/sync/SyncManager";
import { Button } from "frappe-ui";

const router = useRouter();
const status = ref("Initializing...");
const progress = ref(0);
const error = ref("");

onMounted(async () => {
	try {
		await SyncManager.fullInitialSync((newStatus, percent) => {
			status.value = newStatus;
			progress.value = percent;
		});
		setTimeout(() => {
			router.push("/login-pin");
		}, 1000);
	} catch (err: any) {
		error.value = err.message || "Sync failed.";
	}
});
</script>

<template>
	<div class="h-screen w-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
		<div class="max-w-md w-full p-8 text-center flex flex-col items-center">
			<!-- Icon/Logo -->
			<div
				class="w-24 h-24 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-center mb-6"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="w-12 h-12 text-blue-600 dark:text-blue-500"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path
						d="m2 7 4.41-2.21a2 2 0 0 1 1.79 0L12 7l3.8-1.9a2 2 0 0 1 1.79 0L22 7v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7Z"
					/>
					<path d="M12 22V7" />
					<path d="M22 7 12 12 2 7" />
					<path d="M16 12v6" />
					<path d="M8 12v6" />
				</svg>
			</div>

			<h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
				{{ __("RNS Prime") }}
			</h1>
			<p class="text-gray-500 dark:text-gray-400 mb-8">
				{{ __("that empowers businesses.") }}
			</p>

			<div v-if="!error" class="w-full max-w-[240px] mb-4 relative">
				<div
					class="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden"
				>
					<div
						class="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-300 ease-out"
						:style="{ width: `${progress}%` }"
					></div>
				</div>
			</div>

			<p v-if="!error" class="text-sm font-medium text-gray-400 dark:text-gray-500">
				{{ status }}
			</p>

			<div v-else class="w-full">
				<div
					class="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm mb-4"
				>
					{{ error }}
				</div>
				<Button variant="solid" class="w-full" @click="() => window.location.reload()">
					{{ __("Retry") }}
				</Button>
			</div>
		</div>
	</div>
</template>
