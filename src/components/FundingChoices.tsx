'use client';

import Script from 'next/script';

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || 'ca-pub-4674211063760769';

// Google's certified, IAB TCF-integrated consent message (AdSense -> Privacy & messaging).
// It only shows to visitors the message is configured for (EEA, UK, Switzerland); everywhere else
// the site's own banner (CookieConsent) stays in charge. Tag as documented by Google.
export default function FundingChoices() {
  if (!ADSENSE_CLIENT) return null;
  const pub = ADSENSE_CLIENT.replace(/^ca-/, '');
  return (
    <>
      <Script
        id="funding-choices"
        async
        src={`https://fundingchoices.google.com/i/${pub}?ers=1`}
        strategy="afterInteractive"
      />
      <Script id="funding-choices-present" strategy="afterInteractive">
        {`(function(){function s(){if(!window.frames['googlefcPresent']){if(document.body){var i=document.createElement('iframe');i.style='width:0;height:0;border:none;z-index:-1000;left:-1000px;top:-1000px;';i.style.display='none';i.name='googlefcPresent';document.body.appendChild(i);}else{setTimeout(s,0);}}}s();})();`}
      </Script>
    </>
  );
}
