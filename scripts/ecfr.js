// Prints the raw current eCFR text of a section. Usage: node scripts/ecfr.js <title> <part> <section> [grepRegex]
const [title, part, section, re] = process.argv.slice(2);
const { execFileSync } = require('child_process');
const url = `https://www.ecfr.gov/api/versioner/v1/full/${process.env.ECFR_DATE || '2026-10-07'}/title-${title}.xml?part=${part}&section=${section}`;
const xml = execFileSync('curl', ['-s', '--compressed', url], { maxBuffer: 20 * 1024 * 1024 }).toString('utf8');
const text = xml.replace(/<[^>]+>/g, ' ').replace(/&#x2019;|&#8217;/g, "'").replace(/\s+/g, ' ').trim();
if (re) { const r = new RegExp(re, 'gi'); let m; while ((m = r.exec(text))) console.log('...' + text.slice(Math.max(0, m.index - 150), m.index + 450) + '...\n'); }
else console.log(text);
