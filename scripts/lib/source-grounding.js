// Source grounding for the blog generator.
//
// Why this exists: the generator used to give the model NO source material and then forbid it from
// stating any figure it could not source, so it produced fluent, generic prose ("rate volatility…",
// "upwards of 40% of a broker's workday"). Here the generator first downloads the real, current text
// of the regulations / official pages that belong to the article's topic cluster and hands it to the
// model as SOURCE MATERIAL. The article must be built on that text and cite it by name; the quality
// gates (editorial-quality.js) reject drafts that do not, and the Sources list at the bottom is built
// by code from the pages that were actually downloaded — never model-invented URLs.
//
// Only clusters that have at least one primary source here are written by the unattended generator.

const https = require('https');
const zlib = require('zlib');

const UA = 'Mozilla/5.0 (compatible; EditorialResearchBot/1.0)';
const MAX_SOURCE_CHARS = 7000;     // per source
const MAX_TOTAL_CHARS = 26000;     // whole SOURCE MATERIAL block
const FETCH_TIMEOUT_MS = 25000;

// eCFR section: { type:'ecfr', title, section, cite }.  Page: { type:'page', url, label, cite }.
const cfr = (title, section, cite) => ({
  type: 'ecfr', title, section, cite: cite || `${title} CFR § ${section}`,
  label: `${title} CFR § ${section} (eCFR)`,
  url: `https://www.ecfr.gov/current/title-${title}/section-${section}`,
});
const page = (url, label, cite) => ({ type: 'page', url, label, cite: cite || label });

const P = {
  hosPage: page('https://www.fmcsa.dot.gov/regulations/hours-of-service', 'FMCSA — Hours of Service', 'FMCSA'),
  eldPage: page('https://www.fmcsa.dot.gov/hours-service/elds/electronic-logging-devices', 'FMCSA — Electronic Logging Devices', 'FMCSA'),
  csaPage: page('https://csa.fmcsa.dot.gov/about/', 'FMCSA — CSA program overview', 'CSA'),
  regPage: page('https://www.fmcsa.dot.gov/registration', 'FMCSA — Registration and operating authority', 'FMCSA'),
  ctpat: page('https://www.cbp.gov/border-security/ports-entry/cargo-security/ctpat', 'CBP — C-TPAT', 'C-TPAT'),
  eiaDiesel: page('https://www.eia.gov/petroleum/gasdiesel/', 'EIA — Gasoline and diesel fuel update', 'EIA'),
  smartway: page('https://www.epa.gov/smartway/learn-about-smartway', 'EPA — About SmartWay', 'SmartWay'),
  btsFreight: page('https://www.bts.gov/topics/freight-transportation', 'BTS — Freight transportation', 'Bureau of Transportation Statistics'),
  sizeWeight: page('https://ops.fhwa.dot.gov/freight/sw/index.htm', 'FHWA — Truck size and weight', 'FHWA'),
  phmsa: page('https://www.phmsa.dot.gov/hazmat/regulations', 'PHMSA — Hazardous materials regulations', 'PHMSA'),
  fsmaTransport: page('https://www.fda.gov/food/food-safety-modernization-act-fsma/fsma-final-rule-sanitary-transportation-human-and-animal-food', 'FDA — FSMA sanitary transportation rule', 'FDA'),
  cbpTrade: page('https://www.cbp.gov/trade', 'CBP — Trade', 'CBP'),
  afdc: page('https://afdc.energy.gov/vehicles/electric', 'DOE — Electric vehicles (AFDC)', 'Alternative Fuels Data Center'),
};

