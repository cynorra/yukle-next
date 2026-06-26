const fs = require('fs');
const path = require('path');
const https = require('https');
const { createClient } = require('@supabase/supabase-js');

// Load env variables from .env.local
const envLocalPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envLocalPath)) {
  const envContent = fs.readFileSync(envLocalPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const val = parts.slice(1).join('=').trim();
      process.env[key] = val;
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const geminiApiKey = process.env.GEMINI_API_KEY;
const defaultAuthorId = process.env.SCRAPER_SHIPPER_ID || '3c9d15c1-ce40-42c4-b5bc-f2de51a747d5';

if (!supabaseUrl || (!anonKey && !serviceKey)) {
  console.error('Supabase URL or Key is missing from .env.local!');
  process.exit(1);
}

const activeKey = serviceKey || anonKey;
const supabase = createClient(supabaseUrl, activeKey);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runWithConcurrency(tasks, concurrency) {
  const results = [];
  const executing = new Set();
  for (const task of tasks) {
    const p = Promise.resolve().then(() => task());
    results.push(p);
    executing.add(p);
    const clean = () => executing.delete(p);
    p.then(clean, clean);
    if (executing.size >= concurrency) {
      await Promise.race(executing);
    }
  }
  return Promise.all(results);
}

// 12 target audience profiles — each post targets one specific group
const audienceProfiles = [
  {
    name: 'Truck Drivers & Owner-Operators',
    searchIntent: 'practical income tips, route optimization, load finding, legal compliance, fuel savings',
    painPoints: 'empty return miles, rising fuel costs, finding quality loads, HOS regulations, unexpected maintenance costs',
    keywords: ['truck driver income', 'owner operator tips', 'find loads online', 'fuel efficiency trucking', 'load board tips', 'owner operator profit', 'trucking business tips']
  },
  {
    name: 'Freight Shippers & Logistics Managers',
    searchIntent: 'cost reduction, carrier vetting, shipment tracking, freight compliance, rate negotiation',
    painPoints: 'unpredictable shipping costs, unreliable carriers, freight damage claims, customs delays, supply chain visibility',
    keywords: ['reduce shipping costs', 'find reliable freight carriers', 'freight rate negotiation', 'logistics cost optimization', 'shipper best practices', 'freight carrier selection']
  },
  {
    name: 'E-commerce & Retail Businesses',
    searchIntent: 'fulfillment cost reduction, last-mile delivery optimization, returns management, carrier comparison',
    painPoints: 'high fulfillment costs squeezing margins, delivery delays causing refunds, holiday surge capacity, high return rates',
    keywords: ['ecommerce shipping solutions', 'last mile delivery optimization', 'reduce fulfillment costs', 'ecommerce logistics strategy', 'shipping carrier comparison 2025']
  },
  {
    name: 'Freight Brokers & Forwarders',
    searchIntent: 'market intelligence, carrier relationship building, margin optimization, fraud prevention, tech adoption',
    painPoints: 'rate volatility destroying margins, capacity shortages, double-brokering fraud, customer churn, carrier onboarding time',
    keywords: ['freight broker tips', 'freight market rates 2025', 'find carriers as broker', 'freight forwarding guide', 'broker carrier relationships', 'freight brokerage technology']
  },
  {
    name: 'Importers, Exporters & Manufacturers',
    searchIntent: 'customs navigation, international shipping optimization, trade compliance, supply chain resilience',
    painPoints: 'customs delays costing thousands, incorrect documentation fines, port congestion, supply chain disruptions, Incoterms confusion',
    keywords: ['international freight shipping guide', 'customs clearance tips', 'import export logistics', 'supply chain optimization manufacturing', 'Incoterms 2020 explained', 'cross-border freight']
  },
  {
    name: 'Small Business Owners & Startups',
    searchIntent: 'affordable shipping solutions, comparing freight options, scaling logistics without big budgets',
    painPoints: 'paying retail shipping rates with no volume discounts, no logistics expertise, unpredictable freight costs killing cash flow',
    keywords: ['small business shipping tips', 'affordable freight for small business', 'LTL shipping guide for beginners', 'shipping strategy for startups', 'freight marketplace benefits']
  },
  {
    name: 'Warehouse & Distribution Managers',
    searchIntent: 'operational efficiency, carrier performance management, dock scheduling, inventory accuracy, labor optimization',
    painPoints: 'warehouse bottlenecks, carrier no-shows disrupting operations, dock congestion, inventory discrepancies, rising labor costs',
    keywords: ['warehouse efficiency tips', 'distribution center optimization', 'carrier performance management', 'dock scheduling best practices', 'warehouse logistics KPIs']
  },
  {
    name: 'Fleet Managers & Transportation Directors',
    searchIntent: 'fleet cost reduction, driver management, compliance tracking, asset utilization, maintenance scheduling',
    painPoints: 'driver turnover, rising insurance premiums, compliance violations, fuel cost unpredictability, aging fleet maintenance costs',
    keywords: ['fleet management tips', 'reduce fleet operating costs', 'driver retention strategies', 'fleet compliance management', 'transportation KPIs', 'fleet fuel management 2025']
  },
  {
    name: 'Cold Chain & Refrigerated Cargo Specialists',
    searchIntent: 'temperature compliance, reefer carrier qualification, cold chain documentation, pharma logistics, food safety',
    painPoints: 'temperature excursions causing cargo loss, finding qualified reefer carriers, ATP certification requirements, fuel costs for refrigeration units',
    keywords: ['cold chain logistics guide', 'reefer transport best practices', 'temperature controlled shipping', 'cold chain compliance', 'refrigerated freight carriers', 'pharma cold chain requirements']
  },
  {
    name: 'Hazmat & Special Cargo Handlers',
    searchIntent: 'hazmat compliance, dangerous goods documentation, ADR regulations, special transport permits, certified carrier finding',
    painPoints: 'regulatory complexity across borders, finding ADR-certified carriers, documentation errors causing delays, liability exposure for violations',
    keywords: ['hazmat shipping regulations', 'dangerous goods transport guide', 'ADR compliance checklist', 'hazmat carrier qualification', 'special cargo transport permits', 'IATA dangerous goods']
  },
  {
    name: 'Agricultural & Bulk Commodity Shippers',
    searchIntent: 'harvest season logistics, grain transport, commodity freight rates, seasonal capacity planning, perishable cargo',
    painPoints: 'harvest season capacity shortage, weather-dependent scheduling, commodity price volatility, perishable cargo timing pressure',
    keywords: ['agricultural freight solutions', 'grain transport logistics', 'bulk commodity shipping rates', 'harvest logistics planning', 'agricultural supply chain', 'commodity freight broker']
  },
  {
    name: 'Construction & Infrastructure Project Logistics',
    searchIntent: 'heavy equipment transport, project site delivery, oversize load permits, just-in-time construction delivery',
    painPoints: 'permit complexity for oversized loads, project site access restrictions, tight delivery windows, equipment damage risk during transport',
    keywords: ['construction logistics management', 'heavy equipment transport guide', 'oversize load permits process', 'project freight solutions', 'construction material delivery', 'site logistics planning']
  }
];

// 60 highly specific topic clusters with detection keywords for smart rotation
const topicClusters = [
  { name: 'Diesel Fuel Cost & IFTA Tax Management', keywords: ['diesel', 'fuel cost', 'ifta', 'fuel surcharge', 'fuel card', 'mpg', 'fuel efficiency'] },
  { name: 'EV Trucks & Alternative Fuel Adoption', keywords: ['electric truck', 'ev truck', 'hydrogen', 'cng', 'alternative fuel', 'zero emission', 'charging'] },
  { name: 'Load Board Tactics & Spot Market Strategy', keywords: ['load board', 'spot market', 'spot rate', 'load finding', 'freight board', 'dat', 'truckstop'] },
  { name: 'Direct Shipper Relationships & Dedicated Lanes', keywords: ['direct shipper', 'dedicated lane', 'shipper relationship', 'contract freight', 'dedicated carrier'] },
  { name: 'Freight Rate Negotiation & Contract Pricing', keywords: ['rate negotiation', 'contract rate', 'rate per mile', 'pricing strategy', 'rate increase', 'carrier rate'] },
  { name: 'LTL Freight Optimization & Freight Class', keywords: ['ltl', 'less than truckload', 'freight class', 'nmfc', 'pallet', 'ltl rate', 'ltl carrier'] },
  { name: 'FTL Brokerage & Truckload Market', keywords: ['ftl', 'full truckload', 'truckload', 'dry van', 'flatbed broker', 'truckload rate', 'spot truckload'] },
  { name: 'Intermodal Freight & Rail-Truck Strategy', keywords: ['intermodal', 'rail freight', 'container', 'drayage', 'intermodal container', 'rail transport', 'double stack'] },
  { name: 'Drayage, Port & Terminal Operations', keywords: ['drayage', 'port logistics', 'port congestion', 'terminal', 'chassis', 'port fee', 'demurrage', 'detention'] },
  { name: 'Last-Mile Delivery & Urban Logistics', keywords: ['last mile', 'urban delivery', 'final mile', 'city logistics', 'delivery density', 'last-mile cost'] },
  { name: 'Reverse Logistics & Returns Management', keywords: ['reverse logistics', 'returns', 'return freight', 'product return', 'reverse supply chain', 'recall'] },
  { name: 'Cold Chain & Refrigerated Transport', keywords: ['cold chain', 'reefer', 'refrigerated', 'temperature controlled', 'frozen freight', 'atp certificate'] },
  { name: 'Hazmat & Dangerous Goods Compliance', keywords: ['hazmat', 'dangerous goods', 'adr', 'iata dgr', 'un number', 'hazardous material', 'placarding'] },
  { name: 'Oversized, Heavy Haul & Out-of-Gauge Cargo', keywords: ['oversized', 'heavy haul', 'oversize', 'wide load', 'out of gauge', 'superload', 'escort vehicle', 'overweight permit'] },
  { name: 'Automotive Logistics & Vehicle Transport', keywords: ['car hauler', 'auto transport', 'vehicle shipping', 'automotive logistics', 'car carrier', 'roll-on roll-off'] },
  { name: 'Pharmaceutical & Life Sciences Logistics', keywords: ['pharma logistics', 'gdp compliance', 'serialization', 'temperature-sensitive medicine', 'clinical trial', 'cold chain pharma'] },
  { name: 'Food & Beverage Supply Chain', keywords: ['food logistics', 'food safety', 'fsma', 'food grade trailer', 'perishable', 'fda food', 'grocery logistics'] },
  { name: 'Retail & FMCG Distribution', keywords: ['retail logistics', 'fmcg', 'consumer goods', 'retail distribution', 'store replenishment', 'cpg logistics'] },
  { name: 'E-commerce Fulfillment & Shipping Strategy', keywords: ['ecommerce shipping', 'fulfillment', 'dim weight', 'parcel', 'warehouse fulfillment', 'shopify shipping', 'amazon fba'] },
  { name: 'Agricultural, Grain & Bulk Commodity Transport', keywords: ['agricultural freight', 'grain transport', 'bulk commodity', 'harvest logistics', 'hopper', 'ag logistics'] },
  { name: 'Construction, Project Cargo & Site Logistics', keywords: ['construction logistics', 'project cargo', 'building materials', 'site delivery', 'crane', 'modular transport'] },
  { name: 'Oil, Gas & Energy Sector Logistics', keywords: ['oilfield logistics', 'energy freight', 'upstream logistics', 'pipeline', 'frac sand', 'crude oil transport'] },
  { name: 'Cross-Border US-Mexico Trucking', keywords: ['us mexico', 'cross border', 'laredo', 'el paso', 'mexican customs', 'nearshore mexico', 'maquiladora'] },
  { name: 'EU Road Freight, CMR & TIR Operations', keywords: ['cmr', 'tir', 'eu freight', 'european trucking', 'cabotage', 'euro 6', 'european road'] },
  { name: 'Turkey, Balkans & Central Asia Trade Routes', keywords: ['turkey logistics', 'silk road', 'central asia', 'trans caspian', 'middle corridor', 'baku', 'dozvola'] },
  { name: 'Import/Export Customs Brokerage & Documentation', keywords: ['customs broker', 'customs clearance', 'bill of lading', 'commercial invoice', 'bol', 'entry filing', 'importer of record'] },
  { name: 'Incoterms, Trade Finance & Letter of Credit', keywords: ['incoterms', 'letter of credit', 'trade finance', 'ex works', 'dap', 'fob', 'cif', 'incoterms 2020'] },
  { name: 'Port Congestion, Demurrage & Detention Costs', keywords: ['port congestion', 'demurrage', 'detention', 'free time', 'container dwell', 'chassis shortage'] },
  { name: 'HOS Rules, ELD Mandate & Driver Compliance', keywords: ['hos', 'eld', 'hours of service', 'log book', 'drive time', 'sleeper berth', '11 hour rule'] },
  { name: 'FMCSA Safety Ratings, CSA Scores & DOT Audits', keywords: ['fmcsa', 'csa score', 'dot audit', 'safety rating', 'sms score', 'satisfactory rating', 'carrier safety'] },
  { name: 'CDL Requirements, Endorsements & Driver Licensing', keywords: ['cdl', 'commercial driver license', 'hazmat endorsement', 'tanker endorsement', 'cdl test', 'cdl school'] },
  { name: 'Cargo Insurance, Claims & Freight Liability', keywords: ['cargo insurance', 'freight claim', 'cargo claim', 'released value', 'cargo coverage', 'insurance certificate'] },
  { name: 'Freight Contract Law, BOL Terms & Liability Limits', keywords: ['freight contract', 'liability limit', 'cargo loss', 'bill of lading terms', 'carrier liability', 'carmack amendment'] },
  { name: 'Owner-Operator Business Finance & Tax Strategy', keywords: ['owner operator tax', 'per diem', 'tax deduction trucking', 'quarterly tax', 'self employed trucker', 'schedule c trucking'] },
  { name: 'Truck Financing, Leasing & Purchase Strategy', keywords: ['truck financing', 'truck lease', 'equipment financing', 'semi truck loan', 'lease purchase', 'truck payment'] },
  { name: 'Truck Maintenance, Breakdowns & Preventive Schedules', keywords: ['truck maintenance', 'breakdown', 'pm schedule', 'oil change', 'dot inspection', 'repair cost', 'dot violation'] },
  { name: 'Tire Management, Tread Depth & Cost Optimization', keywords: ['tire', 'tread depth', 'retreads', 'tire blow out', 'tire cost', 'alignment', 'tire program'] },
  { name: 'Telematics, ELD & GPS Fleet Tracking Technology', keywords: ['telematics', 'gps tracking', 'fleet tracking', 'dash cam', 'eld device', 'asset tracking', 'geofencing'] },
  { name: 'TMS, Freight Software & Digital Operations', keywords: ['tms', 'transportation management system', 'freight software', 'dispatch software', 'carrier tms', 'shipper tms'] },
  { name: 'AI, Machine Learning & Predictive Freight Matching', keywords: ['ai freight', 'machine learning logistics', 'predictive analytics', 'dynamic pricing freight', 'ai dispatch', 'freight algorithm'] },
  { name: 'Blockchain, Visibility & Supply Chain Transparency', keywords: ['blockchain logistics', 'supply chain visibility', 'track and trace', 'freight visibility', 'digital twin', 'smart contract freight'] },
  { name: 'Warehouse Automation, Robotics & WMS', keywords: ['warehouse automation', 'robotics', 'wms', 'warehouse management', 'pick and pack', 'conveyor', 'automated warehouse'] },
  { name: 'Dock Scheduling, Appointment Systems & Yard Management', keywords: ['dock scheduling', 'appointment system', 'yard management', 'dock door', 'lumper', 'live unload', 'drop and hook'] },
  { name: 'Driver Health, Wellness & Mental Health on the Road', keywords: ['driver health', 'driver wellness', 'truck driver diet', 'sleep apnea', 'driver fatigue', 'driver mental health'] },
  { name: 'Driver Recruitment, Retention & Compensation Structures', keywords: ['driver recruitment', 'driver retention', 'driver pay', 'driver shortage', 'sign on bonus', 'driver turnover'] },
  { name: 'Dispatch Operations, Load Planning & Efficiency', keywords: ['dispatcher', 'dispatch', 'load planning', 'freight dispatch', 'trip planning', 'relay trucking'] },
  { name: 'Freight Brokerage Startup, MC Authority & Licensing', keywords: ['freight broker license', 'mc number', 'broker authority', 'surety bond', 'broker startup', 'broker registration'] },
  { name: 'Carrier Sales, Business Development & Shipper Prospecting', keywords: ['carrier sales', 'shipper prospecting', 'freight sales', 'logistics sales', 'bid rfp', 'freight tender'] },
  { name: 'Freight Factoring, Cash Flow & Invoice Financing', keywords: ['freight factoring', 'factoring company', 'invoice factoring', 'cash flow trucking', 'quick pay', 'factoring rate'] },
  { name: 'Cargo Security, Seals & Anti-Theft Technology', keywords: ['cargo theft', 'cargo security', 'seal', 'trailer theft', 'gps anti-theft', 'secure parking', 'cargo theft hotspot'] },
  { name: 'Freight Fraud, Identity Theft & Double-Brokering', keywords: ['freight fraud', 'double brokering', 'carrier identity theft', 'fictitious pickup', 'fraud prevention freight', 'vetting fraud'] },
  { name: 'Peak Season Planning, Holiday Surge & Capacity Management', keywords: ['peak season', 'holiday freight', 'q4 logistics', 'capacity crunch', 'black friday logistics', 'surge capacity'] },
  { name: 'Nearshoring, Reshoring & Supply Chain Localization', keywords: ['nearshoring', 'reshoring', 'supply chain localization', 'friend shoring', 'china plus one', 'supply chain diversification'] },
  { name: 'Carbon Emissions, ESG Reporting & Green Freight', keywords: ['carbon emissions', 'esg logistics', 'green freight', 'scope 3 emissions', 'carbon neutral shipping', 'sustainability report'] },
  { name: 'Autonomous Trucks, Platooning & Future of Trucking', keywords: ['autonomous truck', 'self driving truck', 'platooning', 'level 4 trucking', 'waymo trucks', 'automated driving'] },
  { name: 'Drone Delivery, Micro-Fulfillment & Urban Innovation', keywords: ['drone delivery', 'micro fulfillment', 'urban consolidation', 'delivery robot', 'instant delivery', 'dark store'] },
  { name: 'Small Business Freight Strategy & Cost Reduction', keywords: ['small business shipping', 'small business freight', 'startup logistics', 'solo shipper', 'low volume freight'] },
  { name: 'Freight Market Intelligence, Rate Forecasting & Cycles', keywords: ['freight market', 'rate forecast', 'freight cycle', 'market intelligence', 'capacity forecast', 'rate index', 'freight recession'] },
  { name: 'Lumper Services, Driver Assist & Unloading Costs', keywords: ['lumper', 'driver assist', 'unloading fee', 'loading labor', 'lumper service', 'detention pay', 'unload time'] },
  { name: 'Permit Management, Overweight Loads & State Regulations', keywords: ['overweight permit', 'trip permit', 'state permit', 'superload permit', 'permit routing', 'axle weight', 'bridge law'] },
  { name: 'Owner-Operator vs Company Driver: Financial Comparison', keywords: ['owner operator vs company driver', 'independent contractor trucking', 'lease operator', 'w2 vs 1099 driver', 'company driver income'] },
  { name: 'Freight Marketplace Technology & Platform Comparison', keywords: ['freight marketplace', 'digital freight', 'uber freight', 'convoy', 'freight platform', 'digital broker', 'loadly'] }
];

// 7 content formats rotate to prevent structural repetition
const contentFormats = [
  { type: 'Ultimate Guide', minWords: 2500, description: 'Comprehensive A-to-Z reference covering all critical aspects of the topic with expert depth' },
  { type: 'Step-by-Step Tutorial', minWords: 1800, description: 'Numbered actionable steps the reader can immediately implement to solve a specific problem' },
  { type: 'Comparison & Decision Guide', minWords: 2000, description: 'Side-by-side comparison of options, tools, or strategies with clear, opinionated recommendations' },
  { type: 'Data-Driven Industry Analysis', minWords: 2000, description: 'Statistics-heavy trend analysis with sourced data, benchmarks, and expert interpretation' },
  { type: 'Actionable Checklist & Audit', minWords: 1600, description: 'Checklist format where each item has a clear explanation and consequence for not following it' },
  { type: 'Cost & ROI Breakdown', minWords: 1800, description: 'Financial analysis with real cost figures, ROI calculations, and a decision framework' },
  { type: 'Problem Diagnosis & Fix Playbook', minWords: 1800, description: 'Diagnoses root causes of a common costly problem then provides specific, step-by-step solutions' }
];

// High-quality fallback articles (only used when Gemini API is completely unavailable)
const fallbackArticles = [
  {
    title: '7 Proven Strategies Owner-Operators Use to Eliminate Empty Miles and Maximize Revenue',
    slug: 'owner-operators-eliminate-empty-miles-maximize-revenue',
    excerpt: 'Empty miles are silently destroying owner-operator profits — costing the average driver over $18,000 per year. Discover the exact strategies top-earning owner-operators use to keep their trucks loaded and their income growing.',
    content: `<h2>The Empty Mile Problem Is Bigger Than You Think</h2>
<p>The average owner-operator drives <strong>15-20% of their total miles empty</strong> — that's one in every five miles generating zero revenue while burning fuel, adding wear, and eating into your bottom line. For a driver running 120,000 miles per year at $0.65 per mile in operating costs, that's over <strong>$15,600 lost annually to deadhead miles</strong>. The good news? The top earners have cracked the code on minimizing this waste.</p>

<h2>1. Master the Art of Strategic Load Pairing</h2>
<p>Before you accept any load, ask yourself: "What load will I pick up for the return trip?" Top earners plan 2-3 loads ahead, not just the next one. Use digital freight platforms to search for available loads at your destination <em>before</em> committing to a current pickup.</p>
<ul>
  <li><strong>Check backhaul availability</strong> at your delivery destination before accepting the outbound load</li>
  <li><strong>Prioritize triangular routes</strong> — A to B to C back to A — over simple round trips</li>
  <li><strong>Build shipper relationships in key cities</strong> where you frequently deliver to guarantee return freight</li>
</ul>

<h2>2. Use Real-Time Load Boards to Your Advantage</h2>
<p>Digital freight marketplaces have transformed how owner-operators find loads. Platforms like Loadly give you access to thousands of verified loads in real time, with transparent rates so you know you're not being lowballed. Drivers using digital platforms report <strong>31% fewer empty miles</strong> compared to those relying solely on dispatchers or phone calls.</p>
<blockquote>Carriers using AI-powered freight matching platforms reduce deadhead miles by an average of 28% within the first 90 days — Freight Tech Insider, 2024</blockquote>

<h2>3. Build a Portfolio of Direct Shipper Relationships</h2>
<p>The highest-earning owner-operators have 3-5 direct shipper accounts that provide consistent freight on their preferred lanes. Use load boards to find these shippers first, deliver exceptional service, then approach them directly about dedicated lane agreements. A single dedicated shipper relationship can fill 40-60% of your schedule reliably.</p>

<h2>4. Optimize Your Home Base Location</h2>
<p>Where you park your truck between loads matters more than most drivers realize. If your home base is in a freight-deficit area, you're starting every week with an empty outbound run. Analyze your load history and consider whether repositioning to a freight-dense area — even temporarily — could significantly improve your loaded mile percentage.</p>

<h2>5. Rate Yourself Strategically on Digital Platforms</h2>
<p>High driver ratings on freight platforms unlock access to premium loads that lower-rated carriers can't see. Shippers pay <strong>8-15% premiums</strong> for carriers with consistently high ratings. Treat every delivery as an audition for your best future loads — communicate proactively, deliver on time, and protect your cargo meticulously.</p>

<h2>6. Leverage Seasonal Freight Patterns</h2>
<p>Freight demand is highly seasonal and geographic. Agricultural harvests, retail holiday surges, and construction season all create predictable demand spikes in specific lanes. Map your historical empty miles against seasonal freight calendars and proactively position yourself in high-demand areas before the rush, when rates are highest and competition is lowest.</p>

<h2>7. Track Your Cost-Per-Mile Obsessively</h2>
<p>You can't optimize what you don't measure. Owner-operators who track their cost-per-mile weekly — not monthly — make faster decisions about which loads to accept and which to walk away from. A load that looks good at $2.20/mile might actually lose money if your operating cost in that lane is $2.35/mile.</p>

<h2>Key Takeaways</h2>
<ul>
  <li>Plan return loads before accepting outbound freight to eliminate reactive deadheading</li>
  <li>Digital freight platforms reduce empty miles by up to 31% for active users</li>
  <li>3-5 direct shipper relationships can fill 40-60% of your schedule reliably</li>
  <li>High platform ratings unlock premium-rate loads unavailable to lower-rated carriers</li>
  <li>Seasonal freight positioning can dramatically increase your loaded mile percentage</li>
  <li>Track cost-per-mile weekly to make faster, more profitable load decisions</li>
</ul>

<h2>Frequently Asked Questions</h2>
<h3>How do I find backhaul loads when I'm far from my home base?</h3>
<p>Use a digital freight marketplace to search loads within 50-75 miles of your delivery location. The broader your search radius, the more options you'll find. Filter by weight, equipment type, and rate-per-mile to identify the best available backhaul quickly.</p>

<h3>What is a good empty mile percentage for an owner-operator?</h3>
<p>Top-performing owner-operators achieve 8-12% empty mile rates. The industry average is 15-20%. Anything above 20% should be a red flag that your load-finding strategy needs to change immediately.</p>

<h3>Is it worth repositioning my truck to a different market to find loads?</h3>
<p>If you can reposition for under 200 miles and the target market offers rates that are 15%+ higher on your preferred lanes, repositioning almost always pays off within 1-2 loads.</p>

<h3>How long does it take to get approved on a digital freight platform?</h3>
<p>Most reputable platforms complete carrier verification — including MC/DOT check, insurance verification, and background screening — within 24-72 hours. Have your insurance certificate and operating authority documents ready to accelerate the process.</p>

<h2>Start Eliminating Empty Miles Today</h2>
<p>Loadly connects owner-operators directly with verified shippers across thousands of lanes, providing real-time load matching, transparent rates, and the tools you need to keep your truck loaded and your income growing. Join thousands of drivers who have already cut their empty miles using Loadly's intelligent freight matching platform.</p>`,
    meta_title: 'Eliminate Empty Miles: 7 Owner-Operator Strategies | Loadly',
    meta_description: 'Empty miles cost owner-operators $15,000+ per year. Discover 7 proven strategies to maximize loaded miles and boost revenue with digital freight platforms.'
  },
  {
    title: 'The Complete Freight Cost Reduction Playbook for E-commerce Businesses in 2025',
    slug: 'freight-cost-reduction-playbook-ecommerce-2025',
    excerpt: 'Shipping costs are now the #1 margin killer for e-commerce businesses, averaging 12-18% of revenue. This complete playbook reveals the exact strategies top online retailers use to cut freight spending by up to 35% without sacrificing delivery speed.',
    content: `<h2>Why Shipping Costs Are Destroying E-commerce Margins</h2>
<p>In 2025, shipping costs represent <strong>12-18% of total revenue</strong> for the average e-commerce business — and that number has climbed every year since 2020. Meanwhile, customer expectations for free or next-day delivery have never been higher. The e-commerce brands winning this battle aren't just negotiating better carrier rates — they're fundamentally rethinking how they approach freight from the ground up.</p>

<h2>Step 1: Audit Your Shipping Spend Before Optimizing Anything</h2>
<p>Most e-commerce businesses have no idea where their shipping money is actually going. Before making any changes, pull 90 days of shipping invoices and break down costs by: carrier, service level (ground vs. express), destination zone, package weight class, and surcharge category. You'll typically find <strong>2-3 areas where you're massively overpaying</strong>.</p>
<ul>
  <li><strong>Zone analysis:</strong> Are you shipping Zone 7-8 packages from a single warehouse? Distributed inventory could save 20-30%</li>
  <li><strong>Surcharge creep:</strong> Residential delivery, fuel, and peak surcharges can add 30-40% to base rates</li>
  <li><strong>DIM weight traps:</strong> Large, lightweight packages are often charged at dimensional weight — packaging optimization alone can save 15-20%</li>
  <li><strong>Service level mismatch:</strong> If customers aren't paying for express, are you defaulting to it? Audit your default service selections</li>
</ul>

<h2>Step 2: Negotiate Carrier Contracts Like a Fortune 500 Company</h2>
<p>Most small and mid-size e-commerce businesses accept the rates carriers offer without negotiating. This is a costly mistake. Even businesses shipping 50-100 packages per day have negotiating leverage — carriers want your volume. Key negotiation points include: base rate discounts, minimum charge reductions, residential surcharge caps, and fuel surcharge table adjustments.</p>
<blockquote>E-commerce brands that renegotiate carrier contracts annually save an average of 11-23% compared to those on auto-renewed rates — Shipware Parcel Spend Analysis, 2024</blockquote>

<h2>Step 3: Build a Multi-Carrier Strategy</h2>
<p>Single-carrier dependency is one of the most expensive mistakes in e-commerce logistics. Using 3-5 carriers and dynamically routing based on zone performance, service type, and current rates can reduce your blended cost-per-shipment by <strong>15-25%</strong>. Regional carriers like OnTrac, LSO, and Spee-Dee often beat national carriers by 20-40% on specific zones.</p>

<h2>Step 4: Use LTL Freight for B2B and Larger Shipments</h2>
<p>If your business ships to retailers, distributors, or fulfillment centers, you should be using LTL (Less-than-Truckload) freight instead of parcel carriers for shipments over 150 lbs. LTL freight is typically <strong>40-65% cheaper per pound</strong> than parcel for heavier shipments. Use a freight marketplace to instantly compare LTL rates from multiple carriers rather than calling brokers.</p>

<h2>Step 5: Optimize Your Packaging for DIM Weight Savings</h2>
<p>Dimensional weight pricing means that large, lightweight boxes cost you based on their size, not their actual weight. Conduct a packaging audit: for every product category, find the smallest box that safely protects the item. Businesses that complete packaging optimization projects typically see <strong>12-18% reductions in their parcel shipping costs</strong> immediately — with no carrier negotiations required.</p>

<h2>Step 6: Distribute Your Inventory Closer to Customers</h2>
<p>Every shipping zone you can eliminate from a typical shipment saves money. If 60% of your customers are on the East Coast but you ship from a single West Coast warehouse, you're paying Zone 7-8 rates for the majority of your orders. Adding a second fulfillment location — even a 3PL — can reduce your average shipping cost by <strong>20-35%</strong> while also improving delivery speed.</p>

<h2>Key Takeaways</h2>
<ul>
  <li>Audit 90 days of shipping data before making any changes — find your biggest waste areas first</li>
  <li>Negotiate carrier contracts annually — even 50 packages/day gives you leverage</li>
  <li>Use 3-5 carriers and dynamically route to cut blended cost-per-shipment by 15-25%</li>
  <li>LTL freight saves 40-65% over parcel for shipments above 150 lbs</li>
  <li>Packaging optimization alone can deliver 12-18% savings with no carrier negotiations</li>
  <li>A second fulfillment location reduces average shipping cost by 20-35% for businesses with distributed customers</li>
</ul>

<h2>Frequently Asked Questions</h2>
<h3>What is DIM weight and how does it affect my shipping costs?</h3>
<p>Dimensional weight (DIM weight) is a pricing method where carriers charge based on package volume rather than actual weight when the package is large but light. The formula is: (length × width × height) ÷ DIM divisor. Using right-sized packaging eliminates this surcharge and can generate immediate savings.</p>

<h3>When should I use LTL freight instead of parcel carriers?</h3>
<p>Generally, shipments over 150 lbs or that require full pallet shipping are cheaper via LTL freight than parcel carriers. For B2B shipments to warehouses or retailers, LTL is almost always the right choice. Use a freight marketplace to compare LTL rates instantly before every large shipment.</p>

<h3>How do I qualify for volume discounts with parcel carriers?</h3>
<p>Volume discounts are primarily negotiated, not automatically applied. Contact your carrier's account management team when you're consistently shipping 50+ packages per day, or use a third-party shipping consultant who negotiates on your behalf and typically shares a portion of the savings.</p>

<h3>Is it worth switching to a freight marketplace for my e-commerce shipping?</h3>
<p>For businesses shipping palletized freight or large/heavy items, a freight marketplace like Loadly offers instant rate comparison from multiple carriers, eliminating broker markups and ensuring you always get competitive market rates. The savings typically justify the switch for any business shipping more than 5-10 freight shipments per month.</p>

<h2>Transform Your E-commerce Shipping Economics</h2>
<p>Loadly's freight marketplace gives e-commerce businesses instant access to competitive LTL and FTL rates from hundreds of verified carriers. Compare rates in seconds, book with confidence, and track your shipments in real time. Start shipping smarter — and profitably — with Loadly.</p>`,
    meta_title: 'E-commerce Freight Cost Reduction Playbook 2025 | Loadly',
    meta_description: 'Cut e-commerce shipping costs by up to 35% in 2025. Complete playbook: carrier negotiation, LTL freight, DIM weight optimization, and multi-carrier strategy.'
  },
  {
    title: 'International Road Freight Documentation Masterclass: CMR, TIR Carnet, and Customs Compliance',
    slug: 'international-road-freight-documentation-cmr-tir-customs-masterclass',
    excerpt: 'A single documentation error in international road freight can cost $3,000+ in delays, fines, and demurrage. This masterclass covers every document you need to cross borders without disruption.',
    content: `<h2>Why Documentation Is the #1 Cause of Border Delays in International Freight</h2>
<p>Border agencies reject or delay <strong>1 in 7 international freight shipments</strong> due to documentation errors — and the average delay costs carriers and shippers between <strong>$1,200 and $4,500</strong> per incident when you factor in demurrage, driver waiting time, expedite fees, and potential cargo spoilage. Getting documentation right is not bureaucratic box-ticking — it is direct profit protection for every party in the supply chain.</p>

<h2>The CMR Consignment Note: Your Most Important Document</h2>
<p>The CMR (Convention on the Contract for the International Carriage of Goods by Road) is the legal backbone of every international road freight shipment. It establishes the contract between shipper, carrier, and consignee, defines liability, and proves the condition of goods at pickup. Always complete it in triplicate: one original for the shipper, one for the consignee, and one that travels with the cargo.</p>
<h3>Critical CMR Fields That Get Missed</h3>
<ul>
  <li><strong>Box 1 (Sender):</strong> Must match exactly with customs export declarations</li>
  <li><strong>Box 13 (Loading instructions):</strong> Missing temperature requirements for reefer cargo cause compliance failures at borders</li>
  <li><strong>Box 21 (Date of takeover):</strong> Must match the actual pickup date — discrepancies trigger customs holds</li>
  <li><strong>Box 23 (Carrier signature):</strong> Often forgotten in rush pickups — without it the CMR is legally void</li>
</ul>
<blockquote>Incomplete CMR notes account for 43% of all documentation-related freight delays at EU external borders — European Freight Transport Association, 2024</blockquote>

<h2>TIR Carnet: The Fast-Track System for Multi-Border Transit</h2>
<p>The TIR (Transports Internationaux Routiers) Carnet is a customs document that allows sealed vehicles to cross multiple international borders with minimal inspection. With <strong>77 member countries</strong> including all EU states, Turkey, Russia, and Central Asian nations, TIR is the most efficient system for transcontinental road freight.</p>
<h3>How TIR Carnet Works in Practice</h3>
<p>The TIR Carnet is a booklet of vouchers — at each border, customs tears out one voucher and retains it, providing a customs chain without requiring bond deposits at each country. This eliminates the need to pay customs duties at transit countries, dramatically reducing crossing times from hours to minutes at participating borders.</p>
<h3>Who Issues TIR Carnets?</h3>
<p>TIR Carnets are issued by national transport associations affiliated with the IRU (International Road Transport Union). In Turkey, this is UND; in Russia, ASMAP; in Germany, BGL. Application processing typically takes <strong>2-5 business days</strong>. Rush processing is available in most countries for an additional fee.</p>

<h2>Dozvola (Transit Permits): The Scarce Resource Every International Carrier Needs</h2>
<p>Transit permits (called "dozvola" in many Eastern European and Central Asian countries) authorize foreign-registered trucks to operate within or transit through a country. They are issued in <strong>strictly limited bilateral quantities</strong> annually — and running out means your trucks are legally grounded until next year's allocation. Permit management is a critical operational function, not an afterthought.</p>
<ul>
  <li>Track permit consumption monthly against projected annual utilization</li>
  <li>Apply for next year's permit allocation in Q3 — not Q4 when shortages become obvious</li>
  <li>Maintain a buffer of 15-20% above projected needs for unexpected demand spikes</li>
  <li>Monitor bilateral trade agreements — new allocations are sometimes released mid-year</li>
</ul>

<h2>e-CMR: The Digital Future of Freight Documentation</h2>
<p>The electronic CMR (e-CMR) is legally valid in <strong>over 30 countries</strong> under the additional protocol to the CMR Convention. e-CMR eliminates paper handling, reduces errors, enables real-time document sharing, and creates an immutable digital audit trail. Countries that currently accept e-CMR include all EU member states, Switzerland, Norway, and several Central Asian nations.</p>

<h2>Key Takeaways</h2>
<ul>
  <li>1 in 7 international shipments is delayed due to documentation errors — costing $1,200-$4,500 per incident</li>
  <li>CMR must be completed in triplicate — missing signatures or dates make it legally void</li>
  <li>TIR Carnet allows multi-border transit in 77 countries with minimal inspection</li>
  <li>Dozvola permits are allocated in limited quantities — apply for next year's allocation in Q3</li>
  <li>e-CMR is legally valid in 30+ countries and eliminates paper handling errors</li>
  <li>Cross-reference all documents before departure — discrepancies between CMR and customs declarations are the most common delay trigger</li>
</ul>

<h2>Frequently Asked Questions</h2>
<h3>What happens if I lose the CMR during transport?</h3>
<p>Contact the shipper immediately to issue a replacement. Without a valid CMR, you cannot prove delivery conditions, and the consignee may legally refuse the load or dispute damage liability. Some carriers mitigate this risk by using e-CMR, which creates a permanent digital record.</p>

<h3>Can I use the same TIR Carnet for multiple journeys?</h3>
<p>No. Each TIR Carnet is valid for a single journey and expires once the final customs office discharges it. However, a carnet booklet contains multiple voucher sets, so it covers all border crossings within that single journey.</p>

<h3>What documents do I need for EU-Turkey road freight?</h3>
<p>You'll need: CMR consignment note, TIR Carnet (or T1 transit document for EU transit), commercial invoice, packing list, EUR.1 or ATR movement certificate (for preferential tariff treatment), and a Dozvola if performing cabotage. Phytosanitary certificates are required for agricultural products.</p>

<h3>How do I check if my destination country accepts e-CMR?</h3>
<p>The IRU (International Road Transport Union) maintains an updated list of e-CMR ratifying countries at their official website. Always verify before your first e-CMR shipment to a new country, as ratification status can change.</p>

<h2>Simplify Your International Freight Operations</h2>
<p>Loadly connects international carriers with verified cross-border freight opportunities and provides documentation checklists for every major trade corridor. Stop losing money to preventable border delays — find your next international load on Loadly and access the compliance resources that keep your trucks moving.</p>`,
    meta_title: 'International Freight Docs: CMR, TIR & Customs Guide | Loadly',
    meta_description: 'Avoid $3,000+ border delays with expert CMR, TIR Carnet, Dozvola, and customs compliance guidance for international road freight carriers.'
  }
];

const blogLanguagesMapping = {
  'English': 'en', 'Turkish': 'tr', 'German': 'de', 'French': 'fr',
  'Spanish': 'es', 'Portuguese': 'pt', 'Italian': 'it', 'Dutch': 'nl',
  'Polish': 'pl', 'Russian': 'ru', 'Ukrainian': 'uk', 'Chinese': 'zh',
  'Japanese': 'ja', 'Hindi': 'hi', 'Arabic': 'ar', 'Persian': 'fa',
  'Korean': 'ko', 'Vietnamese': 'vi', 'Indonesian': 'id', 'Bengali': 'bn',
  'Urdu': 'ur', 'Thai': 'th', 'Malay': 'ms', 'Tagalog': 'tl',
  'Romanian': 'ro', 'Swedish': 'sv', 'Czech': 'cs', 'Hungarian': 'hu',
  'Greek': 'el', 'Azerbaijani': 'az', 'Kazakh': 'kk', 'Hebrew': 'he',
  'Bulgarian': 'bg', 'Croatian': 'hr', 'Serbian': 'sr', 'Slovak': 'sk',
  'Danish': 'da', 'Finnish': 'fi', 'Norwegian': 'no', 'Uzbek': 'uz',
  'Tamil': 'ta', 'Marathi': 'mr', 'Georgian': 'ka', 'Lithuanian': 'lt',
  'Latvian': 'lv', 'Estonian': 'et', 'Slovenian': 'sl'
};

const coverImages = [
  'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1516576885502-d4c30954e73b?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1519003722824-192514ad9360?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1606185540834-d6e40b208b45?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1620052581237-5d36667be337?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1594514336792-b2d28565a044?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1549194388-f61be84a6e9e?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1551524559-8af4e6624178?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1585713181935-d5f622cc2415?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1618042164219-62c820f10723?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1569003339405-ea396a5a8a90?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1512758017271-d7b84c2113f1?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=800'
];

function checkImageUrl(url) {
  return new Promise((resolve) => {
    try {
      const parsedUrl = new URL(url);
      const req = https.request({
        method: 'HEAD',
        hostname: parsedUrl.hostname,
        path: parsedUrl.pathname + parsedUrl.search,
        timeout: 5000
      }, (res) => {
        resolve(res.statusCode >= 200 && res.statusCode < 400);
      });
      req.on('error', () => resolve(false));
      req.on('timeout', () => { req.destroy(); resolve(false); });
      req.end();
    } catch {
      resolve(false);
    }
  });
}

async function getUsedCoverImages() {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('cover_image')
      .not('cover_image', 'is', null);
    if (error || !data) return new Set();
    return new Set(data.map(p => p.cover_image));
  } catch (err) {
    console.warn('getUsedCoverImages error:', err.message);
    return new Set();
  }
}

async function getValidatedCoverImage() {
  const usedImages = await getUsedCoverImages();

  try {
    const keywords = ['truck', 'freight', 'logistics', 'cargo', 'shipping', 'warehouse', 'transportation'];
    
    // Güvenlik amaçlı sonsuz döngüyü engellemek için maksimum 10 deneme
    for (let attempts = 0; attempts < 10; attempts++) {
      const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)];
      const lockId = Math.floor(Math.random() * 1000000);
      const loremUrl = `https://loremflickr.com/1200/630/${randomKeyword}?lock=${lockId}`;
      
      const resolvedUrl = await new Promise((resolve) => {
        const req = https.get(loremUrl, (res) => {
          if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            resolve(res.headers.location);
          } else {
            resolve(loremUrl);
          }
        });
        req.on('error', () => resolve(null));
      });

      if (resolvedUrl && !usedImages.has(resolvedUrl)) {
        console.log(`[Image Dedup] 100% Unique cover image validated: ${resolvedUrl}`);
        return resolvedUrl;
      } else {
        console.log(`[Image Dedup] Image already used or invalid, retrying... (${attempts + 1}/10)`);
      }
    }
  } catch (err) {
    console.warn('[Image Dedup] Failed dynamic image loop, falling back to static pool:', err.message);
  }

  // Fallback to static pool
  const unusedImages = coverImages.filter(url => !usedImages.has(url));
  const candidatePool = unusedImages.length > 0 ? unusedImages : coverImages;
  if (unusedImages.length === 0) {
    console.warn('[Image Dedup] All static images used at least once. Recycling from full pool.');
  }
  const shuffled = [...candidatePool].sort(() => 0.5 - Math.random());
  for (let i = 0; i < Math.min(5, shuffled.length); i++) {
    const imgUrl = shuffled[i];
    const isValid = await checkImageUrl(imgUrl);
    if (isValid) return imgUrl;
  }
  return candidatePool[0];
}

