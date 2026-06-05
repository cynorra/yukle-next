const fs = require('fs');
const path = require('path');

const companiesHtmlPath = 'C:\\Users\\erens\\.gemini\\antigravity-ide\\brain\\027cf3d8-a937-4c09-8bcb-75b42460806a\\scratch\\companies.html';

if (!fs.existsSync(companiesHtmlPath)) {
  console.error('companies.html not found at path:', companiesHtmlPath);
  process.exit(1);
}

const html = fs.readFileSync(companiesHtmlPath, 'utf8');
const regex = /<option value="\?ulke=([^"]+)">([^<]+)<\/option>/gi;

let match;
const countries = [];

while ((match = regex.exec(html)) !== null) {
  const value = match[1].trim();
  const label = match[2].trim();
  countries.push({ value, label });
}

console.log(JSON.stringify(countries, null, 2));
console.log('Total countries found:', countries.length);
