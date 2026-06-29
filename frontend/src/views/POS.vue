<!-- Copyright (c) 2026, Ravindu Gajanayaka -->
<!-- Licensed under GPLv3. See license.txt -->
<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { usePosSessionStore } from "@/stores/posSession";
import { useSettingsStore } from "@/stores/settings";
import { useCartStore } from "@/stores/cart";
import { useCustomerStore } from "@/stores/customer";
import { usePaymentStore } from "@/stores/payment";
import { useDraftsStore } from "@/stores/drafts";
import { useItemsStore } from "@/stores/items";
import { useKeyboardShortcuts } from "@/composables/useKeyboardShortcuts";
import { useBroadcastDisplay, type DisplayMessage } from "@/composables/useBroadcastDisplay";
import { call, Dialog, Button } from "frappe-ui";
import { useSerialDisplay } from "@/composables/useSerialDisplay";
import { useDeskMode } from "@/composables/useDeskMode";
import AppShell from "@/components/layout/AppShell.vue";
import ItemGrid from "@/components/items/ItemGrid.vue";
import Cart from "@/components/cart/Cart.vue";
import PaymentDialog from "@/components/payment/PaymentDialog.vue";
import ReceiptPreview from "@/components/receipt/ReceiptPreview.vue";
import HeldOrdersDrawer from "@/components/orders/HeldOrdersDrawer.vue";
import ReturnSearchDialog from "@/components/orders/ReturnSearchDialog.vue";
import ReturnDialog from "@/components/orders/ReturnDialog.vue";
import { LayoutGrid, ShoppingCart, ClipboardList } from "lucide-vue-next";
const router = useRouter();
const route = useRoute();
const sessionStore = usePosSessionStore();
const settingsStore = useSettingsStore();
const cartStore = useCartStore();
const customerStore = useCustomerStore();
const paymentStore = usePaymentStore();
const draftsStore = useDraftsStore();
const itemsStore = useItemsStore(); // Customer display — scoped by POS Opening Entry so multiple sessions don't conflict
const {
	sendUpdate: sendDisplayUpdate,
	onUpdate: onDisplayMessage,
	close: closeDisplay,
} = useBroadcastDisplay(sessionStore.openingEntry || undefined);
const serialDisplay = useSerialDisplay();
const { isDeskMode } = useDeskMode();
const mobileTab = ref<"items" | "cart">("items");
watch(
	() => route.query.tab,
	(tab) => {
		if (tab === "items" || tab === "cart") {
			mobileTab.value = tab as "items" | "cart";
			router.replace({ query: { ...route.query, tab: undefined } });
		}
	},
	{ immediate: true },
);
const showReceipt = ref(false);
const showHeldOrders = ref(false);
const showReturnDialog = ref(false);
const showReturnSearchDialog = ref(false);
const returnOrder = ref<Record<string, any> | null>(null);
const showNotice = ref(false); // Resizable cart panel (percentage-based, persisted)
const CART_MIN_PCT = 25;
const CART_MAX_PCT = 50;
const CART_DEFAULT_PCT = 40; // ERPNext default: 4/10 = 40%
const cartPct = ref(parseInt(localStorage.getItem("pos_cart_pct") || "") || CART_DEFAULT_PCT);
function onResizeStart(e: PointerEvent) {
	const target = e.currentTarget as HTMLElement;
	target.setPointerCapture(e.pointerId);
	const container = target.closest(".pos-layout") as HTMLElement;
	if (!container) return;
	const containerWidth = container.clientWidth;
	const startX = e.clientX;
	const startPct = cartPct.value;
	function onMove(ev: PointerEvent) {
		const deltaPx = startX - ev.clientX;
		const deltaPct = (deltaPx / containerWidth) * 100;
		cartPct.value = Math.min(
			CART_MAX_PCT,
			Math.max(CART_MIN_PCT, Math.round(startPct + deltaPct)),
		);
	}
	function onUp() {
		localStorage.setItem("pos_cart_pct", String(cartPct.value));
		target.removeEventListener("pointermove", onMove);
		target.removeEventListener("pointerup", onUp);
	}
	target.addEventListener("pointermove", onMove);
	target.addEventListener("pointerup", onUp);
}
const loading = ref(true); // Keyboard shortcuts
useKeyboardShortcuts({
	onHoldOrder: () => holdOrder(),
	onPay: () => {
		if (cartStore.items.length > 0 && customerStore.customer) {
			paymentStore.openPaymentDialog();
		}
	},
	onCloseDialog: () => {
		if (showReceipt.value) showReceipt.value = false;
		else if (paymentStore.showPaymentDialog) paymentStore.closePaymentDialog();
		else if (showHeldOrders.value) showHeldOrders.value = false;
		else if (showReturnSearchDialog.value) showReturnSearchDialog.value = false;
		else if (showReturnDialog.value) showReturnDialog.value = false;
		else if (itemsStore.searchTerm) itemsStore.setSearchTerm("");
		else {
			const active = document.activeElement as HTMLElement;
			if (
				active &&
				(active.tagName === "INPUT" ||
					active.tagName === "TEXTAREA" ||
					active.tagName === "SELECT")
			) {
				active.blur();
			} else if (cartStore.items.length > 0) {
				cartStore.$reset();
			}
		}
	},
	onOpenOrders: () => router.push({ name: "Orders" }),
	onNewOrder: () => startNewOrder(),
	onFocusSearch: () => {
		const searchInput = document.querySelector(
			'[aria-label="Search items"]',
		) as HTMLInputElement;
		searchInput?.focus();
	},
	onToggleHeldOrders: () => {
		showHeldOrders.value = !showHeldOrders.value;
	},
	onToggleReturn: () => {
		showReturnSearchDialog.value = !showReturnSearchDialog.value;
	},
}); // Company info for display
const companyLogo = ref<string | null>(null);
async function sendInitToDisplay() {
	let logo: string | null = null;
	if (sessionStore.company) {
		try {
			const branding = await call("pos_prime.api.pos_session.get_branding", {
				company: sessionStore.company,
			});
			if (branding?.company_logo) logo = branding.company_logo;
		} catch {
			/* ignore */
		}
	}
	companyLogo.value = logo;
	sendDisplayUpdate({
		type: "init",
		payload: {
			companyName: sessionStore.company || "",
			companyLogo: logo,
			currency: settingsStore.currency || "USD",
		},
	});
}
onMounted(async () => {
	onDisplayMessage(async (message: DisplayMessage) => {
		if (message.type === "customer_mobile") {
			const mobile = message.payload.mobile;
			try {
				const results = await customerStore.searchCustomers(
					mobile,
					sessionStore.posProfile,
				);
				if (results && results.length > 0) {
					await customerStore.setCustomer(results[0].name);
					sendDisplayUpdate({
						type: "customer_result",
						payload: {
							found: true,
							customerName: results[0].customer_name || results[0].name,
						},
					});
					const currency = settingsStore.currency || "USD";
					sendDisplayUpdate({
						type: "cart_update",
						payload: {
							items: cartStore.items.map((item) => ({
								item_name: item.item_name,
								qty: item.qty,
								rate: item.rate,
								amount: item.amount,
								is_free_item: item.is_free_item || false,
								pricing_rules: item.pricing_rules || null,
								price_list_rate: item.price_list_rate ?? null,
								discount_percentage: item.discount_percentage || 0,
								discount_amount: item.discount_amount || 0,
							})),
							subtotal: cartStore.subtotal,
							netTotal: cartStore.netTotal,
							taxAmount: cartStore.taxAmount,
							grandTotal: cartStore.grandTotal,
							roundedTotal: cartStore.roundedTotal,
							totalItems: cartStore.totalItems,
							currency,
							customerName: results[0].customer_name || results[0].name,
							companyName: sessionStore.company || null,
							discountValue: cartStore.discountValue,
							discountType: cartStore.discountType,
							pricingRuleDiscount: cartStore.pricingRuleDiscount,
						},
					});
				} else {
					sendDisplayUpdate({
						type: "customer_result",
						payload: { found: false, customerName: null },
					});
				}
			} catch {
				sendDisplayUpdate({
					type: "customer_result",
					payload: { found: false, customerName: null },
				});
			}
		}
	});
	try {
		if (settingsStore.posProfile?.customer && !customerStore.customer) {
			await customerStore.setCustomer(settingsStore.posProfile.customer);
		}
		if (settingsStore.posProfile?.custom_pos_notice) {
			showNotice.value = true;
		}
		sendDisplayUpdate({ type: "idle" });
		sendInitToDisplay();
		if (route.query.resumeDraft) {
			await resumeDraft(route.query.resumeDraft as string);
			router.replace({ query: { ...route.query, resumeDraft: undefined } });
		}
	} catch (e) {
		console.error("POS initialization error:", e);
	} finally {
		loading.value = false;
	}
});
onUnmounted(() => {
	closeDisplay();
});
// Watch for invoice completion to show receipt
watch(
	() => paymentStore.lastInvoice,
	(invoice) => {
		if (invoice) {
			showReceipt.value = true;
			const currency = settingsStore.currency || "USD";
			sendDisplayUpdate({
				type: "payment_complete",
				payload: {
					grandTotal: invoice.rounded_total || invoice.grand_total || 0,
					currency,
				},
			});
			if (serialDisplay.isConnected.value) {
				serialDisplay.sendToVFD(
					" Thank You!",
					`Total: ${(invoice.rounded_total || invoice.grand_total || 0).toFixed(2)}`,
				);
			}
			setTimeout(() => {
				sendDisplayUpdate({ type: "idle" });
				serialDisplay.clearDisplay();
			}, 5000);
		}
	},
);
// Broadcast cart updates to customer display
watch(
	[
		() => cartStore.items,
		() => cartStore.grandTotal,
		() => cartStore.roundedTotal,
		() => cartStore.taxAmount,
		() => cartStore.discountValue,
		() => customerStore.customer?.customer_name,
	],
	() => {
		if (cartStore.items.length === 0) {
			sendDisplayUpdate({ type: "idle" });
			serialDisplay.clearDisplay();
			return;
		}
		const currency = settingsStore.currency || "USD";
		sendDisplayUpdate({
			type: "cart_update",
			payload: {
				items: cartStore.items.map((item) => ({
					item_name: item.item_name,
					qty: item.qty,
					rate: item.rate,
					amount: item.amount,
					is_free_item: item.is_free_item || false,
					pricing_rules: item.pricing_rules || null,
					price_list_rate: item.price_list_rate ?? null,
					discount_percentage: item.discount_percentage || 0,
					discount_amount: item.discount_amount || 0,
				})),
				subtotal: cartStore.subtotal,
				netTotal: cartStore.netTotal,
				taxAmount: cartStore.taxAmount,
				grandTotal: cartStore.grandTotal,
				roundedTotal: cartStore.roundedTotal,
				totalItems: cartStore.totalItems,
				currency,
				customerName: customerStore.customer?.customer_name || null,
				companyName: sessionStore.company || null,
				discountValue: cartStore.discountValue,
				discountType: cartStore.discountType,
				pricingRuleDiscount: cartStore.pricingRuleDiscount,
			},
		});
		if (serialDisplay.isConnected.value) {
			const lastItem = cartStore.items[cartStore.items.length - 1];
			const total = (cartStore.roundedTotal || cartStore.grandTotal).toFixed(2);
			serialDisplay.sendToVFD(
				`${lastItem.item_name.substring(0, 14)} x${lastItem.qty}`,
				`TOTAL: ${total.padStart(13)}`,
			);
		}
	},
	{ deep: true },
);
// Helper to build payment display payload
function buildPaymentPayload() {
	const grandTotal = cartStore.roundedTotal || cartStore.grandTotal;
	return {
		grandTotal,
		currency: settingsStore.currency || "USD",
		payments: paymentStore.payments.filter((p) => p.amount > 0),
		customerName: customerStore.customer?.customer_name || null,
		totalPaid: paymentStore.totalPaid,
		changeDue: paymentStore.changeAmount(grandTotal),
	};
}
// Broadcast payment start
watch(
	() => paymentStore.showPaymentDialog,
	(show) => {
		if (show) {
			sendDisplayUpdate({ type: "payment_start", payload: buildPaymentPayload() });
			if (serialDisplay.isConnected.value) {
				serialDisplay.sendToVFD(
					"Processing...",
					`Total: ${(cartStore.roundedTotal || cartStore.grandTotal).toFixed(2).padStart(13)}`,
				);
			}
		}
	},
);
// Live-update pole display as cashier changes payment amounts
watch(
	() => paymentStore.payments.map((p) => p.amount),
	() => {
		if (paymentStore.showPaymentDialog) {
			sendDisplayUpdate({ type: "payment_start", payload: buildPaymentPayload() });
		}
	},
	{ deep: true },
);

