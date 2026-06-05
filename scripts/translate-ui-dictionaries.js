const fs = require('fs');
const path = require('path');
const https = require('https');

// English Base dictionaries
const enTranslationsDict = {
  nav: {
    marketplace: 'Marketplace',
    blog: 'Blog',
    login: 'Login',
    register: 'Register',
    dashboard: 'Dashboard',
    messages: 'Messages',
    routes: 'My Routes',
    favorites: 'Favorites',
    logout: 'Logout',
    profile: 'Profile',
    kvkk: 'GDPR Policy',
    privacy: 'Privacy',
    terms: 'Terms',
    reklam: 'Advertise',
  },
  home: {
    tagline: 'Next-Gen Logistics',
    heroTitle1: 'Find Loads, Get Offers,',
    heroTitle2: 'Start Transporting',
    heroDesc: 'Global shipping and transport matching network. The fastest pairing platform built for shippers and carriers.',
    exploreBtn: 'Explore Marketplace',
    registerBtn: 'Sign Up for Free',
    activeUsers: '+10,000 active users every day',
    stat1Val: 'Global',
    stat1Label: 'Country Reach',
    stat2Val: '24/7',
    stat2Label: 'Live Network',
    stat3Val: 'Free',
    stat3Label: 'Post Loads',
    howTitle: 'How It Works?',
    howSubtitle: 'Transport your cargo or find new routing jobs in just three easy steps.',
    step1Title: 'Create Load',
    step1Desc: 'Enter your load specifications, pickup and destination details.',
    step2Title: 'Get Offers',
    step2Desc: 'Compare and evaluate the best offers received from certified drivers.',
    step3Title: 'Carry Safely',
    step3Desc: 'Confirm your mutual agreement and deliver your loads safely.',
    ctaTitle: 'Ready to Transform Your Logistics?',
    ctaDesc: 'Thousands of professional carriers and freight owners connect on this platform daily.',
    ctaJoin: 'Join Free',
    ctaReview: 'Explore Marketplace',
    footerCopyright: '© 2025 Loadly · Global Logistics Platform',
  },
  marketplace: {
    title: 'Logistics Marketplace',
    desc: 'Browse current active loads and truck routes worldwide.',
    filterOrigin: 'Origin City / Country',
    filterDestination: 'Destination City / Country',
    searchPlaceholder: 'Search location...',
    noLoadsFound: 'No shipments match your criteria.',
    postLoadBtn: 'Create New Load',
    price: 'Offered Price',
    weight: 'Weight (Tons)',
    truckType: 'Required Truck',
    loadType: 'Load Category',
    detailsBtn: 'View Details',
    allLoads: 'Available Loads',
    driverRoutes: 'Driver Routes',
    negotiable: 'Negotiable',
    active: 'Active',
    inTransit: 'In Transit',
    completed: 'Completed',
    cancelled: 'Cancelled',
  },
  auth: {
    loginTitle: 'Welcome Back',
    registerTitle: 'Create Account',
    email: 'Email Address',
    password: 'Password',
    fullName: 'Full Name',
    phone: 'Phone Number',
    companyName: 'Company Name (Optional)',
    role: 'Who are you?',
    roleShipper: 'I want to send loads (Shipper)',
    roleDriver: 'I am a carrier / driver',
    submitLogin: 'Sign In',
    submitRegister: 'Sign Up',
    noAccount: "Don't have an account yet?",
    hasAccount: 'Already have an account?',
  },
  dashboard: {
    welcome: 'Welcome',
    shipperPanel: 'Shipper Dashboard',
    driverPanel: 'Carrier Dashboard',
    myLoads: 'My Active Loads',
    myRoutes: 'My active Routes',
    activeOffers: 'Incoming Offers',
    noLoads: 'No loads created yet.',
    noRoutes: 'No routes declared yet.',
    points: 'Points',
    verified: 'Verified Account',
    notVerified: 'Not Verified',
  },
  loadTags: {
    urgent: 'Urgent',
    express: 'Express',
    flexible: 'Flexible Date',
    fragile: 'Fragile',
    partial: 'Partial Load',
    full: 'Full Load',
  },
};

