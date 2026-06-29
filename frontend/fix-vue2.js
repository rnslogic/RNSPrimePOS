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
    
    // Very simple regex for the import issue:
    content = content.replace(/' const /g, "'\nconst ");
    content = content.replace(/" const /g, "\"\nconst ");
    content = content.replace(/' let /g, "'\nlet ");
    content = content.replace(/" let /g, "\"\nlet ");
    content = content.replace(/} const /g, "}\nconst ");
    content = content.replace(/} let /g, "}\nlet ");
    content = content.replace(/\) const /g, ")\nconst ");
    content = content.replace(/\) let /g, ")\nlet ");
    content = content.replace(/} function /g, "}\nfunction ");
    content = content.replace(/} interface /g, "}\ninterface ");
    content = content.replace(/} type /g, "}\ntype ");
    content = content.replace(/' type /g, "'\ntype ");
    
    // Any remaining `} something`
    content = content.replace(/} onMounted/g, "}\nonMounted");
    content = content.replace(/} watch/g, "}\nwatch");
    
    // Check specific strings we found:
    content = content.replace(/const router = useRouter\(\)/g, "\nconst router = useRouter()\n");
    content = content.replace(/const route = useRoute\(\)/g, "\nconst route = useRoute()\n");
    
    if (content !== original) {
      fs.writeFileSync(filePath, content);
      console.log('Fixed:', filePath);
    }
  }
});
