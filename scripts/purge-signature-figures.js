// Removes fabricated statistics that the generator re-used across unrelated posts (see lib/false-precision.js).
//
//   node scripts/purge-signature-figures.js            # dry run
//   node scripts/purge-signature-figures.js --apply    # write to the database
//
// 1. a <blockquote> that carries a signature figure is an invented "citation" -> the whole quote is removed
// 2. a sentence that attributes a signature figure to a report/survey/agency is an invented source -> sentence removed
// 3. every other occurrence is turned into plain words ("thousands of dollars", "significantly")

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const FP = require('./lib/false-precision');

const ROOT = path.join(__dirname, '..');
const envLocal = path.join(ROOT, '.env.local');
if (fs.existsSync(envLocal)) {
  for (const line of fs.readFileSync(envLocal, 'utf8').split('\n')) {
    const i = line.indexOf('=');
    if (i > 0 && !process.env[line.slice(0, i).trim()]) process.env[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^["']|["']$/g, '');
  }
}
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const APPLY = process.argv.includes('--apply');
const ATTRIBUTION = /\b(?:according to|report(?:ed|s)?|survey|study|studies|analysis|analy[sz]ed|found that|association|institute|council|organi[sz]ation|commission|agency|bureau|journal|ATA|CSCMP|WCO|FMCSA|IATA|OOIDA|Gartner|McKinsey|Deloitte|research)\b/i;

function purge(content, stats) {
  let out = content.replace(/<blockquote[\s\S]*?<\/blockquote>/gi, (q) => {
    if (FP.SIG_ANY.test(q.replace(/<[^>]+>/g, ' '))) { stats.quotes++; return ''; }
    return q;
  });
  out = out.replace(/<(p|li)(\s[^>]*)?>([\s\S]*?)<\/\1>/gi, (m, tag, attrs, inner) => {
    if (!FP.SIG_ANY.test(inner.replace(/<[^>]+>/g, ' '))) return m;
    const parts = inner.split(/(?<=[.!?])(?:<\/(?:strong|em|b|i)>)?\s+(?=[A-Z<"“])/);
    const kept = parts.filter((seg) => {
      const text = seg.replace(/<[^>]+>/g, ' ');
      if (FP.SIG_ANY.test(text) && ATTRIBUTION.test(text)) { stats.sentences++; return false; }
      return true;
    });
    if (kept.length === parts.length) return m;
    const body = kept.join(' ');
    return body.replace(/<[^>]+>/g, '').trim().length < 25 ? '' : `<${tag}${attrs || ''}>${body}</${tag}>`;
  });
  // remaining occurrences -> words
  return FP.hedgeArticle(out);
}

(async () => {
  const rows = [];
  for (let from = 0; ; from += 100) {
    const { data, error } = await supabase.from('blog_posts').select('id,slug,content').eq('published', true).eq('language', 'en').range(from, from + 99);
    if (error) throw error;
    rows.push(...data);
    if (data.length < 100) break;
  }
  const stats = { quotes: 0, sentences: 0, posts: 0, applied: 0, remainingBefore: 0, remainingAfter: 0 };
  const backup = {};
  for (const p of rows) {
    const plainBefore = p.content.replace(/<[^>]+>/g, ' ');
    if (FP.SIG_ANY.test(plainBefore)) stats.remainingBefore++;
    const next = purge(p.content, stats);
    if (FP.SIG_ANY.test(next.replace(/<[^>]+>/g, ' '))) stats.remainingAfter++;
    if (next !== p.content) {
      stats.posts++;
      backup[p.id] = { slug: p.slug, content: p.content };
      if (APPLY) {
        const { error } = await supabase.from('blog_posts').update({ content: next }).eq('id', p.id);
        if (error) console.error(p.slug, error.message); else stats.applied++;
      }
    }
  }
  if (APPLY) {
    const backupPath = path.join(require('os').tmpdir(), 'purge-signature-backup.json');
    fs.writeFileSync(backupPath, JSON.stringify(backup));
    console.log('originals saved to', backupPath);
  }
  console.log(stats);
})();
