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
    
    // Add a semicolon and newline before these keywords if they follow something else on the same line
    content = content.replace(/(?<!\n)(?<!^)(?<!\{)(?<!\()(export\s+)?(const|let|function|interface|type|import)\s/g, (match) => {
        // Exclude `export const` by checking if it already has a newline before export.
        return '\n' + match.trimStart();
    });
    // The above regex might be too aggressive.
    // Let's specifically target the exact broken syntax we've seen:
    
    content = content.replace(/([\'\"\]\)\}\w])\s+(const\s|let\s|function\s|interface\s|type\s|import\s)/g, '$1\n$2');
    
    // Fix specific case of `export const` if it got caught
    content = content.replace(/\nexport\s+\nconst/g, '\nexport const');
    
    // Specifically handle `... const router = useRouter()` etc
    content = content.replace(/(\w|\)|\]|\})\s+const /g, '$1\nconst ');
    content = content.replace(/(\w|\)|\]|\})\s+let /g, '$1\nlet ');
    content = content.replace(/(\w|\)|\]|\})\s+function /g, '$1\nfunction ');
    
    if (content !== original) {
      fs.writeFileSync(filePath, content);
      console.log('Fixed:', filePath);
    }
  }
});
