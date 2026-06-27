const fs = require('fs');
const content = fs.readFileSync('d:/android-projeler/yukle-next/src/utils/translations.ts', 'utf8');
const lines = content.split('\n');
const missingOrEng = {};
let currentLang = '';
lines.forEach(line => {
  const langMatch = line.match(/^  ([a-z]{2}): {/);
  if(langMatch) {
    currentLang = langMatch[1];
    missingOrEng[currentLang] = {};
  } else if (currentLang && line.match(/\b(kvkk|privacy|terms|reklam|about|contact):\s*['"]/)) {
    const keyMatch = line.match(/\b(kvkk|privacy|terms|reklam|about|contact):/);
    if(keyMatch) {
      const key = keyMatch[1];
      const valMatch = line.match(/:\s*['"](.*?)['"]/);
      if(valMatch) {
        missingOrEng[currentLang][key] = valMatch[1];
      }
    }
  }
});
console.log(JSON.stringify(missingOrEng, null, 2));
