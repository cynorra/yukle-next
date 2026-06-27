const fs = require('fs');
const path = require('path');
const https = require('https');

// Load env variables manually from .env.local
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

const geminiApiKey = process.env.GEMINI_API_KEY;

if (!geminiApiKey) {
  console.error('GEMINI_API_KEY is not defined in .env.local!');
  process.exit(1);
}

const langs = [
  'en', 'tr', 'es', 'pt', 'fr', 'de', 'it', 'pl', 'nl', 'ru', 'uk', 'zh',
  'ja', 'hi', 'ar', 'fa', 'ko', 'vi', 'id', 'bn', 'ur', 'th', 'ms', 'tl',
  'ro', 'sv', 'cs', 'hu', 'el', 'az', 'kk', 'he', 'bg', 'hr', 'sr', 'sk',
  'da', 'fi', 'no', 'uz', 'ta', 'mr', 'ka', 'lt', 'lv', 'et', 'sl'
];

const sourceText = {
  about: {
    title: "About Us",
    description: "Loadly is the digital freight marketplace. We connect shippers and carriers safely and quickly across the globe.",
    fastEasyTitle: "Fast and Easy",
    fastEasyDesc: "Find the most suitable vehicle or load in minutes without wasting time.",
    reliableTitle: "Reliable Network",
    reliableDesc: "A reliable shipping experience with our rating system and verification processes.",
    wideTitle: "Wide Coverage",
    wideDesc: "A wide transportation network with thousands of active local and international users.",
    visionTitle: "Our Vision",
    visionP1: "By digitizing traditional logistics processes with modern technologies, we aim to create an accessible, transparent, and reliable transportation ecosystem for everyone. Whether it is a small item or a large commercial shipment, we believe that the right vehicle should be matched with the right load in the most efficient way.",
    visionP2: "Loadly contributes to reducing the environmental carbon footprint by utilizing the capacities of empty returning vehicles, while allowing shippers to optimize their costs. Thanks to our evolving algorithms, we offer smarter and faster matches every day."
  },
  contact: {
    title: "Contact Us",
    description: "You can always contact us for your questions, comments, or suggestions. Our team will get back to you as soon as possible.",
    getInTouch: "Get in Touch",
    emailTitle: "Email",
    emailDesc: "For general inquiries and support.",
    phoneTitle: "Phone",
    phoneDesc: "Business hours only (Mon-Fri, 09:00 - 18:00).",
    phoneNotAvailable: "Not available yet",
    addressTitle: "Address",
    addressDesc: "Turkey",
    quickSupport: "Quick Support",
    quickSupportDesc: "We recommend using our email channel for your urgent support needs regarding advertising opportunities, collaborations, or account management. We return within 24 hours at the latest.",
    advCollab: "Advertising & Collaboration:"
  },
  privacy: {
    title: "Privacy Policy",
    description: "Loadly platform privacy policy.",
    disclaimer: "Loadly is only a classifieds platform. The platform does not establish any brokerage, contract, or commercial relationship between shippers and carriers. Transportation, payment, and damage obligations are directly between the listing owner and the carrier. The platform accepts no liability arising from these obligations.",
    overviewTitle: "1. Overview",
    overviewDesc: "Loadly values the privacy of its users. This privacy policy explains how personal data collected, used, and protected through the Loadly platform is processed. By using the platform, you agree to the conditions stated in this policy.",
    dataTitle: "2. Collected Data",
    dataDesc: "The Loadly platform collects the following data:",
    dataL1: "Account information: Full name, email address, phone number, company name (optional), user role (shipper/driver)",
    dataL2: "Listing data: Created load listings, route information, date and location information",
    dataL3: "Communication data: Messages sent via the platform and conversation history",
    dataL4: "Technical data: IP address, browser type, device information, access times",
    dataL5: "Usage data: Platform interaction data, feature usage statistics",
    dataNote: "Loadly does not process payment information or contract data. No payment transactions occur through the platform.",
    useTitle: "3. Use of Data",
    useDesc: "Collected personal data is used for the following purposes:",
    useL1: "Account creation and user authentication",
    useL2: "Providing services for creating, publishing, and managing listings",
    useL3: "Providing messaging and communication capabilities between users",
    useL4: "Operating route matching and load-driver matching features",
    useL5: "Ensuring platform security, preventing fraud and abuse",
    useL6: "Fulfilling legal obligations",
    useL7: "Monitoring platform performance and improving user experience",
    useNote: "Loadly does not use your personal data for payment processing purposes. No payment transactions occur through the platform.",
    cookiesTitle: "4. Cookies",
    cookiesDesc: "The Loadly platform uses cookies to improve user experience and ensure the platform operates correctly. Cookie types used:",
    cookiesL1: "Session cookies: Maintaining login status and ensuring account security",
    cookiesL2: "Technical cookies: Cookies necessary for the platform to function properly",
    cookiesL3: "Analytical cookies: Analyzing and improving platform usage",
    cookiesNote: "You can disable cookies from your browser settings; however, in this case, some features of the platform may not work properly.",
    thirdPartiesTitle: "5. Third Parties",
    thirdPartiesDesc: "Your personal data may be shared with third parties in the following cases:",
    thirdPartiesL1: "Service providers providing the technical infrastructure of the platform (hosting, database services)",
    thirdPartiesL2: "Authorized public institutions: In line with legal obligations and legal requests",
    thirdPartiesL3: "Legal advisors: For the purpose of resolving legal disputes",
    thirdPartiesNote: "Loadly does not share your personal data with payment providers. No payment transactions occur through the platform.",
    securityTitle: "6. Data Security",
    securityDesc: "Loadly takes all necessary technical and administrative measures to ensure the security of your personal data. Your data is protected by encryption methods, and firewalls and access controls are implemented against unauthorized access. The platform conducts regular security tests and assessments to prevent vulnerabilities. However, no data transmission over the internet can be guaranteed to be 100% secure.",
    rightsTitle: "7. User Rights",
    rightsDesc: "Under GDPR/KVKK, you have the following rights:",
    rightsL1: "Accessing and viewing your personal data",
    rightsL2: "Requesting the correction of your inaccurate or incomplete data",
    rightsL3: "Requesting the deletion of your personal data",
    rightsL4: "Objecting to the processing of your data",
    rightsL5: "Requesting the transfer of your data",
    rightsL6: "Limiting the transfer of your data to third parties",
    rightsNote: "You can apply via kvkk@loadlyapp.com to exercise these rights.",
    changesTitle: "8. Policy Changes",
    changesDesc: "Loadly reserves the right to update this privacy policy in accordance with legal requirements or changes in platform features. Policy changes will be published on the platform, and the update date will be revised. It is recommended that you check this page regularly to stay informed of changes. By continuing to use the platform, you agree to the updated policy.",
    contactTitle: "9. Contact",
    contactDesc: "If you have questions or concerns about the privacy policy, you can contact us through the following channels:"
  },
  terms: {
    title: "Terms of Service",
    description: "Loadly platform terms and conditions of use.",
    disclaimer: "Loadly is only a classifieds platform. The platform does not establish any brokerage, contract, or commercial relationship between shippers and carriers. No payment transactions occur through the platform. Transportation, payment, and damage obligations are directly between the listing owner and the carrier. The platform accepts no guarantee or liability arising from these obligations.",
    acceptTitle: "1. Acceptance of Terms",
    acceptDesc: "By using the Loadly platform, you declare that you have read, understood, and accepted these terms of service. If you do not agree to these terms, you should not use the platform. Use of the platform is subject to these terms and all applicable legal regulations.",
    serviceTitle: "2. Description of Service",
    serviceDesc: "Loadly is solely a classifieds platform. The platform provides a listing and communication service that allows shippers to publish freight listings and carriers to apply for these listings. Loadly does not act as an intermediary between shippers and carriers. The platform does not mediate the conclusion of contracts, the execution of transportation, making payments, or establishing any commercial relationship between the parties. All relationships between listing owners and carriers are established directly and solely between these parties.",
    accountTitle: "3. User Account",
    accountDesc: "You must create an account to use the platform. You guarantee that the information you provide when creating an account is accurate and complete. You are responsible for your account security and agree not to share your account information with third parties. All actions taken on your account are assumed to be done by you.",
    rulesTitle: "4. Rules of Use",
    rulesDesc: "When using the platform, you agree to comply with the following rules:",
    rulesL1: "Not to engage in any unlawful activity",
    rulesL2: "Respecting the rights of other users",
    rulesL3: "Not providing false or misleading information",
    rulesL4: "Refraining from actions that would harm the technical infrastructure of the platform",
    rulesL5: "Not sending spam, harassment, or unsolicited messages",
    rulesL6: "Not accessing other users account information without permission",
    rulesL7: "Not using the platform for illegal purposes",
    liabilityTitle: "5. Disclaimer of Liability",
    liabilityDesc: "Loadly provides the service 'as is' and 'as available'. No liability is accepted in the following matters:",
    liabilityL1: "Contracts concluded between parties: The platform is not responsible for the content, implementation, or breach of any contract made between the shipper and the carrier",
    liabilityL2: "Damage or loss during transport: Direct parties are responsible for any damage, loss, or delay occurring during transportation",
    liabilityL3: "Payment transactions: No payment transactions occur through the platform. The platform is not responsible for fulfilling payment obligations between parties",
    liabilityL4: "Accuracy of listing information: The listing owner is solely responsible for the accuracy of the information in load listings (price, weight, load type, etc.)",
    liabilityL5: "Identity verification: The platform does not guarantee the verification of user identities. It is your responsibility to verify the identity and authorization of users",
    liabilityL6: "Legal compliance: The parties are responsible for ensuring that transportation operations are carried out in accordance with all legal requirements",
    liabilityL7: "Disputes: The platform has no liability in any dispute arising between users",
    liabilityL8: "Service interruptions: The platform is not responsible for losses caused by the platform being inaccessible for technical reasons",
    liabilityL9: "Force majeure: The platform is not responsible for service disruptions caused by natural disasters, war, pandemics, technical failures, or similar force majeure events",
    adsTitle: "6. Listings and Messaging",
    adsDesc: "Listings and messages you create on the platform are subject to the following rules:",
    adsL1: "Listings must be created solely for shipping purposes",
    adsL2: "The listing owner is responsible for the accuracy and legal compliance of listing contents",
    adsL3: "Misleading, insulting, or illegal listings cannot be published",
    adsL4: "The platform messaging feature must be used for shipping communication purposes",
    adsL5: "Loadly reserves the right to remove inappropriate content from publication",
    adsL6: "The platform is not responsible for the content of communication between listing owners and carriers",
    ipTitle: "7. Intellectual Property",
    ipDesc: "The Loadly platform, its brand, logo, design, and all intellectual property rights belong to Loadly. Platform content cannot be copied, distributed, or used for commercial purposes without permission. Intellectual property rights of content uploaded to the platform by users belong to the user, and publishing the content on the platform grants Loadly a right of use.",
    terminationTitle: "8. Account Termination",
    terminationDesc: "Loadly reserves the right to temporarily or permanently suspend or terminate the accounts of users who violate the terms of use. In case of account termination, the user will be informed. Users can delete their own accounts at any time. In the event of account deletion, your personal data may continue to be processed under legal retention obligations within the scope of GDPR/KVKK.",
    disputeTitle: "9. Dispute Resolution",
    disputeDesc: "In any dispute arising from these terms of use, a friendly resolution will be sought first. If the dispute cannot be resolved amicably, the laws of the Republic of Turkey will apply, and Istanbul Courts and Execution Offices will have exclusive jurisdiction. Loadly has no liability in disputes between users.",
    contactTitle: "10. Contact",
    contactDesc: "For questions or feedback about the terms of use, you can contact us through the following channel:"
  }
};

