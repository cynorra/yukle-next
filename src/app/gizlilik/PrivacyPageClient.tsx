'use client';

import { useT } from '@/hooks/useT';
import { Lock, AlertTriangle } from 'lucide-react';

export function PrivacyPageClient() {
  const t = useT();

  return (
    <div className={t.pageFull}>
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-2xl font-bold ${t.heading} flex items-center gap-3`}>
            <Lock size={28} className="text-[#F5A623]" />
            Gizlilik Politikası
          </h1>
          <p className={`text-sm ${t.muted} mt-1`}>YükLe platformu gizlilik politikası.</p>
        </div>

        {/* Red disclaimer box */}
        <div className="mb-8 p-5 rounded-2xl bg-red-500/10 border border-red-500/20 backdrop-blur-xl">
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} className="text-red-400 shrink-0 mt-0.5" />
            <p className="text-sm text-red-300 leading-relaxed">
              YükLe yalnızca bir ilan platformudur. Platform, yük sahipleri ve nakliyeciler arasında hiçbir aracılık, sözleşme veya ticari ilişki kurmaz. Taşıma, ödeme ve hasar yükümlülükleri doğrudan ilan sahibi ve nakliyeci arasındadır. Platform, bu yükümlülüklerden doğan hiçbir sorumluluk kabul etmez.
            </p>
          </div>
        </div>

        {/* Section 1: Genel Bakış */}
        <div className="p-6 rounded-2xl ${t.card} mb-4">
          <h2 className={`text-lg font-bold ${t.heading} mb-3`}>1. Genel Bakış</h2>
          <p className={`text-sm ${t.sub} leading-relaxed`}>
            YükLe, kullanıcılarının gizliliğine önem vermektedir. Bu gizlilik politikası, YükLe platformu üzerinden toplanan, kullanılan ve korunan kişisel verilerin nasıl işlendiğini açıklamaktadır. Platformu kullanarak bu politikada belirtilen koşulları kabul etmiş sayılırsınız.
          </p>
        </div>

        {/* Section 2: Toplanan Veriler */}
        <div className="p-6 rounded-2xl ${t.card} mb-4">
          <h2 className={`text-lg font-bold ${t.heading} mb-3`}>2. Toplanan Veriler</h2>
          <p className={`text-sm ${t.sub} leading-relaxed mb-3`}>
            YükLe platformu aşağıdaki verileri toplamaktadır:
          </p>
          <ul className={`list-disc list-inside space-y-2 text-sm ${t.sub}`}>
            <li>Hesap bilgileri: Ad soyad, e-posta adresi, telefon numarası, firma adı (opsiyonel), kullanıcı rolü (yük sahibi/sürücü)</li>
            <li>İlan verileri: Oluşturulan yük ilanları, güzergah bilgileri, tarih ve lokasyon bilgileri</li>
            <li>İletişim verileri: Platform üzerinden gönderilen mesajlar ve konuşma geçmişi</li>
            <li>Teknik veriler: IP adresi, tarayıcı türü, cihaz bilgileri, erişim zamanları</li>
            <li>Kullanım verileri: Platform etkileşim verileri, özellik kullanım istatistikleri</li>
          </ul>
          <p className={`text-sm ${t.muted} mt-3 italic`}>
            YükLe, ödeme bilgileri veya sözleşme verilerini işlememektedir. Platform üzerinden herhangi bir ödeme işlemi gerçekleşmemektedir.
          </p>
        </div>

        {/* Section 3: Verilerin Kullanımı */}
        <div className="p-6 rounded-2xl ${t.card} mb-4">
          <h2 className={`text-lg font-bold ${t.heading} mb-3`}>3. Verilerin Kullanımı</h2>
          <p className={`text-sm ${t.sub} leading-relaxed mb-3`}>
            Toplanan kişisel veriler aşağıdaki amaçlarla kullanılmaktadır:
          </p>
          <ul className={`list-disc list-inside space-y-2 text-sm ${t.sub}`}>
            <li>Hesap oluşturma ve kullanıcı kimlik doğrulaması</li>
            <li>İlan oluşturma, yayınlama ve yönetimi hizmetlerinin sunulması</li>
            <li>Kullanıcılar arası mesajlaşma ve iletişim imkânının sağlanması</li>
            <li>Güzergah eşleştirme ve yük-sürücü eşleştirme özelliklerinin çalıştırılması</li>
            <li>Platform güvenliğinin sağlanması, dolandırıcılık ve kötüye kullanımın önlenmesi</li>
            <li>Yasal yükümlülüklerin yerine getirilmesi</li>
            <li>Platform performansının izlenmesi ve kullanıcı deneyiminin iyileştirilmesi</li>
          </ul>
          <p className={`text-sm ${t.muted} mt-3 italic`}>
            YükLe, kişisel verilerinizi ödeme işleme amacıyla kullanmamaktadır. Platform üzerinden herhangi bir ödeme işlemi gerçekleşmemektedir.
          </p>
        </div>

        {/* Section 4: Çerezler */}
        <div className="p-6 rounded-2xl ${t.card} mb-4">
          <h2 className={`text-lg font-bold ${t.heading} mb-3`}>4. Çerezler</h2>
          <p className={`text-sm ${t.sub} leading-relaxed mb-3`}>
            YükLe platformu, kullanıcı deneyimini iyileştirmek ve platformun çalışmasını sağlamak için çerezler kullanmaktadır. Kullanılan çerez türleri:
          </p>
          <ul className={`list-disc list-inside space-y-2 text-sm ${t.sub}`}>
            <li>Oturum çerezleri: Giriş durumunun korunması ve hesap güvenliğinin sağlanması</li>
            <li>Teknik çerezler: Platformun düzgün çalışması için gerekli olan çerezler</li>
            <li>Analitik çerezler: Platform kullanımının analiz edilmesi ve iyileştirilmesi</li>
          </ul>
          <p className={`text-sm ${t.sub} leading-relaxed mt-3`}>
            Tarayıcı ayarlarınızdan çerezleri devre dışı bırakabilirsiniz; ancak bu durumda platformun bazı özellikleri düzgün çalışmayabilir.
          </p>
        </div>

        {/* Section 5: Üçüncü Taraflar */}
        <div className="p-6 rounded-2xl ${t.card} mb-4">
          <h2 className={`text-lg font-bold ${t.heading} mb-3`}>5. Üçüncü Taraflar</h2>
          <p className={`text-sm ${t.sub} leading-relaxed mb-3`}>
            Kişisel verileriniz aşağıdaki durumlarda üçüncü taraflarla paylaşılabilmektedir:
          </p>
          <ul className={`list-disc list-inside space-y-2 text-sm ${t.sub}`}>
            <li>Platformun teknik altyapısını sağlayan hizmet sağlayıcıları (barındırma, veritabanı hizmetleri)</li>
            <li>Yetkili kamu kurumları: Yasal zorunluluklar ve yasal talepler doğrultusunda</li>
            <li>Hukuki danışmanlar: Hukuki uyuşmazlıkların çözümü amacıyla</li>
          </ul>
          <p className={`text-sm ${t.muted} mt-3 italic`}>
            YükLe, kişisel verilerinizi ödeme sağlayıcılarıyla paylaşmamaktadır. Platform üzerinden herhangi bir ödeme işlemi gerçekleşmemektedir.
          </p>
        </div>

        {/* Section 6: Veri Güvenliği */}
        <div className="p-6 rounded-2xl ${t.card} mb-4">
          <h2 className={`text-lg font-bold ${t.heading} mb-3`}>6. Veri Güvenliği</h2>
          <p className={`text-sm ${t.sub} leading-relaxed`}>
            YükLe, kişisel verilerinizin güvenliğini sağlamak için gerekli tüm teknik ve idari tedbirleri almaktadır. Verileriniz, şifreleme yöntemleri ile korunmakta, yetkisiz erişime karşı güvenlik duvarları ve erişim kontrolleri uygulanmaktadır. Platform, güvenlik açıklarını önlemek için düzenli güvenlik testleri ve değerlendirmeleri yapmaktadır. Ancak, internet üzerinden yapılan hiçbir veri iletiminin %100 güvenli olduğu garanti edilemez.
          </p>
        </div>

        {/* Section 7: Kullanıcı Hakları */}
        <div className="p-6 rounded-2xl ${t.card} mb-4">
          <h2 className={`text-lg font-bold ${t.heading} mb-3`}>7. Kullanıcı Hakları</h2>
          <p className={`text-sm ${t.sub} leading-relaxed mb-3`}>
            KVKK kapsamında aşağıdaki haklara sahipsiniz:
          </p>
          <ul className={`list-disc list-inside space-y-2 text-sm ${t.sub}`}>
            <li>Kişisel verilerinize erişme ve bunları görüntüleme</li>
            <li>Hatalı veya eksik verilerinizin düzeltilmesini isteme</li>
            <li>Kişisel verilerinizin silinmesini talep etme</li>
            <li>Verilerinizin işlenmesine itiraz etme</li>
            <li>Verilerinizin taşınmasını talep etme</li>
            <li>Verilerinizin üçüncü taraflara aktarılmasını sınırlama</li>
          </ul>
          <p className={`text-sm ${t.sub} leading-relaxed mt-3`}>
            Bu haklarınızı kullanmak için <a href="mailto:kvkk@loadlyapp.com" className="text-[#F5A623] hover:underline">kvkk@loadlyapp.com</a> adresi üzerinden başvuruda bulunabilirsiniz.
          </p>
        </div>

        {/* Section 8: Politika Değişiklikleri */}
        <div className="p-6 rounded-2xl ${t.card} mb-4">
          <h2 className={`text-lg font-bold ${t.heading} mb-3`}>8. Politika Değişiklikleri</h2>
          <p className={`text-sm ${t.sub} leading-relaxed`}>
            YükLe, bu gizlilik politikasını yasal gerekliliklere veya platform özelliklerindeki değişikliklere uygun olarak güncelleme hakkını saklı tutar. Politika değişiklikleri platform üzerinden yayımlanacak ve güncelleme tarihi değiştirilecektir. Değişikliklerden haberdar olmak için bu sayfayı düzenli olarak kontrol etmeniz önerilir. Platformu kullanmaya devam etmeniz, güncellenmiş politikayı kabul ettiğiniz anlamına gelir.
          </p>
        </div>

        {/* Section 9: İletişim */}
        <div className="p-6 rounded-2xl ${t.card} mb-4">
          <h2 className={`text-lg font-bold ${t.heading} mb-3`}>9. İletişim</h2>
          <p className={`text-sm ${t.sub} leading-relaxed`}>
            Gizlilik politikası hakkında sorularınız veya endişeleriniz varsa, aşağıdaki kanallardan bizimle iletişime geçebilirsiniz:
          </p>
          <ul className={`list-none space-y-2 text-sm ${t.sub} mt-3`}>
            <li>E-posta: <a href="mailto:kvkk@loadlyapp.com" className="text-[#F5A623] hover:underline">kvkk@loadlyapp.com</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