const enBlogTranslationsDict = {
  title: 'Logistics Marketplace & Transport Guide | Loadly',
  description: 'Digital logistics platform. Access articles about posting shipping ads, finding truck loads, and logistics cost reduction methods.',
  tagline: 'Logistics & Shipping Marketplace Guide',
  header1: 'Digitizing the',
  headerAccent: 'Logistics World',
  header2: '',
  introText: 'Find the most up-to-date guides on shipping ads, load matching, and supply chain optimization using the Loadly marketplace.',
  searchPlaceholder: 'Search articles...',
  noArticles: 'No articles found matching your search.',
  faqTitle: 'Frequently Asked Questions About Logistics Marketplace',
  backToBlog: 'Back to Blog',
  readingTime: 'Reading time:',
  readingTimeSuffix: 'min read',
  authorRole: 'Logistics Expert',
  shareTitle: 'Do Not Forget to Share!',
  shareDesc: 'If you found this content useful, share it with your friends in the transport sector.',
  loading: 'Loading article...',
  guides: [
    { label: 'Load Finding Guide', slug: 'kamyon-tir-soforleri-yuk-bulma-rehberi' },
    { label: 'Cost Reduction', slug: 'sehirler-arasi-nakliye-maliyet-dusurme' },
    { label: 'Regulations', slug: 'evden-eve-nakliyat-yasal-mevzuat-belgeler' },
  ],
  faqs: [
    { q: 'What is a logistics marketplace?', a: 'A logistics marketplace is a digital ecosystem where shippers and carriers meet directly to post loads and submit freight bids.' },
    { q: 'What are the benefits of a load board?', a: 'It saves time, improves price transparency, and helps carriers avoid empty backhauls, reducing transportation costs.' },
    { q: 'How is security maintained?', a: 'All users verify credentials, and past transport histories are rated through a review system.' }
  ]
};

const enLoadTypes = {
  general: 'General Cargo',
  hazardous: 'Hazardous',
  perishable: 'Perishable',
  oversized: 'Oversized',
  fragile: 'Fragile'
};

const enTruckTypes = {
  tir: 'TIR / Semi-truck',
  kamyon: 'Truck',
  kamyonet: 'Van / Light Truck',
  dorser: 'Flatbed / Trailer',
  tanker: 'Tanker',
  frigorifik: 'Reefer / Refrigerated'
};

const enLoadDetail = {
  disclaimer: 'Loadly is only a listing platform. Carriage, payment, and damage liabilities are directly between the load owner and the carrier.',
  backToMarket: 'Back to Marketplace',
  origin: 'Origin',
  destination: 'Destination',
  loadNotFound: 'Load not found',
  copied: 'Copied!',
  share: 'Share',
  favorite: 'Favorite',
  inFavorites: 'In Favorites',
  description: 'Description',
  manageLoad: 'Listing Management',
  manageLoadDesc: 'You can edit or cancel the listing.',
  editBtn: 'Edit Listing',
  makeOffer: 'Make an Offer',
  yourOffer: 'Your Offer',
  offerAccepted: 'Offer Accepted',
  offerRejected: 'Offer Rejected',
  offerPrice: 'Offer Price',
  optional: 'optional',
  note: 'Note',
  notePlaceholder: 'Enter note or details for the shipper...',
  sendOffer: 'Send Offer',
  updateOffer: 'Update Offer',
  sending: 'Sending...',
  offerLimitWarning: 'You already have an active offer for this load.',
  offersTitle: 'Received Offers',
  noOffersYet: 'No offers received yet.',
  reviews: 'reviews',
  accept: 'Accept',
  reject: 'Reject',
  accepted: 'Accepted',
  rejected: 'Rejected',
  driver: 'Driver',
  shipper: 'Shipper',
  deliveryConfirmation: 'Delivery Confirmation',
  confirmed: 'Confirmed',
  pending: 'Pending',
  deliveryCompleted: 'Delivery Completed',
  confirmDelivery: 'Confirm Delivery',
  confirming: 'Confirming...',
  waitingOtherConfirmation: 'Waiting for other party to confirm...',
  rateDriver: 'Rate the Carrier',
  rateShipper: 'Rate the Shipper',
  sharePhoneDesc: 'Share your phone number with the shipper to coordinate details.',
  sharePhone: 'Share Phone Number',
  sharing: 'Sharing...',
  phoneShared: 'Your phone number is shared',
  otherPhoneShared: 'Shipper phone number',
  phoneVisibleWait: 'Phone will be visible once you share yours.',
  noMessagesYet: 'No messages yet. Send a message to start conversation.',
  typeMessage: 'Type a message...',
  chatStartOfferAccepted: 'Offer accepted! You can now chat and coordinate details.',
  loginToOfferTitle: 'Bidding requires login',
  loginToOfferDesc: 'Please login or register to send an offer to this load listing.',
  login: 'Login / Register',
  driverPhoneVisible: 'Driver phone will be visible once shared.',
  quickInfo: 'Quick Info',
  pickup: 'Pickup Date',
  priceLabel: 'Price',
  priceOrNoteRequired: 'You must provide a bid price or a note.',
  insufficientPoints: 'Insufficient points! Bidding costs 10 points.',
  notSpecified: 'Not specified',
  tons: 'tons'
};