async function startNewOrder() {
	cartStore.$reset();
	paymentStore.$reset();
	draftsStore.clearActiveDraft();
	showReceipt.value = false;
	sendDisplayUpdate({ type: "idle" });
	serialDisplay.clearDisplay();
	customerStore.$reset();
	if (settingsStore.posProfile?.customer) {
		await customerStore.setCustomer(settingsStore.posProfile.customer);
	}
	itemsStore.fetchAllItems();
}
async function holdOrder() {
	if (cartStore.items.length === 0) return;
	if (!customerStore.customer) return;
	try {
		await draftsStore.saveDraft({
			customer: customerStore.customer.name,
			pos_profile: sessionStore.posProfile,
			items: cartStore.items
				.filter((i) => !i.is_free_item)
				.map((item) => ({
					item_code: item.item_code,
					qty: item.qty,
					rate: item.rate,
					discount_percentage: item.discount_percentage,
					serial_no: item.serial_no || undefined,
					batch_no: item.batch_no || undefined,
					uom: item.uom || undefined,
					conversion_factor: item.conversion_factor || 1,
				})),
		});
		startNewOrder();
	} catch {}
}
async function resumeDraft(name: string) {
	try {
		const draft = await call("pos_prime.api.pos_invoice.get_draft_invoice", { name });
		if (draft.customer) {
			await customerStore.setCustomer(draft.customer);
		}
		cartStore.$reset();
		if (draft.items && draft.items.length > 0) {
			for (const item of draft.items) {
				await cartStore.addItem(
					{
						item_code: item.item_code,
						item_name: item.item_name,
						rate: item.rate,
						uom: item.uom,
						is_free_item: item.is_free_item,
						pricing_rules: item.pricing_rules,
						price_list_rate: item.price_list_rate,
						discount_percentage: item.discount_percentage,
						discount_amount: item.discount_amount,
						has_batch_no: item.has_batch_no,
						has_serial_no: item.has_serial_no,
						custom_serial_numbers: item.serial_no || item.custom_serial_numbers,
						custom_batch_number: item.batch_no || item.custom_batch_number,
					},
					item.qty,
				);
			}
		}
		if (draft.additional_discount_percentage) {
			cartStore.discountType = "percentage";
			cartStore.discountValue = draft.additional_discount_percentage;
		} else if (draft.discount_amount) {
			cartStore.discountType = "amount";
			cartStore.discountValue = draft.discount_amount;
		}
		if (draft.coupon_code) {
			cartStore.couponCode = draft.coupon_code;
		}
		showHeldOrders.value = false;
	} catch (e: any) {
		alert(e.messages?.[0] || e.message || "Failed to load draft invoice");
	}
}
function onReturnCompleted() {
	showReturnDialog.value = false;
	startNewOrder();
}
</script>
<template>
	<div
		v-if="loading"
		:class="[
			'flex items-center justify-center bg-gray-50 dark:bg-gray-900',
			isDeskMode ? 'h-full' : 'h-screen',
		]"
	>
		<div class="text-gray-400 dark:text-gray-500 text-sm">{{ __("Loading POS...") }}</div>
	</div>
	<AppShell
		v-else
		@toggle-held-orders="showHeldOrders = !showHeldOrders"
		@toggle-return="showReturnSearchDialog = true"
	>
		<!-- ERPNext-style layout with resizable panels -->
		<div
			class="pos-layout flex h-full overflow-hidden"
			style="gap: var(--margin-md, 8px); padding: 0.5%"
		>
			<!-- Items panel -->
			<div
				class="flex flex-col overflow-hidden pos-card rounded-lg min-w-0"
				:class="{ 'hidden sm:flex': mobileTab === 'cart' }"
				:style="{ flex: `${100 - cartPct} 1 0%` }"
			>
				<ItemGrid />
			</div>
			<!-- Resize handle -->
			<div
				class="hidden sm:flex items-center justify-center cursor-col-resize shrink-0 group select-none"
				style="width: 6px"
				@pointerdown.prevent="onResizeStart"
			>
				<div
					class="w-1 h-8 rounded-full bg-gray-200 dark:bg-gray-700 group-hover:bg-blue-400 group-active:bg-blue-500 transition-colors"
				/>
			</div>
			<!-- Cart panel -->
			<div
				class="flex flex-col overflow-hidden pos-card rounded-lg min-w-0"
				:class="{ 'hidden sm:flex': mobileTab === 'items' }"
				:style="{ flex: `${cartPct} 1 0%` }"
			>
				<Cart @hold-order="holdOrder" />
			</div>
		</div>
		<!-- Mobile tab switcher -->
		<div
			class="sm:hidden fixed bottom-0 left-0 right-0 flex items-center justify-around bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 z-10 h-[calc(3.5rem+env(safe-area-inset-bottom))] pb-[env(safe-area-inset-bottom)]"
		>
			<button
				@click="router.push({ name: 'Orders' })"
				class="flex-1 flex flex-col items-center justify-center h-full transition-colors text-gray-400 dark:text-gray-500 hover:text-blue-600"
			>
				<ClipboardList :size="18" :stroke-width="2" />
				<span class="text-[9px] mt-0.5 font-semibold">{{ __("Orders") }}</span>
			</button>
			<button
				@click="mobileTab = 'items'"
				class="flex-1 flex flex-col items-center justify-center h-full transition-colors"
				:class="
					mobileTab === 'items'
						? 'text-blue-600 dark:text-blue-400'
						: 'text-gray-400 dark:text-gray-500'
				"
			>
				<LayoutGrid :size="18" :stroke-width="mobileTab === 'items' ? 2.5 : 2" />
				<span class="text-[9px] mt-0.5 font-semibold">{{ __("Items") }}</span>
			</button>
			<button
				@click="mobileTab = 'cart'"
				class="flex-1 flex flex-col items-center justify-center h-full transition-colors relative"
				:class="
					mobileTab === 'cart'
						? 'text-blue-600 dark:text-blue-400'
						: 'text-gray-400 dark:text-gray-500'
				"
			>
				<ShoppingCart :size="18" :stroke-width="mobileTab === 'cart' ? 2.5 : 2" />
				<span class="text-[9px] mt-0.5 font-semibold">{{ __("Cart") }}</span>
				<span
					v-if="cartStore.totalItems > 0"
					class="absolute top-1 right-[calc(50%-16px)] bg-blue-600 text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-0.5"
				>
					{{ cartStore.totalItems > 9 ? "9+" : cartStore.totalItems }}
				</span>
			</button>
		</div>
		<!-- Payment dialog -->
		<PaymentDialog v-if="paymentStore.showPaymentDialog" />
		<!-- Receipt preview -->
		<ReceiptPreview v-if="showReceipt" @new-order="startNewOrder" @close="startNewOrder" />
		<!-- Held orders drawer -->
		<HeldOrdersDrawer
			v-if="showHeldOrders"
			@close="showHeldOrders = false"
			@resume="resumeDraft"
		/>
		<!-- Manual return search dialog -->
		<ReturnSearchDialog
			v-if="showReturnSearchDialog"
			@close="showReturnSearchDialog = false"
			@select="
				(order) => {
					showReturnSearchDialog = false;
					returnOrder = order;
					showReturnDialog = true;
				}
			"
		/>
		<!-- Process return dialog -->
		<ReturnDialog
			v-if="showReturnDialog && returnOrder"
			:order="returnOrder"
			@close="showReturnDialog = false"
			@completed="onReturnCompleted"
		/>
		<!-- Notice Dialog -->
		<Dialog v-model="showNotice">
			<template #body-title>
				<h3 class="text-2xl font-semibold leading-6 text-gray-900 dark:text-gray-100">
					{{ __("Notice") }}
				</h3>
			</template>
			<template #body-content>
				<div
					class="prose dark:prose-invert max-w-none p-4"
					v-html="settingsStore.posProfile?.custom_pos_notice"
				></div>
			</template>
			<template #actions>
				<div class="px-4 pb-7 pt-4 sm:px-6">
					<Button class="w-full" variant="solid" @click="showNotice = false">
						{{ __("Close") }}
					</Button>
				</div>
			</template>
		</Dialog>
	</AppShell>
</template>
<style scoped>
/* Mobile: stack panels */
@media screen and (max-width: 640px) {
	.pos-layout {
		flex-direction: column;
		padding: 4px 4px calc(4.5rem + env(safe-area-inset-bottom)) 4px !important;
	}
	.pos-layout > div {
		flex: 1 1 auto !important;
	}
}
</style>
