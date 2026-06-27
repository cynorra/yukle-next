const fs = require('fs');

const privacyContent = `'use client';

import { useT } from '@/hooks/useT';
import { Lock, AlertTriangle } from 'lucide-react';
import { useParams } from 'next/navigation';
import type { Locale } from '@/utils/translations';

export function PrivacyPageClient() {
  const t = useT();
  const params = useParams();
  const locale = (params.locale as Locale) || 'en';
  const isTr = locale === 'tr';

  return (
    <div className={t.pageFull}>
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={\`text-2xl font-bold \${t.heading} flex items-center gap-3\`}>
            <Lock size={28} className="text-[#F5A623]" />
            {isTr ? 'Gizlilik Politikası' : 'Privacy Policy'}
          </h1>
          <p className={\`text-sm \${t.muted} mt-1\`}>
            {isTr ? 'YükLe platformu gizlilik politikası.' : 'Loadly platform privacy policy.'}
          </p>
        </div>

        {/* Red disclaimer box */}
        <div className="mb-8 p-5 rounded-2xl bg-red-500/10 border border-red-500/20 backdrop-blur-xl">
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} className="text-red-400 shrink-0 mt-0.5" />
            <p className="text-sm text-red-300 leading-relaxed">
              {isTr 
                ? 'YükLe yalnızca bir ilan platformudur. Platform, yük sahipleri ve nakliyeciler arasında hiçbir aracılık, sözleşme veya ticari ilişki kurmaz. Taşıma, ödeme ve hasar yükümlülükleri doğrudan ilan sahibi ve nakliyeci arasındadır. Platform, bu yükümlülüklerden doğan hiçbir sorumluluk kabul etmez.'
                : 'Loadly is only a classifieds platform. The platform does not establish any brokerage, contract, or commercial relationship between shippers and carriers. Transportation, payment, and damage obligations are directly between the listing owner and the carrier. The platform accepts no liability arising from these obligations.'}
            </p>
          </div>
        </div>

        {/* Section 1: Genel Bakış */}
        <div className={\`p-6 rounded-2xl \${t.card} mb-4\`}>
          <h2 className={\`text-lg font-bold \${t.heading} mb-3\`}>1. {isTr ? 'Genel Bakış' : 'Overview'}</h2>
          <p className={\`text-sm \${t.sub} leading-relaxed\`}>
            {isTr 
              ? 'YükLe, kullanıcılarının gizliliğine önem vermektedir. Bu gizlilik politikası, YükLe platformu üzerinden toplanan, kullanılan ve korunan kişisel verilerin nasıl işlendiğini açıklamaktadır. Platformu kullanarak bu politikada belirtilen koşulları kabul etmiş sayılırsınız.'
              : 'Loadly values the privacy of its users. This privacy policy explains how personal data collected, used, and protected through the Loadly platform is processed. By using the platform, you agree to the conditions stated in this policy.'}
          </p>
        </div>

        {/* Section 2: Toplanan Veriler */}
        <div className={\`p-6 rounded-2xl \${t.card} mb-4\`}>
          <h2 className={\`text-lg font-bold \${t.heading} mb-3\`}>2. {isTr ? 'Toplanan Veriler' : 'Collected Data'}</h2>
          <p className={\`text-sm \${t.sub} leading-relaxed mb-3\`}>
            {isTr ? 'YükLe platformu aşağıdaki verileri toplamaktadır:' : 'The Loadly platform collects the following data:'}
          </p>
          <ul className={\`list-disc list-inside space-y-2 text-sm \${t.sub}\`}>
            <li>{isTr ? 'Hesap bilgileri: Ad soyad, e-posta adresi, telefon numarası, firma adı (opsiyonel), kullanıcı rolü (yük sahibi/sürücü)' : 'Account information: Full name, email address, phone number, company name (optional), user role (shipper/driver)'}</li>
            <li>{isTr ? 'İlan verileri: Oluşturulan yük ilanları, güzergah bilgileri, tarih ve lokasyon bilgileri' : 'Listing data: Created load listings, route information, date and location information'}</li>
            <li>{isTr ? 'İletişim verileri: Platform üzerinden gönderilen mesajlar ve konuşma geçmişi' : 'Communication data: Messages sent via the platform and conversation history'}</li>
            <li>{isTr ? 'Teknik veriler: IP adresi, tarayıcı türü, cihaz bilgileri, erişim zamanları' : 'Technical data: IP address, browser type, device information, access times'}</li>
            <li>{isTr ? 'Kullanım verileri: Platform etkileşim verileri, özellik kullanım istatistikleri' : 'Usage data: Platform interaction data, feature usage statistics'}</li>
          </ul>
          <p className={\`text-sm \${t.muted} mt-3 italic\`}>
            {isTr 
              ? 'YükLe, ödeme bilgileri veya sözleşme verilerini işlememektedir. Platform üzerinden herhangi bir ödeme işlemi gerçekleşmemektedir.'
              : 'Loadly does not process payment information or contract data. No payment transactions occur through the platform.'}
          </p>
        </div>

        {/* Section 3: Verilerin Kullanımı */}
        <div className={\`p-6 rounded-2xl \${t.card} mb-4\`}>
          <h2 className={\`text-lg font-bold \${t.heading} mb-3\`}>3. {isTr ? 'Verilerin Kullanımı' : 'Use of Data'}</h2>
          <p className={\`text-sm \${t.sub} leading-relaxed mb-3\`}>
            {isTr ? 'Toplanan kişisel veriler aşağıdaki amaçlarla kullanılmaktadır:' : 'Collected personal data is used for the following purposes:'}
          </p>
          <ul className={\`list-disc list-inside space-y-2 text-sm \${t.sub}\`}>
            <li>{isTr ? 'Hesap oluşturma ve kullanıcı kimlik doğrulaması' : 'Account creation and user authentication'}</li>
            <li>{isTr ? 'İlan oluşturma, yayınlama ve yönetimi hizmetlerinin sunulması' : 'Providing services for creating, publishing, and managing listings'}</li>
            <li>{isTr ? 'Kullanıcılar arası mesajlaşma ve iletişim imkânının sağlanması' : 'Providing messaging and communication capabilities between users'}</li>
            <li>{isTr ? 'Güzergah eşleştirme ve yük-sürücü eşleştirme özelliklerinin çalıştırılması' : 'Operating route matching and load-driver matching features'}</li>
            <li>{isTr ? 'Platform güvenliğinin sağlanması, dolandırıcılık ve kötüye kullanımın önlenmesi' : 'Ensuring platform security, preventing fraud and abuse'}</li>
            <li>{isTr ? 'Yasal yükümlülüklerin yerine getirilmesi' : 'Fulfilling legal obligations'}</li>
            <li>{isTr ? 'Platform performansının izlenmesi ve kullanıcı deneyiminin iyileştirilmesi' : 'Monitoring platform performance and improving user experience'}</li>
          </ul>
          <p className={\`text-sm \${t.muted} mt-3 italic\`}>
            {isTr 
              ? 'YükLe, kişisel verilerinizi ödeme işleme amacıyla kullanmamaktadır. Platform üzerinden herhangi bir ödeme işlemi gerçekleşmemektedir.'
              : 'Loadly does not use your personal data for payment processing purposes. No payment transactions occur through the platform.'}
          </p>
        </div>

        {/* Section 4: Çerezler */}
        <div className={\`p-6 rounded-2xl \${t.card} mb-4\`}>
          <h2 className={\`text-lg font-bold \${t.heading} mb-3\`}>4. {isTr ? 'Çerezler' : 'Cookies'}</h2>
          <p className={\`text-sm \${t.sub} leading-relaxed mb-3\`}>
            {isTr 
              ? 'YükLe platformu, kullanıcı deneyimini iyileştirmek ve platformun çalışmasını sağlamak için çerezler kullanmaktadır. Kullanılan çerez türleri:'
              : 'The Loadly platform uses cookies to improve user experience and ensure the platform operates correctly. Cookie types used:'}
          </p>
          <ul className={\`list-disc list-inside space-y-2 text-sm \${t.sub}\`}>
            <li>{isTr ? 'Oturum çerezleri: Giriş durumunun korunması ve hesap güvenliğinin sağlanması' : 'Session cookies: Maintaining login status and ensuring account security'}</li>
            <li>{isTr ? 'Teknik çerezler: Platformun düzgün çalışması için gerekli olan çerezler' : 'Technical cookies: Cookies necessary for the platform to function properly'}</li>
            <li>{isTr ? 'Analitik çerezler: Platform kullanımının analiz edilmesi ve iyileştirilmesi' : 'Analytical cookies: Analyzing and improving platform usage'}</li>
          </ul>
          <p className={\`text-sm \${t.sub} leading-relaxed mt-3\`}>
            {isTr 
              ? 'Tarayıcı ayarlarınızdan çerezleri devre dışı bırakabilirsiniz; ancak bu durumda platformun bazı özellikleri düzgün çalışmayabilir.'
              : 'You can disable cookies from your browser settings; however, in this case, some features of the platform may not work properly.'}
          </p>
        </div>

        {/* Section 5: Üçüncü Taraflar */}
        <div className={\`p-6 rounded-2xl \${t.card} mb-4\`}>
          <h2 className={\`text-lg font-bold \${t.heading} mb-3\`}>5. {isTr ? 'Üçüncü Taraflar' : 'Third Parties'}</h2>
          <p className={\`text-sm \${t.sub} leading-relaxed mb-3\`}>
            {isTr ? 'Kişisel verileriniz aşağıdaki durumlarda üçüncü taraflarla paylaşılabilmektedir:' : 'Your personal data may be shared with third parties in the following cases:'}
          </p>
          <ul className={\`list-disc list-inside space-y-2 text-sm \${t.sub}\`}>
            <li>{isTr ? 'Platformun teknik altyapısını sağlayan hizmet sağlayıcıları (barındırma, veritabanı hizmetleri)' : 'Service providers providing the technical infrastructure of the platform (hosting, database services)'}</li>
            <li>{isTr ? 'Yetkili kamu kurumları: Yasal zorunluluklar ve yasal talepler doğrultusunda' : 'Authorized public institutions: In line with legal obligations and legal requests'}</li>
            <li>{isTr ? 'Hukuki danışmanlar: Hukuki uyuşmazlıkların çözümü amacıyla' : 'Legal advisors: For the purpose of resolving legal disputes'}</li>
          </ul>
          <p className={\`text-sm \${t.muted} mt-3 italic\`}>
            {isTr 
              ? 'YükLe, kişisel verilerinizi ödeme sağlayıcılarıyla paylaşmamaktadır. Platform üzerinden herhangi bir ödeme işlemi gerçekleşmemektedir.'
              : 'Loadly does not share your personal data with payment providers. No payment transactions occur through the platform.'}
          </p>
        </div>

        {/* Section 6: Veri Güvenliği */}
        <div className={\`p-6 rounded-2xl \${t.card} mb-4\`}>
          <h2 className={\`text-lg font-bold \${t.heading} mb-3\`}>6. {isTr ? 'Veri Güvenliği' : 'Data Security'}</h2>
          <p className={\`text-sm \${t.sub} leading-relaxed\`}>
            {isTr 
              ? 'YükLe, kişisel verilerinizin güvenliğini sağlamak için gerekli tüm teknik ve idari tedbirleri almaktadır. Verileriniz, şifreleme yöntemleri ile korunmakta, yetkisiz erişime karşı güvenlik duvarları ve erişim kontrolleri uygulanmaktadır. Platform, güvenlik açıklarını önlemek için düzenli güvenlik testleri ve değerlendirmeleri yapmaktadır. Ancak, internet üzerinden yapılan hiçbir veri iletiminin %100 güvenli olduğu garanti edilemez.'
              : 'Loadly takes all necessary technical and administrative measures to ensure the security of your personal data. Your data is protected by encryption methods, and firewalls and access controls are implemented against unauthorized access. The platform conducts regular security tests and assessments to prevent vulnerabilities. However, no data transmission over the internet can be guaranteed to be 100% secure.'}
          </p>
        </div>

        {/* Section 7: Kullanıcı Hakları */}
        <div className={\`p-6 rounded-2xl \${t.card} mb-4\`}>
          <h2 className={\`text-lg font-bold \${t.heading} mb-3\`}>7. {isTr ? 'Kullanıcı Hakları' : 'User Rights'}</h2>
          <p className={\`text-sm \${t.sub} leading-relaxed mb-3\`}>
            {isTr ? 'KVKK kapsamında aşağıdaki haklara sahipsiniz:' : 'Under GDPR/KVKK, you have the following rights:'}
          </p>
          <ul className={\`list-disc list-inside space-y-2 text-sm \${t.sub}\`}>
            <li>{isTr ? 'Kişisel verilerinize erişme ve bunları görüntüleme' : 'Accessing and viewing your personal data'}</li>
            <li>{isTr ? 'Hatalı veya eksik verilerinizin düzeltilmesini isteme' : 'Requesting the correction of your inaccurate or incomplete data'}</li>
            <li>{isTr ? 'Kişisel verilerinizin silinmesini talep etme' : 'Requesting the deletion of your personal data'}</li>
            <li>{isTr ? 'Verilerinizin işlenmesine itiraz etme' : 'Objecting to the processing of your data'}</li>
            <li>{isTr ? 'Verilerinizin taşınmasını talep etme' : 'Requesting the transfer of your data'}</li>
            <li>{isTr ? 'Verilerinizin üçüncü taraflara aktarılmasını sınırlama' : 'Limiting the transfer of your data to third parties'}</li>
          </ul>
          <p className={\`text-sm \${t.sub} leading-relaxed mt-3\`}>
            {isTr ? 'Bu haklarınızı kullanmak için ' : 'You can apply via '}
            <a href="mailto:kvkk@loadlyapp.com" className="text-[#F5A623] hover:underline">kvkk@loadlyapp.com</a>
            {isTr ? ' adresi üzerinden başvuruda bulunabilirsiniz.' : ' to exercise these rights.'}
          </p>
        </div>

        {/* Section 8: Politika Değişiklikleri */}
        <div className={\`p-6 rounded-2xl \${t.card} mb-4\`}>
          <h2 className={\`text-lg font-bold \${t.heading} mb-3\`}>8. {isTr ? 'Politika Değişiklikleri' : 'Policy Changes'}</h2>
          <p className={\`text-sm \${t.sub} leading-relaxed\`}>
            {isTr 
              ? 'YükLe, bu gizlilik politikasını yasal gerekliliklere veya platform özelliklerindeki değişikliklere uygun olarak güncelleme hakkını saklı tutar. Politika değişiklikleri platform üzerinden yayımlanacak ve güncelleme tarihi değiştirilecektir. Değişikliklerden haberdar olmak için bu sayfayı düzenli olarak kontrol etmeniz önerilir. Platformu kullanmaya devam etmeniz, güncellenmiş politikayı kabul ettiğiniz anlamına gelir.'
              : 'Loadly reserves the right to update this privacy policy in accordance with legal requirements or changes in platform features. Policy changes will be published on the platform, and the update date will be revised. It is recommended that you check this page regularly to stay informed of changes. By continuing to use the platform, you agree to the updated policy.'}
          </p>
        </div>

        {/* Section 9: İletişim */}
        <div className={\`p-6 rounded-2xl \${t.card} mb-4\`}>
          <h2 className={\`text-lg font-bold \${t.heading} mb-3\`}>9. {isTr ? 'İletişim' : 'Contact'}</h2>
          <p className={\`text-sm \${t.sub} leading-relaxed\`}>
            {isTr 
              ? 'Gizlilik politikası hakkında sorularınız veya endişeleriniz varsa, aşağıdaki kanallardan bizimle iletişime geçebilirsiniz:'
              : 'If you have questions or concerns about the privacy policy, you can contact us through the following channels:'}
          </p>
          <ul className={\`list-none space-y-2 text-sm \${t.sub} mt-3\`}>
            <li>{isTr ? 'E-posta:' : 'Email:'} <a href="mailto:kvkk@loadlyapp.com" className="text-[#F5A623] hover:underline">kvkk@loadlyapp.com</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
`;