const enExternalLoad = {
  externalBadge: "External Source",
  externalWarningTitle: "External Listing",
  externalWarningDesc: "This load is imported from an external source. Direct bidding and in-app chat are disabled. Please use the contact information provided in the description to contact the shipper."
};

const targetLanguages = {
  ko: 'Korean',
  vi: 'Vietnamese',
  id: 'Indonesian',
  bn: 'Bengali',
  ur: 'Urdu',
  th: 'Thai',
  ms: 'Malay',
  tl: 'Tagalog',
  ro: 'Romanian',
  sv: 'Swedish',
  cs: 'Czech',
  hu: 'Hungarian',
  el: 'Greek',
  az: 'Azerbaijani',
  kk: 'Kazakh',
  he: 'Hebrew',
  bg: 'Bulgarian',
  hr: 'Croatian',
  sr: 'Serbian',
  sk: 'Slovak',
  da: 'Danish',
  fi: 'Finnish',
  no: 'Norwegian',
  uz: 'Uzbek',
  ta: 'Tamil',
  mr: 'Marathi',
  ka: 'Georgian',
  lt: 'Lithuanian',
  lv: 'Latvian',
  et: 'Estonian',
  sl: 'Slovenian'
};

// Flatten utility
function flatten(obj, currentPath = '') {
  let result = {};
  for (let key in obj) {
    let newPath = currentPath ? `${currentPath}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      Object.assign(result, flatten(obj[key], newPath));
    } else {
      result[newPath] = obj[key];
    }
  }
  return result;
}

// Unflatten utility
function unflatten(flatObj) {
  let result = {};
  for (let path in flatObj) {
    let parts = path.split('.');
    let current = result;
    for (let i = 0; i < parts.length; i++) {
      let part = parts[i];
      let nextPart = parts[i + 1];
      let isNextNumber = nextPart !== undefined && !isNaN(Number(nextPart));

      if (i === parts.length - 1) {
        current[part] = flatObj[path];
      } else {
        if (!current[part]) {
          current[part] = isNextNumber ? [] : {};
        }
        current = current[part];
      }
    }
  }
  return result;
}

// Translate a batch of texts using Google Translate GTX
function translateTextBatch(texts, targetLang) {
  return new Promise((resolve) => {
    if (texts.length === 0) {
      resolve([]);
      return;
    }
    const joined = texts.map(t => t.replace(/\[s\]/g, '')).join(' [s] ');
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(joined)}`;
    
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed && parsed[0]) {
            const translatedText = parsed[0].map(item => item[0]).join('');
            const parts = translatedText.split(/\s*\[\s*s\s*\]\s*/i).map(s => s.trim());
            if (parts.length === texts.length) {
              resolve(parts);
            } else {
              resolve(null); // count mismatch, fallback
            }
          } else {
            resolve(null);
          }
        } catch {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

// Translate single text
function translateSingleText(text, targetLang) {
  return new Promise((resolve) => {
    if (!text || text.trim() === '') {
      resolve('');
      return;
    }
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed && parsed[0]) {
            resolve(parsed[0].map(item => item[0]).join('').trim());
          } else {
            resolve(text);
          }
        } catch {
          resolve(text);
        }
      });
    }).on('error', () => resolve(text));
  });
}