// substring of topic_cluster (lower-case) → primary sources. First match wins.
const SOURCE_MAP = [
  ['hos rules', [cfr(49, '395.3', '49 CFR § 395.3'), cfr(49, '395.1', '49 CFR § 395.1'), cfr(49, '395.8', '49 CFR § 395.8'), P.hosPage]],
  ['telematics', [cfr(49, '395.22', '49 CFR § 395.22'), cfr(49, '395.8', '49 CFR § 395.8'), P.eldPage]],
  ['fmcsa safety', [cfr(49, '385.5', '49 CFR § 385.5'), cfr(49, '385.7', '49 CFR § 385.7'), P.csaPage]],
  ['cdl requirements', [cfr(49, '383.93', '49 CFR § 383.93'), cfr(49, '383.51', '49 CFR § 383.51'), cfr(49, '391.11', '49 CFR § 391.11')]],
  ['driver recruitment', [cfr(49, '391.11', '49 CFR § 391.11'), cfr(49, '391.21', '49 CFR § 391.21'), cfr(49, '391.23', '49 CFR § 391.23')]],
  ['cargo insurance', [cfr(49, '387.9', '49 CFR § 387.9'), cfr(49, '387.7', '49 CFR § 387.7'), cfr(49, '370.3', '49 CFR § 370.3')]],
  ['contract law', [cfr(49, '371.3', '49 CFR § 371.3'), cfr(49, '371.2', '49 CFR § 371.2'), cfr(49, '370.3', '49 CFR § 370.3')]],
  ['brokerage startup', [cfr(49, '371.2', '49 CFR § 371.2'), cfr(49, '371.3', '49 CFR § 371.3'), cfr(49, '387.307', '49 CFR § 387.307'), P.regPage]],
  ['fraud', [cfr(49, '371.3', '49 CFR § 371.3'), cfr(49, '371.2', '49 CFR § 371.2'), cfr(49, '387.307', '49 CFR § 387.307')]],
  ['dispatch', [cfr(49, '371.2', '49 CFR § 371.2'), cfr(49, '395.3', '49 CFR § 395.3'), P.regPage]],
  ['carrier sales', [cfr(49, '371.3', '49 CFR § 371.3'), cfr(49, '371.2', '49 CFR § 371.2'), P.regPage]],
  ['ftl brokerage', [cfr(49, '371.2', '49 CFR § 371.2'), cfr(49, '371.3', '49 CFR § 371.3'), cfr(49, '387.307', '49 CFR § 387.307')]],
  ['owner-operator', [cfr(49, '376.12', '49 CFR § 376.12'), cfr(49, '376.11', '49 CFR § 376.11'), P.regPage]],
  ['maintenance', [cfr(49, '396.3', '49 CFR § 396.3'), cfr(49, '396.11', '49 CFR § 396.11'), cfr(49, '396.17', '49 CFR § 396.17')]],
  ['tire management', [cfr(49, '393.75', '49 CFR § 393.75'), cfr(49, '396.3', '49 CFR § 396.3'), P.smartway]],
  ['hazmat', [cfr(49, '172.504', '49 CFR § 172.504'), cfr(49, '172.704', '49 CFR § 172.704'), P.phmsa]],
  ['oversized', [cfr(23, '658.15', '23 CFR § 658.15'), cfr(23, '658.17', '23 CFR § 658.17'), cfr(23, '658.13', '23 CFR § 658.13'), P.sizeWeight]],
  ['permit management', [cfr(23, '658.15', '23 CFR § 658.15'), cfr(23, '658.17', '23 CFR § 658.17'), P.sizeWeight]],
  ['cold chain', [cfr(21, '1.908', '21 CFR § 1.908'), cfr(21, '1.912', '21 CFR § 1.912'), P.fsmaTransport]],
  ['food & beverage', [cfr(21, '1.908', '21 CFR § 1.908'), cfr(21, '1.906', '21 CFR § 1.906'), P.fsmaTransport]],
  ['customs brokerage', [cfr(19, '149.3', '19 CFR § 149.3'), cfr(19, '149.2', '19 CFR § 149.2'), P.cbpTrade]],
  ['port congestion', [cfr(46, '541.5', '46 CFR § 541.5'), cfr(46, '541.1', '46 CFR § 541.1'), P.btsFreight]],
  ['drayage', [cfr(46, '541.5', '46 CFR § 541.5'), cfr(19, '149.3', '19 CFR § 149.3'), P.btsFreight]],
  ['cross-border', [P.ctpat, cfr(19, '149.3', '19 CFR § 149.3'), P.cbpTrade]],
  ['cargo security', [P.ctpat, cfr(49, '393.100', '49 CFR § 393.100'), cfr(49, '393.102', '49 CFR § 393.102')]],
  ['diesel fuel', [P.eiaDiesel, page('https://www.iftach.org/', 'IFTA, Inc. — International Fuel Tax Agreement', 'IFTA')]],
  ['ev trucks', [P.afdc, P.smartway]],
  ['carbon emissions', [P.smartway, P.btsFreight]],
];

function sourcesForCluster(cluster) {
  const c = String(cluster || '').toLowerCase();
  const hit = SOURCE_MAP.find(([needle]) => c.includes(needle));
  return hit ? hit[1] : [];
}
const isSourceBacked = (cluster) => sourcesForCluster(cluster).length > 0;

