// Code-level editorial quality gates for AI-written articles (scripts/blog-generator.js).
//
// The generation prompt tells the model not to fabricate first-party data, client
// anecdotes or precise statistics — but a prompt is an instruction, not an enforcement.
// A 2026-09-20 audit of the 802 published English posts found "Our internal Loadly data
// shows…", "one of our clients lost $8,900 last quarter", "In our analysis of thousands
// of shipments…" in roughly half of the newest posts, although Loadly has no clients, no
// shipment data and no active marketplace. These checks are the backstop: validateArticle()
// returns a list of human-readable issues, and the generator feeds them back to the model
// for a retry instead of publishing (or silently skipping the day).
//
// Pure functions only (no I/O) so they can be unit-tested and run against old posts.

const stripTags = (html) => String(html || '').replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ').replace(/\s+/g, ' ').trim();

// ── 1. First-party claims ─────────────────────────────────────────────────────
// Loadly is an editorial publication. It has no clients/customers/members, no shipment or
// carrier dataset, no marketplace, and no analysts — so any sentence that claims one is fiction.
const FIRST_PARTY_PATTERNS = [
  // "our data / our analysis / our clients / our platform / our network …"
  /\bour\s+(?:own\s+|internal\s+|proprietary\s+|platform\s+|aggregated\s+|anonymi[sz]ed\s+|carrier\s+|shipment\s+)*(?:data(?:set|base)?|analys[ie]s|research|stud(?:y|ies)|survey|benchmarks?|carriers?|clients?|customers?|members?|users?|network|marketplace|platform|shippers?|drivers?|shipments?|loads?|experts\b|expert team|analysts?|records?|team|engineers?|advisors?|consultants?|findings)\b/i,
  // "Loadly's data / Loadly analysts / the Loadly marketplace / Loadly clients …"
  /\bLoadly(?:['’]s)?\s+(?:own\s+|internal\s+|proprietary\s+|carrier\s+|shipment\s+)*(?:data|research|analys[ie]s|analysts?|experts?|team|clients?|customers?|members?|users?|network|marketplace|platform|carriers?|shippers?|benchmarks?|survey|study|findings|insights?|index|forecast)\b/i,
  /\bthe Loadly (?:marketplace|platform|network|load board|community)\b/i,
  // Product pitch for a service that does not exist: "Loadly helps you connect…", "join the Loadly network",
  // "at Loadly", "we built Loadly", "for Loadly users". (A 2026-09-20 probe found these in 60 of the 160 posts
  // the patterns above considered clean.)
  /\bLoadly\s+(?:helps?|offers?|provides?|connects?|lets?|allows?|enables?|gives?|makes?|delivers?|powers?|matches|verifies|vets|users?|members?|uses|built|can)\b/i,
  /\b(?:at|join(?:ing)?|we built|we['’]ve built) (?:the )?Loadly\b/i,
  /\b(?:for|to) Loadly (?:users|members|shippers|carriers|drivers)\b/i,
  // Second probe (2026-09-21) — claims the patterns above missed even after the old-post cleanup:
  // "data from thousands of Loadly shipments", "a 2024 Loadly Logistics Report", "Loadly's proprietary rate index",
  // "Loadly's integrated route optimization", "Loadly's system identified $210 …", "Loadly assists/identified/optimizes …".
  /\b(?:thousands|hundreds|millions) of Loadly\b|\bLoadly (?:shipments|loads)\b/i,
  /\bLoadly (?:Logistics |Freight |Market |Rate )?(?:Reports?|Index|Data|Insights?|Survey|Study|Analysis|Benchmark)\b/,
  /\bLoadly['’]s\s+(?:[a-z-]+\s+){0,3}(?:index|reports?|systems?|integrated|analytics|algorithms?|software|tools?|route|routing|technology|dashboard|engine|ledger|insights?|estimates?)\b/i,
  /\bLoadly\s+(?:assists?|identified|optimi[sz]es|streamlines?|integrates|flags|automates|tracks|monitors|analy[sz]es|calculates|suggests|recommends|highlights|reduces|saves|aggregates|commands|is\s+(?:built|designed|not just)|was\s+(?:built|designed|created|founded)|isn['’]t\s+(?:just|only))\b/i,
  // "platforms like Loadly", "e.g., Loadly", "(or a marketplace like Loadly)" — presents Loadly as a service in use
  /\b(?:platforms?|marketplaces?|tools?|services?|providers?|load boards?)\s*(?:like|such as|including|e\.g\.,?)\s+Loadly\b|\be\.g\.,?\s+(?:via\s+)?Loadly\b/i,
  // calls to action for a product that does not exist
  /\b(?:sign up|register|explore|get started|discover|browse|start)\b[^.!?]{0,60}\bLoadly\b/i,
  // invented first-person experience
  /\b(?:when I was running my own|my own \d+\+? years|I['’]ve spent (?:\d+\+? |many |years )?years?|in my \d+\+? years|my (?:own )?freight brokerage)\b/i,
  // "a client of ours"
  /\b(?:a|one|another) (?:client|customer|member|user|carrier|shipper|driver)s? of ours\b/i,
  // "we analyzed / we found / we've seen / we worked with …" — first-person authority about own data/work
  /\bwe(?:['’]ve| have)?\s+(?:analy[sz]ed|surveyed|reviewed|found|observed|measured|audited|tracked|monitored|processed|handled|seen|saw|worked|partnered|helped|advised|consulted|studied|compared|examined|interviewed|spoke|talked|recorded|collected|aggregated)\b/i,
];

function findFirstPartyClaim(...texts) {
  // Each text on its own: joining them lets a pattern match ACROSS fields ("… | Loadly" + "Power only freight …"
  // matched `Loadly powers?`), a false positive that blocked a clean article.
  for (const text of texts.filter(Boolean)) {
    const combined = stripTags(text);
    for (const re of FIRST_PARTY_PATTERNS) {
      const m = combined.match(re);
      if (m) {
        const i = m.index;
        return combined.slice(Math.max(0, i - 25), i + m[0].length + 45).trim();
      }
    }
  }
  return null;
}

// ── 1b. Brand mention ─────────────────────────────────────────────────────────
// The website is a blog only (no load board, marketplace, platform or accounts — the app is separate).
// A 2026-09-21 sweep of the already-cleaned archive still found 446/802 posts naming "Loadly" in the body,
// including invented features ("Capacity Heatmap", "rate prediction feature"), invented studies ("internal
// analysis by Loadly of 700,000 shipments") and a nonexistent "Loadly Emissions Calculator" — none of which
// the pattern list above caught, because every new phrasing slipped past a regex. A brand name in article
// text can only be a pitch or an invented claim, so the rule is simple: the name must not appear.
// A trailing " | Loadly" site suffix in a title/meta_title is not article text and is ignored.
const BRAND_SUFFIX = /\s*[|–—-]\s*Loadly\s*$/i;
function findBrandMention(...texts) {
  for (const text of texts.filter(Boolean)) {
    const plain = stripTags(text).replace(BRAND_SUFFIX, '');
    const m = plain.match(/\bLoadly(?:app)?\b/i);
    if (m) return plain.slice(Math.max(0, m.index - 30), m.index + m[0].length + 45).trim();
  }
  return null;
}

// ── 2. Invented case studies ("Last quarter, a mid-sized carrier lost $8,900…") ──
// An illustrative scenario is fine ("Imagine a 10-truck fleet…", "hypothetical") — presenting a
// specific past event with no source as if it happened is not.
const ILLUSTRATIVE_MARKER = /\b(?:imagine|suppose|consider|picture|say|hypothetical(?:ly)?|for example|for instance|illustrative|scenario|let['’]s say|assume)\b/i;
const ANECDOTE_PATTERNS = [
  /\blast (?:quarter|month|year|week|season),? (?:a|one|an)\b[^.]{0,90}\b(?:carrier|shipper|driver|company|fleet|broker|operator|manufacturer|retailer|distributor|importer|exporter|owner-operator)\b/i,
  /\b(?:a|one) (?:mid-sized|midsize|small|large|regional|family-owned|national|[A-Z][a-z]+-based)[a-z -]{0,25}(?:carrier|shipper|fleet|broker|distributor|manufacturer|retailer|importer|exporter)\b[^.]{0,70}\b(?:lost|saved|cut|reduced|paid|faced|discovered|reported|slashed|boosted|increased|avoided)\b/i,
];

function findFabricatedAnecdote(content) {
  const text = stripTags(content);
  const sentences = text.split(/(?<=[.!?])\s+/);
  for (let i = 0; i < sentences.length; i++) {
    for (const re of ANECDOTE_PATTERNS) {
      if (re.test(sentences[i])) {
        const context = [sentences[i - 1] || '', sentences[i]].join(' ');
        if (!ILLUSTRATIVE_MARKER.test(context)) return sentences[i].slice(0, 160);
      }
    }
  }
  return null;
}

// ── 3. False precision ────────────────────────────────────────────────────────
// Decimal-precision percentages ("14.3%"), non-round dollar amounts ("$1,847") and fractional
// day/hour counts ("2.3 days") read as discovered facts. Without a real source they're inventions.
// Figures inside a <blockquote> are exempt here — those are checked by findFabricatedCitation().
function countFalsePrecision(content) {
  const outsideQuotes = String(content || '').replace(/<blockquote>[\s\S]*?<\/blockquote>/gi, ' ');
  const text = stripTags(outsideQuotes);
  const decimalPct = (text.match(/\b\d{1,3}\.\d{1,2}\s?%/g) || []).length;
  const oddDollars = (text.match(/[$€£]\s?\d{1,3}(?:,\d{3})*(?:\.\d+)?(?![\d,])/g) || [])
    .filter((m) => {
      const n = parseFloat(m.replace(/[^\d.]/g, ''));
      return n >= 100 && n % 50 !== 0; // "$1,847" yes; "$1,500"/"$8,900"/"$12,000" no
    }).length;
  const fractionalUnits = (text.match(/\b\d+\.\d+\s?(?:days?|hours?|hrs?|weeks?|miles|mpg|cents|minutes?)\b/gi) || []).length;
  return { decimalPct, oddDollars, fractionalUnits, total: decimalPct + oddDollars + fractionalUnits };
}

// ── 4. Numbers in the excerpt / meta description ─────────────────────────────
// The old prompt demanded "a specific number" in the excerpt and "a measurable benefit" in the
// meta description, which is where invented "cut costs by 18%" claims came from. Search results and
// share cards are where an unsourced number does the most damage.
function findInventedNumberInMeta(excerpt, metaDescription, metaTitle, title) {
  const re = /\d+(?:\.\d+)?\s?%|[$€£]\s?\d|\b\d+(?:\.\d+)?\s?(?:x|times)\b/i;
  for (const [label, v] of [['excerpt', excerpt], ['meta_description', metaDescription], ['meta_title', metaTitle], ['title', title]]) {
    const m = String(v || '').match(re);
    if (m) return `${label}: "${m[0]}"`;
  }
  return null;
}

// ── 5. Years in titles ───────────────────────────────────────────────────────
// Year-stamped titles ("The 2025 X Playbook") make 87% of the archive look stale within months.
function titleHasYear(...titles) {
  for (const t of titles) {
    const m = String(t || '').match(/\b(20[12]\d)\b/);
    if (m) return m[1];
  }
  return null;
}

// ── Aggregate ─────────────────────────────────────────────────────────────────
// Thresholds were chosen from the distribution over the 802 existing English posts (see the
// 2026-09-20 measurement): tolerate a couple of borderline figures, reject clear fabrication.
const MAX_FALSE_PRECISION = 3;

function validateArticle(post) {
  const issues = [];
  const firstParty = findFirstPartyClaim(post.title, post.excerpt, post.meta_description, post.content);
  if (firstParty) issues.push(`FIRST-PARTY CLAIM ("${firstParty}") — Loadly has no clients, customers, members, shipment data, analysts, platform or marketplace. Never write "our data/clients/analysis/platform/network", "Loadly's data/experts", or "we found/analyzed/saw/worked with…". Attribute facts to real public bodies or present them as general industry knowledge.`);
  const brand = findBrandMention(post.title, post.excerpt, post.meta_title, post.meta_description, post.content);
  if (brand) issues.push(`BRAND MENTION ("${brand}") — do not write the name "Loadly" anywhere: not in the title, excerpt, meta fields, headings or body. The website is a blog only; any sentence that names Loadly is a pitch or an invented feature/study/partner. Write about the topic itself.`);
  const anecdote = findFabricatedAnecdote(post.content);
  if (anecdote) issues.push(`INVENTED CASE STUDY ("${anecdote}") — do not describe a specific past event involving an unnamed company as fact. Use a clearly labelled hypothetical ("Imagine a 10-truck fleet…") or a real, named public source.`);
  const fp = countFalsePrecision(post.content);
  if (fp.total > MAX_FALSE_PRECISION) issues.push(`FALSE PRECISION (${fp.decimalPct} decimal percentages, ${fp.oddDollars} non-round dollar amounts, ${fp.fractionalUnits} fractional day/hour counts) — use honest ranges ("roughly 12-16%", "commonly $1,500-2,500") unless a real, named public source gives the exact figure.`);
  const metaNum = findInventedNumberInMeta(post.excerpt, post.meta_description, post.meta_title, post.title);
  if (metaNum) issues.push(`NUMBER IN SEARCH/SHARE TEXT (${metaNum}) — title, meta_title, meta_description and excerpt must not contain percentages, dollar amounts or "Nx" claims. Describe the concrete benefit in words.`);
  const year = titleHasYear(post.title, post.meta_title);
  if (year) issues.push(`YEAR IN TITLE ("${year}") — titles must be evergreen; do not put a year in the title or meta_title.`);
  return issues;
}

// ── Official resources block ─────────────────────────────────────────────────
// Real, stable primary-source pages appended to every article. Chosen by topic cluster so the
// reader can verify rules and figures at the source. The article's own claims are NOT attributed to
// these links; the block is labelled as further reading on the topic.
const RESOURCE = {
  fmcsa: ['FMCSA — Regulations and guidance', 'https://www.fmcsa.dot.gov/regulations'],
  hos: ['FMCSA — Hours of Service rules', 'https://www.fmcsa.dot.gov/regulations/hours-of-service'],
  eld: ['FMCSA — Electronic Logging Devices', 'https://www.fmcsa.dot.gov/hours-service/elds/electronic-logging-devices'],
  csa: ['FMCSA — Safety Measurement System (CSA)', 'https://csa.fmcsa.dot.gov/'],
  cdl: ['FMCSA — Commercial Driver’s License program', 'https://www.fmcsa.dot.gov/cdl'],
  reg: ['FMCSA — Registration and operating authority', 'https://www.fmcsa.dot.gov/registration'],
  hazmat: ['PHMSA — Office of Hazardous Materials Safety', 'https://www.phmsa.dot.gov/about-phmsa/offices/office-hazardous-materials-safety'],
  bts: ['Bureau of Transportation Statistics — Freight data', 'https://www.bts.gov/topics/freight-transportation'],
  fhwa: ['FHWA — Freight management and operations', 'https://ops.fhwa.dot.gov/freight/'],
  size: ['FHWA — Truck size and weight', 'https://ops.fhwa.dot.gov/freight/sw/index.htm'],
  cbp: ['U.S. Customs and Border Protection — Trade', 'https://www.cbp.gov/trade'],
  ctpat: ['CBP — Customs Trade Partnership Against Terrorism (CTPAT)', 'https://www.cbp.gov/border-security/ports-entry/cargo-security/ctpat'],
  eia: ['U.S. Energy Information Administration — Diesel fuel prices', 'https://www.eia.gov/petroleum/gasdiesel/'],
  epa: ['EPA — SmartWay Transport Partnership', 'https://www.epa.gov/smartway'],
  afdc: ['U.S. DOE — Alternative Fuels Data Center', 'https://afdc.energy.gov/'],
  fmc: ['Federal Maritime Commission', 'https://www.fmc.gov/'],
  irs: ['IRS — Trucking tax center', 'https://www.irs.gov/businesses/small-businesses-self-employed/trucking-tax-center'],
  ifta: ['IFTA — International Fuel Tax Agreement', 'https://www.iftach.org/'],
  incoterms: ['ICC — Incoterms rules', 'https://iccwbo.org/business-solutions/incoterms-rules/'],
  iru: ['IRU — TIR and international road transport', 'https://www.iru.org/'],
  eurlex: ['European Commission — Road transport', 'https://transport.ec.europa.eu/transport-modes/road_en'],
  wto: ['WTO — Trade facilitation', 'https://www.wto.org/english/tratop_e/tradfa_e/tradfa_e.htm'],
  iata: ['IATA — Cargo', 'https://www.iata.org/en/programs/cargo/'],
  fda: ['FDA — Food Safety Modernization Act: sanitary transportation', 'https://www.fda.gov/food/food-safety-modernization-act-fsma/fsma-final-rule-sanitary-transportation-human-and-animal-food'],
  osha: ['OSHA — Warehousing and material handling', 'https://www.osha.gov/warehousing'],
  dotfreight: ['U.S. DOT — Multimodal freight infrastructure and policy', 'https://www.transportation.gov/freight'],
  stb: ['Surface Transportation Board — Rail', 'https://www.stb.gov/'],
  nhtsa: ['NHTSA — Tire safety', 'https://www.nhtsa.gov/vehicle-safety/tires'],
};

// substring (lower-case) of topic_cluster → resource keys. First matches win, then a common base.
const CLUSTER_RESOURCES = [
  ['diesel fuel', ['eia', 'ifta', 'irs']],
  ['ev trucks', ['afdc', 'epa', 'fhwa']],
  ['load board', ['fmcsa', 'reg', 'bts']],
  ['direct shipper', ['fmcsa', 'reg', 'bts']],
  ['rate negotiation', ['bts', 'fmcsa', 'reg']],
  ['ltl freight', ['bts', 'fmcsa', 'fhwa']],
  ['ftl brokerage', ['reg', 'fmcsa', 'bts']],
  ['intermodal', ['bts', 'stb', 'fhwa']],
  ['drayage', ['fmc', 'cbp', 'bts']],
  ['last-mile', ['epa', 'bts', 'fhwa']],
  ['reverse logistics', ['bts', 'epa', 'dotfreight']],
  ['cold chain', ['fda', 'epa', 'fmcsa']],
  ['hazmat', ['hazmat', 'fmcsa', 'cdl']],
  ['oversized', ['size', 'fhwa', 'fmcsa']],
  ['automotive', ['bts', 'fmcsa', 'cbp']],
  ['pharmaceutical', ['fda', 'fmcsa', 'bts']],
  ['food & beverage', ['fda', 'fmcsa', 'bts']],
  ['retail', ['bts', 'epa', 'fhwa']],
  ['e-commerce', ['bts', 'epa', 'fhwa']],
  ['agricultural', ['bts', 'fmcsa', 'fda']],
  ['construction', ['size', 'osha', 'fmcsa']],
  ['oil, gas', ['hazmat', 'eia', 'fmcsa']],
  ['us-mexico', ['cbp', 'ctpat', 'fmcsa']],
  ['eu road', ['eurlex', 'iru', 'wto']],
  ['turkey, balkans', ['iru', 'wto', 'eurlex']],
  ['customs brokerage', ['cbp', 'wto', 'incoterms']],
  ['incoterms', ['incoterms', 'wto', 'cbp']],
  ['port congestion', ['fmc', 'cbp', 'bts']],
  ['hos rules', ['hos', 'eld', 'csa']],
  ['fmcsa safety', ['csa', 'fmcsa', 'reg']],
  ['cdl requirements', ['cdl', 'fmcsa', 'hos']],
  ['cargo insurance', ['fmcsa', 'reg', 'bts']],
  ['contract law', ['fmcsa', 'reg', 'stb']],
  ['owner-operator business', ['irs', 'ifta', 'reg']],
  ['truck financing', ['irs', 'reg', 'fmcsa']],
  ['truck maintenance', ['fmcsa', 'nhtsa', 'csa']],
  ['tire management', ['nhtsa', 'fmcsa', 'epa']],
  ['telematics', ['eld', 'hos', 'fmcsa']],
  ['tms', ['bts', 'fmcsa', 'fhwa']],
  ['ai, machine', ['bts', 'fhwa', 'fmcsa']],
];
const DEFAULT_RESOURCES = ['fmcsa', 'bts', 'fhwa'];

function resourcesForCluster(topicCluster) {
  const c = String(topicCluster || '').toLowerCase();
  const hit = CLUSTER_RESOURCES.find(([needle]) => c.includes(needle));
  const keys = hit ? hit[1] : DEFAULT_RESOURCES;
  return [...new Set(keys)].map((k) => RESOURCE[k]).filter(Boolean);
}

function officialResourcesHtml(topicCluster) {
  const links = resourcesForCluster(topicCluster);
  if (!links.length) return '';
  const items = links.map(([label, url]) => `<li><a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a></li>`).join('');
  return `<h2>Official resources for further reading</h2><p>Rules, thresholds and published statistics change. These primary sources are where to check the current position before you act on anything above.</p><ul>${items}</ul>`;
}

module.exports = {
  stripTags,
  findFirstPartyClaim,
  findBrandMention,
  findFabricatedAnecdote,
  countFalsePrecision,
  findInventedNumberInMeta,
  titleHasYear,
  validateArticle,
  resourcesForCluster,
  officialResourcesHtml,
  RESOURCE,
  CLUSTER_RESOURCES,
  MAX_FALSE_PRECISION,
};
