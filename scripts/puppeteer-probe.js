/**
 * puppeteer-probe.js
 * Tests multiple global freight sites with headless browser to find real scrapable sources.
 */
const puppeteer = require('puppeteer');

async function testSite(browser, name, url, waitSelector, extractFn) {
  console.log('\n=== Testing:', name, '===');
  console.log('URL:', url);
  const page = await browser.newPage();
  try {
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.setExtraHTTPHeaders({ 'Accept-Language': 'en-US,en;q=0.9' });
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 20000 });
    
    // Try to wait for the expected selector
    if (waitSelector) {
      try {
        await page.waitForSelector(waitSelector, { timeout: 8000 });
        console.log('Selector found:', waitSelector);
      } catch(e) {
        console.log('Selector NOT found:', waitSelector);
      }
    }

    const title = await page.title();
    const url2 = page.url();
    console.log('Title:', title);
    console.log('Final URL:', url2);
    
    // Extract some text
    const text = await page.evaluate(() => document.body.innerText.slice(0, 800));
    console.log('Content preview:', text.replace(/\n+/g, ' ').slice(0, 400));

    if (extractFn) {
      const data = await page.evaluate(extractFn);
      console.log('Extracted data:', JSON.stringify(data, null, 2).slice(0, 1000));
    }

    // Check for login walls
    const hasLoginWall = await page.evaluate(() => {
      const t = document.body.innerText.toLowerCase();
      return t.includes('sign in') || t.includes('log in') || t.includes('create account') || t.includes('register to view');
    });
    console.log('Login wall detected:', hasLoginWall);

    return { name, url: url2, title, hasLoginWall, success: true };
  } catch(e) {
    console.log('ERROR:', e.message.slice(0, 200));
    return { name, success: false, error: e.message };
  } finally {
    await page.close();
  }
}

async function main() {
  console.log('Launching Puppeteer...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const sites = [
    {
      name: 'Shiply Load Board',
      url: 'https://www.shiply.com/us/load-board',
      waitSelector: null,
      extract: () => {
        const items = document.querySelectorAll('[data-testid], .job-item, .load-item, article, .listing');
        return { itemCount: items.length, firstItem: items[0] ? items[0].innerText.slice(0, 200) : null };
      }
    },
    {
      name: 'FreightFinder Search',
      url: 'https://www.freightfinder.com/database/search/city-radius',
      waitSelector: null,
      extract: () => {
        const forms = document.querySelectorAll('form');
        const inputs = document.querySelectorAll('input[name]');
        return {
          forms: forms.length,
          inputs: Array.from(inputs).map(i => i.name).slice(0, 10)
        };
      }
    },
    {
      name: 'uShip Freight',
      url: 'https://www.uship.com/freight/',
      waitSelector: null,
      extract: () => {
        const items = document.querySelectorAll('.shipment, .listing, [class*="load"], [class*="ship"]');
        return { itemCount: items.length, bodyText: document.body.innerText.slice(0, 300) };
      }
    },
    {
      name: 'Convoy Loads',
      url: 'https://www.convoy.com/loads',
      waitSelector: null,
      extract: () => {
        return { bodyText: document.body.innerText.slice(0, 300), hasLoginWall: document.body.innerText.toLowerCase().includes('sign in') };
      }
    },
    {
      name: 'Loadsmart',
      url: 'https://loadsmart.com',
      waitSelector: null,
      extract: () => ({ bodyText: document.body.innerText.slice(0, 300) })
    },
    {
      name: 'Coyote Logistics',
      url: 'https://www.coyote.com/carrier/find-loads/',
      waitSelector: null,
      extract: () => ({ bodyText: document.body.innerText.slice(0, 300) })
    },
    {
      name: 'Uber Freight',
      url: 'https://www.uberfreight.com/carrier',
      waitSelector: null,
      extract: () => ({ bodyText: document.body.innerText.slice(0, 300) })
    }
  ];

  const results = [];
  for (const site of sites) {
    const result = await testSite(browser, site.name, site.url, site.waitSelector, site.extract);
    results.push(result);
    await new Promise(r => setTimeout(r, 1500));
  }

  await browser.close();

  console.log('\n\n=== SUMMARY ===');
  results.forEach(r => {
    const status = r.success ? (r.hasLoginWall ? '🔒 LOGIN' : '✅ OK') : '❌ ERR';
    console.log(status, r.name, '-', r.url ? r.url.slice(0, 60) : r.error?.slice(0, 60));
  });
}

main().catch(e => { console.error(e); process.exit(1); });
