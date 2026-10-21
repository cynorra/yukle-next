---
trigger: always_on
glob:
description: AdSense configuration and autonomous execution rules
---

- **Tam Yetki (Full Autonomy)**: Kullanıcı tüm komutları doğrudan çalıştırma yetkisi vermiştir. Komut çalıştırmadan önce teyit/soru sorma, doğrudan yürüt.
- **AdSense Yapılandırması**:
  - Yayıncı Kimliği: `pub-4674211063760769` / `ca-pub-4674211063760769`
  - ads.txt: `https://loadlyapp.com/ads.txt` -> `google.com, pub-4674211063760769, DIRECT, f08c47fec0942fa0`
  - Doğrulama meta etiketi ve Funding Choices scripti aktiftir.
  - Politika sayfaları (`/en/privacy`, `/en/terms`, `/en/about`, `/en/contact`) canlıda 200 dönmektedir.
