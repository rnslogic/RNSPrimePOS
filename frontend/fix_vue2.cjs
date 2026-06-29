const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.vue')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Fix '}' followed by keyword on same line
      content = content.replace(/\}\s+(function|async|const|let|var|onMounted|onUnmounted|watch|use[A-Z]\w*|if|else|return|try|catch|finally|for|while|switch)/g, '}\n$1');
      
      // Fix ') keyword' etc on same line
      content = content.replace(/\)\s+(function|async|const|let|var|onMounted|onUnmounted|watch|use[A-Z]\w*|if|else|return|try|catch|finally|for|while|switch)/g, ')\n$1');

      // Fix '] keyword' etc on same line
      content = content.replace(/\]\s+(function|async|const|let|var|onMounted|onUnmounted|watch|use[A-Z]\w*|if|else|return|try|catch|finally|for|while|switch)/g, ']\n$1');

      // Fix 'import ... from ... const'
      content = content.replace(/(import.*?(?:'|"))\s+(const|let|var)/g, '$1\n$2');

      // Fix `"..." const`
      content = content.replace(/((?:'|"))\s+(const|let|var|function|async|if|return)/g, '$1\n$2');

      fs.writeFileSync(fullPath, content);
    }
  }
}

processDir('src/views');
processDir('src/components');
console.log('Fixed squished lines in views and components');
