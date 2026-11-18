const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const env = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
const supabaseUrl = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1].trim();
const supabaseKey = (env.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/) || env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/))[1].trim();
const supabase = createClient(supabaseUrl, supabaseKey);

const EDITS = [
  // 1. Boost pre-employment-screening-program (PSP)
  {
    sourceSlug: 'driver-qualification-file-391-51-contents-retention-en',
    targetSlug: 'pre-employment-screening-program-psp-mvr-background-en',
    linkHtml: '<p>When assembling the initial safety performance history, motor carriers routinely request crash and inspection histories through the <a href="/en/blog/pre-employment-screening-program-psp-mvr-background-en">FMCSA Pre-Employment Screening Program (PSP) alongside state MVR background records</a>.</p>'
  },
  {
    sourceSlug: 'how-to-check-a-trucking-company-before-hiring-en',
    targetSlug: 'pre-employment-screening-program-psp-mvr-background-en',
    linkHtml: '<p>Shippers and brokers auditing safety practices also check whether carriers screen commercial operators using the <a href="/en/blog/pre-employment-screening-program-psp-mvr-background-en">Pre-Employment Screening Program (PSP)</a> before assigning loads.</p>'
  },

  // 2. Boost eld-mandate-exemptions
  {
    sourceSlug: 'hours-of-service-limits-property-carrying-drivers-en',
    targetSlug: 'eld-mandate-exemptions-malfunction-procedures-en',
    linkHtml: '<p>To ensure duty records are logged without manual paper falsification, property-carrying operators must understand the <a href="/en/blog/eld-mandate-exemptions-malfunction-procedures-en">federal ELD mandate exemptions and electronic logging malfunction procedures</a>.</p>'
  },
  {
    sourceSlug: 'box-truck-cargo-van-pickup-federal-rules-by-weight-en',
    targetSlug: 'eld-mandate-exemptions-malfunction-procedures-en',
    linkHtml: '<p>Drivers crossing state lines outside the short-haul exception or driving pre-2000 model engines should review the specific <a href="/en/blog/eld-mandate-exemptions-malfunction-procedures-en">ELD mandate exemptions</a> governing property vehicles.</p>'
  },

  // 3. Boost bona-fide-freight-dispatcher
  {
    sourceSlug: 'what-is-a-freight-broker-legal-definition-requirements-en',
    targetSlug: 'bona-fide-freight-dispatcher-vs-unauthorized-broker-en',
    linkHtml: '<p>To distinguish legal dispatch operations representing motor carriers from illicit brokering without operating authority, read our comparison of <a href="/en/blog/bona-fide-freight-dispatcher-vs-unauthorized-broker-en">bona fide freight dispatchers versus unauthorized brokers</a>.</p>'
  },
  {
    sourceSlug: 'how-to-check-a-trucking-company-before-hiring-en',
    targetSlug: 'bona-fide-freight-dispatcher-vs-unauthorized-broker-en',
    linkHtml: '<p>Always confirm that third-party representatives hold independent broker authority rather than functioning as an <a href="/en/blog/bona-fide-freight-dispatcher-vs-unauthorized-broker-en">unauthorized freight broker</a> without financial security.</p>'
  },

  // 4. Boost cvsa-out-of-service-criteria
  {
    sourceSlug: 'eld-mandate-exemptions-malfunction-procedures-en',
    targetSlug: 'cvsa-out-of-service-criteria-mechanisms-decals-en',
    linkHtml: '<p>Drivers unable to produce eight consecutive days of electronic logs during roadside audits face immediate shutdown under the <a href="/en/blog/cvsa-out-of-service-criteria-mechanisms-decals-en">CVSA North American Standard Out-of-Service Criteria</a>.</p>'
  },
  {
    sourceSlug: 'cargo-securement-tiedowns-working-load-limit-en',
    targetSlug: 'cvsa-out-of-service-criteria-mechanisms-decals-en',
    linkHtml: '<p>Damaged webbing or insufficient working load limits trigger immediate vehicle grounding under <a href="/en/blog/cvsa-out-of-service-criteria-mechanisms-decals-en">CVSA roadside out-of-service inspection criteria</a>.</p>'
  },

  // 5. Boost importer-security-filing-isf
  {
    sourceSlug: 'freight-claims-deadlines-carrier-duties-en',
    targetSlug: 'importer-security-filing-isf-10-2-what-when-who-en',
    linkHtml: '<p>For containerized ocean shipments destined for domestic drayage linehaul, customs non-compliance under <a href="/en/blog/importer-security-filing-isf-10-2-what-when-who-en">Importer Security Filing (ISF 10+2) rules</a> often results in cargo holds that complicate delivery claims.</p>'
  },

  // 6. Boost freight-factoring
  {
    sourceSlug: 'truck-driver-pay-bls-data-pay-methods-en',
    targetSlug: 'freight-factoring-explained-selling-invoices-en',
    linkHtml: '<p>Owner-operators bridging the payment gap between invoice submission and 30-day broker settlement often use <a href="/en/blog/freight-factoring-explained-selling-invoices-en">freight factoring to advance freight invoices</a>.</p>'
  },
  {
    sourceSlug: 'freight-broker-bond-bmc-84-trust-fund-explained-en',
    targetSlug: 'freight-factoring-explained-selling-invoices-en',
    linkHtml: '<p>Factoring companies evaluate broker creditworthiness by verifying active status under the <a href="/en/blog/freight-broker-bond-bmc-84-trust-fund-explained-en">BMC-84 freight broker bond</a> before advancing funds against pending bills of lading.</p>'
  },

  // 7. Boost truck-driver-pay
  {
    sourceSlug: 'truck-dispatcher-role-federal-rules-dispatching-en',
    targetSlug: 'truck-driver-pay-bls-data-pay-methods-en',
    linkHtml: '<p>Negotiating spot market rates effectively requires understanding operating margins and official <a href="/en/blog/truck-driver-pay-bls-data-pay-methods-en">truck driver pay methods and BLS wage data</a>.</p>'
  },
  {
    sourceSlug: 'hours-of-service-limits-property-carrying-drivers-en',
    targetSlug: 'truck-driver-pay-bls-data-pay-methods-en',
    linkHtml: '<p>Detention time spent waiting at shipper docks directly impacts hourly earnings; see our detailed breakdown of <a href="/en/blog/truck-driver-pay-bls-data-pay-methods-en">truck driver pay structures and mileage compensation models</a>.</p>'
  },

  // 8. Boost freight-and-trucking-terms-glossary
  {
    sourceSlug: 'cdl-classes-and-endorsements-explained-en',
    targetSlug: 'freight-and-trucking-terms-glossary-federal-definitions-en',
    linkHtml: '<p>For statutory definitions across commercial motor vehicles, trailers, and interstate commerce, reference our <a href="/en/blog/freight-and-trucking-terms-glossary-federal-definitions-en">freight and trucking terms glossary of federal definitions</a>.</p>'
  },
  {
    sourceSlug: 'box-truck-cargo-van-pickup-federal-rules-by-weight-en',
    targetSlug: 'freight-and-trucking-terms-glossary-federal-definitions-en',
    linkHtml: '<p>Federal distinctions between private and for-hire motor carriers are codified in the <a href="/en/blog/freight-and-trucking-terms-glossary-federal-definitions-en">freight terms glossary under 49 U.S.C. 13102</a>.</p>'
  },

  // 9. Boost hazmat-placarding-tables
  {
    sourceSlug: 'cdl-classes-and-endorsements-explained-en',
    targetSlug: 'hazmat-placarding-tables-1001-pound-rule-en',
    linkHtml: '<p>Operators hauling materials requiring safety placards under 49 CFR 172 must obtain the Hazardous Materials (H) endorsement; consult our guide on <a href="/en/blog/hazmat-placarding-tables-1001-pound-rule-en">hazmat placarding tables and the 1,001-pound aggregate rule</a>.</p>'
  },
  {
    sourceSlug: 'box-truck-cargo-van-pickup-federal-rules-by-weight-en',
    targetSlug: 'hazmat-placarding-tables-1001-pound-rule-en',
    linkHtml: '<p>Even small vehicles under 10,001 pounds become subject to full FMCSR safety oversight if placarded; see our guide on <a href="/en/blog/hazmat-placarding-tables-1001-pound-rule-en">the 1,001-pound hazmat placarding rule</a>.</p>'
  },

  // 10. Tools links from relevant articles
  {
    sourceSlug: 'federal-axle-weight-limits-bridge-formula-en',
    targetSlug: '/en/tools/bridge-formula-calculator',
    linkHtml: '<p>To calculate allowable gross weight on any axle spacing combination instantly, use our interactive <a href="/en/tools/bridge-formula-calculator">Federal Bridge Formula Calculator</a>.</p>'
  },
  {
    sourceSlug: 'ltl-freight-class-density-calculation-en',
    targetSlug: '/en/tools/ltl-density-calculator',
    linkHtml: '<p>Calculate your shipment pounds per cubic foot and estimated NMFC freight class using our <a href="/en/tools/ltl-density-calculator">free LTL Density Calculator</a>.</p>'
  },
  {
    sourceSlug: 'hours-of-service-limits-property-carrying-drivers-en',
    targetSlug: '/en/tools/detention-fee-calculator',
    linkHtml: '<p>Track layover and detention billing beyond free time with our <a href="/en/tools/detention-fee-calculator">Detention Fee Calculator</a>.</p>'
  },
  {
    sourceSlug: 'shipper-carrier-consignee-roles-bill-of-lading-en',
    targetSlug: 'ltl-shipping-explained-vs-parcel-and-full-truckload-en',
    linkHtml: '<p>Depending on freight volume and routing requirements, shipments move under full truckload or consolidated carrier networks; read our breakdown of <a href="/en/blog/ltl-shipping-explained-vs-parcel-and-full-truckload-en">LTL shipping explained versus parcel and full truckload transport</a>.</p>'
  },
  {
    sourceSlug: 'box-truck-cargo-van-pickup-federal-rules-by-weight-en',
    targetSlug: 'ltl-shipping-explained-vs-parcel-and-full-truckload-en',
    linkHtml: '<p>Straight trucks and hotshot rigs often compete with freight consolidation terminals; learn how palletized networks operate in our review of <a href="/en/blog/ltl-shipping-explained-vs-parcel-and-full-truckload-en">LTL shipping versus full truckload</a>.</p>'
  },
  {
    sourceSlug: 'pre-employment-screening-program-psp-mvr-background-en',
    targetSlug: 'driver-qualification-file-391-51-contents-retention-en',
    linkHtml: '<p>Commercial background records obtained through PSP are archived in the mandatory <a href="/en/blog/driver-qualification-file-391-51-contents-retention-en">Driver Qualification File retention mandated by 49 CFR 391.51</a>.</p>'
  },
  {
    sourceSlug: 'importer-security-filing-isf-10-2-what-when-who-en',
    targetSlug: 'shipper-carrier-consignee-roles-bill-of-lading-en',
    linkHtml: '<p>The ten importer security elements must correspond directly with the intermodal <a href="/en/blog/shipper-carrier-consignee-roles-bill-of-lading-en">bill of lading defining shipper, carrier, and consignee obligations</a>.</p>'
  }
];

async function run() {
  let count = 0;
  for (const edit of EDITS) {
    const { data: post, error } = await supabase.from('blog_posts').select('id,content').eq('slug', edit.sourceSlug).single();
    if (error || !post) {
      console.error(`Post not found: ${edit.sourceSlug}`, error);
      continue;
    }
    if (post.content.includes(edit.targetSlug)) {
      console.log(`Already linked: ${edit.sourceSlug} -> ${edit.targetSlug}`);
      continue;
    }
    const newContent = post.content + '\n' + edit.linkHtml;
    const { error: updateErr } = await supabase.from('blog_posts').update({ content: newContent, updated_at: new Date().toISOString() }).eq('id', post.id);
    if (updateErr) {
      console.error(`Failed to update ${edit.sourceSlug}:`, updateErr);
    } else {
      count++;
      console.log(`✓ Linked: ${edit.sourceSlug} -> ${edit.targetSlug}`);
    }
  }
  console.log(`Successfully added ${count} new internal links across articles!`);
}

run();