// ── HTTP ──────────────────────────────────────────────────────────────────────
function httpGet(url, redirects = 4) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'User-Agent': UA, Accept: 'text/html,application/xml,application/json', 'Accept-Encoding': 'gzip' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location && redirects > 0) {
        res.resume();
        return resolve(httpGet(new URL(res.headers.location, url).toString(), redirects - 1));
      }
      const stream = res.headers['content-encoding'] === 'gzip' ? res.pipe(zlib.createGunzip()) : res;
      let body = '';
      stream.setEncoding('utf8');
      stream.on('data', (d) => { if (body.length < 3e6) body += d; });
      stream.on('end', () => resolve({ status: res.statusCode, body }));
      stream.on('error', reject);
    });
    req.setTimeout(FETCH_TIMEOUT_MS, () => req.destroy(new Error('timeout')));
    req.on('error', reject);
  });
}

const decode = (s) => s
  .replace(/&#x2019;|&#8217;|&rsquo;/g, "'").replace(/&#x201[CD];|&#822[01];|&ldquo;|&rdquo;/g, '"')
  .replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/&sect;|&#xA7;|&#167;/g, '§')
  .replace(/&[a-z]+;|&#x?[0-9a-f]+;/gi, ' ');

function htmlToText(html) {
  return decode(String(html)
    .replace(/<(script|style|nav|footer|header|noscript|svg)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<\/(p|div|li|h[1-6]|tr|br)>/gi, '\n')
    .replace(/<[^>]+>/g, ' '))
    .replace(/[ \t]+/g, ' ').replace(/\n\s*\n+/g, '\n').trim();
}

let ecfrDate = null;
async function getEcfrDate() {
  if (ecfrDate) return ecfrDate;
  try {
    const { status, body } = await httpGet('https://www.ecfr.gov/api/versioner/v1/titles.json');
    if (status === 200) {
      const t = JSON.parse(body).titles.find((x) => x.number === 49);
      if (t && t.up_to_date_as_of) return (ecfrDate = t.up_to_date_as_of);
    }
  } catch (_) { /* fall through */ }
  return (ecfrDate = new Date(Date.now() - 3 * 86400000).toISOString().slice(0, 10));
}

async function fetchSource(src) {
  try {
    if (src.type === 'ecfr') {
      const date = await getEcfrDate();
      const part = String(src.section).split('.')[0];
      const { status, body } = await httpGet(`https://www.ecfr.gov/api/versioner/v1/full/${date}/title-${src.title}.xml?part=${part}&section=${src.section}`);
      if (status !== 200) return null;
      const text = htmlToText(body);
      if (text.length < 200) return null;
      return { ...src, text: text.slice(0, MAX_SOURCE_CHARS), asOf: date };
    }
    const { status, body } = await httpGet(src.url);
    if (status !== 200) return null;
    const text = htmlToText(body);
    if (text.length < 400) return null;
    return { ...src, text: text.slice(0, MAX_SOURCE_CHARS), asOf: new Date().toISOString().slice(0, 10) };
  } catch (_) {
    return null;
  }
}

// Downloads the sources for a cluster. Returns { sources:[{label,url,cite,text,asOf}], promptBlock, sourceText }.
// `sources` only contains pages that were actually retrieved.
async function gatherSources(cluster) {
  const wanted = sourcesForCluster(cluster);
  const fetched = (await Promise.all(wanted.map(fetchSource))).filter(Boolean);
  let total = 0;
  const kept = [];
  for (const s of fetched) {
    if (total + s.text.length > MAX_TOTAL_CHARS) break;
    total += s.text.length;
    kept.push(s);
  }
  const promptBlock = kept.map((s, i) =>
    `[SOURCE ${i + 1}] cite as "${s.cite}" — ${s.label} — ${s.url} — retrieved ${s.asOf}\n${s.text}`).join('\n\n────────\n\n');
  return { sources: kept, promptBlock, sourceText: kept.map((s) => s.text).join('\n') };
}

function sourcesHtml(sources) {
  if (!sources || !sources.length) return '';
  const items = sources.map((s) => `<li><a href="${s.url}" target="_blank" rel="noopener noreferrer">${s.label}</a> — checked ${s.asOf}</li>`).join('');
  return `<h2>Primary sources for this article</h2><p>The rules and figures above were checked against the following primary sources on the dates shown. Regulations are amended, so confirm the current text before relying on it.</p><ul>${items}</ul>`;
}

module.exports = { SOURCE_MAP, sourcesForCluster, isSourceBacked, gatherSources, sourcesHtml, htmlToText, fetchSource };
