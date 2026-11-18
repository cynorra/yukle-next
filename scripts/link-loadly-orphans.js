const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const env = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
const supabaseUrl = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1].trim();
const supabaseKey = (env.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/) || env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/))[1].trim();
const supabase = createClient(supabaseUrl, supabaseKey);

const EDITS = [
  {
    sourceSlug: 'commercial-vehicle-roadside-inspections-preparation-en',
    targetSlug: 'cvsa-out-of-service-criteria-mechanisms-decals-en',
    linkHtml: '<p>When inspectors discover critical violations during Level I through Level V inspections, the vehicle or driver is grounded under the <a href="/en/blog/cvsa-out-of-service-criteria-mechanisms-decals-en">CVSA North American Standard Out-of-Service Criteria mechanisms and inspection decal rules</a>.</p>'
  },
  {
    sourceSlug: 'shipper-carrier-consignee-roles-bill-of-lading-en',
    targetSlug: 'importer-security-filing-isf-10-2-what-when-who-en',
    linkHtml: '<p>When international maritime shipments transfer to domestic overland transport under an intermodal bill of lading, shippers and consignees must also verify filing under the <a href="/en/blog/importer-security-filing-isf-10-2-what-when-who-en">Importer Security Filing (ISF 10+2) federal requirements</a>.</p>'
  },
  {
    sourceSlug: 'truck-dispatcher-role-federal-rules-dispatching-en',
    targetSlug: 'freight-and-trucking-terms-glossary-federal-definitions-en',
    linkHtml: '<p>For the complete statutory definitions separating carriers, brokers, and logistics agents under 49 U.S.C. 13102, consult our <a href="/en/blog/freight-and-trucking-terms-glossary-federal-definitions-en">freight and trucking terms glossary of federal definitions</a>.</p>'
  },
  {
    sourceSlug: 'load-boards-how-to-vet-a-load-before-booking-en',
    targetSlug: 'freight-factoring-explained-selling-invoices-en',
    linkHtml: '<p>To mitigate cash flow delays when booking freight with brokerages offering 30-to-60-day settlement windows, carriers frequently evaluate <a href="/en/blog/freight-factoring-explained-selling-invoices-en">freight factoring for advancing freight invoices</a>.</p>'
  },
  {
    sourceSlug: 'ltl-freight-class-density-calculation-en',
    targetSlug: 'ltl-shipping-explained-vs-parcel-and-full-truckload-en',
    linkHtml: '<p>For an overview of how hub-and-spoke consolidation networks differ from dedicated linehaul moves, see our comprehensive guide on <a href="/en/blog/ltl-shipping-explained-vs-parcel-and-full-truckload-en">LTL shipping explained versus parcel and full truckload transport</a>.</p>'
  }
];

async function run() {
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
      console.log(`✓ Linked: ${edit.sourceSlug} -> ${edit.targetSlug}`);
    }
  }
  console.log('Internal link insertion complete.');
}

run();
