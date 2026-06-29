const fs = require('fs');
const files = [
  'src/components/cart/CartItem.vue',
  'src/components/cart/NumPad.vue',
  'src/components/FrappeImage.vue',
  'src/components/items/BatchSerialSelector.vue',
  'src/components/items/ItemGroupFilter.vue',
  'src/components/items/ItemSearch.vue',
  'src/components/items/UOMSelector.vue',
  'src/components/kiosk/KioskWelcome.vue',
  'src/components/orders/OrderDetail.vue',
  'src/components/orders/OrderList.vue',
  'src/components/receipt/EmailReceiptDialog.vue',
  'src/components/shift/DenominationCalculator.vue',
  'src/components/stock/SupplierSelector.vue'
];
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/defineProps<\{([^\}]*)\}\>\(\)/g, (match, inner) => {
    if (inner.trim() === '') return match;
    const props = inner.trim().split(/\s+(?=[a-zA-Z0-9_'"-]+:)/).join('\n  ');
    return `defineProps<{\n  ${props}\n}>()`;
  });
  content = content.replace(/defineEmits<\{([^\}]*)\}\>\(\)/g, (match, inner) => {
    if (inner.trim() === '') return match;
    const emits = inner.trim().split(/\s+(?=[a-zA-Z0-9_'"-]+:)/).join('\n  ');
    return `defineEmits<{\n  ${emits}\n}>()`;
  });
  fs.writeFileSync(file, content);
});
