const fs = require('fs');
let content = fs.readFileSync('src/components/cart/InvoiceOptions.vue', 'utf8');

content = content.replace(
  'const selectClass = "w-full text-xs border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md px-2 py-1.5 focus:outline-none const inputClass = "w-full text-xs border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md px-2 py-1.5 focus:outline-none </script>',
  'const selectClass = "w-full text-xs border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md px-2 py-1.5 focus:outline-none";\nconst inputClass = "w-full text-xs border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md px-2 py-1.5 focus:outline-none";\n</script>'
);

content = content.replace(
  'class="w-3.5 h-3.5 rounded border-gray-300 dark:border-gray-600 text-blue-600 />',
  'class="w-3.5 h-3.5 rounded border-gray-300 dark:border-gray-600 text-blue-600" />'
);

fs.writeFileSync('src/components/cart/InvoiceOptions.vue', content);
