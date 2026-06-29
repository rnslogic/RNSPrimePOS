<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from "vue";
import { useAuthStore } from "@/stores/auth";
const props = defineProps<{
	src?: string | null;
	alt?: string;
}>();

const authStore = useAuthStore();
const imageUrl = ref<string>("");
let objectUrl: string | null = null;
let hasTriedPrivate = false;

async function fetchPrivateImage(url: string) {
	try {
		// Extract relative path to use with file_url param
		let fileUrl = url;
		if (url.startsWith(authStore.serverUrl)) {
			fileUrl = url.substring(authStore.serverUrl.length);
			if (!fileUrl.startsWith("/")) fileUrl = "/" + fileUrl;
		} else if (!url.startsWith("http") && !url.startsWith("/")) {
			fileUrl = "/" + url;
		}
		// Frappe's static file handler doesn't send CORS preflight headers for /private/files/.
		// The download_file API endpoint is under /api/ so it correctly handles CORS.
		const apiUrl = `/api/method/frappe.core.doctype.file.file.download_file?file_url=${encodeURIComponent(fileUrl)}`;
		// window.fetch is monkey-patched by authStore to add serverUrl and Authorization header for /api/ routes
		const response = await fetch(apiUrl);
		if (response.ok) {
			const blob = await response.blob();
			if (objectUrl) URL.revokeObjectURL(objectUrl);
			objectUrl = URL.createObjectURL(blob);
			imageUrl.value = objectUrl;
			return true;
		}
	} catch (e) {
		// Ignore
	}
	return false;
}

async function loadImage() {
	hasTriedPrivate = false;
	if (objectUrl) {
		URL.revokeObjectURL(objectUrl);
		objectUrl = null;
	}
	if (!props.src) {
		imageUrl.value = "";
		return;
	}
	const resolved = authStore.resolveUrl(props.src);
	if (!resolved) {
		imageUrl.value = "";
		return;
	}
	// If it's explicitly a private file, fetch it with auth headers
	if (resolved.includes("/private/files/")) {
		hasTriedPrivate = true;
		const success = await fetchPrivateImage(resolved);
		if (!success) {
			imageUrl.value = resolved; // fallback to normal img tag handling if error
		}
	} else {
		// Public file or external URL
		imageUrl.value = resolved;
	}
}

async function handleImageError(e: Event) {
	if (!props.src || hasTriedPrivate) return;
	const resolved = authStore.resolveUrl(props.src);
	if (resolved && resolved.includes("/files/") && !resolved.includes("/private/files/")) {
		hasTriedPrivate = true;
		const privateUrl = resolved.replace("/files/", "/private/files/");
		await fetchPrivateImage(privateUrl);
	}
}

watch(() => props.src, loadImage);
onMounted(loadImage);
onUnmounted(() => {
	if (objectUrl) URL.revokeObjectURL(objectUrl);
});
</script>
<template>
	<img
		v-if="imageUrl"
		:src="imageUrl"
		:alt="alt || ''"
		@error="handleImageError"
		v-bind="$attrs"
	/>
</template>