function callGeminiTranslate(langCode) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      contents: [{
        parts: [{
          text: "Translate the following JSON object to language code '" + langCode + "'. Keep the EXACT SAME JSON structure and keys, just translate the string values. Return ONLY valid JSON matching the structure.\\nInput JSON:\\n" + JSON.stringify(sourceText, null, 2)
        }]
      }],
      generationConfig: {
        responseMimeType: 'application/json',
      }
    });

    const options = {
      hostname: 'generativelanguage.googleapis.com',
      port: 443,
      path: "/v1beta/models/gemini-2.5-flash:generateContent?key=" + geminiApiKey,
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
            reject({ status: res.statusCode, message: (parsed.error && parsed.error.message ? parsed.error.message : data) });
            return;
          }
          
          const textResponse = parsed.candidates && parsed.candidates[0] && parsed.candidates[0].content && parsed.candidates[0].content.parts && parsed.candidates[0].content.parts[0] ? parsed.candidates[0].content.parts[0].text : null;
          if (!textResponse) {
            reject(new Error('Empty response from Gemini API'));
            return;
          }
          
          resolve(JSON.parse(textResponse));
        } catch (e) {
          reject(new Error("Failed to parse Gemini output: " + e.message));
        }
      });
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

const targetDir = path.join(__dirname, '../src/utils/legal-translations');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Always save 'en' directly since we already have it
fs.writeFileSync(path.join(targetDir, 'en.json'), JSON.stringify(sourceText, null, 2));

async function run() {
  console.log('Translating legal pages for all 47 languages...');
  
  for (const lang of langs) {
    if (lang === 'en') continue;
    
    const filePath = path.join(targetDir, lang + '.json');
    if (fs.existsSync(filePath)) {
      console.log("Skipping " + lang + ", already exists.");
      continue;
    }

    console.log("Translating " + lang + "...");
    let success = false;
    let attempts = 0;
    while (!success && attempts < 5) {
      attempts++;
      try {
        const translated = await callGeminiTranslate(lang);
        fs.writeFileSync(filePath, JSON.stringify(translated, null, 2));
        console.log("Saved " + lang + ".json");
        success = true;
      } catch (e) {
        if (e.status === 429) {
          console.log("Rate limit hit, waiting 20 seconds before retry...");
          await new Promise(r => setTimeout(r, 20000));
        } else {
          console.error("Error for " + lang + ":", e.message || e);
          break; // Don't retry non-429 errors
        }
      }
    }
    
    // Base sleep between successful requests
    if (success) {
      await new Promise(r => setTimeout(r, 10000));
    }
  }
  
  console.log('Finished translating all pages.');
}

run();
