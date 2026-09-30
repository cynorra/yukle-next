const fs=require('fs'),https=require('https');process.chdir(require('path').join(__dirname,'..'));
fs.readFileSync('.env.local','utf8').split('\n').forEach(l=>{const i=l.indexOf('=');if(i>0)process.env[l.slice(0,i).trim()]=l.slice(i+1).trim().replace(/^['"]|['"]$/g,'')});
const {createClient}=require('@supabase/supabase-js');
const q=require('./lib/article-quality');
const sb=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);
const APPLY=process.argv.includes('--apply'), OUT='D:/android-projeler/backups/meta-plan.json';
function gem(prompt){return new Promise((res,rej)=>{const body=JSON.stringify({contents:[{parts:[{text:prompt}]}],generationConfig:{responseMimeType:'application/json',temperature:0.4}});
 const r=https.request({hostname:'generativelanguage.googleapis.com',path:`/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,method:'POST',headers:{'Content-Type':'application/json','Content-Length':Buffer.byteLength(body)}},x=>{let d='';x.on('data',c=>d+=c);x.on('end',()=>{try{const j=JSON.parse(d);if(x.statusCode!==200)return rej(new Error(x.statusCode+' '+(j.error&&j.error.message)));res(JSON.parse(j.candidates[0].content.parts[0].text))}catch(e){rej(e)}})});r.setTimeout(90000,()=>r.destroy(new Error('timeout')));r.on('error',rej);r.write(body);r.end()});}
const bad=p=>q.findHypeClaim({title:p.title,meta_title:p.meta_title,excerpt:p.excerpt,meta_description:p.meta_description,content:''})||q.findInventedNumberInMeta(p.excerpt,p.meta_description,p.meta_title,p.title)||q.titleHasYear(p.title,p.meta_title)||q.findBrandMention(p.title,p.excerpt,p.meta_title,p.meta_description)||/[|]\s*Loadly/i.test(p.title+(p.meta_title||''));
function ok(o){return o&&o.title&&o.title.length>=25&&o.title.length<=70&&o.meta_title&&o.meta_title.length<=68&&o.meta_description&&o.meta_description.length>=90&&o.meta_description.length<=185&&o.excerpt&&o.excerpt.length>=60&&o.excerpt.length<=280&&!bad(o)}
(async()=>{
 let rows=[],last='00000000-0000-0000-0000-000000000000';
 for(;;){const {data,error}=await sb.from('blog_posts').select('id,slug,title,meta_title,excerpt,meta_description').eq('published',true).eq('language','en').order('id').gt('id',last).limit(200);
  if(error)throw error;if(!data.length)break;rows=rows.concat(data);last=data[data.length-1].id;if(data.length<200)break;}
 const todo=rows.filter(bad);console.log('flagged',todo.length,'of',rows.length);
 const plan=fs.existsSync(OUT)?JSON.parse(fs.readFileSync(OUT)):{};
 for(let pass=0;pass<3;pass++){
  const pend=todo.filter(p=>!plan[p.id]);if(!pend.length)break;console.log('pass',pass,'pending',pend.length);
  const chunks=[];for(let i=0;i<pend.length;i+=8)chunks.push(pend.slice(i,i+8));
  for(let c=0;c<chunks.length;c+=4){await Promise.all(chunks.slice(c,c+4).map(async b=>{
   const prompt=`Rewrite the SEO metadata for these freight/logistics blog articles. Return JSON: an array of objects {"id","title","meta_title","excerpt","meta_description"} — same ids, same order.
STRICT RULES for every field:
- Keep the same topic and search intent; write plain, factual, useful English. Third person only.
- NO digits used as claims: no percentages, no dollar/euro amounts, no "10x", no years (2024/2025/2026), no "#1". Digits are allowed only if part of a proper name/standard (e.g. "Class 8", "HOS", "IFTA", "Incoterms 2020" is NOT allowed — write "Incoterms").
- NO hype or promises: never use guarantee, slash, eliminate, secret, insider, battle-tested, explode, crush, dominate, unlock hidden, master, revolutionize, skyrocket. Prefer measured verbs: reduce, lower, improve, understand, manage, compare, prepare.
- Do not mention the words "Loadly" or "Playbook" more than needed; never end with "| Loadly".
- title: 40-62 characters, natural headline. meta_title: 40-60 characters, may differ slightly from title. meta_description: 120-155 characters, describes what the reader will learn (no promised numbers). excerpt: 1-2 sentences, 90-220 characters.
Articles:
${JSON.stringify(b.map(p=>({id:p.id,slug:p.slug,title:p.title,excerpt:p.excerpt,meta_description:p.meta_description})))}`;
   try{const out=await gem(prompt);const arr=Array.isArray(out)?out:(out.items||out.articles||[]);
    for(const o of arr){if(b.find(p=>p.id===o.id)&&ok(o))plan[o.id]={title:o.title.trim(),meta_title:o.meta_title.trim(),excerpt:o.excerpt.trim(),meta_description:o.meta_description.trim()}}
   }catch(e){console.log('batch err',e.message.slice(0,120));await new Promise(r=>setTimeout(r,8000))}
   process.stdout.write('.');}));fs.writeFileSync(OUT,JSON.stringify(plan));
  }console.log();
 }
 const done=todo.filter(p=>plan[p.id]).length;console.log('planned',done,'/',todo.length);
 if(APPLY){let n=0;for(const p of todo){if(!plan[p.id])continue;const {error}=await sb.from('blog_posts').update(plan[p.id]).eq('id',p.id);if(error)console.log(p.slug,error.message);else n++}console.log('applied',n)}
})();