// Main translation orchestrator for an object
async function translateObject(sourceObj, targetLangCode) {
  const flat = flatten(sourceObj);
  const result = { ...flat };
  const entries = Object.entries(flat).filter(([key]) => !key.endsWith('.slug'));
  
  const chunkSize = 12;
  for (let i = 0; i < entries.length; i += chunkSize) {
    const chunk = entries.slice(i, i + chunkSize);
    const keys = chunk.map(([k]) => k);
    const values = chunk.map(([, v]) => v);
    
    let translatedValues = await translateTextBatch(values, targetLangCode);
    if (!translatedValues) {
      translatedValues = [];
      for (const val of values) {
        const trans = await translateSingleText(val, targetLangCode);
        translatedValues.push(trans);
        await new Promise(r => setTimeout(r, 50));
      }
    }
    
    for (let j = 0; j < keys.length; j++) {
      result[keys[j]] = translatedValues[j] || values[j];
    }
    await new Promise(r => setTimeout(r, 100));
  }
  
  return unflatten(result);
}

// Helper to insert translations before closing brace with comma injection
function insertIntoObject(fileContent, startPattern, newContentString) {
  const startIndex = fileContent.indexOf(startPattern);
  if (startIndex === -1) {
    throw new Error(`Could not find pattern: ${startPattern}`);
  }
  const closingBraceIndex = fileContent.indexOf('};', startIndex);
  if (closingBraceIndex === -1) {
    throw new Error(`Could not find closing }; after pattern: ${startPattern}`);
  }
  
  let insertPosition = closingBraceIndex;
  const substringBefore = fileContent.substring(startIndex, closingBraceIndex).trim();
  if (!substringBefore.endsWith(',')) {
    let lastCharIndex = closingBraceIndex - 1;
    while (lastCharIndex > startIndex && /\s/.test(fileContent[lastCharIndex])) {
      lastCharIndex--;
    }
    const beforePart = fileContent.substring(0, lastCharIndex + 1);
    const afterPart = fileContent.substring(lastCharIndex + 1);
    fileContent = beforePart + ',\n' + afterPart;
    insertPosition = fileContent.indexOf('};', startIndex);
  }
  
  return fileContent.substring(0, insertPosition) + newContentString + fileContent.substring(insertPosition);
}

