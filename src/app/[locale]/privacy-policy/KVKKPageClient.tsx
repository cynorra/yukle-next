'use client';

import { useT } from '@/hooks/useT';
import { Shield, AlertTriangle } from 'lucide-react';

export function KVKKPageClient() {
  const t = useT();

  return (
    <div className={t.pageFull}>
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-2xl font-bold ${t.heading} flex items-center gap-3`}>
            <Shield size={28} className="text-[#F5A623]" />
            KVKK Aydınlatma Metni
          </h1>
          <p className={`text-sm ${t.muted} mt-1`}>6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında aydınlatma metni.</p>
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

        {/* Section 1: Veri Sorumlusu */}
        <div className="p-6 rounded-2xl ${t.card} mb-4">
          <h2 className={`text-lg font-bold ${t.heading} mb-3`}>1. Veri Sorumlusu</h2>
          <p className={`text-sm ${t.sub} leading-relaxed`}>
            6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, kişisel verileriniz veri sorumlusu sıfatıyla YükLe tarafından aşağıda açıklanan kapsamda işlenebilecektir. Veri sorumlusu olarak YükLe, kişisel verilerinizin hukuka uygun, güvenli ve şeffaf bir şekilde işlenmesini sağlamak için gerekli tüm teknik ve idari tedbirleri almaktadır.
          </p>
        </div>

        {/* Section 2: İşlenen Kişisel Veriler */}
        <div className="p-6 rounded-2xl ${t.card} mb-4">
          <h2 className={`text-lg font-bold ${t.heading} mb-3`}>2. İşlenen Kişisel Veriler</h2>
          <p className={`text-sm ${t.sub} leading-relaxed mb-3`}>
            YükLe platformunda aşağıdaki kişisel verileriniz işlenmektedir:
          </p>
          <ul className={`list-disc list-inside space-y-2 text-sm ${t.sub}`}>
            <li>Kimlik bilgileri: Ad soyad</li>
            <li>İletişim bilgileri: E-posta adresi, telefon numarası</li>
            <li>Firma bilgileri: Firma adı (opsiyonel)</li>
            <li>Kullanım verileri: Platform üzerindeki ilanlar, mesajlar ve işlem geçmişi</li>
            <li>Teknik veriler: IP adresi, tarayıcı bilgileri, cihaz bilgileri</li>
          </ul>
          <p className={`text-sm ${t.muted} mt-3 italic`}>
            YükLe, T.C. kimlik numarası veya vergi numarası gibi özel nitelikli kişisel verileri işlememektedir.
          </p>
        </div>

        {/* Section 3: İşlenme Amaçları */}
        <div className="p-6 rounded-2xl ${t.card} mb-4">
          <h2 className={`text-lg font-bold ${t.heading} mb-3`}>3. İşlenme Amaçları</h2>
          <p className={`text-sm ${t.sub} leading-relaxed mb-3`}>
            Kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:
          </p>
          <ul className={`list-disc list-inside space-y-2 text-sm ${t.sub}`}>
            <li>Üyelik işlemlerinin yürütülmesi ve hesap yönetimi</li>
            <li>İlan oluşturma ve yönetimi hizmetlerinin sunulması</li>
            <li>Kullanıcılar arası mesajlaşma ve iletişim imkânının sağlanması</li>
            <li>Platform güvenliğinin sağlanması ve kötüye kullanımın önlenmesi</li>
            <li>Yasal yükümlülüklerin yerine getirilmesi</li>
            <li>Platformun geliştirilmesi ve kullanıcı deneyiminin iyileştirilmesi</li>
          </ul>
        </div>

        {/* Section 4: Aktarılması */}
        <div className="p-6 rounded-2xl ${t.card} mb-4">
          <h2 className={`text-lg font-bold ${t.heading} mb-3`}>4. Kişisel Verilerin Aktarılması</h2>
          <p className={`text-sm ${t.sub} leading-relaxed mb-3`}>
            Kişisel verileriniz, aşağıdaki taraflara ve amaçlarla aktarılabilmektedir:
          </p>
          <ul className={`list-disc list-inside space-y-2 text-sm ${t.sub}`}>
            <li>Kamu kurumlarına: Yasal yükümlülüklerin yerine getirilmesi amacıyla yetkili kamu kurum ve kuruluşlarına</li>
            <li>Hukuki danışmanlara: Hukuki uyuşmazlıkların çözümü ve yasal savunma amacıyla avukatlar ve hukuk bürolarına</li>
          </ul>
          <p className={`text-sm ${t.muted} mt-3 italic`}>
            YükLe, kişisel verilerinizi üçüncü taraf ticari kuruluşlara pazarlama amaçlı olarak aktarmamaktadır.
          </p>
        </div>

        {/* Section 5: Toplanma Yöntemi */}
        <div className="p-6 rounded-2xl ${t.card} mb-4">
          <h2 className={`text-lg font-bold ${t.heading} mb-3`}>5. Kişisel Verilerin Toplanma Yöntemi</h2>
          <p className={`text-sm ${t.sub} leading-relaxed`}>
            Kişisel verileriniz, YükLe platformuna üye kaydı sırasında ve platform kullanımı esnasında sizin tarafınızdan doğrudan elektronik ortamda (web sitesi ve mobil uygulama) paylaşılan bilgiler aracılığıyla toplanmaktadır. Ayrıca, platformun teknik altyapısı üzerinden otomatik olarak oluşturulan veriler (IP adresi, log kayıtları vb.) de işlenmektedir.
          </p>
        </div>

        {/* Section 6: Haklar */}
        <div className="p-6 rounded-2xl ${t.card} mb-4">
          <h2 className={`text-lg font-bold ${t.heading} mb-3`}>6. KVKK Kapsamındaki Haklarınız</h2>
          <p className={`text-sm ${t.sub} leading-relaxed mb-3`}>
            KVKK'nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:
          </p>
          <ul className={`list-disc list-inside space-y-2 text-sm ${t.sub}`}>
            <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
            <li>Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme</li>
            <li>Kişisel verilerinizin işlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme</li>
            <li>Yurt içinde veya yurt dışında kişisel verilerinizin aktarıldığı üçüncü kişileri bilme</li>
            <li>Kişisel verilerinizin eksik veya yanlış işlenmiş olması halinde bunların düzeltilmesini isteme</li>
            <li>KVKK'nın 7. maddesinde öngörülen şartlar çerçevesinde kişisel verilerinizin silinmesini veya yok edilmesini isteme</li>
            <li>Yapılan düzeltme, silinme ve yok etme işlemlerinin, kişisel verilerinizin aktarıldığı üçüncü kişilere bildirilmesini isteme</li>
            <li>İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme</li>
            <li>Kişisel verilerinizin kanuna aykırı olarak işlenmesi sebebiyle zarara uğramanız halinde zararın giderilmesini talep etme</li>
          </ul>
        </div>

        {/* Section 7: Başvuru Yöntemi */}
        <div className="p-6 rounded-2xl ${t.card} mb-4">
          <h2 className={`text-lg font-bold ${t.heading} mb-3`}>7. Başvuru Yöntemi</h2>
          <p className={`text-sm ${t.sub} leading-relaxed`}>
            Yukarıda belirtilen haklarınızı kullanmak için YükLe'ye başvuruda bulunabilirsiniz. Başvurularınızı <a href="mailto:kvkk@loadlyapp.com" className="text-[#F5A623] hover:underline">kvkk@loadlyapp.com</a> e-posta adresi üzerinden veya YükLe resmi iletişim kanalları aracılığıyla iletebilirsiniz. Başvurularınız, KVKK'nın 13. maddesi uyarınca en kısa sürede ve en geç 30 gün içerisinde ücretsiz olarak sonuçlandırılacaktır. İşlemin maliyet gerektirmesi halinde, KVKK'nın 13. maddesinde belirtilen ücret tarifesi uygulanacaktır.
          </p>
        </div>

        {/* Section 8: Dış Kaynaklı İlanlar ve Veri Silme Talepleri */}
        <div className="p-6 rounded-2xl ${t.card} mb-4">
          <h2 className={`text-lg font-bold ${t.heading} mb-3`}>8. Dış Kaynaklı İlanlar ve Veri Silme Talepleri</h2>
          <p className={`text-sm ${t.sub} leading-relaxed`}>
            Sitemizde yer alan dış kaynaklı ilanlar, ilgili platformlarda sahipleri tarafından alenileştirilmiş ticari iletişim bilgilerini içermektedir. İlan sahipleri, verilerinin kaldırılmasını veya güncellenmesini istemeleri halinde <a href="mailto:info@loadlyapp.com" className="text-[#F5A623] hover:underline">info@loadlyapp.com</a> adresi üzerinden bizimle iletişime geçebilirler. Talepler derhal işleme alınmaktadır.
          </p>
        </div>

        {/* Effective date */}
        <div className="text-center mt-8">
          <p className={`text-xs ${t.muted}`}>Yürürlük tarihi: 01.01.2025</p>
        </div>
      </div>
    </div>
  );
}
