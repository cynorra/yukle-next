/**
 * inspect-freightfinder.js
 * Opens FreightFinder search and dumps full table HTML to understand structure
 */
const puppeteer = require('puppeteer');
const fs = require('fs');

async function main() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    defaultViewport: { width: 1366, height: 768 }
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36');

  // Go directly to results URL (form already submitted via GET)
  const url = 'https://www.freightfinder.com/database/search/city-radius?perPage=25&AvailDate=&vchOrigin=Los+Angeles%2C+CA&geoOrigin=&intOriginRadius=500&vchDestination=&geoDestination=&intDestinationRadius=500&vchUserAction=Search';
  console.log('Fetching:', url);
  
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  // Dump full table HTML
  const tableHTML = await page.evaluate(() => {
    const tables = document.querySelectorAll('table');
    let result = '';
    tables.forEach((t, i) => {
      result += `\n\n=== TABLE ${i} ===\n`;
      result += t.outerHTML.slice(0, 3000);
    });
    return result;
  });

  fs.writeFileSync('scripts/ff-table-dump.html', tableHTML);
  console.log('Table HTML saved to scripts/ff-table-dump.html');

  // Also dump all row data
  const rowData = await page.evaluate(() => {
    const rows = document.querySelectorAll('table tr');
    return Array.from(rows).map((row, i) => {
      const cells = Array.from(row.querySelectorAll('td, th')).map(c => c.innerText.trim());
      return { rowIndex: i, cellCount: cells.length, cells };
    }).slice(0, 30);
  });

  console.log('\n=== ROW DATA (first 30 rows) ===');
  rowData.forEach(r => {
    console.log(`Row ${r.rowIndex} [${r.cellCount} cells]:`, JSON.stringify(r.cells));
  });

  // Also check if there's structured data (JSON-LD or data attributes)
  const structured = await page.evaluate(() => {
    const scripts = Array.from(document.querySelectorAll('script[type="application/json"], script[type="application/ld+json"]'));
    return scripts.map(s => s.textContent.slice(0, 500));
  });
  if (structured.length > 0) {
    console.log('\n=== STRUCTURED DATA ===');
    structured.forEach(s => console.log(s));
  }

  await browser.close();
}

main().catch(e => { console.error(e); process.exit(1); });