function translateText(text, targetLang) {
  return new Promise((resolve, reject) => {
    if (!text || text.trim() === '') { resolve(''); return; }
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed && parsed[0]) {
            resolve(parsed[0].map(item => item[0]).join(''));
          } else {
            reject(new Error('Invalid response from Google Translate'));
          }
        } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

async function translateHtml(html, targetLang) {
  if (!html || html.trim() === '') return '';
  const tags = [];
  const placeholderText = html.replace(/<[^>]+>/g, (match) => {
    tags.push(match);
    return ` {${tags.length - 1}} `;
  });
  const translatedText = await translateText(placeholderText, targetLang);
  let restoredHtml = translatedText;
  for (let i = 0; i < tags.length; i++) {
    const regex = new RegExp(`\\{\\s*${i}\\s*\\}`, 'g');
    restoredHtml = restoredHtml.replace(regex, tags[i]);
  }
  return restoredHtml;
}

async function translatePostUsingGoogle(basePost, targetLangCode) {
  const title = await translateText(basePost.title, targetLangCode);
  const excerpt = await translateText(basePost.excerpt, targetLangCode);
  const content = await translateHtml(basePost.content, targetLangCode);
  const meta_title = await translateText(basePost.meta_title, targetLangCode);
  const meta_description = await translateText(basePost.meta_description, targetLangCode);
  return {
    title: title.trim(),
    excerpt: excerpt.trim(),
    content: content.trim(),
    meta_title: meta_title.trim(),
    meta_description: meta_description.trim()
  };
}

function makeGeminiRequest(payload) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'generativelanguage.googleapis.com',
      port: 443,
      path: `/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (res.statusCode !== 200) {
            reject({ statusCode: res.statusCode, message: parsed.error?.message || data, raw: data });
            return;
          }
          const textResponse = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
          if (!textResponse) {
            reject(new Error('Empty response from Gemini API'));
            return;
          }
          resolve(JSON.parse(textResponse));
        } catch (e) {
          reject(new Error(`Failed to parse Gemini output: ${e.message}. Raw: ${data.slice(0, 500)}`));
        }
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function callGeminiWithRetry(payload, maxRetries = 3) {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      return await makeGeminiRequest(payload);
    } catch (err) {
      attempt++;
      const isRateLimit = err.statusCode === 429 || (err.message && (err.message.includes('429') || err.message.includes('quota')));
      if (isRateLimit && attempt < maxRetries) {
        console.warn(`[429 Rate Limit] Waiting 45s before retry ${attempt}/${maxRetries}...`);
        await sleep(45000);
      } else if (attempt < maxRetries) {
        console.warn(`[API Error] Status: ${err.statusCode || 'unknown'}, Msg: ${err.message}. Waiting 5s before retry ${attempt}/${maxRetries}...`);
        await sleep(5000);
      } else {
        throw new Error(err.message || JSON.stringify(err));
      }
    }
  }
}

// ─── TOPIC BANK SYSTEM (Supabase) ────────────────────────────────────────────
// Stores pre-generated topics in Supabase so they survive deploys.
// Gemini is called once to generate 30 topics in batch.
// Each run pops one unused topic — guarantees uniqueness forever.
// Auto-refills when fewer than BANK_REFILL_THRESHOLD topics remain.

const BANK_BATCH_SIZE = 30;
const BANK_REFILL_THRESHOLD = 8;

async function getBankCount() {
  const { count } = await supabase
    .from('topic_bank')
    .select('*', { count: 'exact', head: true })
    .eq('is_used', false);
  return count || 0;
}

async function popTopicFromBank() {
  const { data, error } = await supabase
    .from('topic_bank')
    .select('*')
    .eq('is_used', false)
    .order('generated_at', { ascending: true })
    .limit(1)
    .maybeSingle();
  if (error || !data) return null;
  await supabase.from('topic_bank').update({ is_used: true }).eq('id', data.id);
  return data;
}

async function refillTopicBank(recentTitles) {
  console.log(`[Bank] Refilling — generating ${BANK_BATCH_SIZE} unique topics in one batch...`);

  const { data: bankTopics } = await supabase
    .from('topic_bank')
    .select('topic')
    .eq('is_used', false);

  const pendingTopics = (bankTopics || []).map(t => t.topic);
  const allExisting = [...recentTitles, ...pendingTopics];
  const existingList = allExisting.slice(0, 130).map(t => `- ${t}`).join('\n') || '- (none yet)';

  const clusterNames = topicClusters.map(c => c.name).join('\n');
  const audienceNames = audienceProfiles.map(a => a.name).join(', ');
  const formatNames = contentFormats.map(f => f.type).join(', ');

  const payload = JSON.stringify({
    contents: [{
      parts: [{
        text: `You are the chief content strategist at Loadly, a global digital freight marketplace.

Generate exactly ${BANK_BATCH_SIZE} completely unique, diverse, high-traffic blog topic ideas for our content calendar.

CRITICAL UNIQUENESS RULES:
- Every topic must be 100% different from each other (no two topics in the same narrow sub-niche)
- Zero overlap, rephrasing, or adjacent coverage of ANY topic in the existing list below
- Spread across as many DIFFERENT clusters as possible — aim for ${BANK_BATCH_SIZE} different clusters
- Each must target a DIFFERENT primary keyword

EXISTING TOPICS TO AVOID (do not duplicate or rephrase ANY of these):
${existingList}

AVAILABLE TOPIC CLUSTERS (distribute across as many as possible):
${clusterNames}

TARGET AUDIENCES (vary across topics):
${audienceNames}

CONTENT FORMATS (vary across topics):
${formatNames}

TRAFFIC QUALITY REQUIREMENTS for each topic:
1. Must address a real, painful problem the audience actively searches for
2. Primary keyword must be something people type verbatim into Google or AI assistants
3. Specific compelling angle — NOT "shipping tips", YES "Why 73% of LTL Claims Get Denied (And the Fix)"
4. Relevant to 2025 freight industry realities
5. Viral potential: data insight, counterintuitive finding, urgent problem, or insider knowledge

For each topic return:
- topic: Compelling title (keyword-rich, max 80 chars)
- primaryKeyword: Main 2-5 word SEO keyword
- cluster: Exact cluster name from the list above
- audience: Exact audience name from the list above
- audiencePainPoints: 1-2 specific pain points this addresses
- searchIntent: informational | commercial | transactional
- viralAngle: What makes this genuinely share-worthy (be specific)
- contentFormat: Exact format name from the list above

Return ONLY a valid JSON array of exactly ${BANK_BATCH_SIZE} objects. No markdown, no extra text.`
      }]
    }],
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'ARRAY',
        items: {
          type: 'OBJECT',
          properties: {
            topic: { type: 'STRING' },
            primaryKeyword: { type: 'STRING' },
            cluster: { type: 'STRING' },
            audience: { type: 'STRING' },
            audiencePainPoints: { type: 'STRING' },
            searchIntent: { type: 'STRING' },
            viralAngle: { type: 'STRING' },
            contentFormat: { type: 'STRING' }
          },
          required: ['topic', 'primaryKeyword', 'cluster', 'audience', 'searchIntent', 'viralAngle', 'contentFormat']
        }
      }
    }
  });

  const topics = await callGeminiWithRetry(payload);

  const rows = topics.map(t => ({
    topic: t.topic,
    primary_keyword: t.primaryKeyword,
    cluster: t.cluster,
    audience: t.audience,
    audience_pain_points: t.audiencePainPoints || '',
    search_intent: t.searchIntent,
    viral_angle: t.viralAngle,
    content_format: t.contentFormat,
    is_used: false
  }));

  const { error } = await supabase.from('topic_bank').insert(rows);
  if (error) throw new Error(`[Bank] Supabase insert failed: ${error.message}`);

  console.log(`[Bank] Added ${rows.length} topics to Supabase. Waiting 65s for rate limit reset...`);
  await sleep(65000);
}

// Fetch recent post titles from DB to provide uniqueness context to Gemini
async function getRecentTopics(limit = 150) {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('title')
      .eq('language', 'en')
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error || !data) return [];
    return data.map(p => p.title);
  } catch (err) {
    console.warn('getRecentTopics error:', err.message);
    return [];
  }
}

// Pop the next unique topic from the bank (refills automatically when low)
async function generateFreshTopic(recentTopics) {
  if (!geminiApiKey) throw new Error('GEMINI_API_KEY not set');

  const remaining = await getBankCount();
  console.log(`[Bank] ${remaining} unused topics in Supabase bank`);

  if (remaining < BANK_REFILL_THRESHOLD) {
    console.log(`[Bank] Below threshold (${BANK_REFILL_THRESHOLD}) — triggering refill`);
    await refillTopicBank(recentTopics);
  }

  const topicData = await popTopicFromBank();
  if (!topicData) throw new Error('[Bank] No topics available even after refill');

  console.log(`[Bank] Using topic: "${topicData.topic}"`);
  console.log(`[Bank] Cluster: "${topicData.cluster}" | Format: "${topicData.content_format}"`);
  console.log(`[Bank] Audience: "${topicData.audience}" | Keyword: "${topicData.primary_keyword}"`);
  console.log(`[Bank] Viral angle: ${topicData.viral_angle}`);

  const audienceProfile = audienceProfiles.find(a => a.name === topicData.audience) || audienceProfiles[0];
  const formatSpec = contentFormats.find(f => f.type === topicData.content_format) || contentFormats[0];

  return {
    topic: topicData.topic,
    audience: topicData.audience,
    primaryKeyword: topicData.primary_keyword,
    searchIntent: topicData.search_intent,
    viralAngle: topicData.viral_angle,
    contentFormat: topicData.content_format,
    topicCluster: topicData.cluster,
    audienceProfile,
    formatSpec
  };
}

// Generate the full viral SEO/AEO/GEO blog post using the topic data
function generateBasePost(topicData) {
  if (!geminiApiKey) return Promise.reject(new Error('GEMINI_API_KEY is not defined'));

  const { topic, audience, primaryKeyword, searchIntent, viralAngle, audienceProfile, formatSpec, topicCluster, contentFormat } = topicData;
  const minWords = formatSpec?.minWords || 2000;
  const formatDesc = formatSpec?.description || 'comprehensive expert guide';

  const payload = JSON.stringify({
    contents: [{
      parts: [{
        text: `You are a veteran freight industry expert and editorial director at Loadly — a global digital freight marketplace. You have spent 15+ years in the field: as a dispatcher, a freight broker, an owner-operator, and a logistics manager. You write from real experience, not theory. Your readers are working professionals who can instantly detect generic AI content and click away. They stay only when they learn something specific, surprising, or immediately actionable that they couldn't find anywhere else.

THE READER COMES FIRST. Before writing any sentence, ask: "Does this help the reader solve a real problem right now?" If the answer is no, don't write it.

Write the article below with these specifications:

TOPIC: "${topic}"
PRIMARY KEYWORD: "${primaryKeyword}"
TARGET AUDIENCE: ${audience}
THEIR REAL PAIN POINTS: ${audienceProfile?.painPoints || 'logistics cost, efficiency, compliance, reliability'}
SEARCH INTENT: ${searchIntent}
VIRAL ANGLE: ${viralAngle}
CONTENT FORMAT: ${contentFormat || formatSpec?.type} — ${formatDesc}
TOPIC CLUSTER: ${topicCluster}
PLATFORM: Loadly (digital freight marketplace connecting shippers, carriers and truck drivers worldwide)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AUDIENCE-FIRST WRITING RULES (non-negotiable)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. WRITE FOR ONE PERSON: Picture a specific reader — e.g., a 42-year-old owner-operator sitting in a truck stop at 10pm, worried about cash flow after a slow week. Write to solve HIS exact problem.
2. NO GENERIC ADVICE: "Plan ahead," "communicate clearly," "track your metrics" are filler. Replace every vague tip with a specific, implementable action: what exactly to do, what tool to use, what number to aim for.
3. INCLUDE INSIDER KNOWLEDGE: Every section must contain at least one insight that a reader would only know if they'd actually worked in this industry — something that makes them think "I never thought of it that way."
4. USE REAL NUMBERS: Not "significant savings" — say "$1,840 per truck per year." Not "faster delivery" — say "2.3 days faster on average." Specific numbers are what get cited by AI and shared by professionals.
5. CONTROVERSIAL WHEN WARRANTED: If the conventional wisdom is wrong or incomplete, say so directly. Readers share content that challenges what they thought they knew.
6. NARRATIVE PULL: Open with a scenario, problem, or statistic so specific that the reader immediately thinks "this is about me." End each section making them want to read the next one.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TITLE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Choose the formula that best fits the topic and content format:
• "[Number] [Power Word] [Topic] Every [Audience] Needs in 2025"
• "The [Format]: How to [Achieve Benefit] Without [Pain Point]"
• "Why [Common Belief] Is [Wrong/Outdated/Costing You] in 2025"
• "[Specific Problem]: Causes, Real Costs & the Expert Fix"
• "What [Trend/Change] Means for [Audience] Right Now"
• "The [Year] [Topic] Playbook: [Specific Outcome Promised]"

Rules: primary keyword included naturally, max 70 chars, creates urgency or promises specific value.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HTML STRUCTURE (strict)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Use ONLY these HTML tags. No markdown, no code fences, no html/head/body wrappers:
<h2> main sections (6-8 total) | <h3> subsections | <p> paragraphs (3-5 sentences)
<ul><li> bullet lists | <ol><li> numbered steps | <strong> key data/terms
<blockquote> cited statistics and expert quotes | <table><tr><th><td> for comparisons

MINIMUM ${minWords} words of substantive expert content. No filler. Every sentence earns its place.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MANDATORY SECTIONS (in this order)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**1. QUICK ANSWER BOX** (AEO — for AI assistants and featured snippets)
Open with a <p> starting with: "<strong>Quick Answer:</strong>" followed by a 40-60 word direct answer to the primary question this article addresses. This is what Google's AI Overview and ChatGPT will pull. Make it complete enough to stand alone.

**2. HOOK PARAGRAPH**
Immediately after Quick Answer, one <p> with a shocking specific statistic OR a concrete scenario that makes the reader feel "this is my exact problem." Must create urgency in the first 2 sentences.

**3. PROBLEM DEEP-DIVE** (1-2 <h2> sections)
Authoritative analysis: root causes, quantified costs, why most people fail here. Show expertise. Use specific numbers. Cite realistic sources in <blockquote> format: "According to [Organization/Report], [specific finding] — [Year]"

**4. SOLUTION SECTIONS** (3-5 <h2> sections matching the content format)
Deep, implementable advice — not generic tips. Each section must:
- Open with a clear, expert claim
- Include specific numbered steps or criteria where relevant
- Contain at least one data point or case example
- Target a related long-tail keyword in the heading

**5. COMPARISON TABLE** (if format is Comparison/Checklist/Decision Guide)
Use <table> to compare options, tools, or approaches across 3-5 criteria.

**6. KEY TAKEAWAYS** (<h2>Key Takeaways</h2>)
<ul> with 6-8 crisp, actionable bullets. Each one should be valuable enough to share on its own.

**7. FAQ SECTION** (<h2>Frequently Asked Questions</h2>) — AEO CRITICAL
Minimum 5 Q&A pairs structured for voice search and People Also Ask:
- <h3> questions: Write as exact natural-language queries (e.g., "How much does LTL freight cost per mile in 2025?")
- <p> answers: Start with a direct 1-sentence answer, then 2-3 sentences of supporting detail. Must be self-contained — AI assistants extract these verbatim.
- Cover: what is X, how to X, how much does X cost, when should I X, what is the difference between X and Y

**8. CTA CONCLUSION** (<h2> with keyword in heading)
Don't pitch Loadly — show how Loadly solves the specific problem the reader just read about. Write it like a trusted colleague saying "by the way, this tool helped me with exactly that." One clear call to action at the end.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
QUALITY ANTI-PATTERNS (these will get the article rejected)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NEVER write these generic phrases — replace every instance with specifics:
✗ "It's important to..." → ✓ "This costs carriers an average of $X per year because..."
✗ "Many companies struggle with..." → ✓ "73% of carriers report that..."
✗ "Consider your options carefully" → ✓ "Compare [Option A] vs [Option B]: use A when X, use B when Y"
✗ "Effective communication is key" → ✓ "Send a check-call every 2 hours on live loads — shippers who require this pay 8% higher rates"
✗ "There are several factors to consider" → ✓ List exactly what those factors are with weights/criteria
✗ Vague statistics like "many," "most," "significantly" → Always use precise numbers
✗ Sections that could appear in ANY logistics article → Every section must be specific to THIS topic

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SEO OPTIMIZATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Primary keyword: in title, Quick Answer, first <h2>, at least 2 other headings, conclusion
- LSI keywords: weave semantic variants naturally (e.g., for "LTL freight": less-than-truckload, pallet shipping, freight class, LTL rates)
- Each <h2> targets a distinct long-tail query variant from Google's People Also Ask
- Featured snippet optimization: some sections open with a 1-sentence direct answer before elaborating
- Schema-ready FAQ: questions phrased exactly as people type/speak them

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GEO OPTIMIZATION (Generative Engine Optimization)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AI assistants cite content that looks authoritative and structured. To get cited:
- Open with first-person authority signals: "In our analysis of...", "Based on data from thousands of Loadly shipments...", "Freight professionals consistently tell us..."
- Include at least 6 statistics in <blockquote> with attribution: "According to [Organization], [specific finding] — [Year]"
- Define key terms at first use — AI extracts definitions ("LTL freight, or Less-than-Truckload shipping, refers to...")
- Use precise figures, not ranges: $1,847 not "around $2,000"; 14.3% not "about 15%"
- Entity density: specific company names, regulation codes, industry body abbreviations, named trade routes
- Conclude sections with a summary sentence AI can extract as a standalone fact

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
E-E-A-T SIGNALS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Name specific regulations: 49 CFR Part 395, ELD mandate, Carmack Amendment, FMCSA SMS, ADR 2025
- Reference industry bodies: ATA, TIA, FMCSA, OOIDA, IRU, IATA, NRF, CSCMP
- Include "what most professionals miss" moments — insider knowledge that signals real experience
- Contradict a common mistake the target audience makes — this builds trust faster than agreeing with them
- No hedging: write "you must," "carriers that do X earn 23% more," not "you might want to consider possibly"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
METADATA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- slug: primary-keyword-first, lowercase, hyphens only (e.g., "ltl-freight-cost-guide-2025")
- meta_title: primary keyword first, max 60 chars, end with "| Loadly"
- meta_description: primary keyword + specific measurable benefit + soft CTA, max 155 chars
- excerpt: 2 punchy sentences — first names the problem with a specific number, second states exactly what the reader will learn. Include primary keyword.

Return ONLY valid JSON with no additional text or markdown wrappers.`
      }]
    }],
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'OBJECT',
        properties: {
          title: { type: 'STRING' },
          slug: { type: 'STRING' },
          excerpt: { type: 'STRING' },
          content: { type: 'STRING' },
          meta_title: { type: 'STRING' },
          meta_description: { type: 'STRING' }
        },
        required: ['title', 'slug', 'excerpt', 'content', 'meta_title', 'meta_description']
      }
    }
  });

  return callGeminiWithRetry(payload);
}

async function runBlogGenerator() {
  console.log('Starting Viral SEO Multilingual Blog Generator...');

  // Verify author profile exists
  console.log(`Verifying author profile ID: ${defaultAuthorId}`);
  const { data: profile, error: pError } = await supabase
    .from('public_profiles')
    .select('id')
    .eq('id', defaultAuthorId)
    .maybeSingle();

  let activeAuthorId = defaultAuthorId;
  if (pError || !profile) {
    const { data: fallbackProfile } = await supabase
      .from('public_profiles')
      .select('id')
      .eq('role', 'shipper')
      .limit(1)
      .maybeSingle();
    if (fallbackProfile) {
      activeAuthorId = fallbackProfile.id;
    } else {
      console.error('CRITICAL: No profiles exist in database to assign as author!');
      process.exit(1);
    }
  }

  // 1. Generate/Select Base Article
  let basePost;
  let baseLanguage = 'en';

  if (geminiApiKey) {
    try {
      // Fetch recent topics for uniqueness context
      const recentTopics = await getRecentTopics(150);
      console.log(`[Dedup] Loaded ${recentTopics.length} recent topics for uniqueness check`);

      // Dynamically generate a fresh, unique topic using AI
      const topicData = await generateFreshTopic(recentTopics);

      console.log(`Generating viral SEO article for topic: "${topicData.topic}"`);
      basePost = await generateBasePost(topicData);
      baseLanguage = 'en';
    } catch (e) {
      console.error('Failed to generate AI article. Falling back to curated library...', e.message);
      const local = fallbackArticles[Math.floor(Math.random() * fallbackArticles.length)];
      basePost = {
        title: local.title,
        slug: local.slug,
        excerpt: local.excerpt,
        content: local.content,
        meta_title: local.meta_title,
        meta_description: local.meta_description
      };
      baseLanguage = 'en';
    }
  } else {
    console.log('Library Mode: Selecting article from curated fallback library...');
    const local = fallbackArticles[Math.floor(Math.random() * fallbackArticles.length)];
    basePost = {
      title: local.title,
      slug: local.slug,
      excerpt: local.excerpt,
      content: local.content,
      meta_title: local.meta_title,
      meta_description: local.meta_description
    };
    baseLanguage = 'en';
  }

  // Sanitize base slug
  let baseSlug = basePost.slug.toLowerCase().trim()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  // Verify slug uniqueness in database across ALL language variants
  const { data: existingPosts } = await supabase
    .from('blog_posts')
    .select('id')
    .ilike('slug', `${baseSlug}-%`)
    .limit(1);

  if (existingPosts && existingPosts.length > 0) {
    const uniqueSuffix = Math.floor(1000 + Math.random() * 9000);
    baseSlug = `${baseSlug}-${uniqueSuffix}`;
    console.log(`Slug base "${baseSlug.split('-').slice(0, -1).join('-')}" already exists in some languages. New base slug: "${baseSlug}"`);
  }

  // Ensure title uniqueness (case-insensitive)
  let baseTitle = basePost.title.trim();
  const { data: titleExists } = await supabase
    .from('blog_posts')
    .select('id')
    .ilike('title', baseTitle)
    .maybeSingle();
  if (titleExists) {
    const titleSuffix = Math.floor(1000 + Math.random() * 9000);
    baseTitle = `${baseTitle} ${titleSuffix}`;
    console.log(`Title duplicate found. Modified to: "${baseTitle}"`);
  }
  basePost.title = baseTitle;

  // 2. Translate into all target languages using Google Translate
  const targetLanguages = Object.entries(blogLanguagesMapping).filter(([, code]) => code !== baseLanguage);
  const translatedPosts = [];

  console.log(`Translating base post into ${targetLanguages.length} languages (concurrency: 5)...`);

  const tasks = targetLanguages.map(([langName, langCode]) => async () => {
    try {
      console.log(`Translating to ${langName} (${langCode})...`);
      const translation = await translatePostUsingGoogle(basePost, langCode);
      translatedPosts.push({ ...translation, langCode });
      console.log(`✓ ${langName} (${langCode})`);
    } catch (err) {
      console.error(`❌ Translation failed for ${langName} (${langCode}). Skipping — do NOT insert English content with wrong language code.`, err.message);
    }
  });

  await runWithConcurrency(tasks, 5);

  // 3. Pick and validate unique cover image
  const coverImage = await getValidatedCoverImage();

  // 4. Build bulk insert list
  const postsToInsert = [];

  postsToInsert.push({
    title: basePost.title,
    slug: `${baseSlug}-${baseLanguage}`,
    excerpt: basePost.excerpt,
    content: basePost.content,
    cover_image: coverImage,
    author_id: activeAuthorId,
    published: true,
    language: baseLanguage,
    meta_title: basePost.meta_title,
    meta_description: basePost.meta_description
  });

  for (const trans of translatedPosts) {
    postsToInsert.push({
      title: trans.title,
      slug: `${baseSlug}-${trans.langCode}`,
      excerpt: trans.excerpt,
      content: trans.content,
      cover_image: coverImage,
      author_id: activeAuthorId,
      published: true,
      language: trans.langCode,
      meta_title: trans.meta_title,
      meta_description: trans.meta_description
    });
  }

  // 5. Bulk insert
  console.log(`Publishing ${postsToInsert.length} multilingual posts to database...`);
  const { data: insertedPosts, error: insertError } = await supabase
    .from('blog_posts')
    .insert(postsToInsert)
    .select('*');

  if (insertError) {
    console.error('Failed to insert blog posts:', insertError);
    throw new Error(`DB Bulk Insert Error: ${insertError.message}`);
  }

  console.log(`Successfully published ${insertedPosts.length} blog post translations! Base slug: "${baseSlug}"`);
  return insertedPosts;
}

// Execute if run directly
if (require.main === module) {
  (async () => {
    if (!serviceKey && process.env.SCRAPER_USER_EMAIL && process.env.SCRAPER_USER_PASSWORD) {
      console.log('Logging in to Supabase...');
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: process.env.SCRAPER_USER_EMAIL,
        password: process.env.SCRAPER_USER_PASSWORD
      });
      if (authError) console.error('Login failed:', authError.message);
    }
    await runBlogGenerator();
    process.exit(0);
  })().catch(e => {
    console.error('Fatal Blog Generator Error:', e);
    process.exit(1);
  });
}

module.exports = { runBlogGenerator };
