const fs = require('fs');
const path = 'd:/android-projeler/yukle-next/src/utils/translations.ts';
let content = fs.readFileSync(path, 'utf8');

const dict = {
  en: { kvkk: "GDPR Policy", privacy: "Privacy", terms: "Terms", reklam: "Advertise", about: "About Us", contact: "Contact Us" },
  tr: { kvkk: "KVKK", privacy: "Gizlilik", terms: "Şartlar", reklam: "Reklam", about: "Hakkımızda", contact: "İletişim" },
  es: { kvkk: "Política GDPR", privacy: "Privacidad", terms: "Términos", reklam: "Publicidad", about: "Sobre Nosotros", contact: "Contáctenos" },
  pt: { kvkk: "Política GDPR", privacy: "Privacidade", terms: "Termos", reklam: "Anunciar", about: "Sobre Nós", contact: "Contate-nos" },
  fr: { kvkk: "Politique RGPD", privacy: "Confidentialité", terms: "Conditions", reklam: "Publicité", about: "À Propos", contact: "Nous Contacter" },
  de: { kvkk: "DSGVO", privacy: "Datenschutz", terms: "Bedingungen", reklam: "Werben", about: "Über Uns", contact: "Kontakt" },
  it: { kvkk: "Informativa GDPR", privacy: "Privacy", terms: "Termini", reklam: "Pubblicità", about: "Chi Siamo", contact: "Contattaci" },
  pl: { kvkk: "Polityka RODO", privacy: "Prywatność", terms: "Warunki", reklam: "Reklama", about: "O Nas", contact: "Kontakt" },
  nl: { kvkk: "AVG-beleid", privacy: "Privacy", terms: "Voorwaarden", reklam: "Adverteren", about: "Over Ons", contact: "Contact" },
  ru: { kvkk: "Политика GDPR", privacy: "Конфиденциальность", terms: "Условия", reklam: "Реклама", about: "О Нас", contact: "Контакты" },
  uk: { kvkk: "Політика GDPR", privacy: "Конфіденційність", terms: "Умови", reklam: "Реклама", about: "Про Нас", contact: "Контакти" },
  zh: { kvkk: "GDPR 政策", privacy: "隐私", terms: "条款", reklam: "广告", about: "关于我们", contact: "联系我们" },
  ja: { kvkk: "GDPR ポリシー", privacy: "プライバシー", terms: "利用規約", reklam: "広告", about: "私たちについて", contact: "お問い合わせ" },
  hi: { kvkk: "GDPR नीति", privacy: "गोपनीयता", terms: "शर्तें", reklam: "विज्ञापन", about: "हमारे बारे में", contact: "संपर्क करें" },
  ar: { kvkk: "سياسة GDPR", privacy: "الخصوصية", terms: "الشروط", reklam: "إعلان", about: "معلومات عنا", contact: "اتصل بنا" },
  fa: { kvkk: "سیاست GDPR", privacy: "حریم خصوصی", terms: "شرایط", reklam: "تبلیغات", about: "درباره ما", contact: "تماس با ما" },
  ko: { kvkk: "GDPR 정책", privacy: "개인정보 보호", terms: "약관", reklam: "광고", about: "회사 소개", contact: "문의하기" },
  vi: { kvkk: "Chính sách GDPR", privacy: "Quyền riêng tư", terms: "Điều khoản", reklam: "Quảng cáo", about: "Về chúng tôi", contact: "Liên hệ" },
  id: { kvkk: "Kebijakan GDPR", privacy: "Privasi", terms: "Syarat", reklam: "Beriklan", about: "Tentang Kami", contact: "Hubungi Kami" },
  bn: { kvkk: "GDPR নীতি", privacy: "গোপনীয়তা", terms: "শর্তাবলী", reklam: "বিজ্ঞাপন", about: "আমাদের সম্পর্কে", contact: "যোগাযোগ" },
  ur: { kvkk: "GDPR پالیسی", privacy: "رازداری", terms: "شرائط", reklam: "تشہیر", about: "ہمارے بارے میں", contact: "رابطہ کریں" },
  th: { kvkk: "นโยบาย GDPR", privacy: "ความเป็นส่วนตัว", terms: "เงื่อนไข", reklam: "โฆษณา", about: "เกี่ยวกับเรา", contact: "ติดต่อเรา" },
  ms: { kvkk: "Dasar GDPR", privacy: "Privasi", terms: "Syarat", reklam: "Iklan", about: "Tentang Kami", contact: "Hubungi Kami" },
  tl: { kvkk: "Patakaran sa GDPR", privacy: "Privacy", terms: "Mga Tuntunin", reklam: "Mag-advertise", about: "Tungkol sa Amin", contact: "Makipag-ugnayan" },
  ro: { kvkk: "Politica GDPR", privacy: "Confidențialitate", terms: "Termeni", reklam: "Publicitate", about: "Despre Noi", contact: "Contact" },
  sv: { kvkk: "GDPR Policy", privacy: "Integritet", terms: "Villkor", reklam: "Annonsera", about: "Om Oss", contact: "Kontakta Oss" },
  cs: { kvkk: "Zásady GDPR", privacy: "Soukromí", terms: "Podmínky", reklam: "Reklama", about: "O Nás", contact: "Kontakt" },
  hu: { kvkk: "GDPR Irányelv", privacy: "Adatvédelem", terms: "Feltételek", reklam: "Hirdetés", about: "Rólunk", contact: "Kapcsolat" },
  el: { kvkk: "Πολιτική GDPR", privacy: "Απόρρητο", terms: "Όροι", reklam: "Διαφήμιση", about: "Σχετικά με εμάς", contact: "Επικοινωνία" },
  az: { kvkk: "GDPR Siyasəti", privacy: "Məxfilik", terms: "Şərtlər", reklam: "Reklam", about: "Haqqımızda", contact: "Əlaqə" },
  kk: { kvkk: "GDPR Саясаты", privacy: "Құпиялылық", terms: "Шарттар", reklam: "Жарнама", about: "Біз Туралы", contact: "Байланыс" },
  he: { kvkk: "מדיניות GDPR", privacy: "פרטיות", terms: "תנאים", reklam: "פרסום", about: "עלינו", contact: "צור קשר" },
  bg: { kvkk: "GDPR Политика", privacy: "Поверителност", terms: "Условия", reklam: "Реклама", about: "За Нас", contact: "Контакти" },
  hr: { kvkk: "GDPR Pravila", privacy: "Privatnost", terms: "Uvjeti", reklam: "Oglašavanje", about: "O Nama", contact: "Kontakt" },
  sr: { kvkk: "GDPR Politika", privacy: "Privatnost", terms: "Uslovi", reklam: "Oglašavanje", about: "O Nama", contact: "Kontakt" },
  sk: { kvkk: "Zásady GDPR", privacy: "Súkromie", terms: "Podmienky", reklam: "Reklama", about: "O Nás", contact: "Kontakt" },
  da: { kvkk: "GDPR Politik", privacy: "Privatliv", terms: "Vilkår", reklam: "Annoncer", about: "Om Os", contact: "Kontakt Os" },
  fi: { kvkk: "GDPR Käytäntö", privacy: "Yksityisyys", terms: "Ehdot", reklam: "Mainosta", about: "Meistä", contact: "Ota Yhteyttä" },
  no: { kvkk: "GDPR Retningslinjer", privacy: "Personvern", terms: "Vilkår", reklam: "Annonsere", about: "Om Oss", contact: "Kontakt Oss" },
  uz: { kvkk: "GDPR Siyosati", privacy: "Maxfiylik", terms: "Shartlar", reklam: "Reklama", about: "Biz Haqimizda", contact: "Aloqa" },
  ta: { kvkk: "GDPR கொள்கை", privacy: "தனியுரிமை", terms: "விதிமுறைகள்", reklam: "விளம்பரம்", about: "எங்களை பற்றி", contact: "தொடர்பு கொள்ள" },
  mr: { kvkk: "GDPR धोरण", privacy: "गोपनीयता", terms: "अटी", reklam: "जाहिरात", about: "आमच्याबद्दल", contact: "संपर्क" },
  ka: { kvkk: "GDPR პოლიტიკა", privacy: "კონფიდენციალურობა", terms: "პირობები", reklam: "რეკლამა", about: "ჩვენს შესახებ", contact: "კონტაქტი" },
  lt: { kvkk: "BDAR Politika", privacy: "Privatumas", terms: "Sąlygos", reklam: "Reklama", about: "Apie Mus", contact: "Kontaktai" },
  lv: { kvkk: "VDAR Politika", privacy: "Privātums", terms: "Noteikumi", reklam: "Reklāma", about: "Par Mums", contact: "Kontakti" },
  et: { kvkk: "IKÜM Poliitika", privacy: "Privaatsus", terms: "Tingimused", reklam: "Reklaam", about: "Meist", contact: "Kontakt" },
  sl: { kvkk: "GDPR Pravilnik", privacy: "Zasebnost", terms: "Pogoji", reklam: "Oglaševanje", about: "O Nas", contact: "Kontakt" }
};