async function run() {
  console.log('Starting dictionary translation script using Google Translate GTX API...');
  const langCodes = Object.keys(targetLanguages);
  
  const translations = {};
  const blogTranslations = {};
  const loadTypes = {};
  const truckTypes = {};
  const loadDetails = {};
  const externalLoads = {};

  for (let i = 0; i < langCodes.length; i++) {
    const code = langCodes[i];
    const name = targetLanguages[code];
    console.log(`[${i + 1}/${langCodes.length}] Translating to ${name} (${code})...`);

    translations[code] = await translateObject(enTranslationsDict, code);
    blogTranslations[code] = await translateObject(enBlogTranslationsDict, code);
    loadTypes[code] = await translateObject(enLoadTypes, code);
    truckTypes[code] = await translateObject(enTruckTypes, code);
    loadDetails[code] = await translateObject(enLoadDetail, code);
    externalLoads[code] = await translateObject(enExternalLoad, code);
    
    await new Promise(r => setTimeout(r, 100));
  }

  console.log('\nAll translations fetched. Updating TS files...');


  // 1. Update src/utils/translations.ts
  const translationsPath = path.join(__dirname, '..', 'src', 'utils', 'translations.ts');
  if (fs.existsSync(translationsPath)) {
    let translationsContent = fs.readFileSync(translationsPath, 'utf8');

    // Update RTL_LOCALES array
    translationsContent = translationsContent.replace(
      /export const RTL_LOCALES: Locale\[\] = \['ar', 'fa'\];/g,
      "export const RTL_LOCALES: Locale[] = ['ar', 'fa', 'ur', 'he'];"
    );

    // Update export type Locale definition
    const rawLocaleReplacement = `export type Locale =
  | 'en' | 'tr' | 'es' | 'pt' | 'fr' | 'de' | 'it' | 'pl'
  | 'nl' | 'ru' | 'uk' | 'zh' | 'ja' | 'hi' | 'ar' | 'fa'
  | 'ko' | 'vi' | 'id' | 'bn' | 'ur' | 'th' | 'ms' | 'tl'
  | 'ro' | 'sv' | 'cs' | 'hu' | 'el' | 'az' | 'kk' | 'he'
  | 'bg' | 'hr' | 'sr' | 'sk' | 'da' | 'fi' | 'no' | 'uz'
  | 'ta' | 'mr' | 'ka' | 'lt' | 'lv' | 'et' | 'sl';`;

    translationsContent = translationsContent.replace(
      /export type Locale =\s*\|\s*'en'[\s\S]*?'fa';/g,
      rawLocaleReplacement
    );

    // Construct translations blocks
    let newTranslationsString = '';
    for (const code of langCodes) {
      newTranslationsString += `  ${code}: ${JSON.stringify(translations[code], null, 4)},\n`;
    }

    translationsContent = insertIntoObject(translationsContent, 'export const TRANSLATIONS: Record<Locale, TranslationDict> = {', newTranslationsString);
    fs.writeFileSync(translationsPath, translationsContent, 'utf8');
    console.log(`Updated translations in: ${translationsPath}`);
  }

  // 2. Update src/utils/blogTranslations.ts
  const blogTranslationsPath = path.join(__dirname, '..', 'src', 'utils', 'blogTranslations.ts');
  if (fs.existsSync(blogTranslationsPath)) {
    let blogContent = fs.readFileSync(blogTranslationsPath, 'utf8');

    let newBlogTranslationsString = '';
    for (const code of langCodes) {
      newBlogTranslationsString += `  ${code}: ${JSON.stringify(blogTranslations[code], null, 4)},\n`;
    }

    blogContent = insertIntoObject(blogContent, 'export const BLOG_TRANSLATIONS: Record<Locale, BlogTranslationDict> = {', newBlogTranslationsString);
    fs.writeFileSync(blogTranslationsPath, blogContent, 'utf8');
    console.log(`Updated blog translations in: ${blogTranslationsPath}`);
  }

  // 3. Update src/utils/loadDetailTranslations.ts
  const loadDetailsPath = path.join(__dirname, '..', 'src', 'utils', 'loadDetailTranslations.ts');
  if (fs.existsSync(loadDetailsPath)) {
    let loadDetailsContent = fs.readFileSync(loadDetailsPath, 'utf8');

    // Build translation strings for loadDetailTranslations
    let newLoadTypesStr = '';
    let newTruckTypesStr = '';
    let newLoadDetailStr = '';
    let newExternalLoadStr = '';
    
    for (const code of langCodes) {
      newLoadTypesStr += `  ${code}: ${JSON.stringify(loadTypes[code], null, 4)},\n`;
      newTruckTypesStr += `  ${code}: ${JSON.stringify(truckTypes[code], null, 4)},\n`;
      newLoadDetailStr += `  ${code}: ${JSON.stringify(loadDetails[code], null, 4)},\n`;
      newExternalLoadStr += `  ${code}: ${JSON.stringify(externalLoads[code], null, 4)},\n`;
    }

    // Insert into each of the four objects
    loadDetailsContent = insertIntoObject(loadDetailsContent, 'export const LOAD_TYPES_LOCALIZED', newLoadTypesStr);
    loadDetailsContent = insertIntoObject(loadDetailsContent, 'export const TRUCK_TYPES_LOCALIZED', newTruckTypesStr);
    loadDetailsContent = insertIntoObject(loadDetailsContent, 'export const LOAD_DETAIL_TRANSLATIONS', newLoadDetailStr);
    loadDetailsContent = insertIntoObject(loadDetailsContent, 'export const EXTERNAL_LOAD_TRANSLATIONS', newExternalLoadStr);

    fs.writeFileSync(loadDetailsPath, loadDetailsContent, 'utf8');
    console.log(`Updated load details translations in: ${loadDetailsPath}`);
  }

  console.log('\nAll dictionary TS files updated successfully!');
}

run().catch(e => {
  console.error('Fatal Error:', e);
});
