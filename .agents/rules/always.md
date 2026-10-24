---
trigger: always_on
glob:
description: AdSense configuration and autonomous execution rules
---

- **Tam Yetki (Full Autonomy)**: Kullanıcı tüm komutları doğrudan çalıştırma yetkisi vermiştir. Komut çalıştırmadan önce teyit/soru sorma, doğrudan yürüt.
- **Site Vizyonu (Blog Odaklı Medya)**: Web sitesi saf bir editoryal lojistik/taşımacılık blogudur; yük arama/borsa özellikleri webde olmayacaktır.
- **AI Slop Yasağı**: `animate-ping`, parıltı (`Sparkles`) veya yapay hissettiren neon animasyonlar kesinlikle yasaktır. Sade ve otoriter finans/lojistik medyası tarzı korunmalıdır.
- **AdSense & Kalite Yapılandırması**:
  - Yayıncı Kimliği: `pub-4674211063760769` / `ca-pub-4674211063760769`
  - ads.txt: `https://loadlyapp.com/ads.txt` -> `google.com, pub-4674211063760769, DIRECT, f08c47fec0942fa0`
  - Doğrulama meta etiketi ve Funding Choices scripti aktiftir.
  - Politika sayfaları (`/en/privacy`, `/en/terms`, `/en/about`, `/en/contact`) canlıda 200 dönmektedir.
- **Canlı Sunucu**: Oracle VM (`129.80.191.21`), anahtar: `oracle/private/ssh-key-2026-09-10.key`. Deploy betiği: `/opt/loadly/app/deploy/deploy.sh`.