const keys = ['kvkk', 'privacy', 'terms', 'reklam', 'about', 'contact'];

// Replace the values in the translations file
let lines = content.split('\n');
let currentLang = '';
let inNav = false;

for (let i = 0; i < lines.length; i++) {
  let line = lines[i];
  
  // match language block e.g., "  en: {" or "  \"ko\": {"
  const langMatch = line.match(/^\s*"?([a-z]{2})"?:\s*\{/);
  if (langMatch) {
    currentLang = langMatch[1];
    inNav = false;
    continue;
  }
  
  // match nav block
  if (currentLang && line.match(/^\s*"?nav"?:\s*\{/)) {
    inNav = true;
    continue;
  }
  
  // if end of block
  if (inNav && line.match(/^\s*\},/)) {
    inNav = false;
    continue;
  }
  
  if (inNav && currentLang && dict[currentLang]) {
    for (const key of keys) {
      // match e.g. about: "About Us", or "about": "About Us",
      const rgx = new RegExp(`^(\\s*)"?${key}"?\\s*:\\s*['"].*?['"](,?)`);
      if (rgx.test(line)) {
        // replace with translated string
        const translated = dict[currentLang][key].replace(/'/g, "\\'"); // escape single quotes
        lines[i] = line.replace(rgx, `$1${key}: '${translated}'$2`);
        line = lines[i];
      }
    }
  }
}

fs.writeFileSync(path, lines.join('\n'), 'utf8');
console.log('Translations updated successfully.');