const termsContent = `'use client';

import { useT } from '@/hooks/useT';
import { FileText, AlertTriangle } from 'lucide-react';
import { useParams } from 'next/navigation';
import type { Locale } from '@/utils/translations';

export function TermsPageClient() {
  const t = useT();
  const params = useParams();
  const locale = (params.locale as Locale) || 'en';
  const isTr = locale === 'tr';

  return (
    <div className={t.pageFull}>
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={\`text-2xl font-bold \${t.heading} flex items-center gap-3\`}>
            <FileText size={28} className="text-[#F5A623]" />
            {isTr ? 'Kullanım Koşulları' : 'Terms of Service'}
          </h1>
          <p className={\`text-sm \${t.muted} mt-1\`}>
            {isTr ? 'YükLe platformu kullanım koşulları ve şartları.' : 'Loadly platform terms and conditions of use.'}
          </p>
        </div>

        {/* Red disclaimer box */}
        <div className="mb-8 p-5 rounded-2xl bg-red-500/10 border border-red-500/20 backdrop-blur-xl">
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} className="text-red-400 shrink-0 mt-0.5" />
            <p className="text-sm text-red-300 leading-relaxed">
              {isTr 
                ? 'YükLe yalnızca bir ilan platformudur. Platform, yük sahipleri ve nakliyeciler arasında hiçbir aracılık, sözleşme veya ticari ilişki kurmaz. Platform üzerinden herhangi bir ödeme işlemi gerçekleşmemektedir. Taşıma, ödeme ve hasar yükümlülükleri doğrudan ilan sahibi ve nakliyeci arasındadır. Platform, bu yükümlülüklerden doğan hiçbir garanti veya sorumluluk kabul etmez.'
                : 'Loadly is only a classifieds platform. The platform does not establish any brokerage, contract, or commercial relationship between shippers and carriers. No payment transactions occur through the platform. Transportation, payment, and damage obligations are directly between the listing owner and the carrier. The platform accepts no guarantee or liability arising from these obligations.'}
            </p>
          </div>
        </div>

        {/* Section 1: Kabul Şartları */}
        <div className={\`p-6 rounded-2xl \${t.card} mb-4\`}>
          <h2 className={\`text-lg font-bold \${t.heading} mb-3\`}>1. {isTr ? 'Kabul Şartları' : 'Acceptance of Terms'}</h2>
          <p className={\`text-sm \${t.sub} leading-relaxed\`}>
            {isTr 
              ? 'YükLe platformunu kullanarak bu kullanım koşullarını okuduğunuzu, anladığınızı ve kabul ettiğinizi beyan etmiş olursunuz. Bu koşulları kabul etmiyorsanız, platformu kullanmamanız gerekmektedir. Platformun kullanımı, bu koşullara ve yürürlükteki tüm yasal düzenlemelere tabidir.'
              : 'By using the Loadly platform, you declare that you have read, understood, and accepted these terms of service. If you do not agree to these terms, you should not use the platform. Use of the platform is subject to these terms and all applicable legal regulations.'}
          </p>
        </div>

        {/* Section 2: Hizmet Tanımı */}
        <div className={\`p-6 rounded-2xl \${t.card} mb-4\`}>
          <h2 className={\`text-lg font-bold \${t.heading} mb-3\`}>2. {isTr ? 'Hizmet Tanımı' : 'Description of Service'}</h2>
          <p className={\`text-sm \${t.sub} leading-relaxed\`}>
            {isTr 
              ? 'YükLe, yalnızca bir ilan platformudur. Platform, yük sahiplerinin nakliye ilanlarını yayınlamalarına ve nakliyecilerin bu ilanlara başvurmalarına olanak tanıyan bir ilan ve iletişim hizmeti sunmaktadır. YükLe, yük sahipleri ve nakliyeciler arasında hiçbir aracılık yapmamaktadır. Platform, taraflar arasında sözleşme akdedilmesine, taşınma işinin yürütülmesine, ödeme yapılmasına veya herhangi bir ticari ilişkinin kurulmasına aracılık etmez. İlan sahipleri ve nakliyeciler arasındaki tüm ilişkiler doğrudan ve yalnızca bu taraflar arasında kurulur.'
              : 'Loadly is solely a classifieds platform. The platform provides a listing and communication service that allows shippers to publish freight listings and carriers to apply for these listings. Loadly does not act as an intermediary between shippers and carriers. The platform does not mediate the conclusion of contracts, the execution of transportation, making payments, or establishing any commercial relationship between the parties. All relationships between listing owners and carriers are established directly and solely between these parties.'}
          </p>
        </div>

        {/* Section 3: Kullanıcı Hesabı */}
        <div className={\`p-6 rounded-2xl \${t.card} mb-4\`}>
          <h2 className={\`text-lg font-bold \${t.heading} mb-3\`}>3. {isTr ? 'Kullanıcı Hesabı' : 'User Account'}</h2>
          <p className={\`text-sm \${t.sub} leading-relaxed mb-3\`}>
            {isTr 
              ? 'Platformu kullanmak için bir hesap oluşturmanız gerekmektedir. Hesap oluştururken verdiğiniz bilgilerin doğru ve eksiksiz olduğunu taahhüt edersiniz. Hesap güvenliğinizden siz sorumlusunuz ve hesap bilgilerinizi üçüncü kişilerle paylaşmamayı kabul edersiniz. Hesabınızda gerçekleşen tüm işlemlerin sizin tarafınızdan yapıldığı varsayılır.'
              : 'You must create an account to use the platform. You guarantee that the information you provide when creating an account is accurate and complete. You are responsible for your account security and agree not to share your account information with third parties. All actions taken on your account are assumed to be done by you.'}
          </p>
        </div>

        {/* Section 4: Kullanım Kuralları */}
        <div className={\`p-6 rounded-2xl \${t.card} mb-4\`}>
          <h2 className={\`text-lg font-bold \${t.heading} mb-3\`}>4. {isTr ? 'Kullanım Kuralları' : 'Rules of Use'}</h2>
          <p className={\`text-sm \${t.sub} leading-relaxed mb-3\`}>
            {isTr ? 'Platformu kullanırken aşağıdaki kurallara uymayı kabul edersiniz:' : 'When using the platform, you agree to comply with the following rules:'}
          </p>
          <ul className={\`list-disc list-inside space-y-2 text-sm \${t.sub}\`}>
            <li>{isTr ? 'Yasalara aykırı herhangi bir faaliyette bulunmamak' : 'Not to engage in any unlawful activity'}</li>
            <li>{isTr ? 'Diğer kullanıcıların haklarına saygı göstermek' : 'Respecting the rights of other users'}</li>
            <li>{isTr ? 'Yanlış veya yanıltıcı bilgi vermemek' : 'Not providing false or misleading information'}</li>
            <li>{isTr ? 'Platformun teknik altyapısına zarar verecek eylemlerden kaçınmak' : 'Refraining from actions that would harm the technical infrastructure of the platform'}</li>
            <li>{isTr ? 'Spam, taciz veya istenmeyen mesaj göndermemek' : 'Not sending spam, harassment, or unsolicited messages'}</li>
            <li>{isTr ? 'Başka kullanıcıların hesap bilgilerine izinsiz erişmemek' : 'Not accessing other users account information without permission'}</li>
            <li>{isTr ? 'Platformu yasal olmayan amaçlarla kullanmamak' : 'Not using the platform for illegal purposes'}</li>
          </ul>
        </div>

        {/* Section 5: Sorumluluk Reddi */}
        <div className={\`p-6 rounded-2xl \${t.card} mb-4\`}>
          <h2 className={\`text-lg font-bold \${t.heading} mb-3\`}>5. {isTr ? 'Sorumluluk Reddi' : 'Disclaimer of Liability'}</h2>
          <p className={\`text-sm \${t.sub} leading-relaxed mb-3\`}>
            {isTr 
              ? 'YükLe, "olduğu gibi" ve "mevcut haliyle" hizmet sunmaktadır. Aşağıdaki hususlarda hiçbir sorumluluk kabul edilmez:'
              : 'Loadly provides the service "as is" and "as available". No liability is accepted in the following matters:'}
          </p>
          <ul className={\`list-disc list-inside space-y-2 text-sm \${t.sub}\`}>
            <li>{isTr ? 'Taraflar arasında akdedilen sözleşmeler: Platform, yük sahibi ve nakliyeci arasında yapılan herhangi bir sözleşmenin içeriğinden, uygulanmasından veya ihlalinden sorumlu değildir' : 'Contracts concluded between parties: The platform is not responsible for the content, implementation, or breach of any contract made between the shipper and the carrier'}</li>
            <li>{isTr ? 'Taşıma sırasında oluşabilecek hasar veya kayıp: Nakliye esnasında meydana gelen her türlü hasar, kayıp veya gecikmeden doğrudan ilgili taraflar sorumludur' : 'Damage or loss during transport: Direct parties are responsible for any damage, loss, or delay occurring during transportation'}</li>
            <li>{isTr ? 'Ödeme işlemleri: Platform üzerinden herhangi bir ödeme işlemi gerçekleşmemektedir. Taraflar arasındaki ödeme yükümlülüklerinin yerine getirilmesinden platform sorumlu değildir' : 'Payment transactions: No payment transactions occur through the platform. The platform is not responsible for fulfilling payment obligations between parties'}</li>
            <li>{isTr ? 'İlan bilgilerinin doğruluğu: Yük ilanlarında yer alan bilgilerin (fiyat, ağırlık, yük tipi vb.) doğruluğundan yalnızca ilan sahibi sorumludur' : 'Accuracy of listing information: The listing owner is solely responsible for the accuracy of the information in load listings (price, weight, load type, etc.)'}</li>
            <li>{isTr ? 'Kimlik doğrulama: Platform, kullanıcı kimliklerinin doğrulanmasını garanti etmez. Kullanıcıların kimlik ve yetki bilgilerini doğrulama sorumluluğu tarafınıza aittir' : 'Identity verification: The platform does not guarantee the verification of user identities. It is your responsibility to verify the identity and authorization of users'}</li>
            <li>{isTr ? 'Yasal uyum: Taşıma işlemlerinin tüm yasal gerekliliklere uygun olarak gerçekleştirilmesinden taraflar sorumludur' : 'Legal compliance: The parties are responsible for ensuring that transportation operations are carried out in accordance with all legal requirements'}</li>
            <li>{isTr ? 'Uyuşmazlıklar: Kullanıcılar arasında doğan her türlü uyuşmazlıkta platformun herhangi bir sorumluluğu yoktur' : 'Disputes: The platform has no liability in any dispute arising between users'}</li>
            <li>{isTr ? 'Hizmet kesintileri: Platformun teknik nedenlerle erişilemez olmasından kaynaklanan kayıplardan platform sorumlu değildir' : 'Service interruptions: The platform is not responsible for losses caused by the platform being inaccessible for technical reasons'}</li>
            <li>{isTr ? 'Mücbir sebepler: Doğal afet, savaş, pandemi, teknik arıza veya benzeri mücbir sebeplerden kaynaklanan hizmet aksaklıklarından platform sorumlu değildir' : 'Force majeure: The platform is not responsible for service disruptions caused by natural disasters, war, pandemics, technical failures, or similar force majeure events'}</li>
          </ul>
        </div>

        {/* Section 6: İlan ve Mesajlaşma */}
        <div className={\`p-6 rounded-2xl \${t.card} mb-4\`}>
          <h2 className={\`text-lg font-bold \${t.heading} mb-3\`}>6. {isTr ? 'İlan ve Mesajlaşma' : 'Listings and Messaging'}</h2>
          <p className={\`text-sm \${t.sub} leading-relaxed mb-3\`}>
            {isTr ? 'Platform üzerinde oluşturduğunuz ilanlar ve mesajlar aşağıdaki kurallara tabidir:' : 'Listings and messages you create on the platform are subject to the following rules:'}
          </p>
          <ul className={\`list-disc list-inside space-y-2 text-sm \${t.sub}\`}>
            <li>{isTr ? 'İlanlar, yalnızca nakliye amaçlı oluşturulmalıdır' : 'Listings must be created solely for shipping purposes'}</li>
            <li>{isTr ? 'İlan içeriklerinin doğruluğundan ve yasal uyumluluğundan ilan sahibi sorumludur' : 'The listing owner is responsible for the accuracy and legal compliance of listing contents'}</li>
            <li>{isTr ? 'Yanıltıcı, hakaret içereren veya yasa dışı içerikli ilanlar yayımlanamaz' : 'Misleading, insulting, or illegal listings cannot be published'}</li>
            <li>{isTr ? 'Platform mesajlaşma özelliği, nakliye iletişimi amacıyla kullanılmalıdır' : 'The platform messaging feature must be used for shipping communication purposes'}</li>
            <li>{isTr ? 'YükLe, uygun olmayan içerikleri yayımlandan kaldırma hakkını saklı tutar' : 'Loadly reserves the right to remove inappropriate content from publication'}</li>
            <li>{isTr ? 'İlan sahipleri ve nakliyeciler arasındaki iletişimin içeriğinden platform sorumlu değildir' : 'The platform is not responsible for the content of communication between listing owners and carriers'}</li>
          </ul>
        </div>

        {/* Section 7: Fikri Mülkiyet */}
        <div className={\`p-6 rounded-2xl \${t.card} mb-4\`}>
          <h2 className={\`text-lg font-bold \${t.heading} mb-3\`}>7. {isTr ? 'Fikri Mülkiyet' : 'Intellectual Property'}</h2>
          <p className={\`text-sm \${t.sub} leading-relaxed\`}>
            {isTr 
              ? 'YükLe platformu, markası, logosu, tasarımı ve tüm fikri mülkiyet hakları YükLe\\'ye aittir. Platform içeriği izinsiz olarak kopyalanamaz, dağıtılamaz veya ticari amaçlarla kullanılamaz. Kullanıcılar tarafından platforma yüklenen içeriklerin fikri mülkiyet hakları kullanıcıya ait olup, içeriklerin platformda yayımlanması YükLe\\'ye kullanım hakkı vermektedir.'
              : 'The Loadly platform, its brand, logo, design, and all intellectual property rights belong to Loadly. Platform content cannot be copied, distributed, or used for commercial purposes without permission. Intellectual property rights of content uploaded to the platform by users belong to the user, and publishing the content on the platform grants Loadly a right of use.'}
          </p>
        </div>

        {/* Section 8: Hesap Feshi */}
        <div className={\`p-6 rounded-2xl \${t.card} mb-4\`}>
          <h2 className={\`text-lg font-bold \${t.heading} mb-3\`}>8. {isTr ? 'Hesap Feshi' : 'Account Termination'}</h2>
          <p className={\`text-sm \${t.sub} leading-relaxed\`}>
            {isTr 
              ? 'YükLe, kullanım koşullarını ihlal eden kullanıcıların hesaplarını geçici veya kalıcı olarak askıya alma veya feshetme hakkını saklı tutar. Hesap feshi durumunda, kullanıcıya bilgilendirme yapılacaktır. Kullanıcılar, istedikleri zaman kendi hesaplarını silebilirler. Hesap silinmesi durumunda, kişisel verileriniz KVKK kapsamında yasal saklama yükümlülükleri çerçevesinde işlenmeye devam edebilir.'
              : 'Loadly reserves the right to temporarily or permanently suspend or terminate the accounts of users who violate the terms of use. In case of account termination, the user will be informed. Users can delete their own accounts at any time. In the event of account deletion, your personal data may continue to be processed under legal retention obligations within the scope of GDPR/KVKK.'}
          </p>
        </div>

        {/* Section 9: Uyuşmazlık Çözümü */}
        <div className={\`p-6 rounded-2xl \${t.card} mb-4\`}>
          <h2 className={\`text-lg font-bold \${t.heading} mb-3\`}>9. {isTr ? 'Uyuşmazlık Çözümü' : 'Dispute Resolution'}</h2>
          <p className={\`text-sm \${t.sub} leading-relaxed\`}>
            {isTr 
              ? 'Bu kullanım koşullarından doğan her türlü uyuşmazlıkta, öncelikle dostane yollarla çözüm aranacaktır. Uyuşmazlığın dostane yollarla çözülememesi halinde, Türkiye Cumhuriyeti yasaları uygulanacak ve İstanbul Mahkemeleri ve İcra Daireleri münhasıran yetkili olacaktır. Kullanıcılar arasındaki uyuşmazlıklarda YükLe\\'nin herhangi bir sorumluluğu yoktur.'
              : 'In any dispute arising from these terms of use, a friendly resolution will be sought first. If the dispute cannot be resolved amicably, the laws of the Republic of Turkey will apply, and Istanbul Courts and Execution Offices will have exclusive jurisdiction. Loadly has no liability in disputes between users.'}
          </p>
        </div>

        {/* Section 10: İletişim */}
        <div className={\`p-6 rounded-2xl \${t.card} mb-4\`}>
          <h2 className={\`text-lg font-bold \${t.heading} mb-3\`}>10. {isTr ? 'İletişim' : 'Contact'}</h2>
          <p className={\`text-sm \${t.sub} leading-relaxed\`}>
            {isTr 
              ? 'Kullanım koşulları hakkında sorularınız veya geri bildirimleriniz için aşağıdaki kanaldan bizimle iletişime geçebilirsiniz:'
              : 'For questions or feedback about the terms of use, you can contact us through the following channel:'}
          </p>
          <ul className={\`list-none space-y-2 text-sm \${t.sub} mt-3\`}>
            <li>{isTr ? 'E-posta:' : 'Email:'} <a href="mailto:info@loadlyapp.com" className="text-[#F5A623] hover:underline">info@loadlyapp.com</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
`;

fs.writeFileSync('d:/android-projeler/yukle-next/src/app/[locale]/privacy/PrivacyPageClient.tsx', privacyContent);
fs.writeFileSync('d:/android-projeler/yukle-next/src/app/[locale]/terms/TermsPageClient.tsx', termsContent);
console.log('Successfully updated Privacy and Terms pages.');
