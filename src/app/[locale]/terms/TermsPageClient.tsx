'use client';

import { useT } from '@/hooks/useT';
import { FileText, AlertTriangle } from 'lucide-react';

export function TermsPageClient() {
  const t = useT();

  return (
    <div className={t.pageFull}>
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-2xl font-bold ${t.heading} flex items-center gap-3`}>
            <FileText size={28} className="text-[#F5A623]" />
            Kullanım Koşulları
          </h1>
          <p className={`text-sm ${t.muted} mt-1`}>YükLe platformu kullanım koşulları ve şartları.</p>
        </div>

        {/* Red disclaimer box */}
        <div className="mb-8 p-5 rounded-2xl bg-red-500/10 border border-red-500/20 backdrop-blur-xl">
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} className="text-red-400 shrink-0 mt-0.5" />
            <p className="text-sm text-red-300 leading-relaxed">
              YükLe yalnızca bir ilan platformudur. Platform, yük sahipleri ve nakliyeciler arasında hiçbir aracılık, sözleşme veya ticari ilişki kurmaz. Platform üzerinden herhangi bir ödeme işlemi gerçekleşmemektedir. Taşıma, ödeme ve hasar yükümlülükleri doğrudan ilan sahibi ve nakliyeci arasındadır. Platform, bu yükümlülüklerden doğan hiçbir garanti veya sorumluluk kabul etmez.
            </p>
          </div>
        </div>

        {/* Section 1: Kabul Şartları */}
        <div className="p-6 rounded-2xl ${t.card} mb-4">
          <h2 className={`text-lg font-bold ${t.heading} mb-3`}>1. Kabul Şartları</h2>
          <p className={`text-sm ${t.sub} leading-relaxed`}>
            YükLe platformunu kullanarak bu kullanım koşullarını okuduğunuzu, anladığınızı ve kabul ettiğinizi beyan etmiş olursunuz. Bu koşulları kabul etmiyorsanız, platformu kullanmamanız gerekmektedir. Platformun kullanımı, bu koşullara ve yürürlükteki tüm yasal düzenlemelere tabidir.
          </p>
        </div>

        {/* Section 2: Hizmet Tanımı */}
        <div className="p-6 rounded-2xl ${t.card} mb-4">
          <h2 className={`text-lg font-bold ${t.heading} mb-3`}>2. Hizmet Tanımı</h2>
          <p className={`text-sm ${t.sub} leading-relaxed`}>
            YükLe, yalnızca bir ilan platformudur. Platform, yük sahiplerinin nakliye ilanlarını yayınlamalarına ve nakliyecilerin bu ilanlara başvurmalarına olanak tanıyan bir ilan ve iletişim hizmeti sunmaktadır. YükLe, yük sahipleri ve nakliyeciler arasında hiçbir aracılık yapmamaktadır. Platform, taraflar arasında sözleşme akdedilmesine, taşınma işinin yürütülmesine, ödeme yapılmasına veya herhangi bir ticari ilişkinin kurulmasına aracılık etmez. İlan sahipleri ve nakliyeciler arasındaki tüm ilişkiler doğrudan ve yalnızca bu taraflar arasında kurulur.
          </p>
        </div>

        {/* Section 3: Kullanıcı Hesabı */}
        <div className="p-6 rounded-2xl ${t.card} mb-4">
          <h2 className={`text-lg font-bold ${t.heading} mb-3`}>3. Kullanıcı Hesabı</h2>
          <p className={`text-sm ${t.sub} leading-relaxed mb-3`}>
            Platformu kullanmak için bir hesap oluşturmanız gerekmektedir. Hesap oluştururken verdiğiniz bilgilerin doğru ve eksiksiz olduğunu taahhüt edersiniz. Hesap güvenliğinizden siz sorumlusunuz ve hesap bilgilerinizi üçüncü kişilerle paylaşmamayı kabul edersiniz. Hesabınızda gerçekleşen tüm işlemlerin sizin tarafınızdan yapıldığı varsayılır.
          </p>
        </div>

        {/* Section 4: Kullanım Kuralları */}
        <div className="p-6 rounded-2xl ${t.card} mb-4">
          <h2 className={`text-lg font-bold ${t.heading} mb-3`}>4. Kullanım Kuralları</h2>
          <p className={`text-sm ${t.sub} leading-relaxed mb-3`}>
            Platformu kullanırken aşağıdaki kurallara uymayı kabul edersiniz:
          </p>
          <ul className={`list-disc list-inside space-y-2 text-sm ${t.sub}`}>
            <li>Yasalara aykırı herhangi bir faaliyette bulunmamak</li>
            <li>Diğer kullanıcıların haklarına saygı göstermek</li>
            <li>Yanlış veya yanıltıcı bilgi vermemek</li>
            <li>Platformun teknik altyapısına zarar verecek eylemlerden kaçınmak</li>
            <li>Spam, taciz veya istenmeyen mesaj göndermemek</li>
            <li>Başka kullanıcıların hesap bilgilerine izinsiz erişmemek</li>
            <li>Platformu yasal olmayan amaçlarla kullanmamak</li>
          </ul>
        </div>

        {/* Section 5: Sorumluluk Reddi */}
        <div className="p-6 rounded-2xl ${t.card} mb-4">
          <h2 className={`text-lg font-bold ${t.heading} mb-3`}>5. Sorumluluk Reddi</h2>
          <p className={`text-sm ${t.sub} leading-relaxed mb-3`}>
            YükLe, "olduğu gibi" ve "mevcut haliyle" hizmet sunmaktadır. Aşağıdaki hususlarda hiçbir sorumluluk kabul edilmez:
          </p>
          <ul className={`list-disc list-inside space-y-2 text-sm ${t.sub}`}>
            <li>Taraflar arasında akdedilen sözleşmeler: Platform, yük sahibi ve nakliyeci arasında yapılan herhangi bir sözleşmenin içeriğinden, uygulanmasından veya ihlalinden sorumlu değildir</li>
            <li>Taşıma sırasında oluşabilecek hasar veya kayıp: Nakliye esnasında meydana gelen her türlü hasar, kayıp veya gecikmeden doğrudan ilgili taraflar sorumludur</li>
            <li>Ödeme işlemleri: Platform üzerinden herhangi bir ödeme işlemi gerçekleşmemektedir. Taraflar arasındaki ödeme yükümlülüklerinin yerine getirilmesinden platform sorumlu değildir</li>
            <li>İlan bilgilerinin doğruluğu: Yük ilanlarında yer alan bilgilerin (fiyat, ağırlık, yük tipi vb.) doğruluğundan yalnızca ilan sahibi sorumludur</li>
            <li>Kimlik doğrulama: Platform, kullanıcı kimliklerinin doğrulanmasını garanti etmez. Kullanıcıların kimlik ve yetki bilgilerini doğrulama sorumluluğu tarafınıza aittir</li>
            <li>Yasal uyum: Taşıma işlemlerinin tüm yasal gerekliliklere uygun olarak gerçekleştirilmesinden taraflar sorumludur</li>
            <li>Uyuşmazlıklar: Kullanıcılar arasında doğan her türlü uyuşmazlıkta platformun herhangi bir sorumluluğu yoktur</li>
            <li>Hizmet kesintileri: Platformun teknik nedenlerle erişilemez olmasından kaynaklanan kayıplardan platform sorumlu değildir</li>
            <li>Mücbir sebepler: Doğal afet, savaş, pandemi, teknik arıza veya benzeri mücbir sebeplerden kaynaklanan hizmet aksaklıklarından platform sorumlu değildir</li>
          </ul>
        </div>

        {/* Section 6: İlan ve Mesajlaşma */}
        <div className="p-6 rounded-2xl ${t.card} mb-4">
          <h2 className={`text-lg font-bold ${t.heading} mb-3`}>6. İlan ve Mesajlaşma</h2>
          <p className={`text-sm ${t.sub} leading-relaxed mb-3`}>
            Platform üzerinde oluşturduğunuz ilanlar ve mesajlar aşağıdaki kurallara tabidir:
          </p>
          <ul className={`list-disc list-inside space-y-2 text-sm ${t.sub}`}>
            <li>İlanlar, yalnızca nakliye amaçlı oluşturulmalıdır</li>
            <li>İlan içeriklerinin doğruluğundan ve yasal uyumluluğundan ilan sahibi sorumludur</li>
            <li>Yanıltıcı, hakaret içereren veya yasa dışı içerikli ilanlar yayımlanamaz</li>
            <li>Platform mesajlaşma özelliği, nakliye iletişimi amacıyla kullanılmalıdır</li>
            <li>YükLe, uygun olmayan içerikleri yayımlandan kaldırma hakkını saklı tutar</li>
            <li>İlan sahipleri ve nakliyeciler arasındaki iletişimin içeriğinden platform sorumlu değildir</li>
          </ul>
        </div>

        {/* Section 7: Fikri Mülkiyet */}
        <div className="p-6 rounded-2xl ${t.card} mb-4">
          <h2 className={`text-lg font-bold ${t.heading} mb-3`}>7. Fikri Mülkiyet</h2>
          <p className={`text-sm ${t.sub} leading-relaxed`}>
            YükLe platformu, markası, logosu, tasarımı ve tüm fikri mülkiyet hakları YükLe'ye aittir. Platform içeriği izinsiz olarak kopyalanamaz, dağıtılamaz veya ticari amaçlarla kullanılamaz. Kullanıcılar tarafından platforma yüklenen içeriklerin fikri mülkiyet hakları kullanıcıya ait olup, içeriklerin platformda yayımlanması YükLe'ye kullanım hakkı vermektedir.
          </p>
        </div>

        {/* Section 8: Hesap Feshi */}
        <div className="p-6 rounded-2xl ${t.card} mb-4">
          <h2 className={`text-lg font-bold ${t.heading} mb-3`}>8. Hesap Feshi</h2>
          <p className={`text-sm ${t.sub} leading-relaxed`}>
            YükLe, kullanım koşullarını ihlal eden kullanıcıların hesaplarını geçici veya kalıcı olarak askıya alma veya feshetme hakkını saklı tutar. Hesap feshi durumunda, kullanıcıya bilgilendirme yapılacaktır. Kullanıcılar, istedikleri zaman kendi hesaplarını silebilirler. Hesap silinmesi durumunda, kişisel verileriniz KVKK kapsamında yasal saklama yükümlülükleri çerçevesinde işlenmeye devam edebilir.
          </p>
        </div>

        {/* Section 9: Uyuşmazlık Çözümü */}
        <div className="p-6 rounded-2xl ${t.card} mb-4">
          <h2 className={`text-lg font-bold ${t.heading} mb-3`}>9. Uyuşmazlık Çözümü</h2>
          <p className={`text-sm ${t.sub} leading-relaxed`}>
            Bu kullanım koşullarından doğan her türlü uyuşmazlıkta, öncelikle dostane yollarla çözüm aranacaktır. Uyuşmazlığın dostane yollarla çözülememesi halinde, Türkiye Cumhuriyeti yasaları uygulanacak ve İstanbul Mahkemeleri ve İcra Daireleri münhasıran yetkili olacaktır. Kullanıcılar arasındaki uyuşmazlıklarda YükLe'nin herhangi bir sorumluluğu yoktur.
          </p>
        </div>

        {/* Section 10: İletişim */}
        <div className="p-6 rounded-2xl ${t.card} mb-4">
          <h2 className={`text-lg font-bold ${t.heading} mb-3`}>10. İletişim</h2>
          <p className={`text-sm ${t.sub} leading-relaxed`}>
            Kullanım koşulları hakkında sorularınız veya geri bildirimleriniz için aşağıdaki kanaldan bizimle iletişime geçebilirsiniz:
          </p>
          <ul className={`list-none space-y-2 text-sm ${t.sub} mt-3`}>
            <li>E-posta: <a href="mailto:info@loadlyapp.com" className="text-[#F5A623] hover:underline">info@loadlyapp.com</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
