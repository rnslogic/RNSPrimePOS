const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

walk('./src', function(filePath) {
  if (filePath.endsWith('.vue')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Fix imports
    content = content.replace(/(from\s+['"][^'"]+['"])\s+(const|let|function|import)/g, "$1\n$2");
    
    // Fix ) const
    content = content.replace(/\)\s+(const|let|function)/g, ")\n$1");
    // Fix } const
    content = content.replace(/\}\s+(const|let|function|interface|type)/g, "}\n$1");
    // Fix ] const
    content = content.replace(/\]\s+(const|let|function)/g, "]\n$1");
    
    // Fix specific literals
    content = content.replace(/(['"])\s+(const|let|function)/g, "$1\n$2");
    content = content.replace(/(>)\s+(const|let|function|interface|type)/g, "$1\n$2");

    // Any missing `const route = ...`
    content = content.replace(/useRoute\(\)\s+const/g, "useRoute()\nconst");
    content = content.replace(/useRouter\(\)\s+const/g, "useRouter()\nconst");
    
    // Other known missing ones
    content = content.replace(/(\w+)\s+(const\s+router\s*=)/g, "$1\n$2");
    content = content.replace(/(\w+)\s+(const\s+route\s*=)/g, "$1\n$2");
    
    if (content !== original) {
      fs.writeFileSync(filePath, content);
      console.log('Fixed:', filePath);
    }
  }
});
