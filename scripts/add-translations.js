const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/utils/translations.ts');
let content = fs.readFileSync(filePath, 'utf8');

// 2. Update all dictionary entries
content = content.replace(/reklam:\s*['"](.*?)['"]/g, (match, p1) => {
  let aboutText = "About Us";
  let contactText = "Contact Us";
  
  if (p1 === "Reklam") {
    aboutText = "Hakkımızda";
    contactText = "İletişim";
  } else if (p1 === "Anzeigen") {
    aboutText = "Über uns";
    contactText = "Kontakt";
  } else if (p1 === "Anunciar") {
    aboutText = "Sobre Nosotros";
    contactText = "Contacto";
  }
  
  return `${match},\n      about: '${aboutText}',\n      contact: '${contactText}'`;
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('Translations updated successfully.');
