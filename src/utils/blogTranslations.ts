import type { Locale } from './translations';

export interface BlogTranslationDict {
  title: string;
  description: string;
  tagline: string;
  header1: string;
  headerAccent: string;
  header2: string;
  introText: string;
  searchPlaceholder: string;
  noArticles: string;
  faqTitle: string;
  backToBlog: string;
  readingTime: string;
  readingTimeSuffix: string;
  authorRole: string;
  shareTitle: string;
  shareDesc: string;
  loading: string;
  guides: { label: string; slug: string }[];
  faqs: { q: string; a: string }[];
}

export const BLOG_TRANSLATIONS: Record<Locale, BlogTranslationDict> = {
  en: {
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
  },
  tr: {
    title: 'Nakliye Pazaryeri & Lojistik Rehberi | Loadly',
    description: "Türkiye'nin dijital nakliye pazaryeri. Yük ilanı verme, yük bulma rehberleri ve lojistik maliyet düşürme yöntemleri hakkında kapsamlı bilgiler.",
    tagline: 'Lojistik & Nakliye Pazaryeri Rehberi',
    header1: 'Lojistik Dünyasını',
    headerAccent: 'Dijitalleştiriyoruz',
    header2: '',
    introText: 'YükLe nakliye pazaryeri ile yük ilanı verme, yük bulma ve lojistik süreçlerini optimize etme üzerine en güncel rehberlere ulaşın.',
    searchPlaceholder: 'Yazılarda ara...',
    noArticles: 'Aramanızla eşleşen yazı bulunamadı.',
    faqTitle: 'Nakliye Pazaryeri Hakkında Sık Sorulan Sorular',
    backToBlog: "Blog'a Dön",
    readingTime: '',
    readingTimeSuffix: 'dk okuma',
    authorRole: 'Lojistik Uzmanı',
    shareTitle: 'Paylaşmayı Unutmayın!',
    shareDesc: 'Bu içerik sizin için faydalı olduysa, nakliye sektöründeki arkadaşlarınızla paylaşarak onlara da yardımcı olabilirsiniz.',
    loading: 'Yazı yükleniyor...',
    guides: [
      { label: 'Yük Bulma Rehberi', slug: 'kamyon-tir-soforleri-yuk-bulma-rehberi' },
      { label: 'Maliyet Düşürme', slug: 'sehirler-arasi-nakliye-maliyet-dusurme' },
      { label: 'Yasal Mevzuat', slug: 'evden-eve-nakliyat-yasal-mevzuat-belgeler' },
    ],
    faqs: [
      { q: 'Nakliye pazaryeri nedir?', a: 'Nakliye pazaryeri, yük sahipleri ile nakliyecilerin dijital bir platformda buluşarak yük ilanı vermelerini ve teklif almalarını sağlayan bir ekosistemdir.' },
      { q: 'Lojistik pazaryeri nasıl avantaj sağlar?', a: "Zaman tasarrufu, fiyat şeffaflığı ve güvenilir nakliyecilere hızlı erişim sağlayarak lojistik maliyetlerini %30'a kadar düşürebilir." },
      { q: 'Yük pazaryerinde güvenlik nasıl sağlanır?', a: 'YükLe gibi platformlarda tüm kullanıcılar belge doğrulamasından geçer ve geçmiş performansları puanlanır.' }
    ]
  },
  es: {
    title: 'Mercado Logístico y Guía de Transporte | Loadly',
    description: 'Plataforma de logística digital. Artículos sobre cómo publicar anuncios de envío, encontrar cargas de camiones y reducir costos.',
    tagline: 'Guía del Mercado de Logística y Envíos',
    header1: 'Digitalizando el',
    headerAccent: 'Mundo Logístico',
    header2: '',
    introText: 'Encuentre las guías más actualizadas sobre anuncios de transporte, coincidencia de cargas y optimización de la cadena de suministro.',
    searchPlaceholder: 'Buscar artículos...',
    noArticles: 'No se encontraron artículos que coincidan con su búsqueda.',
    faqTitle: 'Preguntas frecuentes sobre el mercado de logística',
    backToBlog: 'Volver al Blog',
    readingTime: 'Tiempo de lectura:',
    readingTimeSuffix: 'min de lectura',
    authorRole: 'Experto en Logística',
    shareTitle: '¡No olvides compartir!',
    shareDesc: 'Si este contenido te resultó útil, compártelo con tus amigos del sector del transporte.',
    loading: 'Cargando artículo...',
    guides: [
      { label: 'Guía de Búsqueda de Carga', slug: 'kamyon-tir-soforleri-yuk-bulma-rehberi' },
      { label: 'Reducción de Costos', slug: 'sehirler-arasi-nakliye-maliyet-dusurme' },
      { label: 'Regulaciones', slug: 'evden-eve-nakliyat-yasal-mevzuat-belgeler' },
    ],
    faqs: [
      { q: '¿Qué es un mercado logístico?', a: 'Es un ecosistema digital donde cargadores y transportistas se encuentran directamente para publicar cargas y enviar ofertas.' },
      { q: '¿Qué ventajas ofrece una bolsa de cargas?', a: 'Ahorra tiempo, mejora la transparencia de precios y ayuda a evitar viajes de retorno vacíos, reduciendo costos.' },
      { q: '¿Cómo se garantiza la seguridad?', a: 'Todos los usuarios verifican sus credenciales y sus historiales son calificados por valoraciones.' }
    ]
  },
  pt: {
    title: 'Mercado de Logística e Guia de Transporte | Loadly',
    description: 'Plataforma digital de logística. Acesse artigos sobre anúncios de frete, busca de cargas e redução de custos logísticos.',
    tagline: 'Guia do Mercado de Logística e Fretes',
    header1: 'Digitalizando o',
    headerAccent: 'Mundo da Logística',
    header2: '',
    introText: 'Encontre os guias mais recentes sobre anúncios de frete, pareamento de cargas e otimização de suprimentos.',
    searchPlaceholder: 'Pesquisar artigos...',
    noArticles: 'Nenhum artigo encontrado.',
    faqTitle: 'Perguntas Frequentes Sobre o Mercado de Logística',
    backToBlog: 'Voltar ao Blog',
    readingTime: 'Tempo de leitura:',
    readingTimeSuffix: 'min de leitura',
    authorRole: 'Especialista em Logística',
    shareTitle: 'Não se esqueça de compartilhar!',
    shareDesc: 'Se achou este conteúdo útil, compartilhe com seus amigos do setor de transportes.',
    loading: 'Carregando artigo...',
    guides: [
      { label: 'Guia de Busca de Cargas', slug: 'kamyon-tir-soforleri-yuk-bulma-rehberi' },
      { label: 'Redução de Custos', slug: 'sehirler-arasi-nakliye-maliyet-dusurme' },
      { label: 'Regulamentos', slug: 'evden-eve-nakliyat-yasal-mevzuat-belgeler' },
    ],
    faqs: [
      { q: 'O que é um mercado de logística?', a: 'É um ecossistema digital onde embarcadores e transportadores se conectam para postar fretes e propor lances.' },
      { q: 'Quais os benefícios das bolsas de cargas?', a: 'Economiza tempo, eleva a transparência de preços e evita retornos com veículos vazios, reduzindo custos.' },
      { q: 'Como a segurança é mantida?', a: 'Os usuários passam por verificação cadastral e contam com histórico de avaliações.' }
    ]
  },
  fr: {
    title: 'Marché Logistique & Guide de Transport | Loadly',
    description: 'Plateforme logistique digitale. Retrouvez des articles pour publier des frets, trouver des chargements et réduire vos coûts.',
    tagline: 'Guide de la Logistique et du Transport',
    header1: 'Numérisation du',
    headerAccent: 'Monde Logistique',
    header2: '',
    introText: 'Découvrez des guides pratiques sur l\'affrètement, l\'optimisation de tournées et le marché de fret en ligne.',
    searchPlaceholder: 'Rechercher des articles...',
    noArticles: 'Aucun article trouvé pour cette recherche.',
    faqTitle: 'Questions Fréquentes sur le Marché Logistique',
    backToBlog: 'Retour au Blog',
    readingTime: 'Temps de lecture :',
    readingTimeSuffix: 'min de lecture',
    authorRole: 'Expert en Logistique',
    shareTitle: 'N\'oubliez pas de partager !',
    shareDesc: 'Si ce contenu vous a été utile, partagez-le avec vos confrères du transport.',
    loading: 'Chargement de l\'article...',
    guides: [
      { label: 'Trouver du Fret', slug: 'kamyon-tir-soforleri-yuk-bulma-rehberi' },
      { label: 'Réduction des Coûts', slug: 'sehirler-arasi-nakliye-maliyet-dusurme' },
      { label: 'Réglementations', slug: 'evden-eve-nakliyat-yasal-mevzuat-belgeler' },
    ],
    faqs: [
      { q: 'Qu\'est-ce qu\'une place de marché logistique ?', a: 'C\'est une plateforme numérique reliant directement expéditeurs et transporteurs pour simplifier le transport de marchandises.' },
      { q: 'Quel est l\'intérêt d\'une bourse de fret ?', a: 'Elle garantit la transparence des prix, fait gagner du temps et réduit les retours à vide.' },
      { q: 'Comment la sécurité est-elle assurée ?', a: 'Les transporteurs sont vérifiés et notés selon leurs prestations précédentes.' }
    ]
  },
  de: {
    title: 'Logistik-Marktplatz & Frachtführer-Reiseführer | Loadly',
    description: 'Digitale Logistik-Plattform. Informieren Sie sich über Frachtangebote, Ladungssuche und Kostenoptimierung im Straßentransport.',
    tagline: 'Leitfaden für Logistik & Frachtbörsen',
    header1: 'Digitalisierung der',
    headerAccent: 'Logistikwelt',
    header2: '',
    introText: 'Finden Sie aktuelle Leitfäden zu Frachtinseraten, Ladungsvermittlung und Lieferkettenoptimierung über Loadly.',
    searchPlaceholder: 'Artikel durchsuchen...',
    noArticles: 'Keine passenden Artikel gefunden.',
    faqTitle: 'Häufig gestellte Fragen zum Logistik-Marktplatz',
    backToBlog: 'Zurück zum Blog',
    readingTime: 'Lesezeit:',
    readingTimeSuffix: 'Min. Lesezeit',
    authorRole: 'Logistikexperte',
    shareTitle: 'Teilen nicht vergessen!',
    shareDesc: 'Wenn dieser Inhalt hilfreich war, teilen Sie ihn mit Ihren Kollegen in der Transportbranche.',
    loading: 'Beitrag wird geladen...',
    guides: [
      { label: 'Ladungssuche-Leitfaden', slug: 'kamyon-tir-soforleri-yuk-bulma-rehberi' },
      { label: 'Kostenreduzierung', slug: 'sehirler-arasi-nakliye-maliyet-dusurme' },
      { label: 'Transportrecht', slug: 'evden-eve-nakliyat-yasal-mevzuat-belgeler' },
    ],
    faqs: [
      { q: 'Was ist ein digitaler Logistik-Marktplatz?', a: 'Ein digitales Ökosystem, auf dem Verlader und Frachtführer direkt Ladungen posten und Angebote verhandeln.' },
      { q: 'Welche Vorteile hat eine Frachtbörse?', a: 'Zeitersparnis, Preistransparenz und die Reduzierung von Leerfahrten (Backhauls).' },
      { q: 'Wie wird die Sicherheit gewährleistet?', a: 'Alle Nutzer durchlaufen eine Verifizierung und werden nach Transporten bewertet.' }
    ]
  },
  it: {
    title: 'Mercato Logistico & Guida al Trasporto | Loadly',
    description: 'Piattaforma logistica digitale. Articoli su inserzioni di spedizioni, ricerca carichi per camion e metodi di riduzione dei costi.',
    tagline: 'Guida al Mercato Logistico e delle Spedizioni',
    header1: 'Digitalizziamo il',
    headerAccent: 'Mondo Logistico',
    header2: '',
    introText: 'Scopri le guide più recenti sugli annunci di carichi, l\'accoppiamento domanda-offerta e l\'ottimizzazione della supply chain.',
    searchPlaceholder: 'Cerca articoli...',
    noArticles: 'Nessun articolo trovato.',
    faqTitle: 'Domande frequenti sul mercato della logistica',
    backToBlog: 'Torna al Blog',
    readingTime: 'Tempo di lettura:',
    readingTimeSuffix: 'min di lettura',
    authorRole: 'Esperto di Logistica',
    shareTitle: 'Non dimenticare di condividere!',
    shareDesc: 'Se hai trovato utili questi contenuti, condividili con i tuoi contatti nel settore dei trasporti.',
    loading: 'Caricamento articolo...',
    guides: [
      { label: 'Guida alla Ricerca Carichi', slug: 'kamyon-tir-soforleri-yuk-bulma-rehberi' },
      { label: 'Riduzione dei Costi', slug: 'sehirler-arasi-nakliye-maliyet-dusurme' },
      { label: 'Normative e Documenti', slug: 'evden-eve-nakliyat-yasal-mevzuat-belgeler' },
    ],
    faqs: [
      { q: 'Cos\'è un mercato logistico?', a: 'È un portale digitale dove mittenti e trasportatori interagiscono direttamente per scambiare offerte e prenotare carichi.' },
      { q: 'Quali sono i vantaggi di una borsa carichi?', a: 'Trasparenza dei prezzi, efficienza operativa e drastica riduzione dei viaggi a vuoto.' },
      { q: 'Come si garantisce la sicurezza sulla piattaforma?', a: 'Tutti gli operatori sono verificati e recensiti in base alle performance storiche.' }
    ]
  },
  pl: {
    title: 'Giełda Logistyczna i Poradnik Transportowy | Loadly',
    description: 'Cyfrowa platforma logistyczna. Artykuły o dodawaniu ładunków, szukaniu frachtów i optymalizacji kosztów transportu.',
    tagline: 'Poradnik Giełdy Logistycznej i Transportowej',
    header1: 'Cyfryzacja',
    headerAccent: 'Świata Logistyki',
    header2: '',
    introText: 'Znajdź najnowsze porady dotyczące zleceń transportowych, wyszukiwania ładunków i redukcji kosztów operacyjnych.',
    searchPlaceholder: 'Szukaj artykułów...',
    noArticles: 'Nie znaleziono artykułów pasujących do wyszukiwania.',
    faqTitle: 'Często Zadawane Pytania o Giełdę Logistyczną',
    backToBlog: 'Powrót do Bloga',
    readingTime: 'Czas czytania:',
    readingTimeSuffix: 'min czytania',
    authorRole: 'Ekspert ds. Logistyki',
    shareTitle: 'Nie zapomnij udostępnić!',
    shareDesc: 'Jeśli te informacje były pomocne, podziel się nimi ze znajomymi z branży transportowej.',
    loading: 'Ładowanie artykułu...',
    guides: [
      { label: 'Poradnik Szukania Ładunków', slug: 'kamyon-tir-soforleri-yuk-bulma-rehberi' },
      { label: 'Redukcja Kosztów', slug: 'sehirler-arasi-nakliye-maliyet-dusurme' },
      { label: 'Przepisy i Wymagania', slug: 'evden-eve-nakliyat-yasal-mevzuat-belgeler' },
    ],
    faqs: [
      { q: 'Czym jest giełda logistyczna?', a: 'To cyfrowa platforma łącząca bezpośrednio załadowców z przewoźnikami w celu szybkiej wymiany zleceń.' },
      { q: 'Jakie korzyści daje giełda ładunków?', a: 'Oszczędność czasu, przejrzystość stawek oraz eliminację pustych przebiegów.' },
      { q: 'Jak dbacie o bezpieczeństwo transakcji?', a: 'Weryfikujemy dokumenty firmowe i pozwalamy na ocenianie przewoźników po każdym zleceniu.' }
    ]
  },
  nl: {
    title: 'Logistiek Platform & Transportgids | Loadly',
    description: 'Digitaal logistiek platform. Lees artikelen over het plaatsen van vrachten, vracht zoeken voor vrachtwagens en kostenbesparingen.',
    tagline: 'Gids voor Logistiek & Transportmarkt',
    header1: 'Digitalisering van de',
    headerAccent: 'Logistieke Wereld',
    header2: '',
    introText: 'Vind actuele gidsen over transportadvertenties, vrachtmatching en supply chain-optimalisatie.',
    searchPlaceholder: 'Artikelen zoeken...',
    noArticles: 'Geen artikelen gevonden voor deze zoekopdracht.',
    faqTitle: 'Veelgestelde vragen over de logistieke marktplaats',
    backToBlog: 'Terug naar Blog',
    readingTime: 'Leestijd:',
    readingTimeSuffix: 'min leestijd',
    authorRole: 'Logistiek Expert',
    shareTitle: 'Vergeet niet te delen!',
    shareDesc: 'Vond u deze inhoud nuttig? Deel het met collega\'s in de transportsector.',
    loading: 'Artikel laden...',
    guides: [
      { label: 'Vracht Zoeken Gids', slug: 'kamyon-tir-soforleri-yuk-bulma-rehberi' },
      { label: 'Kostenbesparing', slug: 'sehirler-arasi-nakliye-maliyet-dusurme' },
      { label: 'Regelgeving', slug: 'evden-eve-nakliyat-yasal-mevzuat-belgeler' },
    ],
    faqs: [
      { q: 'Wat is een logistieke marktplaats?', a: 'Een digitaal ecosysteem waar verladers en vervoerders elkaar rechtstreeks ontmoeten om vrachten te verhandelen.' },
      { q: 'Wat zijn de voordelen van een vrachtuitwisseling?', a: 'Preistransparantie, tijdwinst en het minimaliseren van lege retourritten (lege kilometers).' },
      { q: 'Hoe wordt de betrouwbaarheid gewaarborgd?', a: 'Leden worden geverifieerd en beoordeeld op basis van eerdere transporten.' }
    ]
  },
  ru: {
    title: 'Логистический Портал и Гид по Грузоперевозкам | Loadly',
    description: 'Цифровая логистическая платформа. Статьи о публикации грузов, поиске попутного транспорта и сокращении расходов.',
    tagline: 'Руководство по рынку логистики и грузоперевозок',
    header1: 'Цифровизация',
    headerAccent: 'Мира Логистики',
    header2: '',
    introText: 'Актуальные инструкции по размещению грузов, поиску обратных рейсов и повышению рентабельности перевозок.',
    searchPlaceholder: 'Поиск статей...',
    noArticles: 'Статей не найдено.',
    faqTitle: 'Часто задаваемые вопросы о логистическом маркетплейсе',
    backToBlog: 'Назад в Блог',
    readingTime: 'Время чтения:',
    readingTimeSuffix: 'мин для чтения',
    authorRole: 'Эксперт по Логистике',
    shareTitle: 'Не забудьте поделиться!',
    shareDesc: 'Если статья была вам полезна, поделитесь ею с коллегами по автотранспортной отрасли.',
    loading: 'Загрузка статьи...',
    guides: [
      { label: 'Инструкция по Поиску Грузов', slug: 'kamyon-tir-soforleri-yuk-bulma-rehberi' },
      { label: 'Снижение Расходов', slug: 'sehirler-arasi-nakliye-maliyet-dusurme' },
      { label: 'Документы и Законы', slug: 'evden-eve-nakliyat-yasal-mevzuat-belgeler' },
    ],
    faqs: [
      { q: 'Что такое логистический маркетплейс?', a: 'Это онлайн-платформа, которая напрямую связывает грузовладельцев и перевозчиков для быстрого торга.' },
      { q: 'В чем преимущество биржи грузов?', a: 'Экономия времени, прозрачность тарифов и минимизация холостых пробегов (обратных рейсов).' },
      { q: 'Как обеспечивается безопасность?', a: 'Все пользователи проходят верификацию документов, а их работа оценивается отзывами.' }
    ]
  },
  uk: {
    title: 'Логістичний Портал та Гід з Вантажоперевезень | Loadly',
    description: 'Цифрова логістична платформа. Статті про публікацію вантажів, пошук автотранспорту та оптимізацію витрат.',
    tagline: 'Інструкція з ринку логістики та вантажоперевезень',
    header1: 'Цифровізація',
    headerAccent: 'Світу Логістики',
    header2: '',
    introText: 'Найновіші посібники про замовлення на доставку, пошук зворотних рейсів та скорочення витрат на логістику.',
    searchPlaceholder: 'Пошук статей...',
    noArticles: 'Нічого не знайдено.',
    faqTitle: 'Часті Питання про Логістичний Маркетплейс',
    backToBlog: 'Назад до Блогу',
    readingTime: 'Час читання:',
    readingTimeSuffix: 'хв читання',
    authorRole: 'Експерт з Логістики',
    shareTitle: 'Поділіться корисною інформацією!',
    shareDesc: 'Якщо ця стаття була вам корисною, поділіться нею з друзями в транспортній сфері.',
    loading: 'Завантаження статті...',
    guides: [
      { label: 'Гід з Пошуку Вантажів', slug: 'kamyon-tir-soforleri-yuk-bulma-rehberi' },
      { label: 'Зниження Витрат', slug: 'sehirler-arasi-nakliye-maliyet-dusurme' },
      { label: 'Юридичні Правила', slug: 'evden-eve-nakliyat-yasal-mevzuat-belgeler' },
    ],
    faqs: [
      { q: 'Що таке логістичний маркетплейс?', a: 'Це цифрова екосистема, де вантажовідправники та перевізники укладають прямі угоди.' },
      { q: 'Які переваги дає біржа вантажів?', a: 'Прозорість цін, економія часу та запобігання поїздкам порожніх автомобілів.' },
      { q: 'Як гарантується безпека?', a: 'Користувачі проходять верифікацію профілів та рейтингуються за відгуками.' }
    ]
  },
  zh: {
    title: '物流货运市场与运输指南 | Loadly',
    description: '数字化物流服务平台。获取关于发布货源信息、寻找卡车货源以及降低运输成本方法的全面指导文章。',
    tagline: '物流与货运市场指南',
    header1: '使物流世界',
    headerAccent: '数字化',
    header2: '',
    introText: '了解如何利用 Loadly 货运市场发布货源、配载车源以及优化供应链流程。',
    searchPlaceholder: '搜索文章...',
    noArticles: '未找到符合搜索条件的文章。',
    faqTitle: '关于物流货运市场的常见问题',
    backToBlog: '返回博客',
    readingTime: '阅读时间：',
    readingTimeSuffix: '分钟阅读',
    authorRole: '物流专家',
    shareTitle: '不要忘记分享！',
    shareDesc: '如果您觉得这些内容有用，请分享给运输行业的朋友们。',
    loading: '文章加载中...',
    guides: [
      { label: '找货源指南', slug: 'kamyon-tir-soforleri-yuk-bulma-rehberi' },
      { label: '降低运输成本', slug: 'sehirler-arasi-nakliye-maliyet-dusurme' },
      { label: '行业法规要求', slug: 'evden-eve-nakliyat-yasal-mevzuat-belgeler' },
    ],
    faqs: [
      { q: '什么是物流货运市场？', a: '物流货运市场是一个数字化平台，货主和承运人可以直接对接以发布货源和提交报价。' },
      { q: '货运交易所有什么优势？', a: '它提高价格透明度，节省寻找车源时间，减少卡车空驶率，从而降低整体成本。' },
      { q: '如何保证交易的安全性？', a: '平台要求对所有用户进行资质认证，并在货运任务完成后提供评价系统。' }
    ]
  },
  ja: {
    title: '物流マーケットプレイス＆輸送ガイド | Loadly',
    description: 'デジタル物流プラットフォーム。貨物情報の登録、トラック積荷の検索、運送コスト削減方法に関する役立つ記事。',
    tagline: '物流＆運送マーケットプレイスガイド',
    header1: '物流の世界を',
    headerAccent: 'デジタル化する',
    header2: '',
    introText: 'Loadlyのマーケットプレイスを利用した、配送案件の掲載、求車求貨マッチング、物流効率化の最新情報をお届けします。',
    searchPlaceholder: '記事を検索...',
    noArticles: '該当する記事が見つかりませんでした。',
    faqTitle: '物流マーケットプレイスに関するよくある質問',
    backToBlog: 'ブログに戻る',
    readingTime: '所要時間：',
    readingTimeSuffix: '分で読めます',
    authorRole: '物流スペシャリスト',
    shareTitle: 'シェアしましょう！',
    shareDesc: 'この記事が役に立ったら、物流・運送業界の仲間にもぜひシェアして教えてあげてください。',
    loading: '記事を読み込んでいます...',
    guides: [
      { label: '求貨ガイド', slug: 'kamyon-tir-soforleri-yuk-bulma-rehberi' },
      { label: 'コスト削減', slug: 'sehirler-arasi-nakliye-maliyet-dusurme' },
      { label: '法規制と書類', slug: 'evden-eve-nakliyat-yasal-mevzuat-belgeler' },
    ],
    faqs: [
      { q: '物流マーケットプレイスとは何ですか？', a: '荷主と運送会社が直接繋がり、貨物の掲載や運賃の見積もりを行えるオンライン取引システムです。' },
      { q: '求車求貨システムを使うメリットは？', a: '取引価格の透明化、手間の削減、帰りの便の空車（バックホール）の解消によるコスト削減です。' },
      { q: '取引の安全性はどのように保たれますか？', a: '登録時に本人確認と書類審査を行い、過去の取引のレビューを公開しています。' }
    ]
  },
  hi: {
    title: 'रसद बाज़ार और परिवहन गाइड | Loadly',
    description: 'डिजिटल रसद मंच। शिपिंग विज्ञापन पोस्ट करने, ट्रक लोड खोजने और रसद लागत कम करने की विधियों के बारे में विस्तृत गाइड।',
    tagline: 'रसद और नौवहन बाज़ार गाइड',
    header1: 'रसद जगत को',
    headerAccent: 'डिजिटल बनाना',
    header2: '',
    introText: 'Loadly बाज़ार का उपयोग करके शिपिंग विज्ञापन, लोड मिलान और आपूर्ति श्रृंखला अनुकूलन पर अद्यतित गाइड खोजें।',
    searchPlaceholder: 'लेख खोजें...',
    noArticles: 'आपकी खोज से मेल खाता कोई लेख नहीं मिला।',
    faqTitle: 'लॉजिस्टिक्स मार्केटप्लेस के बारे में अक्सर पूछे जाने वाले प्रश्न',
    backToBlog: 'ब्लॉग पर वापस जाएँ',
    readingTime: 'पढ़ने का समय:',
    readingTimeSuffix: 'मिनट',
    authorRole: 'लॉजिस्टिक्स विशेषज्ञ',
    shareTitle: 'साझा करना न भूलें!',
    shareDesc: 'यदि आपको यह सामग्री उपयोगी लगी, तो इसे परिवहन क्षेत्र के अपने दोस्तों के साथ साझा करें।',
    loading: 'लेख लोड हो रहा है...',
    guides: [
      { label: 'लोड खोजने की गाइड', slug: 'kamyon-tir-soforleri-yuk-bulma-rehberi' },
      { label: 'लागत में कमी', slug: 'sehirler-arasi-nakliye-maliyet-dusurme' },
      { label: 'नियम और कानून', slug: 'evden-eve-nakliyat-yasal-mevzuat-belgeler' },
    ],
    faqs: [
      { q: 'लॉजिस्टिक्स मार्केटप्लेस क्या है?', a: 'यह एक डिजिटल प्लेटफॉर्म है जहां लोड पोस्ट करने और बिड भेजने के लिए शिपर और कैरियर सीधे जुड़ते हैं।' },
      { q: 'लोड बोर्ड के क्या लाभ हैं?', a: 'यह मूल्य पारदर्शिता प्रदान करता है, समय बचाता है और खाली ट्रकों की वापसी (बैकहॉल) को रोककर लागत घटाता है।' },
      { q: 'सुरक्षा कैसे सुनिश्चित की जाती है?', a: 'सभी उपयोगकर्ताओं का सत्यापन किया जाता है और उनके पिछले काम के लिए रेटिंग प्रणाली दी जाती है।' }
    ]
  },
  ar: {
    title: 'سوق الخدمات اللوجستية ودليل النقل | Loadly',
    description: 'منصة الخدمات اللوجستية الرقمية. مقالات حول نشر إعلانات الشحن، والعثور على حمولات للشاحنات، وطرق خفض التكاليف اللوجستية.',
    tagline: 'دليل سوق الخدمات اللوجستية والشحن',
    header1: 'رقمنة',
    headerAccent: 'عالم الخدمات اللوجستية',
    header2: '',
    introText: 'اعثر على أحدث الأدلة حول إعلانات الشحن ومطابقة الحمولات وتحسين سلاسل التوريد باستخدام منصة Loadly.',
    searchPlaceholder: 'البحث عن المقالات...',
    noArticles: 'لم يتم العثور على مقالات تطابق بحثك.',
    faqTitle: 'الأسئلة الشائعة حول سوق النقل والخدمات اللوجستية',
    backToBlog: 'العودة للمدونة',
    readingTime: 'وقت القراءة:',
    readingTimeSuffix: 'دقائق للقراءة',
    authorRole: 'خبير لوجستي',
    shareTitle: 'لا تنسى مشاركة المحتوى!',
    shareDesc: 'إذا كان هذا المحتوى مفيداً لك، يرجى مشاركته مع أصدقائك في قطاع النقل البري.',
    loading: 'جاري تحميل المقال...',
    guides: [
      { label: 'دليل البحث عن الحمولات', slug: 'kamyon-tir-soforleri-yuk-bulma-rehberi' },
      { label: 'خفض التكاليف اللوجستية', slug: 'sehirler-arasi-nakliye-maliyet-dusurme' },
      { label: 'المستندات والقوانين', slug: 'evden-eve-nakliyat-yasal-mevzuat-belgeler' },
    ],
    faqs: [
      { q: 'ما هو سوق النقل والخدمات اللوجستية؟', a: 'هو نظام رقمي يربط أصحاب البضائع بشركات الشحن مباشرة لنشر الحمولات وتقديم عروض الأسعار.' },
      { q: 'ما هي فوائد بورصة الشحن؟', a: 'يوفر الوقت، ويضمن شفافية الأسعار، ويمنع عودة الشاحنات فارغة مما يقلل النفقات.' },
      { q: 'كيف يتم ضمان أمن المعاملات؟', a: 'يتم التحقق من وثائق جميع المستخدمين وتقييم أدائهم بناءً على سجلات النقل السابقة.' }
    ]
  },
  fa: {
    title: 'بازارگاه لجستیک و راهنمای حمل و نقل | Loadly',
    description: 'سامانه دیجیتال حمل و نقل. دسترسی به مقالات در زمینه ثبت آگهی باربری، پیدا کردن بارهای تریلی و روش‌های کاهش هزینه‌های لجستیکی.',
    tagline: 'راهنمای بازارگاه لجستیک و بارهای حمل و نقل',
    header1: 'دیجیتالی کردن',
    headerAccent: 'دنیای لجستیک',
    header2: '',
    introText: 'به روزترین راهنماها در زمینه اعلام بار، هماهنگی رانندگان و بهینه‌سازی زنجیره تامین را در بازارگاه لودلی بیابید.',
    searchPlaceholder: 'جستجو در مقالات...',
    noArticles: 'هیچ مقاله‌ای منطبق با جستجوی شما یافت نشد.',
    faqTitle: 'سوالات متداول درباره بازارگاه حمل و نقل لجستیک',
    backToBlog: 'بازگشت به وبلاگ',
    readingTime: 'زمان مطالعه:',
    readingTimeSuffix: 'دقیقه مطالعه',
    authorRole: 'کارشناس لجستیک',
    shareTitle: 'اشتراک‌گذاری فراموش نشود!',
    shareDesc: 'اگر این مطلب برای شما مفید بود، آن را با همکاران خود در حوزه حمل و نقل به اشتراک بگذارید.',
    loading: 'در حال بارگذاری مطلب...',
    guides: [
      { label: 'راهنمای پیدا کردن بار', slug: 'kamyon-tir-soforleri-yuk-bulma-rehberi' },
      { label: 'کاهش هزینه‌های حمل', slug: 'sehirler-arasi-nakliye-maliyet-dusurme' },
      { label: 'قوانین و مدارک قانونی', slug: 'evden-eve-nakliyat-yasal-mevzuat-belgeler' },
    ],
    faqs: [
      { q: 'بازارگاه لجستیک چیست؟', a: 'یک بستر دیجیتال است که صاحبان بار و رانندگان را مستقیماً برای ثبت بار و پیشنهاد قیمت به هم وصل می‌کند.' },
      { q: 'اعلام بار آنلاین چه مزایایی دارد؟', a: 'شفافیت قیمت، صرفه‌جویی در زمان و جلوگیری از بازگشت بدون بار کامیون‌ها.' },
      { q: 'امنیت کاربران چگونه تامین می‌شود؟', a: 'مدارک و هویت تمام رانندگان تایید می‌شود و سوابق کاری آنها دارای سیستم امتیازدهی است.' }
    ]
  }
};
