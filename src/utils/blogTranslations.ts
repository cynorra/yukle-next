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
    title: 'Freight, Trucking & Truck Load Guide | Loadly',
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
    authorRole: 'Chief Technical Editor',
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
    title: 'Nakliye, Taşımacılık & Tır Yükü Rehberi | Loadly',
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
    authorRole: 'Baş Teknik Editör',
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
    title: 'Guía de Flete, Transporte y Carga | Loadly',
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
    authorRole: 'Editor Técnico Jefe',
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
    title: 'Guia de Frete, Transporte e Carga | Loadly',
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
    authorRole: 'Editor Técnico Chefe',
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
    title: 'Guide Fret, Transport et Logistique | Loadly',
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
    authorRole: 'Rédacteur Technique en Chef',
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
    title: 'Fracht-, Transport- & Logistik-Leitfaden | Loadly',
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
    authorRole: 'Leitender Technischer Redakteur',
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
    title: 'Guida Trasporto Merci, Logistica e Spedizioni | Loadly',
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
    authorRole: 'Capo Redattore Tecnico',
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
    title: 'Przewodnik po Frachcie, Transporcie i Logistyce | Loadly',
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
    authorRole: 'Główny Redaktor Techniczny',
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
    title: 'Gids voor Vracht, Transport en Logistiek | Loadly',
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
    authorRole: 'Hoofdredacteur Techniek',
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
    title: 'Руководство по Грузам, Перевозкам и Логистике | Loadly',
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
    authorRole: 'Главный технический редактор',
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
    title: 'Посібник з Вантажу, Перевезень та Логістики | Loadly',
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
    authorRole: 'Головний технічний редактор',
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
    title: '货运、卡车运输与物流指南 | Loadly',
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
    authorRole: '首席技术编辑',
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
    title: '貨物輸送、トラック輸送、物流の総合ガイド | Loadly',
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
    authorRole: 'チーフ技術編集者',
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
    title: 'माल ढुलाई, परिवहन और लॉजिस्टिक्स गाइड | Loadly',
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
    authorRole: 'मुख्य तकनीकी संपादक',
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
    title: 'دليل الشحن والنقل واللوجستيات | Loadly',
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
    authorRole: 'رئيس التحرير التقني',
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
    title: 'راهنمای باربری، حمل و نقل و لجستیک | Loadly',
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
    authorRole: 'سردبیر فنی ارشد',
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
  },

  ko: {
    "title": "화물 운송, 트럭 운송 및 물류 가이드 | Loadly",
    "description": "디지털 물류 플랫폼. 배송 광고 게시, 트럭 적재량 찾기, 물류 비용 절감 방법에 대한 기사에 액세스하세요.",
    "tagline": "물류 및 배송 마켓플레이스 가이드",
    "header1": "Digitizing the",
    "headerAccent": "물류 세계의 디지털화",
    "header2": "",
    "introText": "Loadly 마켓플레이스를 사용하여 배송 광고, 로드 매칭 및 공급망 최적화에 대한 최신 가이드를 찾아보세요.",
    "searchPlaceholder": "기사 검색...",
    "noArticles": "검색과 일치하는 기사를 찾을 수 없습니다.",
    "faqTitle": "물류 시장에 대해 자주 묻는 질문",
    "backToBlog": "블로그로 돌아가기",
    "readingTime": "읽기 시간:",
    "readingTimeSuffix": "min read",
    "authorRole": "수석 기술 편집자",
    "shareTitle": "공유하는 것을 잊지 마세요!",
    "shareDesc": "이 콘텐츠가 유용하다고 생각되면 교통 분야의 친구들과 공유하세요.",
    "loading": "기사 로드 중...",
    "guides": [
        {
            "label": "로드 찾기 가이드",
            "slug": "kamyon-tir-soforleri-yuk-bulma-rehberi"
        },
        {
            "label": "비용 절감",
            "slug": "sehirler-arasi-nakliye-maliyet-dusurme"
        },
        {
            "label": "규정",
            "slug": "evden-eve-nakliyat-yasal-mevzuat-belgeler"
        }
    ],
    "faqs": [
        {
            "q": "물류 마켓플레이스란 무엇입니까?",
            "a": "물류 시장은 배송업체와 운송업체가 직접 만나 화물을 게시하고 화물 입찰을 제출하는 디지털 생태계입니다."
        },
        {
            "q": "로드 보드의 장점은 무엇입니까?",
            "a": "시간을 절약하고, 가격 투명성을 향상시키며, 운송업체가 빈 백홀을 ��하고 운송 비용을 절감하는 데 도움이 됩니다."
        },
        {
            "q": "보안은 어떻게 유지되나요?",
            "a": "모든 사용자는 자격 증명을 확인하고 과거 전송 기록은 검토 시스템을 통해 평가됩니다."
        }
    ]
},
  vi: {
    "title": "Hướng dẫn Vận chuyển Hàng hóa, Vận tải & Hậu cần | Loadly",
    "description": "Nền tảng hậu cần kỹ thuật số. Truy cập các bài viết về đăng quảng cáo vận chuyển, tìm tải trọng xe tải và các phương pháp giảm chi phí hậu cần.",
    "tagline": "Hướng dẫn về thị trường hậu cần & vận chuyển",
    "header1": "Số hóa",
    "headerAccent": "Thế giới hậu cần",
    "header2": "",
    "introText": "Tìm hướng dẫn cập nhật nhất về quảng cáo vận chuyển, khớp tải và tối ưu hóa chuỗi cung ứng bằng cách sử dụng thị trường Loadly.",
    "searchPlaceholder": "Tìm kiếm bài viết...",
    "noArticles": "Không tìm thấy bài viết nào phù hợp với tìm kiếm của bạn.",
    "faqTitle": "Câu hỏi thường gặp về thị trường Logistics",
    "backToBlog": "Quay lại Blog",
    "readingTime": "Thời gian đọc:",
    "readingTimeSuffix": "phút đọc",
    "authorRole": "Biên Tập Viên Kỹ Thuật Trưởng",
    "shareTitle": "Đừng quên chia sẻ!",
    "shareDesc": "Nếu bạn thấy nội dung này hữu ích, hãy chia sẻ nó với bạn bè trong lĩnh vực giao thông vận tải.",
    "loading": "Đang tải bài viết...",
    "guides": [
        {
            "label": "Tải Hướng dẫn tìm kiếm",
            "slug": "kamyon-tir-soforleri-yuk-bulma-rehberi"
        },
        {
            "label": "Giảm chi phí",
            "slug": "sehirler-arasi-nakliye-maliyet-dusurme"
        },
        {
            "label": "Quy định",
            "slug": "evden-eve-nakliyat-yasal-mevzuat-belgeler"
        }
    ],
    "faqs": [
        {
            "q": "Thị trường logistics là gì?",
            "a": "Thị trường hậu cần là một hệ sinh thái kỹ thuật số nơi người gửi hàng và người vận chuyển gặp nhau trực tiếp để đăng tải và gửi giá thầu vận chuyển hàng hóa."
        },
        {
            "q": "Lợi ích của bảng tải là gì?",
            "a": "Nó tiết kiệm thời gian, cải thiện tính minh bạch về giá và giúp các hãng vận tải tránh được các chuyến bay không tải về, giảm chi phí vận chuyển."
        },
        {
            "q": "An ninh được duy trì như thế nào?",
            "a": "Tất cả người dùng đều xác minh thông tin xác thực và lịch sử vận ​​chuyển trong quá khứ được xếp hạng thông qua hệ thống đánh giá."
        }
    ]
},
  id: {
    "title": "Panduan Pengiriman Barang, Transportasi & Logistik | Loadly",
    "description": "Platform logistik digital. Akses artikel tentang memasang iklan pengiriman, menemukan muatan truk, dan metode pengurangan biaya logistik.",
    "tagline": "Panduan Pasar Logistik & Pengiriman",
    "header1": "Mendigitalkan",
    "headerAccent": "Dunia Logistik",
    "header2": "",
    "introText": "Temukan panduan terbaru tentang iklan pengiriman, pencocokan muatan, dan pengoptimalan rantai pasokan menggunakan pasar Loadly.",
    "searchPlaceholder": "Cari artikel...",
    "noArticles": "Tidak ada artikel yang cocok dengan pencarian Anda.",
    "faqTitle": "Pertanyaan Umum Tentang Pasar Logistik",
    "backToBlog": "Kembali ke Blog",
    "readingTime": "Waktu membaca:",
    "readingTimeSuffix": "min baca",
    "authorRole": "Kepala Editor Teknis",
    "shareTitle": "Jangan Lupa Berbagi!",
    "shareDesc": "Jika Anda merasa konten ini bermanfaat, bagikan dengan teman Anda di bidang transportasi.",
    "loading": "Memuat artikel...",
    "guides": [
        {
            "label": "Panduan Pencarian Beban",
            "slug": "kamyon-tir-soforleri-yuk-bulma-rehberi"
        },
        {
            "label": "Pengurangan Biaya",
            "slug": "sehirler-arasi-nakliye-maliyet-dusurme"
        },
        {
            "label": "Peraturan",
            "slug": "evden-eve-nakliyat-yasal-mevzuat-belgeler"
        }
    ],
    "faqs": [
        {
            "q": "Apa yang dimaksud dengan pasar logistik?",
            "a": "Pasar logistik adalah ekosistem digital tempat pengirim dan operator bertemu langsung untuk mengirimkan muatan dan mengajukan tawaran pengangkutan."
        },
        {
            "q": "Apa manfaat papan beban?",
            "a": "Ini menghemat waktu, meningkatkan transparansi harga, dan membantu operator menghindari backhaul kosong, sehingga mengurangi biaya transportasi."
        },
        {
            "q": "Bagaimana keamanan dipertahankan?",
            "a": "Semua pengguna memverifikasi kredensial, dan riwayat transportasi sebelumnya dinilai melalui sistem peninjauan."
        }
    ]
},
  bn: {
    "title": "মালবাহী, পরিবহন ও লজিস্টিকস গাইড | Loadly",
    "description": "ডিজিটাল লজিস্টিক প্ল্যাটফর্ম। শিপিং বিজ্ঞাপন পোস্ট করা, ট্রাক লোড খুঁজে বের করা এবং লজিস্টিক খরচ কমানোর পদ্ধতি সম্পর্কে নিবন্ধগুলি অ্যাক্সেস করুন।",
    "tagline": "লজিস্টিক এবং শিপিং মার্কেটপ্লেস গাইড",
    "header1": "ডিজিটাইজিং",
    "headerAccent": "লজিস্টিক ওয়ার্ল্ড",
    "header2": "",
    "introText": "লোডলি মার্কেটপ্লেস ব্যবহার করে শিপিং বিজ্ঞাপন, লোড ম্যাচিং এবং সাপ্লাই চেইন অপ্টিমাইজেশানের সবচেয়ে আপ-টু-ডেট গাইড খুঁজুন।",
    "searchPlaceholder": "নিবন্ধ অনুসন্ধান করুন...",
    "noArticles": "আপনার অনুসন্ধানের সাথে মেলে কোনো নিবন্ধ পাওয়া যায়নি.",
    "faqTitle": "লজিস্টিক মার্কেটপ্লেস সম্পর্কে প্রায়শই জিজ্ঞাসিত প্রশ্ন",
    "backToBlog": "ব্লগে ফিরে যান",
    "readingTime": "পড়ার সময়:",
    "readingTimeSuffix": "মিনিট পড়া",
    "authorRole": "প্রধান কারিগরি সম্পাদক",
    "shareTitle": "শেয়ার করতে ভুলবেন না!",
    "shareDesc": "আপনি যদি এই বিষয়বস্তুটিকে উপযোগী মনে করেন, তাহলে পরিবহন সেক্টরে আপনার বন্ধুদের সাথে শেয়ার করুন।",
    "loading": "নিবন্ধ লোড হচ্ছে...",
    "guides": [
        {
            "label": "লোড ফাইন্ডিং গাইড",
            "slug": "kamyon-tir-soforleri-yuk-bulma-rehberi"
        },
        {
            "label": "খরচ হ্রাস",
            "slug": "sehirler-arasi-nakliye-maliyet-dusurme"
        },
        {
            "label": "প্রবিধান",
            "slug": "evden-eve-nakliyat-yasal-mevzuat-belgeler"
        }
    ],
    "faqs": [
        {
            "q": "একটি লজিস্টিক মার্কেটপ্লেস কি?",
            "a": "একটি লজিস্টিক মার্কেটপ্লেস হল একটি ডিজিটাল ইকোসিস্টেম যেখানে শিপার এবং ক্যারিয়ার লোড পোস্ট করতে এবং মালবাহী বিড জমা দেওয়ার জন্য সরাসরি দেখা করে।"
        },
        {
            "q": "লোড বোর্ডের সুবিধা কি?",
            "a": "এটি সময় বাঁচায়, মূল্যের স্বচ্ছতা উন্নত করে এবং বাহকদের খালি ব্যাকহল এড়াতে সাহায্য করে, পরিবহন খরচ কমায়।"
        },
        {
            "q": "কিভাবে নিরাপত্তা বজায় রাখা হয়?",
            "a": "সমস্ত ব্যবহারকারী শংসাপত্র যাচাই করে, এবং অতীতের পরিবহন ইতিহাস একটি পর্যালোচনা সিস্টেমের মাধ্যমে রেট করা হয়।"
        }
    ]
},
  ur: {
    "title": "مال برداری، نقل و حمل اور لاجسٹکس گائیڈ | Loadly",
    "description": "ڈیجیٹل لاجسٹکس پلیٹ فارم۔ شپنگ اشتہارات پوسٹ کرنے، ٹرک کے بوجھ کو تلاش کرنے، اور لاجسٹک لاگت میں کمی کے طریقوں کے بارے میں مضامین تک رسائی حاصل کریں۔",
    "tagline": "لاجسٹک اور شپنگ مارکیٹ پلیس گائیڈ",
    "header1": "کو ڈیجیٹائز کرنا",
    "headerAccent": "لاجسٹک ورلڈ",
    "header2": "",
    "introText": "لوڈلی مارکیٹ پلیس کا استعمال کرتے ہوئے شپنگ اشتہارات، لوڈ میچنگ، اور سپلائی چین آپٹیمائزیشن کے بارے میں تازہ ترین گائیڈز تلاش کریں۔",
    "searchPlaceholder": "مضامین تلاش کریں...",
    "noArticles": "آپ کی تلاش سے مماثل کوئی مضمون نہیں ملا۔",
    "faqTitle": "لاجسٹک مارکیٹ پلیس کے بارے میں اکثر پوچھے جانے والے سوالات",
    "backToBlog": "واپس بلاگ پر",
    "readingTime": "پڑھنے کا وقت:",
    "readingTimeSuffix": "منٹ پڑھیں",
    "authorRole": "چیف ٹیکنیکل ایڈیٹر",
    "shareTitle": "شیئر کرنا نہ بھولیں!",
    "shareDesc": "اگر آپ کو یہ مواد کارآمد لگتا ہے تو اسے ٹرانسپورٹ کے شعبے میں اپنے دوستوں کے ساتھ شیئر کریں۔",
    "loading": "مضمون لوڈ ہو رہا ہے...",
    "guides": [
        {
            "label": "لوڈ فائنڈنگ گائیڈ",
            "slug": "kamyon-tir-soforleri-yuk-bulma-rehberi"
        },
        {
            "label": "لاگت میں کمی",
            "slug": "sehirler-arasi-nakliye-maliyet-dusurme"
        },
        {
            "label": "ضابطے",
            "slug": "evden-eve-nakliyat-yasal-mevzuat-belgeler"
        }
    ],
    "faqs": [
        {
            "q": "لاجسٹک مارکیٹ پلیس کیا ہے؟",
            "a": "لاجسٹکس مارکیٹ پلیس ایک ڈیجیٹل ماحولیاتی نظام ہے جہاں شپرز اور کیریئرز لوڈ پوسٹ کرنے اور مال برداری کی بولیاں جمع کرانے کے لیے براہ راست ملتے ہیں۔"
        },
        {
            "q": "لوڈ بورڈ کے فوائد کیا ہیں؟",
            "a": "یہ وقت بچاتا ہے، قیمت کی شفافیت کو بہتر بناتا ہے، اور نقل و حمل کے اخراجات کو کم کرتے ہوئے کیریئرز کو خالی بیک ہال سے بچنے میں مدد کرتا ہے۔"
        },
        {
            "q": "سیکیورٹی کیسے رکھی جاتی ہے؟",
            "a": "تمام صارفین اسناد کی تصدیق کرتے ہیں، اور ماضی کی نقل و حمل کی تاریخوں کو ایک جائزہ نظام کے ذریعے درجہ بندی کیا جاتا ہے۔"
        }
    ]
},
  th: {
    "title": "คู่มือการขนส่งสินค้า, การขนส่ง & โลจิสติกส์ | Loadly",
    "description": "แพลตฟอร์มโลจิสติกส์ดิจิทัล เข้าถึงบทความเกี่ยวกับการโพสต์โฆษณาเกี่ยวกับการขนส่ง การค้นหาการบรรทุกของรถบรรทุก และวิธีการลดต้นทุนด้านลอจิสติกส์",
    "tagline": "คู่มือตลาดโลจิสติกส์และการขนส่ง",
    "header1": "การแปลงเป็นดิจิทัล",
    "headerAccent": "โลจิสติกโลก",
    "header2": "",
    "introText": "ค้นหาคำแนะนำล่าสุดเกี่ยวกับโฆษณาการจัดส่ง การจับคู่โหลด และการเพิ่มประสิทธิภาพห่วงโซ่อุปทานโดยใช้ตลาด Loadly",
    "searchPlaceholder": "ค้นหาบทความ...",
    "noArticles": "ไม่พบบทความที่ตรงกับการค้นหาของคุณ",
    "faqTitle": "คำถามที่พบบ่อยเกี่ยวกับตลาดโลจิสติกส์",
    "backToBlog": "กลับไปที่บล็อก",
    "readingTime": "เวลาในการอ่าน:",
    "readingTimeSuffix": "นาทีอ่าน",
    "authorRole": "หัวหน้าบรรณาธิการฝ่ายเทคนิค",
    "shareTitle": "อย่าลืมแบ่งปัน!",
    "shareDesc": "หากคุณพบว่าเนื้อหานี้มีประโยชน์ โปรดแบ่งปันกับเพื่อนของคุณในภาคการขนส่ง",
    "loading": "กำลังโหลดบทความ...",
    "guides": [
        {
            "label": "คู่มือการค้นหาโหลด",
            "slug": "kamyon-tir-soforleri-yuk-bulma-rehberi"
        },
        {
            "label": "การลดต้นทุน",
            "slug": "sehirler-arasi-nakliye-maliyet-dusurme"
        },
        {
            "label": "ข้อบังคับ",
            "slug": "evden-eve-nakliyat-yasal-mevzuat-belgeler"
        }
    ],
    "faqs": [
        {
            "q": "ตลาดโลจิสติกส์คืออะไร?",
            "a": "ตลาดลอจิสติกส์เป็นระบบนิเวศดิจิทัลที่ผู้จัดส่งและผู้ให้บริการพบกันโดยตรงหลังการบรรทุกและส่งการเสนอราคาค่าขนส่ง"
        },
        {
            "q": "กระดานโหลดมีประโยชน์อย่างไร?",
            "a": "ช่วยประหยัดเวลา ปรับปรุงความโปร่งใสด้านราคา และช่วยให้ผู้ให้บริการขนส่งหลีกเลี่ยงการขึ้นเครื่องเปล่า ลดต้นทุนการขนส่ง"
        },
        {
            "q": "มีการรักษาความปลอดภัยอย่างไร?",
            "a": "ผู้ใช้ทุกคนตรวจสอบข้อมูลรับรอง และประวัติการขนส่งที่ผ่านมาได้รับการจัดอันดับผ่านระบบตรวจสอบ"
        }
    ]
},
  ms: {
    "title": "Panduan Pengangkutan Barang, Logistik & Penghantaran | Loadly",
    "description": "Platform logistik digital. Akses artikel tentang menyiarkan iklan penghantaran, mencari muatan trak dan kaedah pengurangan kos logistik.",
    "tagline": "Panduan Pasaran Logistik & Penghantaran",
    "header1": "Mendigitalkan",
    "headerAccent": "Dunia Logistik",
    "header2": "",
    "introText": "Cari panduan paling terkini tentang iklan penghantaran, pemadanan muatan dan pengoptimuman rantaian bekalan menggunakan pasaran Loadly.",
    "searchPlaceholder": "Cari artikel...",
    "noArticles": "Tiada artikel ditemui sepadan dengan carian anda.",
    "faqTitle": "Soalan Lazim Mengenai Pasaran Logistik",
    "backToBlog": "Kembali ke Blog",
    "readingTime": "Masa membaca:",
    "readingTimeSuffix": "min baca",
    "authorRole": "Ketua Editor Teknikal",
    "shareTitle": "Jangan Lupa Kongsi!",
    "shareDesc": "Jika anda mendapati kandungan ini berguna, kongsi dengan rakan anda dalam sektor pengangkutan.",
    "loading": "Memuatkan artikel...",
    "guides": [
        {
            "label": "Panduan Mencari Muatan",
            "slug": "kamyon-tir-soforleri-yuk-bulma-rehberi"
        },
        {
            "label": "Pengurangan Kos",
            "slug": "sehirler-arasi-nakliye-maliyet-dusurme"
        },
        {
            "label": "Peraturan",
            "slug": "evden-eve-nakliyat-yasal-mevzuat-belgeler"
        }
    ],
    "faqs": [
        {
            "q": "Apakah itu pasaran logistik?",
            "a": "Pasaran logistik ialah ekosistem digital di mana pengirim dan pembawa bertemu secara langsung untuk menghantar muatan dan menyerahkan bidaan barang."
        },
        {
            "q": "Apakah faedah papan muatan?",
            "a": "Ia menjimatkan masa, meningkatkan ketelusan harga dan membantu pembawa mengelakkan pengangkutan balik kosong, mengurangkan kos pengangkutan."
        },
        {
            "q": "Bagaimanakah keselamatan dijaga?",
            "a": "Semua pengguna mengesahkan kelayakan, dan sejarah pengangkutan lalu dinilai melalui sistem semakan."
        }
    ]
},
  tl: {
    "title": "Gabay sa Kargamento, Transportasyon at Logistik | Loadly",
    "description": "Digital logistics platform. I-access ang mga artikulo tungkol sa pag-post ng mga ad sa pagpapadala, paghahanap ng mga karga ng trak, at mga paraan ng pagbabawas ng gastos sa logistik.",
    "tagline": "Logistics & Shipping Marketplace Guide",
    "header1": "Digitizing the",
    "headerAccent": "Logistics World",
    "header2": "",
    "introText": "Hanapin ang pinaka-up-to-date na mga gabay sa shipping ads, load matching, at supply chain optimization gamit ang Loadly marketplace.",
    "searchPlaceholder": "Maghanap ng mga artikulo...",
    "noArticles": "Walang nakitang mga artikulo na tumutugma sa iyong paghahanap.",
    "faqTitle": "Mga Madalas Itanong Tungkol sa Logistics Marketplace",
    "backToBlog": "Bumalik sa Blog",
    "readingTime": "Oras ng pagbabasa:",
    "readingTimeSuffix": "min read",
    "authorRole": "Punong Editor sa Teknikal",
    "shareTitle": "Huwag Kalimutang Ibahagi!",
    "shareDesc": "Kung nakita mong kapaki-pakinabang ang nilalamang ito, ibahagi ito sa iyong mga kaibigan sa sektor ng transportasyon.",
    "loading": "Naglo-load ng artikulo...",
    "guides": [
        {
            "label": "Gabay sa Paghahanap ng Pag-load",
            "slug": "kamyon-tir-soforleri-yuk-bulma-rehberi"
        },
        {
            "label": "Pagbawas ng Gastos",
            "slug": "sehirler-arasi-nakliye-maliyet-dusurme"
        },
        {
            "label": "Mga Regulasyon",
            "slug": "evden-eve-nakliyat-yasal-mevzuat-belgeler"
        }
    ],
    "faqs": [
        {
            "q": "Ano ang marketplace ng logistik?",
            "a": "Ang logistics marketplace ay isang digital ecosystem kung saan direktang nagkikita ang mga shipper at carrier para mag-post ng mga load at magsumite ng mga bid sa kargamento."
        },
        {
            "q": "Ano ang mga benepisyo ng isang load board?",
            "a": "Nakakatipid ito ng oras, pinapahusay ang transparency ng presyo, at tinutulungan ang mga carrier na maiwasan ang mga walang laman na backhaul, na binabawasan ang mga gastos sa transportasyon."
        },
        {
            "q": "Paano napapanatili ang seguridad?",
            "a": "Lahat ng mga user ay nagbe-verify ng mga kredensyal, at ang mga nakaraang kasaysayan ng transportasyon ay na-rate sa pamamagitan ng isang sistema ng pagsusuri."
        }
    ]
},
  ro: {
    "title": "Ghid de Transport Marfă și Logistică | Loadly",
    "description": "Platformă logistică digitală. Accesați articole despre postarea anunțurilor de expediere, găsirea încărcăturilor de camioane și metode de reducere a costurilor logistice.",
    "tagline": "Ghidul pieței de logistică și expediere",
    "header1": "Digitizarea",
    "headerAccent": "Lumea Logisticii",
    "header2": "",
    "introText": "Găsiți cele mai actualizate ghiduri despre anunțurile de expediere, potrivirea încărcăturii și optimizarea lanțului de aprovizionare folosind piața Loadly.",
    "searchPlaceholder": "Căutați articole...",
    "noArticles": "Nu s-au găsit articole care să corespundă căutării dvs.",
    "faqTitle": "Întrebări frecvente despre piața logistică",
    "backToBlog": "Înapoi la Blog",
    "readingTime": "Timp de citire:",
    "readingTimeSuffix": "min citire",
    "authorRole": "Redactor Tehnic Șef",
    "shareTitle": "Nu uitați să distribuiți!",
    "shareDesc": "Dacă ți s-a părut util acest conținut, distribuie-l prietenilor tăi din sectorul transporturilor.",
    "loading": "Se încarcă articolul...",
    "guides": [
        {
            "label": "Încărcați ghidul de căutare",
            "slug": "kamyon-tir-soforleri-yuk-bulma-rehberi"
        },
        {
            "label": "Reducerea costurilor",
            "slug": "sehirler-arasi-nakliye-maliyet-dusurme"
        },
        {
            "label": "Regulamente",
            "slug": "evden-eve-nakliyat-yasal-mevzuat-belgeler"
        }
    ],
    "faqs": [
        {
            "q": "Ce este o piață de logistică?",
            "a": "O piață de logistică este un ecosistem digital în care expeditorii și transportatorii se întâlnesc direct pentru a posta încărcături și a depune oferte de transport."
        },
        {
            "q": "Care sunt avantajele unei plăci de încărcare?",
            "a": "Economisește timp, îmbunătățește transparența prețurilor și ajută transportatorii să evite transporturile goale, reducând costurile de transport."
        },
        {
            "q": "Cum se menține securitatea?",
            "a": "Toți utilizatorii verifică acreditările, iar istoricul de transport din trecut este evaluat printr-un sistem de evaluare."
        }
    ]
},
  sv: {
    "title": "Guide för Frakt, Transport och Logistik | Loadly",
    "description": "Digital logistikplattform. Få tillgång till artiklar om att lägga upp fraktannonser, hitta lastbilslaster och metoder för att minska logistikkostnader.",
    "tagline": "Marknadsguide för logistik och frakt",
    "header1": "Digitalisera",
    "headerAccent": "logistikvärlden",
    "header2": "",
    "introText": "Hitta de mest uppdaterade guiderna om fraktannonser, lastmatchning och optimering av försörjningskedjan med hjälp av Loadly-marknadsplatsen.",
    "searchPlaceholder": "Sök artiklar...",
    "noArticles": "Inga artiklar hittades som matchar din sökning.",
    "faqTitle": "Vanliga frågor om Logistics Marketplace",
    "backToBlog": "Tillbaka till bloggen",
    "readingTime": "Lästid:",
    "readingTimeSuffix": "min läsning",
    "authorRole": "Teknisk Chefredaktör",
    "shareTitle": "Glöm inte att dela!",
    "shareDesc": "Om du tyckte att det här innehållet var användbart, dela det med dina vänner inom transportsektorn.",
    "loading": "Laddar artikel...",
    "guides": [
        {
            "label": "Lastsökningsguide",
            "slug": "kamyon-tir-soforleri-yuk-bulma-rehberi"
        },
        {
            "label": "Kostnadsminskning",
            "slug": "sehirler-arasi-nakliye-maliyet-dusurme"
        },
        {
            "label": "Regler",
            "slug": "evden-eve-nakliyat-yasal-mevzuat-belgeler"
        }
    ],
    "faqs": [
        {
            "q": "Vad är en logistikmarknadsplats?",
            "a": "En logistikmarknad är ett digitalt ekosystem där avsändare och transportörer träffas direkt för att lägga upp laster och lämna fraktbud."
        },
        {
            "q": "Vilka är fördelarna med en lastbräda?",
            "a": "Det sparar tid, förbättrar pristransparensen och hjälper transportörer att undvika tomma backhauls, vilket minskar transportkostnaderna."
        },
        {
            "q": "Hur upprätthålls säkerheten?",
            "a": "Alla användare verifierar autentiseringsuppgifter och tidigare transporthistoriker betygsätts genom ett granskningssystem."
        }
    ]
},
  cs: {
    "title": "Průvodce Nákladní Dopravou a Logistikou | Loadly",
    "description": "Digitální logistická platforma. Získejte přístup k článkům o zveřejňování reklam na přepravu, hledání nákladu kamionů a metodách snižování nákladů na logistiku.",
    "tagline": "Průvodce tržištěm logistiky a přepravy",
    "header1": "Digitalizace",
    "headerAccent": "Svět logistiky",
    "header2": "",
    "introText": "Najděte nejaktuálnější průvodce o reklamách na přepravu, přiřazování nákladu a optimalizaci dodavatelského řetězce pomocí tržiště Loadly.",
    "searchPlaceholder": "Hledat články...",
    "noArticles": "Nebyly nalezeny žádné články odpovídající vašemu hledání.",
    "faqTitle": "Často kladené otázky o Logistics Marketplace",
    "backToBlog": "Zpět na blog",
    "readingTime": "Doba čtení:",
    "readingTimeSuffix": "min čtení",
    "authorRole": "Hlavní technický redaktor",
    "shareTitle": "Nezapomeňte sdílet!",
    "shareDesc": "Pokud pro vás byl tento obsah užitečný, sdílejte jej se svými přáteli v odvětví dopravy.",
    "loading": "Načítání článku...",
    "guides": [
        {
            "label": "Průvodce hledáním nákladu",
            "slug": "kamyon-tir-soforleri-yuk-bulma-rehberi"
        },
        {
            "label": "Snížení nákladů",
            "slug": "sehirler-arasi-nakliye-maliyet-dusurme"
        },
        {
            "label": "Předpisy",
            "slug": "evden-eve-nakliyat-yasal-mevzuat-belgeler"
        }
    ],
    "faqs": [
        {
            "q": "Co je to logistické tržiště?",
            "a": "Logistické tržiště je digitální ekosystém, kde se přímo setkávají dopravci a přepravci, aby posílali náklady a předkládali nabídky na přepravu."
        },
        {
            "q": "Jaké jsou výhody nakládací desky?",
            "a": "Šetří čas, zlepšuje cenovou transparentnost a pomáhá dopravcům vyhnout se prázdným páteřním spojům, čímž snižuje náklady na dopravu."
        },
        {
            "q": "Jak je zajištěna bezpečnost?",
            "a": "Všichni uživatelé ověřují pověření a historie přepravy je hodnocena prostřednictvím kontrolního systému."
        }
    ]
},
  hu: {
    "title": "Áruszállítás, Fuvarozás és Logisztika Útmutató | Loadly",
    "description": "Digitális logisztikai platform. Hozzáférés a szállítási hirdetések feladásáról, a teherautó rakományok kereséséről és a logisztikai költségcsökkentési módszerekről szóló cikkekhez.",
    "tagline": "Logisztikai és szállítási piactér útmutató",
    "header1": "A",
    "headerAccent": "logisztikai világ digitalizálása",
    "header2": "",
    "introText": "Keresse meg a legfrissebb útmutatókat a szállítási hirdetésekről, a rakományegyeztetésről és az ellátási lánc optimalizálásáról a Loadly piactér segítségével.",
    "searchPlaceholder": "Cikkek keresése...",
    "noArticles": "Nem található a keresésnek megfelelő cikk.",
    "faqTitle": "Gyakran Ismételt Kérdések a Logisztikai Piactérrel kapcsolatban",
    "backToBlog": "Vissza a blogra",
    "readingTime": "Olvasási idő:",
    "readingTimeSuffix": "min olvasni",
    "authorRole": "Vezető Technikai Szerkesztő",
    "shareTitle": "Ne felejts el megosztani!",
    "shareDesc": "Ha hasznosnak találta ezt a tartalmat, ossza meg a közlekedési ágazatban dolgozó barátaival.",
    "loading": "Cikk betöltése...",
    "guides": [
        {
            "label": "Betöltéskeresési útmutató",
            "slug": "kamyon-tir-soforleri-yuk-bulma-rehberi"
        },
        {
            "label": "Költségcsökkentés",
            "slug": "sehirler-arasi-nakliye-maliyet-dusurme"
        },
        {
            "label": "Előírások",
            "slug": "evden-eve-nakliyat-yasal-mevzuat-belgeler"
        }
    ],
    "faqs": [
        {
            "q": "Mi az a logisztikai piactér?",
            "a": "A logisztikai piac egy digitális ökoszisztéma, ahol a feladók és a fuvarozók közvetlenül találkoznak, hogy feladják a rakományt és beadják a fuvarozási ajánlatokat."
        },
        {
            "q": "Milyen előnyei vannak a rakodólapnak?",
            "a": "Időt takarít meg, javítja az árak átláthatóságát, és segít a fuvarozóknak elkerülni az üres backhaul-okat, csökkentve ezzel a szállítási költségeket."
        },
        {
            "q": "Hogyan tartják fenn a biztonságot?",
            "a": "Minden felhasználó ellenőrzi a hitelesítő adatokat, és a korábbi szállítási előzményeket egy felülvizsgálati rendszer értékeli."
        }
    ]
},
  el: {
    "title": "Οδηγός Φορτίου, Μεταφορών και Εφοδιαστικής | Loadly",
    "description": "Digital logistics πλατφόρμα. Αποκτήστε πρόσβαση σε άρθρα σχετικά με τη δημοσίευση διαφημίσεων αποστολής, την εύρεση φορτίων φορτηγών και τις μεθόδους μείωσης του κόστους εφοδιαστικής.",
    "tagline": "Οδηγός Logistics & Shipping Marketplace",
    "header1": "Ψηφιοποίηση του",
    "headerAccent": "Logistics World",
    "header2": "",
    "introText": "Βρείτε τους πιο ενημερωμένους οδηγούς σχετικά με τις διαφημίσεις αποστολής, την αντιστοίχιση φορτίου και τη βελτιστοποίηση της αλυσίδας εφοδιασμού χρησιμοποιώντας την αγορά Loadly.",
    "searchPlaceholder": "Αναζήτηση άρθρων...",
    "noArticles": "Δεν βρέθηκαν άρθρα που να ταιριάζουν με την αναζήτησή σας.",
    "faqTitle": "Συχνές ερωτήσεις σχετικά με την αγορά Logistics",
    "backToBlog": "Επιστροφή στο Ιστολόγιο",
    "readingTime": "Χρόνος ανάγνωσης:",
    "readingTimeSuffix": "ελάχιστη ανάγνωση",
    "authorRole": "Επικεφαλής Τεχνικός Συντάκτης",
    "shareTitle": "Μην ξεχάσετε να μοιραστείτε!",
    "shareDesc": "Εάν βρήκατε αυτό το περιεχόμενο χρήσιμο, μοιραστείτε το με τους φίλους σας στον τομέα των μεταφορών.",
    "loading": "Φόρτωση άρθρου...",
    "guides": [
        {
            "label": "Οδηγός εύρεσης φορτίου",
            "slug": "kamyon-tir-soforleri-yuk-bulma-rehberi"
        },
        {
            "label": "Κανονισμοί μείωσης κόστους",
            "slug": "sehirler-arasi-nakliye-maliyet-dusurme"
        },
        {
            "label": "Regulations",
            "slug": "evden-eve-nakliyat-yasal-mevzuat-belgeler"
        }
    ],
    "faqs": [
        {
            "q": "Τι είναι η αγορά logistics;",
            "a": "Η αγορά logistics είναι ένα ψηφιακό οικοσύστημα όπου οι αποστολείς και οι μεταφορείς συναντώνται απευθείας για να αναρτήσουν φορτία και να υποβάλουν προσφορές φορτίου."
        },
        {
            "q": "Ποια είναι τα οφέλη μιας σανίδας φόρτωσης;",
            "a": "Εξοικονομεί χρόνο, βελτιώνει τη διαφάνεια των τιμών και βοηθά τους μεταφορείς να αποφεύγουν τις άδειες μεταφορές, μειώνοντας το κόστος μεταφοράς."
        },
        {
            "q": "Πώς διατηρείται η ασφάλεια;",
            "a": "Όλοι οι χρήστες επαληθεύουν τα διαπιστευτήρια και τα προηγούμενα ιστορικά μεταφορών βαθμολογούνται μέσω ενός συστήματος ελέγχου."
        }
    ]
},
  az: {
    "title": "Yük, Daşınma və Logistika Bələdçisi | Loadly",
    "description": "Rəqəmsal logistika platforması. Göndərmə elanlarının yerləşdirilməsi, yük maşını yüklərinin tapılması və logistika xərclərinin azaldılması üsulları haqqında məqalələrə daxil olun.",
    "tagline": "Logistika və Göndərmə Bazar Yeri Bələdçisi",
    "header1": "Digitizing the",
    "headerAccent": "Logistika Dünyasının Rəqəmləşdirilməsi",
    "header2": "",
    "introText": "Loadly bazarından istifadə edərək göndərmə reklamları, yüklərin uyğunlaşdırılması və təchizat zəncirinin optimallaşdırılması üzrə ən müasir bələdçiləri tapın.",
    "searchPlaceholder": "Məqalələri axtarın...",
    "noArticles": "Axtarışınıza uyğun məqalə tapılmadı.",
    "faqTitle": "Logistics Marketplace Haqqında Tez-tez Verilən Suallar",
    "backToBlog": "Bloqa qayıt",
    "readingTime": "Oxu vaxtı:",
    "readingTimeSuffix": "dəq oxumaq",
    "authorRole": "Baş Texniki Redaktor",
    "shareTitle": "Paylaşmağı Unutmayın!",
    "shareDesc": "Bu məzmunu faydalı hesab etdinizsə, nəqliyyat sektorunda dostlarınızla paylaşın.",
    "loading": "Məqalə yüklənir...",
    "guides": [
        {
            "label": "Axtarış bələdçisini yükləyin",
            "slug": "kamyon-tir-soforleri-yuk-bulma-rehberi"
        },
        {
            "label": "Xərclərin azaldılması",
            "slug": "sehirler-arasi-nakliye-maliyet-dusurme"
        },
        {
            "label": "Qaydalar",
            "slug": "evden-eve-nakliyat-yasal-mevzuat-belgeler"
        }
    ],
    "faqs": [
        {
            "q": "Logistika bazarı nədir?",
            "a": "Logistika bazarı, yükgöndərənlərin və daşıyıcıların yükləri göndərmək və yük təkliflərini təqdim etmək üçün birbaşa görüşdüyü rəqəmsal ekosistemdir."
        },
        {
            "q": "Yük lövhəsinin üstünlükləri nələrdir?",
            "a": "Bu, vaxta qənaət edir, qiymət şəffaflığını artırır və daşıyıcılara boş daşımalardan qaçmağa kömək edir, nəqliyyat xərclərini azaldır."
        },
        {
            "q": "Təhlükəsizlik necə qorunur?",
            "a": "Bütün istifadəçilər etimadnamələrini yoxlayır və keçmiş nəqliyyat tarixçələri nəzərdən keçirmə sistemi vasitəsilə qiymətləndirilir."
        }
    ]
},
  kk: {
    "title": "Жүк, Тасымалдау және Логистика Нұсқаулығы | Loadly",
    "description": "Сандық логистикалық платформа. Жеткізу хабарландыруларын орналастыру, жүк көліктерін табу және логистикалық шығындарды азайту әдістері туралы мақалаларға қол жеткізіңіз.",
    "tagline": "Логистика және жеткізу нарығының нұсқаулығы",
    "header1": "цифрландыру",
    "headerAccent": "Логистика әлемі",
    "header2": "",
    "introText": "Loadly нарығын пайдалана отырып, хабарландыруларды жеткізу, жүктемені сәйкестендіру және жеткізу тізбегін оңтайландыру бойынша ең соңғы нұсқаулықтарды табыңыз.",
    "searchPlaceholder": "Мақалаларды іздеу...",
    "noArticles": "Іздеуіңізге сәйкес мақалалар табылмады.",
    "faqTitle": "Логистика нарығы туралы жиі қойылатын сұрақтар",
    "backToBlog": "Блогқа оралу",
    "readingTime": "Оқу уақыты:",
    "readingTimeSuffix": "мин оқу",
    "authorRole": "Бас техникалық редактор",
    "shareTitle": "Бөлісуді ұмытпаңыз!",
    "shareDesc": "Бұл мазмұнды пайдалы деп тапсаңыз, оны көлік саласындағы достарыңызбен бөлісіңіз.",
    "loading": "Мақала жүктелуде...",
    "guides": [
        {
            "label": "Іздеу нұсқаулығын жүктеңіз",
            "slug": "kamyon-tir-soforleri-yuk-bulma-rehberi"
        },
        {
            "label": "Шығындарды азайту",
            "slug": "sehirler-arasi-nakliye-maliyet-dusurme"
        },
        {
            "label": "Ережелер",
            "slug": "evden-eve-nakliyat-yasal-mevzuat-belgeler"
        }
    ],
    "faqs": [
        {
            "q": "Логистикалық нарық дегеніміз не?",
            "a": "Логистикалық нарық – жүк жөнелтушілер мен тасымалдаушылар жүктерді орналастыру және жүк тасымалы бойынша өтінімдерді жіберу үшін тікелей кездесетін сандық экожүйе."
        },
        {
            "q": "Жүктеме тақтасының артықшылықтары қандай?",
            "a": "Бұл уақытты үнемдейді, бағаның ашықтығын жақсартады және тасымалдаушыларға көлік шығындарын азайта отырып, бос қайта жөндеуден аулақ болуға көмектеседі."
        },
        {
            "q": "Қауіпсіздік қалай сақталады?",
            "a": "Барлық пайдаланушылар тіркелгі деректерін тексереді және өткен тасымалдау тарихы шолу жүйесі арқылы бағаланады."
        }
    ]
},
  he: {
    "title": "מדריך למטען, הובלה ולוגיסטיקה | Loadly",
    "description": "פלטפורמה לוגיסטית דיגיטלית. גש למאמרים על פרסום מודעות משלוח, מציאת מטענים של משאיות ושיטות להפחתת עלויות לוגיסטיות.",
    "tagline": "מדריך שוק לוגיסטיקה ומשלוח",
    "header1": "דיגיטציה של",
    "headerAccent": "עולם הלוגיסטיקה",
    "header2": "",
    "introText": "מצא את המדריכים המעודכנים ביותר בנושא משלוח מודעות, התאמת עומסים ואופטימיזציה של שרשרת האספקה ​​באמצעות השוק Loadly.",
    "searchPlaceholder": "חפש מאמרים...",
    "noArticles": "לא נמצאו מאמרים התואמים לחיפוש שלך.",
    "faqTitle": "שאלות נפוצות על שוק הלוגיסטיקה",
    "backToBlog": "חזרה לבלוג",
    "readingTime": "זמן קריאה:",
    "readingTimeSuffix": "דקות קריאה",
    "authorRole": "עורך טכני ראשי",
    "shareTitle": "אל תשכח לשתף!",
    "shareDesc": "אם מצאתם את התוכן הזה שימושי, שתפו אותו עם חבריכם מתחום התחבורה.",
    "loading": "טוען מאמר...",
    "guides": [
        {
            "label": "טען מדריך איתור",
            "slug": "kamyon-tir-soforleri-yuk-bulma-rehberi"
        },
        {
            "label": "הפחתת עלויות",
            "slug": "sehirler-arasi-nakliye-maliyet-dusurme"
        },
        {
            "label": "תַקָנוֹן",
            "slug": "evden-eve-nakliyat-yasal-mevzuat-belgeler"
        }
    ],
    "faqs": [
        {
            "q": "מהו שוק לוגיסטי?",
            "a": "שוק לוגיסטי הוא מערכת אקולוגית דיגיטלית שבה שולחים ומובילים נפגשים ישירות כדי לפרסם מטענים ולהגיש הצעות הובלה."
        },
        {
            "q": "מהם היתרונות של לוח עומסים?",
            "a": "זה חוסך זמן, משפר את שקיפות המחירים ועוזר למובילים להימנע מהחזרות ריקות, ומפחית את עלויות ההובלה."
        },
        {
            "q": "איך שומרים על האבטחה?",
            "a": "כל המשתמשים מאמתים אישורים, והיסטוריות העברות קודמות מדורגות באמצעות מערכת סקירה."
        }
    ]
},
  bg: {
    "title": "Наръчник за Товари, Транспорт и Логистика | Loadly",
    "description": "Цифрова логистична платформа. Достъп до статии за публикуване на реклами за доставка, намиране на товари от камиони и методи за намаляване на логистичните разходи.",
    "tagline": "Ръководство за пазара за логистика и доставка",
    "header1": "Дигитализация на",
    "headerAccent": "света на логистиката",
    "header2": "",
    "introText": "Намерете най-актуалните ръководства за реклами за доставка, съпоставяне на товара и оптимизация на веригата за доставки с помощта на пазара Loadly.",
    "searchPlaceholder": "Търсене на статии...",
    "noArticles": "Няма намерени статии, отговарящи на вашето търсене.",
    "faqTitle": "Често задавани въпроси относно Logistics Marketplace",
    "backToBlog": "Назад към блога",
    "readingTime": "Време за четене:",
    "readingTimeSuffix": "min read",
    "authorRole": "Главен технически редактор",
    "shareTitle": "Не забравяйте да споделите!",
    "shareDesc": "Ако намирате това съдържание за полезно, споделете го с приятелите си в транспортния сектор.",
    "loading": "Зареждане на статия...",
    "guides": [
        {
            "label": "Зареждане на ръководство за намиране",
            "slug": "kamyon-tir-soforleri-yuk-bulma-rehberi"
        },
        {
            "label": "Намаляване на разходите",
            "slug": "sehirler-arasi-nakliye-maliyet-dusurme"
        },
        {
            "label": "Регламенти",
            "slug": "evden-eve-nakliyat-yasal-mevzuat-belgeler"
        }
    ],
    "faqs": [
        {
            "q": "Какво е логистичен пазар?",
            "a": "Логистичният пазар е дигитална екосистема, където спедитори и превозвачи се срещат директно, за да публикуват товари и да подават оферти за превоз."
        },
        {
            "q": "Какви са предимствата на товарната дъска?",
            "a": "Спестява време, подобрява прозрачността на цените и помага на превозвачите да избегнат празни обратни връзки, намалявайки транспортните разходи."
        },
        {
            "q": "Как се поддържа сигурността?",
            "a": "Всички потребители проверяват идентификационните данни и миналите транспортни истории се оценяват чрез система за преглед."
        }
    ]
},
  hr: {
    "title": "Vodič za Teret, Prijevoz i Logistiku | Loadly",
    "description": "Digitalna logistička platforma. Pristupite člancima o objavljivanju oglasa za otpremu, pronalaženju tovara kamiona i metodama smanjenja logističkih troškova.",
    "tagline": "Vodič za tržište logistike i dostave",
    "header1": "Digitalizacija",
    "headerAccent": "svijeta logistike",
    "header2": "",
    "introText": "Pronađite najažurnije vodiče o oglasima za dostavu, usklađivanju tereta i optimizaciji opskrbnog lanca pomoću tržišta Loadly.",
    "searchPlaceholder": "Pretraživanje članaka...",
    "noArticles": "Nema pronađenih članaka koji odgovaraju vašem pretraživanju.",
    "faqTitle": "Često postavljana pitanja o logističkom tržištu",
    "backToBlog": "Natrag na blog",
    "readingTime": "Vrijeme čitanja:",
    "readingTimeSuffix": "min. čitanje",
    "authorRole": "Glavni tehnički urednik",
    "shareTitle": "Ne zaboravite podijeliti!",
    "shareDesc": "Ako smatrate da je ovaj sadržaj koristan, podijelite ga sa svojim prijateljima u transportnom sektoru.",
    "loading": "Učitavanje članka...",
    "guides": [
        {
            "label": "Učitaj vodič za pronalaženje",
            "slug": "kamyon-tir-soforleri-yuk-bulma-rehberi"
        },
        {
            "label": "Smanjenje troškova",
            "slug": "sehirler-arasi-nakliye-maliyet-dusurme"
        },
        {
            "label": "Propisi",
            "slug": "evden-eve-nakliyat-yasal-mevzuat-belgeler"
        }
    ],
    "faqs": [
        {
            "q": "Što je logističko tržište?",
            "a": "Tržište logistike digitalni je ekosustav u kojem se pošiljatelji i prijevoznici susreću izravno kako bi objavili utovar i podnijeli ponude za prijevoz."
        },
        {
            "q": "Koje su prednosti teretne ploče?",
            "a": "Štedi vrijeme, poboljšava transparentnost cijena i pomaže prijevoznicima da izbjegnu prazne povratne veze, smanjujući troškove prijevoza."
        },
        {
            "q": "Kako se održava sigurnost?",
            "a": "Svi korisnici provjeravaju vjerodajnice, a prošle povijesti transporta ocjenjuju se kroz sustav pregleda."
        }
    ]
},
  sr: {
    "title": "Водич за Терет, Превоз и Логистику | Loadly",
    "description": "Дигитална логистичка платформа. Приступите чланцима о постављању огласа за испоруку, проналажењу утовара камиона и методама смањења трошкова логистике.",
    "tagline": "Водич за тржиште логистике и отпреме",
    "header1": "Дигитализација тхе",
    "headerAccent": "Логистицс Ворлд",
    "header2": "",
    "introText": "Пронађите најажурније водиче о огласима за испоруку, усклађивању оптерећења и оптимизацији ланца снабдевања користећи Лоадли маркетплаце.",
    "searchPlaceholder": "Претражи чланке...",
    "noArticles": "Није пронађен ниједан чланак који одговара вашој претрази.",
    "faqTitle": "Често постављана питања о Логистицс Маркетплаце-у",
    "backToBlog": "Назад на блог",
    "readingTime": "Време читања:",
    "readingTimeSuffix": "мин читања",
    "authorRole": "Главни технички уредник",
    "shareTitle": "Не заборавите да поделите!",
    "shareDesc": "Ако сматрате да је овај садржај користан, поделите га са пријатељима у сектору транспорта.",
    "loading": "Учитавање чланка...",
    "guides": [
        {
            "label": "Учитајте водич за проналажење",
            "slug": "kamyon-tir-soforleri-yuk-bulma-rehberi"
        },
        {
            "label": "Смањење трошкова",
            "slug": "sehirler-arasi-nakliye-maliyet-dusurme"
        },
        {
            "label": "Прописи",
            "slug": "evden-eve-nakliyat-yasal-mevzuat-belgeler"
        }
    ],
    "faqs": [
        {
            "q": "Шта је логистичко тржиште?",
            "a": "Тржиште логистике је дигитални екосистем где се отпремници и превозници састају директно да би послали утовар и поднели понуде за терет."
        },
        {
            "q": "Које су предности утоварне плоче?",
            "a": "То штеди време, побољшава транспарентност цена и помаже превозницима да избегну празне транспорте, смањујући трошкове транспорта."
        },
        {
            "q": "Како се одржава безбедност?",
            "a": "Сви корисници верифицирају акредитиве, а прошлост транспорта се оцењује кроз систем прегледа."
        }
    ]
},
  sk: {
    "title": "Sprievodca Nákladnou Dopravou a Logistikou | Loadly",
    "description": "Digitálna logistická platforma. Získajte prístup k článkom o uverejňovaní reklám na prepravu, hľadaní nákladu kamiónov a metódach znižovania nákladov na logistiku.",
    "tagline": "Sprievodca trhom logistiky a prepravy",
    "header1": "Digitalizácia",
    "headerAccent": "Svet logistiky",
    "header2": "",
    "introText": "Nájdite najaktuálnejších sprievodcov o reklamách na prepravu, priraďovaní nákladu a optimalizácii dodávateľského reťazca pomocou trhoviska Loadly.",
    "searchPlaceholder": "Hľadať články...",
    "noArticles": "Nenašli sa žiadne články zodpovedajúce vášmu vyhľadávaniu.",
    "faqTitle": "Často kladené otázky o Logistickom trhu",
    "backToBlog": "Späť na blog",
    "readingTime": "Čas čítania:",
    "readingTimeSuffix": "min čítať",
    "authorRole": "Hlavný technický redaktor",
    "shareTitle": "Nezabudnite zdieľať!",
    "shareDesc": "Ak ste považovali tento obsah za užitočný, zdieľajte ho so svojimi priateľmi v sektore dopravy.",
    "loading": "Načítava sa článok...",
    "guides": [
        {
            "label": "Sprievodca hľadaním nákladu",
            "slug": "kamyon-tir-soforleri-yuk-bulma-rehberi"
        },
        {
            "label": "Zníženie nákladov",
            "slug": "sehirler-arasi-nakliye-maliyet-dusurme"
        },
        {
            "label": "Predpisy",
            "slug": "evden-eve-nakliyat-yasal-mevzuat-belgeler"
        }
    ],
    "faqs": [
        {
            "q": "Čo je to trh logistiky?",
            "a": "Logistický trh je digitálny ekosystém, kde sa odosielatelia a dopravcovia stretávajú priamo, aby zložili náklady a predložili ponuky na prepravu."
        },
        {
            "q": "Aké sú výhody nakladacej dosky?",
            "a": "Šetrí čas, zlepšuje transparentnosť cien a pomáha dopravcom vyhnúť sa prázdnym backhaulom, čím sa znižujú náklady na dopravu."
        },
        {
            "q": "Ako sa udržiava bezpečnosť?",
            "a": "Všetci používatelia overujú poverenia a minulá história prepravy sa hodnotí prostredníctvom systému kontroly."
        }
    ]
},
  da: {
    "title": "Guide til Fragt, Transport og Logistik | Loadly",
    "description": "Digital logistikplatform. Få adgang til artikler om opslag af forsendelsesannoncer, at finde lastbiler og metoder til reduktion af logistikomkostninger.",
    "tagline": "Logistik & Shipping Marketplace Guide",
    "header1": "Digitalisering af",
    "headerAccent": "Logistics World",
    "header2": "",
    "introText": "Find de mest opdaterede guider om forsendelsesannoncer, belastningsmatchning og forsyningskædeoptimering ved hjælp af Loadly-markedspladsen.",
    "searchPlaceholder": "Søg artikler...",
    "noArticles": "Der blev ikke fundet nogen artikler, der matcher din søgning.",
    "faqTitle": "Ofte stillede spørgsmål om Logistics Marketplace",
    "backToBlog": "Tilbage til blog",
    "readingTime": "Læsetid:",
    "readingTimeSuffix": "min læst",
    "authorRole": "Teknisk Chefredaktør",
    "shareTitle": "Glem ikke at dele!",
    "shareDesc": "Hvis du fandt dette indhold nyttigt, så del det med dine venner i transportsektoren.",
    "loading": "Indlæser artikel...",
    "guides": [
        {
            "label": "Load Finding Guide",
            "slug": "kamyon-tir-soforleri-yuk-bulma-rehberi"
        },
        {
            "label": "Omkostningsreduktion",
            "slug": "sehirler-arasi-nakliye-maliyet-dusurme"
        },
        {
            "label": "Regler",
            "slug": "evden-eve-nakliyat-yasal-mevzuat-belgeler"
        }
    ],
    "faqs": [
        {
            "q": "Hvad er en logistikmarkedsplads?",
            "a": "En logistikmarkedsplads er et digitalt økosystem, hvor afsendere og transportører mødes direkte for at sende laster og afgive fragtbud."
        },
        {
            "q": "Hvad er fordelene ved et læssebræt?",
            "a": "Det sparer tid, forbedrer prisgennemsigtigheden og hjælper transportører med at undgå tomme backhauls, hvilket reducerer transportomkostningerne."
        },
        {
            "q": "Hvordan opretholdes sikkerheden?",
            "a": "Alle brugere bekræfter legitimationsoplysninger, og tidligere transporthistorier bedømmes gennem et gennemgangssystem."
        }
    ]
},
  fi: {
    "title": "Opas Rahtiin, Kuljetukseen ja Logistiikkaan | Loadly",
    "description": "Digitaalinen logistiikkaalusta. Tutustu artikkeleihin toimitusilmoitusten lähettämisestä, kuorma-autokuormien löytämisestä ja logistiikkakustannusten vähentämismenetelmistä.",
    "tagline": "Logistics & Shipping Marketplace Guide",
    "header1": "Digitalising the",
    "headerAccent": "Logistics World",
    "header2": "",
    "introText": "Löydä uusimmat oppaat toimitusmainoksista, kuorman täsmäyttämisestä ja toimitusketjun optimoinnista Loadly-markkinapaikan avulla.",
    "searchPlaceholder": "Hae artikkeleita...",
    "noArticles": "Hakusi vastaavia artikkeleita ei löytynyt.",
    "faqTitle": "Usein kysyttyjä kysymyksiä Logistics Marketplacesta",
    "backToBlog": "Takaisin blogiin",
    "readingTime": "Lukuaika:",
    "readingTimeSuffix": "min lue",
    "authorRole": "Tekninen Päätoimittaja",
    "shareTitle": "Älä unohda jakaa!",
    "shareDesc": "Jos pidit tästä sisällöstä hyödyllistä, jaa se kuljetusalan ystävillesi.",
    "loading": "Ladataan artikkelia...",
    "guides": [
        {
            "label": "Load Finding Guide",
            "slug": "kamyon-tir-soforleri-yuk-bulma-rehberi"
        },
        {
            "label": "Kustannusten vähentäminen",
            "slug": "sehirler-arasi-nakliye-maliyet-dusurme"
        },
        {
            "label": "Määräykset",
            "slug": "evden-eve-nakliyat-yasal-mevzuat-belgeler"
        }
    ],
    "faqs": [
        {
            "q": "Mikä on logistiikkamarkkinapaikka?",
            "a": "Logistiikkamarkkinat ovat digitaalinen ekosysteemi, jossa rahdinkuljettajat ja rahdinkuljettajat tapaavat suoraan lähettääkseen kuorman ja jättääkseen rahtitarjouksia."
        },
        {
            "q": "Mitä etuja kuormalaudalla on?",
            "a": "Se säästää aikaa, parantaa hintojen läpinäkyvyyttä ja auttaa liikenteenharjoittajia välttämään tyhjiä backhauleja, mikä vähentää kuljetuskustannuksia."
        },
        {
            "q": "Miten turvallisuutta ylläpidetään?",
            "a": "Kaikki käyttäjät vahvistavat tunnistetiedot, ja aiemmat kuljetushistoriat arvioidaan tarkistusjärjestelmän avulla."
        }
    ]
},
  no: {
    "title": "Guide for Frakt, Transport og Logistikk | Loadly",
    "description": "Digital logistikkplattform. Få tilgang til artikler om å legge ut fraktannonser, finne lastebiler og metoder for kostnadsreduksjon i logistikk.",
    "tagline": "Markedsveiledning for logistikk og frakt",
    "header1": "Digitalisering av",
    "headerAccent": "logistikkverden",
    "header2": "",
    "introText": "Finn de mest oppdaterte veiledningene om fraktannonser, lasttilpasning og forsyningskjedeoptimalisering ved å bruke Loadly-markedsplassen.",
    "searchPlaceholder": "Søk etter artikler...",
    "noArticles": "Ingen artikler funnet som samsvarer med søket ditt.",
    "faqTitle": "Ofte stilte spørsmål om logistikkmarkedsplassen",
    "backToBlog": "Tilbake til bloggen",
    "readingTime": "Lesetid:",
    "readingTimeSuffix": "min lest",
    "authorRole": "Teknisk Sjefredaktør",
    "shareTitle": "Ikke glem å dele!",
    "shareDesc": "Hvis du syntes dette innholdet var nyttig, del det med vennene dine i transportsektoren.",
    "loading": "Laster artikkel...",
    "guides": [
        {
            "label": "Load Finding Guide",
            "slug": "kamyon-tir-soforleri-yuk-bulma-rehberi"
        },
        {
            "label": "Kostnadsreduksjon",
            "slug": "sehirler-arasi-nakliye-maliyet-dusurme"
        },
        {
            "label": "Regelverk",
            "slug": "evden-eve-nakliyat-yasal-mevzuat-belgeler"
        }
    ],
    "faqs": [
        {
            "q": "Hva er en logistikkmarkedsplass?",
            "a": "En logistikkmarkedsplass er et digitalt økosystem der avsendere og transportører møtes direkte for å legge inn last og sende inn fraktbud."
        },
        {
            "q": "Hva er fordelene med et lastebrett?",
            "a": "Det sparer tid, forbedrer pristransparens og hjelper transportører med å unngå tomme tilbakehalinger, noe som reduserer transportkostnadene."
        },
        {
            "q": "Hvordan opprettholdes sikkerheten?",
            "a": "Alle brukere bekrefter legitimasjon, og tidligere transporthistorier blir vurdert gjennom et gjennomgangssystem."
        }
    ]
},
  uz: {
    "title": "Yuk, Tashish va Logistika Bo'yicha Qo'llanma | Loadly",
    "description": "Raqamli logistika platformasi. Yuk tashish e'lonlarini joylashtirish, yuk mashinalari yuklarini topish va logistika xarajatlarini kamaytirish usullari haqida maqolalarga kiring.",
    "tagline": "Logistika va yuk tashish bozori bo'yicha qo'llanma",
    "header1": "raqamlashtirish",
    "headerAccent": "Logistika dunyosi",
    "header2": "",
    "introText": "Loadly bozoridan foydalangan holda reklamalarni jo'natish, yuklarni moslashtirish va ta'minot zanjirini optimallashtirish bo'yicha eng so'nggi qo'llanmalarni toping.",
    "searchPlaceholder": "Maqolalar qidirish...",
    "noArticles": "Qidiruvingizga mos maqola topilmadi.",
    "faqTitle": "Logistika bozori haqida tez-tez so'raladigan savollar",
    "backToBlog": "Blog sahifasiga qaytish",
    "readingTime": "O'qish vaqti:",
    "readingTimeSuffix": "min o'qish",
    "authorRole": "Bosh texnik muharrir",
    "shareTitle": "Ulashishni unutmang!",
    "shareDesc": "Agar siz ushbu tarkibni foydali deb bilsangiz, uni transport sohasidagi do'stlaringiz bilan baham ko'ring.",
    "loading": "Maqola yuklanmoqda...",
    "guides": [
        {
            "label": "Topish bo'yicha qo'llanmani yuklab oling",
            "slug": "kamyon-tir-soforleri-yuk-bulma-rehberi"
        },
        {
            "label": "Xarajatlarni kamaytirish",
            "slug": "sehirler-arasi-nakliye-maliyet-dusurme"
        },
        {
            "label": "Qoidalar",
            "slug": "evden-eve-nakliyat-yasal-mevzuat-belgeler"
        }
    ],
    "faqs": [
        {
            "q": "Logistika bozori nima?",
            "a": "Logistika bozori raqamli ekotizim bo'lib, u erda yuk jo'natuvchilar va tashuvchilar yuklarni joylashtirish va yuk takliflarini topshirish uchun to'g'ridan-to'g'ri uchrashadilar."
        },
        {
            "q": "Yuklash taxtasining afzalliklari nimada?",
            "a": "Bu vaqtni tejaydi, narxlarning shaffofligini yaxshilaydi va tashuvchilarga bo'sh orqaga qaytishdan qochishga yordam beradi va transport xarajatlarini kamaytiradi."
        },
        {
            "q": "Xavfsizlik qanday saqlanadi?",
            "a": "Barcha foydalanuvchilar hisob maʼlumotlarini tekshiradi va oʻtgan transport tarixi koʻrib chiqish tizimi orqali baholanadi."
        }
    ]
},
  ta: {
    "title": "சரக்கு, போக்குவரத்து மற்றும் தளவாடங்கள் வழிகாட்டி | Loadly",
    "description": "டிஜிட்டல் தளவாட தளம். ஷிப்பிங் விளம்பரங்களை இடுகையிடுதல், டிரக் சுமைகளைக் கண்டறிதல் மற்றும் தளவாடச் செலவுக் குறைப்பு முறைகள் பற்றிய கட்டுரைகளை அணுகவும்.",
    "tagline": "தளவாடங்கள் & கப்பல் சந்தை வழிகாட்டி",
    "header1": "இலக்கமாக்கும்",
    "headerAccent": "லாஜிஸ்டிக்ஸ் உலகம்",
    "header2": "",
    "introText": "லோட்லி மார்க்கெட்பிளேஸைப் பயன்படுத்தி ஷிப்பிங் விளம்பரங்கள், லோட் மேட்சிங் மற்றும் சப்ளை செயின் ஆப்டிமைசேஷன் பற்றிய சமீபத்திய வழிகாட்டிகளைக் கண்டறியவும்.",
    "searchPlaceholder": "கட்டுரைகளைத் தேடு...",
    "noArticles": "உங்கள் தேடலுக்குப் பொருத்தமான கட்டுரைகள் எதுவும் இல்லை.",
    "faqTitle": "லாஜிஸ்டிக்ஸ் சந்தையைப் பற்றி அடிக்கடி கேட்கப்படும் கேள்விகள்",
    "backToBlog": "வலைப்பதிவுக்குத் திரும்பு",
    "readingTime": "படிக்கும் நேரம்:",
    "readingTimeSuffix": "நிமிடம் படித்தேன்",
    "authorRole": "தலைமை தொழில்நுட்ப ஆசிரியர்",
    "shareTitle": "மறக்காமல் பகிருங்கள்!",
    "shareDesc": "இந்த உள்ளடக்கம் உங்களுக்கு பயனுள்ளதாக இருந்தால், போக்குவரத்துத் துறையில் உள்ள உங்கள் நண்பர்களுடன் பகிர்ந்து கொள்ளுங்கள்.",
    "loading": "கட்டுரையை ஏற்றுகிறது...",
    "guides": [
        {
            "label": "கண்டறிதல் வழிகாட்டியை ஏற்றவும்",
            "slug": "kamyon-tir-soforleri-yuk-bulma-rehberi"
        },
        {
            "label": "செலவு குறைப்பு",
            "slug": "sehirler-arasi-nakliye-maliyet-dusurme"
        },
        {
            "label": "விதிமுறைகள்",
            "slug": "evden-eve-nakliyat-yasal-mevzuat-belgeler"
        }
    ],
    "faqs": [
        {
            "q": "தளவாட சந்தை என்றால் என்ன?",
            "a": "லாஜிஸ்டிக்ஸ் மார்க்கெட்ப்ளேஸ் என்பது ஒரு டிஜிட்டல் சுற்றுச்சூழல் அமைப்பாகும், அங்கு சரக்குகளை அனுப்புபவர்களும் கேரியர்களும் நேரடியாகச் சந்தித்து சரக்கு ஏலங்களைச் சமர்ப்பிக்கிறார்கள்."
        },
        {
            "q": "சுமை பலகையின் நன்மைகள் என்ன?",
            "a": "இது நேரத்தை மிச்சப்படுத்துகிறது, விலை வெளிப்படைத்தன்மையை மேம்படுத்துகிறது மற்றும் கேரியர்களுக்கு வெற்று பேக்ஹால்களைத் தவிர்க்க உதவுகிறது, போக்குவரத்து செலவுகளைக் குறைக்கிறது."
        },
        {
            "q": "பாதுகாப்பு எவ்வாறு பராமரிக்கப்படுகிறது?",
            "a": "அனைத்து பயனர்களும் நற்சான்றிதழ்களை சரிபார்க்கிறார்கள், மேலும் கடந்த கால போக்குவரத்து வரலாறுகள் மதிப்பாய்வு அமைப்பு மூலம் மதிப்பிடப்படுகின்றன."
        }
    ]
},
  mr: {
    "title": "मालवाहतूक, वाहतूक आणि लॉजिस्टिक्स मार्गदर्शक | Loadly",
    "description": "डिजिटल लॉजिस्टिक प्लॅटफॉर्म. शिपिंग जाहिराती पोस्ट करणे, ट्रक लोड शोधणे आणि लॉजिस्टिक खर्च कमी करण्याच्या पद्धतींबद्दल लेखांमध्ये प्रवेश करा.",
    "tagline": "लॉजिस्टिक आणि शिपिंग मार्केटप्लेस मार्गदर्शक",
    "header1": "डिजिटायझिंग",
    "headerAccent": "लॉजिस्टिक वर्ल्ड",
    "header2": "",
    "introText": "लोडली मार्केटप्लेस वापरून शिपिंग जाहिराती, लोड जुळणी आणि पुरवठा शृंखला ऑप्टिमायझेशनवर सर्वात अद्ययावत मार्गदर्शक शोधा.",
    "searchPlaceholder": "लेख शोधा...",
    "noArticles": "तुमच्या शोधाशी जुळणारे कोणतेही लेख आढळले नाहीत.",
    "faqTitle": "लॉजिस्टिक मार्केटप्लेसबद्दल वारंवार विचारले जाणारे प्रश्न",
    "backToBlog": "ब्लॉगवर परत",
    "readingTime": "वाचन वेळ:",
    "readingTimeSuffix": "किमान वाचले",
    "authorRole": "मुख्य तांत्रिक संपादक",
    "shareTitle": "शेअर करायला विसरू नका!",
    "shareDesc": "तुम्हाला ही सामग्री उपयुक्त वाटल्यास, वाहतूक क्षेत्रातील तुमच्या मित्रांसह शेअर करा.",
    "loading": "लेख लोड करत आहे...",
    "guides": [
        {
            "label": "लोड शोधणे मार्गदर्शक",
            "slug": "kamyon-tir-soforleri-yuk-bulma-rehberi"
        },
        {
            "label": "खर्चात कपात",
            "slug": "sehirler-arasi-nakliye-maliyet-dusurme"
        },
        {
            "label": "नियमावली",
            "slug": "evden-eve-nakliyat-yasal-mevzuat-belgeler"
        }
    ],
    "faqs": [
        {
            "q": "लॉजिस्टिक मार्केटप्लेस म्हणजे काय?",
            "a": "लॉजिस्टिक मार्केटप्लेस ही एक डिजिटल इकोसिस्टम आहे जिथे शिपर्स आणि वाहक लोड पोस्ट करण्यासाठी आणि मालवाहतूक बिड सबमिट करण्यासाठी थेट भेटतात."
        },
        {
            "q": "लोड बोर्डचे फायदे काय आहेत?",
            "a": "हे वेळेची बचत करते, किमतीची पारदर्शकता सुधारते आणि वाहकांना रिकामे बॅकहॉल टाळण्यास मदत करते, वाहतूक खर्च कमी करते."
        },
        {
            "q": "सुरक्षा कशी राखली जाते?",
            "a": "सर्व वापरकर्ते क्रेडेन्शियल सत्यापित करतात आणि मागील वाहतूक इतिहास पुनरावलोकन प्रणालीद्वारे रेट केला जातो."
        }
    ]
},
  ka: {
    "title": "ტვირთის, ტრანსპორტირებისა და ლოგისტიკის გზამკვლევი | Loadly",
    "description": "ციფრული ლოგისტიკური პლატფორმა. იხილეთ სტატიები გადაზიდვის რეკლამის განთავსების, სატვირთო მანქანების პოვნისა და ლოგისტიკური ხარჯების შემცირების მეთოდების შესახებ.",
    "tagline": "Logistics & Shipping Marketplace-ის გზამკვლევი",
    "header1": "Digitizing the",
    "headerAccent": "Logistics World-ის დიგიტალიზაცია",
    "header2": "",
    "introText": "იპოვეთ ყველაზე განახლებული სახელმძღვანელო გადაზიდვის რეკლამების, დატვირთვის შესატყვისი და მიწოდების ჯაჭვის ოპტიმიზაციის შესახებ Loadly marketplace-ის გამოყენებით.",
    "searchPlaceholder": "სტატიების ძიება...",
    "noArticles": "არ მოიძებნა სტატიები, რომლებიც შეესაბამება თქვენს ძიებას.",
    "faqTitle": "ხშირად დასმული კითხვები Logistics Marketplace-ის შესახებ",
    "backToBlog": "დაბრუნება ბლოგზე",
    "readingTime": "კითხვის დრო:",
    "readingTimeSuffix": "წაკითხვის წუთი",
    "authorRole": "მთავარი ტექნიკური რედაქტორი",
    "shareTitle": "არ დაგავიწყდეთ გაზიარება!",
    "shareDesc": "თუ ეს კონტენტი თქვენთვის სასარგებლო აღმოჩნდა, გაუზიარეთ ის თქვენს მეგობრებს ტრანსპორტის სექტორში.",
    "loading": "იტვირთება სტატია...",
    "guides": [
        {
            "label": "Load Find Guide",
            "slug": "kamyon-tir-soforleri-yuk-bulma-rehberi"
        },
        {
            "label": "ხარჯების შემცირების",
            "slug": "sehirler-arasi-nakliye-maliyet-dusurme"
        },
        {
            "label": "რეგულაციები",
            "slug": "evden-eve-nakliyat-yasal-mevzuat-belgeler"
        }
    ],
    "faqs": [
        {
            "q": "რა არის ლოგისტიკური ბაზარი?",
            "a": "ლოგისტიკური ბაზარი არის ციფრული ეკოსისტემა, სადაც გამგზავნ��� და გადამზიდავი ხვდებიან პირდაპირ ტვირთების განსათავსებლად და სატვირთო წინადადებების წარდგენის მიზნით."
        },
        {
            "q": "რა სარგებელი მოაქვს დატვირთვის დაფას?",
            "a": "ეს დაზოგავს დროს, აუმჯობესებს ფასების გამჭვირვალობას და ეხმარება გადამზიდველებს თავიდან აიცილონ ცარიელი გადაზიდვები, რაც ამცირებს ტრანსპორტირების ხარჯებს."
        },
        {
            "q": "როგორ არის დაცული უსაფრთხოება?",
            "a": "ყველა მომხმარებელი ამოწმებს რწმუნებათა სიგელებს და წარსული ტრანსპორტის ისტორია ფასდება მიმოხილვის სისტემის მეშვეობით."
        }
    ]
},
  lt: {
    "title": "Krovinių, Transporto ir Logistikos Vadovas | Loadly",
    "description": "Skaitmeninė logistikos platforma. Pasiekite straipsnius apie siuntimo skelbimų paskelbimą, sunkvežimių krovinių paiešką ir logistikos išlaidų mažinimo būdus.",
    "tagline": "Logistikos ir pristatymo rinkos vadovas",
    "header1": "Skaitmeninimas",
    "headerAccent": "Logistikos pasaulis",
    "header2": "",
    "introText": "Raskite naujausius vadovus apie skelbimų pristatymą, krovinio atitikimą ir tiekimo grandinės optimizavimą naudodami „Loadly“ prekyvietę.",
    "searchPlaceholder": "Ieškoti straipsnių...",
    "noArticles": "Nerasta straipsnių, atitinkančių jūsų paiešką.",
    "faqTitle": "Dažnai užduodami klausimai apie logistikos prekyvietę",
    "backToBlog": "Grįžti į dienoraštį",
    "readingTime": "Skaitymo laikas:",
    "readingTimeSuffix": "min skaityti",
    "authorRole": "Vyriausiasis techninis redaktorius",
    "shareTitle": "Nepamirškite pasidalinti!",
    "shareDesc": "Jei šis turinys jums pasirodė naudingas, pasidalykite juo su savo draugais transporto sektoriuje.",
    "loading": "Įkeliamas straipsnis...",
    "guides": [
        {
            "label": "Įkėlimo vadovas",
            "slug": "kamyon-tir-soforleri-yuk-bulma-rehberi"
        },
        {
            "label": "Išlaidų mažinimas",
            "slug": "sehirler-arasi-nakliye-maliyet-dusurme"
        },
        {
            "label": "Taisyklės",
            "slug": "evden-eve-nakliyat-yasal-mevzuat-belgeler"
        }
    ],
    "faqs": [
        {
            "q": "Kas yra logistikos rinka?",
            "a": "Logistikos prekyvietė yra skaitmeninė ekosistema, kurioje siuntėjai ir vežėjai susitinka tiesiogiai, kad išsiųstų krovinius ir pateiktų krovinių pasiūlymus."
        },
        {
            "q": "Kokie yra pakrovimo lentos pranašumai?",
            "a": "Tai taupo laiką, pagerina kainų skaidrumą ir padeda vežėjams išvengti tuščių atbulinių maršrutų, taip sumažinant transportavimo išlaidas."
        },
        {
            "q": "Kaip palaikomas saugumas?",
            "a": "Visi vartotojai tikrina kredencialus, o ankstesnės transporto istorijos įvertinamos per peržiūros sistemą."
        }
    ]
},
  lv: {
    "title": "Kravu, Transporta un Loģistikas Ceļvedis | Loadly",
    "description": "Digitālā loģistikas platforma. Piekļūstiet rakstiem par piegādes sludinājumu ievietošanu, kravas automašīnu atrašanu un loģistikas izmaksu samazināšanas metodēm.",
    "tagline": "Loģistikas un piegādes tirgus ceļvedis",
    "header1": "Digitalizējot",
    "headerAccent": "Loģistikas pasaule",
    "header2": "",
    "introText": "Atrodiet visjaunākos ceļvežus par piegādes reklāmām, kravu atbilstību un piegādes ķēdes optimizāciju, izmantojot vietni Loadly.",
    "searchPlaceholder": "Meklēt rakstus...",
    "noArticles": "Nav atrasts neviens raksts, kas atbilstu jūsu meklēšanas vaicājumam.",
    "faqTitle": "Bieži uzdotie jautājumi par loģistikas tirgu",
    "backToBlog": "Atpakaļ uz emuāru",
    "readingTime": "Lasīšanas laiks:",
    "readingTimeSuffix": "min lasīt",
    "authorRole": "Galvenais tehniskais redaktors",
    "shareTitle": "Neaizmirstiet padalīties!",
    "shareDesc": "Ja šis saturs jums šķita noderīgs, kopīgojiet to ar saviem draugiem transporta nozarē.",
    "loading": "Notiek raksta ielāde...",
    "guides": [
        {
            "label": "Load Finding Guide",
            "slug": "kamyon-tir-soforleri-yuk-bulma-rehberi"
        },
        {
            "label": "Izmaksu samazināšana",
            "slug": "sehirler-arasi-nakliye-maliyet-dusurme"
        },
        {
            "label": "Noteikumi",
            "slug": "evden-eve-nakliyat-yasal-mevzuat-belgeler"
        }
    ],
    "faqs": [
        {
            "q": "Kas ir loģistikas tirgus?",
            "a": "Loģistikas tirgus ir digitāla ekosistēma, kurā nosūtītāji un pārvadātāji tiekas tieši, lai nosūtītu kravas un iesniegtu kravas piedāvājumus."
        },
        {
            "q": "Kādas ir kravas dēļa priekšrocības?",
            "a": "Tas ietaupa laiku, uzlabo cenu pārskatāmību un palīdz pārvadātājiem izvairīties no tukšiem atvilkšanas maršrutiem, samazinot transportēšanas izmaksas."
        },
        {
            "q": "Kā tiek uzturēta drošība?",
            "a": "Visi lietotāji pārbauda akreditācijas datus, un iepriekšējā transporta vēsture tiek novērtēta, izmantojot pārskatīšanas sistēmu."
        }
    ]
},
  et: {
    "title": "Veose, Transpordi ja Logistika Juhend | Loadly",
    "description": "Digitaalne logistikaplatvorm. Juurdepääs artiklitele saatmiskuulutuste postitamise, veoautokoormate leidmise ja logistikakulude vähendamise meetodite kohta.",
    "tagline": "Logistika ja tarneturu juhend",
    "header1": "Logistikamaailma",
    "headerAccent": "digiteerimine",
    "header2": "",
    "introText": "Loadly turu abil leiate kõige ajakohasemad juhendid tarnereklaamide, veose sobitamise ja tarneahela optimeerimise kohta.",
    "searchPlaceholder": "Otsi artikleid...",
    "noArticles": "Teie otsingule vastavaid artikleid ei leitud.",
    "faqTitle": "Korduma kippuvad küsimused Logistics Marketplace'i kohta",
    "backToBlog": "Tagasi blogisse",
    "readingTime": "Lugemisaeg:",
    "readingTimeSuffix": "min loe",
    "authorRole": "Tehniline Peatoimetaja",
    "shareTitle": "Ärge unustage jagada!",
    "shareDesc": "Kui see sisu oli teile kasulik, jagage seda oma sõpradega transpordisektoris.",
    "loading": "Artikli laadimine...",
    "guides": [
        {
            "label": "Laadimisjuhend",
            "slug": "kamyon-tir-soforleri-yuk-bulma-rehberi"
        },
        {
            "label": "Kulude vähendamine",
            "slug": "sehirler-arasi-nakliye-maliyet-dusurme"
        },
        {
            "label": "Määrused",
            "slug": "evden-eve-nakliyat-yasal-mevzuat-belgeler"
        }
    ],
    "faqs": [
        {
            "q": "Mis on logistikaturg?",
            "a": "Logistikaturg on digitaalne ökosüsteem, kus kaubasaatjad ja vedajad kohtuvad vahetult, et postitada lasti ja esitada veopakkumisi."
        },
        {
            "q": "Millised on laadimislaua eelised?",
            "a": "See säästab aega, parandab hindade läbipaistvust ja aitab vedajatel vältida tühje tagasiühendusi, vähendades transpordikulusid."
        },
        {
            "q": "Kuidas turvalisust hoitakse?",
            "a": "Kõik kasutajad kontrollivad mandaate ja varasemaid transpordilugusid hinnatakse ülevaatussüsteemi kaudu."
        }
    ]
},
  sl: {
    "title": "Vodnik za Tovor, Prevoz in Logistiko | Loadly",
    "description": "Digitalna logistična platforma. Dostopajte do člankov o objavljanju oglasov za dostavo, iskanju tovora tovornjakov in metodah zniževanja logističnih stroškov.",
    "tagline": "Vodnik po tržnici logistike in pošiljanja",
    "header1": "Digitalizacija",
    "headerAccent": "sveta logistike",
    "header2": "",
    "introText": "Poiščite najnovejše vodnike o oglasih za pošiljanje, ujemanju tovora in optimizaciji dobavne verige na tržnici Loadly.",
    "searchPlaceholder": "Iskanje člankov ...",
    "noArticles": "Ni člankov, ki bi ustrezali vašemu iskanju.",
    "faqTitle": "Pogosto zastavljena vprašanja o logističnem trgu",
    "backToBlog": "Nazaj na blog",
    "readingTime": "Čas branja:",
    "readingTimeSuffix": "min branje",
    "authorRole": "Glavni tehnični urednik",
    "shareTitle": "Ne pozabite deliti!",
    "shareDesc": "Če se vam zdi ta vsebina uporabna, jo delite s prijatelji v prometnem sektorju.",
    "loading": "Nalaganje članka...",
    "guides": [
        {
            "label": "Naloži vodnik za iskanje",
            "slug": "kamyon-tir-soforleri-yuk-bulma-rehberi"
        },
        {
            "label": "Zmanjšanje stroškov",
            "slug": "sehirler-arasi-nakliye-maliyet-dusurme"
        },
        {
            "label": "Predpisi",
            "slug": "evden-eve-nakliyat-yasal-mevzuat-belgeler"
        }
    ],
    "faqs": [
        {
            "q": "Kaj je logistična tržnica?",
            "a": "Logistična tržnica je digitalni ekosistem, kjer se pošiljatelji in prevozniki srečajo neposredno, da objavijo tovor in oddajo ponudbe za prevoz."
        },
        {
            "q": "Kakšne so prednosti tovorne deske?",
            "a": "Prihrani čas, izboljša preglednost cen in pomaga prevoznikom, da se izognejo praznim povratnim povezavam, kar zmanjša stroške prevoza."
        },
        {
            "q": "Kako se ohranja varnost?",
            "a": "Vsi uporabniki preverijo poverilnice, pretekle zgodovine prevozov pa so ocenjene s sistemom pregleda."
        }
    ]
},
  kn: {
    "title": "ಸರಕು ಸಾಗಣೆ ಮತ್ತು ಟ್ರಕ್ ಮಾರ್ಗದರ್ಶಿ | Loadly",
    "description": "ಡಿಜಿಟಲ್ ಲಾಜಿಸ್ಟಿಕ್ಸ್ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್. ಶಿಪ್ಪಿಂಗ್ ಜಾಹೀರಾತುಗಳು, ಟ್ರಕ್ ಸರಕು ಮತ್ತು ಲಾಜಿಸ್ಟಿಕ್ಸ್ ವೆಚ್ಚ ಕಡಿಮೆ ಮಾಡುವ ವಿಧಾನಗಳ ಲೇಖನಗಳು.",
    "tagline": "ಲಾಜಿಸ್ಟಿಕ್ಸ್ ಮತ್ತು ಶಿಪ್ಪಿಂಗ್ ಮಾರ್ಗದರ್ಶಿ",
    "header1": "ಡಿಜಿಟಲೀಕರಣಗೊಳ್ಳುತ್ತಿರುವ",
    "headerAccent": "ಲಾಜಿಸ್ಟಿಕ್ಸ್ ಪ್ರಪಂಚ",
    "header2": "",
    "introText": "Loadly ಮಾರುಕಟ್ಟೆಯನ್ನು ಬಳಸಿ ಶಿಪ್ಪಿಂಗ್ ಜಾಹೀರಾತುಗಳು, ಸರಕು ಹೊಂದಾಣಿಕೆ ಮತ್ತು ಸಪ್ಲೈ ಚೇನ್ ಸುಧಾರಣೆಯ ಕುರಿತು ಹೊಸ ಮಾರ್ಗದರ್ಶಿಗಳನ್ನು ಪಡೆಯಿರಿ.",
    "searchPlaceholder": "ಲೇಖನಗಳನ್ನು ಹುಡುಕಿ...",
    "noArticles": "ನಿಮ್ಮ ಹುಡುಕಾಟಕ್ಕೆ ಸೂಕ್ತವಾದ ಲೇಖನಗಳು ಸಿಗಲಿಲ್ಲ.",
    "faqTitle": "ಲಾಜಿಸ್ಟಿಕ್ಸ್ ಮಾರುಕಟ್ಟೆಯ ಕುರಿತು ಪದೇ ಪದೇ ಕೇಳಲಾಗುವ ಪ್ರಶ್ನೆಗಳು",
    "backToBlog": "ಬ್ಲಾಗ್‌ಗೆ ಹಿಂತಿರುಗಿ",
    "readingTime": "ಓದುವ ಸಮಯ:",
    "readingTimeSuffix": "ನಿಮಿಷ ಓದು",
    "authorRole": "ಮುಖ್ಯ ತಾಂತ್ರಿಕ ಸಂಪಾದಕ",
    "shareTitle": "ಹಂಚಿಕೊಳ್ಳಲು ಮರೆಯಬೇಡಿ!",
    "shareDesc": "ಈ ಮಾಹಿತಿ ಉಪಯುಕ್ತವಾಗಿದ್ದರೆ, ಸಾರಿಗೆ ಕ್ಷೇತ್ರದಲ್ಲಿರುವ ನಿಮ್ಮ ಸ್ನೇಹಿತರೊಂದಿಗೆ ಹಂಚಿಕೊಳ್ಳಿ.",
    "loading": "ಲೇಖನ ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
    "guides": [
      {
        "label": "ಸರಕು ಹುಡುಕುವ ಮಾರ್ಗದರ್ಶಿ",
        "slug": "kamyon-tir-soforleri-yuk-bulma-rehberi"
      },
      {
        "label": "ವೆಚ್ಚ ಕಡಿತ",
        "slug": "sehirler-arasi-nakliye-maliyet-dusurme"
      },
      {
        "label": "ನಿಯಮಗಳು",
        "slug": "evden-eve-nakliyat-yasal-mevzuat-belgeler"
      }
    ],
    "faqs": [
      {
        "q": "ಲಾಜಿಸ್ಟಿಕ್ಸ್ ಮಾರುಕಟ್ಟೆ ಎಂದರೆ ಏನು?",
        "a": "ಲಾಜಿಸ್ಟಿಕ್ಸ್ ಮಾರುಕಟ್ಟೆ ಎಂಬುದು ಸರಕು ಕಳುಹಿಸುವವರು ಮತ್ತು ಕ್ಯಾರಿಯರ್‌ಗಳು ನೇರವಾಗಿ ಭೇಟಿಯಾಗಿ ಸರಕುಗಳನ್ನು ಪೋಸ್ಟ್ ಮಾಡಲು ಮತ್ತು ಬಿಡ್ ಸಲ್ಲಿಸಲು ಸಹಾಯ ಮಾಡುವ ಡಿಜಿಟಲ್ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ಆಗಿದೆ."
      },
      {
        "q": "ಲೋಡ್ ಬೋರ್ಡ್‌ನ ಪ್ರಯೋಜನಗಳೇನು?",
        "a": "ಇದು ಸಮಯವನ್ನು ಉಳಿಸುತ್ತದೆ, ಬೆಲೆ ಪಾರದರ್ಶಕತೆಯನ್ನು ಹೆಚ್ಚಿಸುತ್ತದೆ ಮತ್ತು ಖಾಲಿ ರಿಟರ್ನ್ ಟ್ರಿಪ್ ತಪ್ಪಿಸಲು ಕ್ಯಾರಿಯರ್‌ಗಳಿಗೆ ಸಹಾಯ ಮಾಡುತ್ತದೆ."
      },
      {
        "q": "ಸುರಕ್ಷತೆಯನ್ನು ಹೇಗೆ ನಿರ್ವಹಿಸಲಾಗುತ್ತದೆ?",
        "a": "ಎಲ್ಲಾ ಬಳಕೆದಾರರ ವಿವರಗಳನ್ನು ಪರಿಶೀಲಿಸಲಾಗುತ್ತದೆ ಮತ್ತು ಹಿಂದಿನ ಸಾರಿಗೆ ಇತಿಹಾಸವನ್ನು ರೇಟಿಂಗ್ ವ್ಯವಸ್ಥೆಯ ಮೂಲಕ ಮೌಲ್ಯಮಾಪನ ಮಾಡಲಾಗುತ್ತದೆ."
      }
    ]
  },
  te: {
    "title": "సరుకు రవాణా మరియు ట్రక్ లోడ్ గైడ్ | Loadly",
    "description": "డిజిటల్ లాజిస్టిక్స్ ప్లాట్‌ఫారమ్. రవాణా ప్రకటనలు, ట్రక్ లోడ్లు మరియు ఖర్చులు తగ్గించే విధానాల వ్యాసాలు.",
    "tagline": "లాజిస్టిక్స్ & షిప్పింగ్ మార్కెట్‌ప్లేస్ గైడ్",
    "header1": "లాజిస్టిక్స్ ప్రపంచాన్ని",
    "headerAccent": "డిజిటలైజ్ చేయడం",
    "header2": "",
    "introText": "Loadly ద్వారా రవాణా ప్రకటనలు, లోడ్ మ్యాచింగ్ మరియు సరఫరా వ్యవస్థ పురోగతిపై తాజా మార్గదర్శకాలను పొందండి.",
    "searchPlaceholder": "వ్యాసాలను వెతకండి...",
    "noArticles": "మీ శోధనకు తగిన వ్యాసాలు కనుగొనబడలేదు.",
    "faqTitle": "లాజిస్టిక్స్ మార్కెట్‌ప్లేస్ గురించి తరచుగా అడిగే ప్రశ్నలు",
    "backToBlog": "బ్లాగ్‌కు తిరిగి వెళ్లండి",
    "readingTime": "చదివే సమయం:",
    "readingTimeSuffix": "నిమిషాల చదువు",
    "authorRole": "చీఫ్ టెక్నికల్ ఎడిటర్",
    "shareTitle": "షేర్ చేయడం మర్చిపోకండి!",
    "shareDesc": "ఈ సమాచారం ఉపయోగకరంగా అనిపిస్తే, రవాణా రంగంలో ఉన్న మీ మిత్రులతో పంచుకోండి.",
    "loading": "వ్యాసం లోడ్ అవుతోంది...",
    "guides": [
      {
        "label": "లోడ్ కనుగొనే మార్గదర్శి",
        "slug": "kamyon-tir-soforleri-yuk-bulma-rehberi"
      },
      {
        "label": "ఖర్చుల తగ్గింపు",
        "slug": "sehirler-arasi-nakliye-maliyet-dusurme"
      },
      {
        "label": "నిబంధనలు",
        "slug": "evden-eve-nakliyat-yasal-mevzuat-belgeler"
      }
    ],
    "faqs": [
      {
        "q": "లాజిస్టిక్స్ మార్కెట్‌ప్లేస్ అంటే ఏమిటి?",
        "a": "లాజిస్టిక్స్ మార్కెట్‌ప్లేస్ అనేది షిప్పర్లు మరియు క్యారియర్లు నేరుగా కలిసి సరుకు లోడ్లు మరియు రవాణా బిడ్లను నిర్వహించే డిజిటల్ వ్యవస్థ."
      },
      {
        "q": "లోడ్ బోర్డ్ వల్ల కలిగే ప్రయోజనాలు ఏమిటి?",
        "a": "ఇది సమయాన్ని ఆదా చేస్తుంది, ధరల పారదర్శకతను పెంచుతుంది మరియు ఖాళీ తిరుగు ప్రయాణాలను నివారించడంలో సహాయపడుతుంది."
      },
      {
        "q": "భద్రత ఎలా నిర్వహించబడుతుంది?",
        "a": "వినియోగదారుల వివరాలు ధృవీకరించబడతాయి మరియు మునుపటి రవాణా వివరాలు రివ్యూ వ్యవస్థ ద్వారా రేట్ చేయబడతాయి."
      }
    ]
  },
  pa: {
    "title": "ਮਾਲ ਟਰਾਂਸਪੋਰਟ ਅਤੇ ਟਰੱਕ ਲੋਡ ਗਾਈਡ | Loadly",
    "description": "ਡਿਜੀਟਲ ਲੌਜਿਸਟਿਕਸ ਪਲੇਟਫਾਰਮ। ਮਾਲ ਦੀਆਂ ਇਸ਼ਤਿਹਾਰਾਂ, ਟਰੱਕ ਲੋਡ ਲੱਭਣ ਅਤੇ ਲੌਜਿਸਟਿਕਸ ਖਰਚ ਘਟਾਉਣ ਦੇ ਲੇਖ।",
    "tagline": "ਲੌਜਿਸਟਿਕਸ ਅਤੇ ਸ਼ਿਪਿੰਗ ਮਾਰਕੀਟਪਲੇਸ ਗਾਈਡ",
    "header1": "ਲੌਜਿਸਟਿਕਸ ਦੁਨੀਆ ਦਾ",
    "headerAccent": "ਡਿਜੀਟਲੀਕਰਨ",
    "header2": "",
    "introText": "Loadly ਮਾਰਕੀਟਪਲੇਸ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਮਾਲ ਮੈਚਿੰਗ ਅਤੇ ਸਪਲਾਈ ਚੇਨ ਸੁਧਾਰ ਬਾਰੇ ਤਾਜ਼ਾ ਗਾਈਡ ਪ੍ਰਾਪਤ ਕਰੋ।",
    "searchPlaceholder": "ਲੇਖ ਖੋਜੋ...",
    "noArticles": "ਤੁਹਾਡੀ ਖੋਜ ਮੁਤਾਬਕ ਕੋਈ ਲੇਖ ਨਹੀਂ ਮਿਲਿਆ।",
    "faqTitle": "ਲੌਜਿਸਟਿਕਸ ਮਾਰਕੀਟਪਲੇਸ ਬਾਰੇ ਅਕਸਰ ਪੁੱਛੇ ਜਾਂਦੇ ਸਵਾਲ",
    "backToBlog": "ਬਲੌਗ 'ਤੇ ਵਾਪਸ ਜਾਓ",
    "readingTime": "ਪੜ੍ਹਨ ਦਾ ਸਮਾਂ:",
    "readingTimeSuffix": "ਮਿੰਟ ਪੜ੍ਹੋ",
    "authorRole": "ਮੁੱਖ ਤਕਨੀਕੀ ਸੰਪਾਦਕ",
    "shareTitle": "ਸਾਂਝਾ ਕਰਨਾ ਨਾ ਭੁੱਲੋ!",
    "shareDesc": "ਜੇਕਰ ਇਹ ਜਾਣਕਾਰੀ ਵਧੀਆ ਲੱਗੀ, ਤਾਂ ਟਰਾਂਸਪੋਰਟ ਖੇਤਰ ਦੇ ਦੋਸਤਾਂ ਨਾਲ ਸਾਂਝੀ ਕਰੋ।",
    "loading": "ਲੇਖ ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...",
    "guides": [
      {
        "label": "ਮਾਲ ਲੱਭਣ ਦੀ ਗਾਈਡ",
        "slug": "kamyon-tir-soforleri-yuk-bulma-rehberi"
      },
      {
        "label": "ਖਰਚਾ ਘਟਾਉਣਾ",
        "slug": "sehirler-arasi-nakliye-maliyet-dusurme"
      },
      {
        "label": "ਨਿਯਮ ਅਤੇ ਕਾਨੂੰਨ",
        "slug": "evden-eve-nakliyat-yasal-mevzuat-belgeler"
      }
    ],
    "faqs": [
      {
        "q": "ਲੌਜਿਸਟਿਕਸ ਮਾਰਕੀਟਪਲੇਸ ਕੀ ਹੈ?",
        "a": "ਲੌਜਿਸਟਿਕਸ ਮਾਰਕੀਟਪਲੇਸ ਇੱਕ ਡਿਜੀਟਲ ਮੰਚ ਹੈ ਜਿੱਥੇ ਮਾਲ ਭੇਜਣ ਵਾਲੇ ਅਤੇ ਕੈਰੀਅਰ ਸਿੱਧੇ ਮਿਲ ਕੇ ਬੋਲੀ ਲਗਾਉਂਦੇ ਹਨ।"
      },
      {
        "q": "ਲੋਡ ਬੋਰਡ ਦੇ ਕੀ ਫਾਇਦੇ ਹਨ?",
        "a": "ਇਹ ਸਮਾਂ ਬਚਾਉਂਦਾ ਹੈ, ਕੀਮਤਾਂ ਵਿੱਚ ਪਾਰਦਰਸ਼ਤਾ ਲਿਆਉਂਦਾ ਹੈ ਅਤੇ ਖਾਲੀ ਗੇੜੇ ਤੋਂ ਬਚਾਉਂਦਾ ਹੈ।"
      },
      {
        "q": "ਸੁਰੱਖਿਆ ਕਿਵੇਂ ਯਕੀਨੀ ਬਣਾਈ ਜਾਂਦੀ ਹੈ?",
        "a": "ਸਾਰੇ ਵਰਤੋਂਕਾਰਾਂ ਦੇ ਵੇਰਵੇ ਦੀ ਪੜਤਾਲ ਕੀਤੀ ਜਾਂਦੀ ਹੈ ਅਤੇ ਪਿਛਲੇ ਕੰਮ ਦੇ ਆਧਾਰ 'ਤੇ ਰੇਟਿੰਗ ਦਿੱਤੀ ਜਾਂਦੀ ਹੈ।"
      }
    ]
  },
  gu: {
    "title": "માલ પરિવહન અને ટ્રક લોડ માર્ગદર્શિકા | Loadly",
    "description": "ડિજિટલ લોજિસ્ટિક્સ પ્લેટફોર્મ. શિપિંગ જાહેરાતો, ટ્રક લોડ શોધવા અને ખર્ચ ઘટાડવાની પદ્ધતિઓના લેખો.",
    "tagline": "લોજિસ્ટિક્સ અને શિપિંગ માર્કેટપ્લેસ ગાઇડ",
    "header1": "લોજિસ્ટિક્સ વિશ્વનું",
    "headerAccent": "ડિજિટલાઇઝેશન",
    "header2": "",
    "introText": "Loadly નો ઉપયોગ કરીને સામાન મેચિંગ અને સપ્લાય ચેઇન સુધારણા અંગેની નવીનતમ માર્ગદર્શિકા મેળવો.",
    "searchPlaceholder": "લેખો શોધો...",
    "noArticles": "તમારી શોધ મુજબ કોઈ લેખ મળ્યો નથી.",
    "faqTitle": "લોજિસ્ટિક્સ માર્કેટપ્લેસ વિશે વારંવાર પૂછાતા પ્રશ્નો",
    "backToBlog": "બ્લોગ પર પાછા જાઓ",
    "readingTime": "વાંચન સમય:",
    "readingTimeSuffix": "મિનિટ વાંચન",
    "authorRole": "મુખ્ય ટેકનિકલ એડિટર",
    "shareTitle": "શેર કરવાનું ભૂલશો નહીં!",
    "shareDesc": "જો આ માહિતી ઉપયોગી લાગી હોય, તો ટ્રાન્સપોર્ટ ક્ષેત્રના મિત્રો સાથે શેર કરો.",
    "loading": "લેખ લોડ થઈ રહ્યો છે...",
    "guides": [
      {
        "label": "સામાન શોધવાની માર્ગદર્શિકા",
        "slug": "kamyon-tir-soforleri-yuk-bulma-rehberi"
      },
      {
        "label": "ખર્ચમાં ઘટાડો",
        "slug": "sehirler-arasi-nakliye-maliyet-dusurme"
      },
      {
        "label": "નિયમો અને કાયદા",
        "slug": "evden-eve-nakliyat-yasal-mevzuat-belgeler"
      }
    ],
    "faqs": [
      {
        "q": "લોજિસ્ટિક્સ માર્કેટપ્લેસ શું છે?",
        "a": "લોજિસ્ટિક્સ માર્કેટપ્લેસ એ એક ડિજિટલ પ્લેટફોર્મ છે જ્યાં શિપર્સ અને કેરિયર્સ સીધા મળીને બોલી લગાવે છે."
      },
      {
        "q": "લોડ બોર્ડના ફાયદા શું છે?",
        "a": "આ સમય બચાવે છે, કિંમતોમાં પારદર્શિતા લાવે છે અને ખાલી રિટર્ન ટ્રિપ ટાળવામાં મદદ કરે છે."
      },
      {
        "q": "સુરક્ષા કેવી રીતે જાળવવામાં આવે છે?",
        "a": "બધા વપરાશકર્તાઓની વિગતો ચકાસવામાં આવે છે અને ભૂતકાળના ટ્રાન્સપોર્ટ હિસ્ટ્રીના આધારે રેટિંગ આપવામાં આવે છે."
      }
    ]
  },
  ml: {
    "title": "ചരക്ക് ഗതാഗതവും ട്രക്ക് ലോഡ് ഗൈഡും | Loadly",
    "description": "ഡിജിറ്റൽ ലോജിസ്റ്റിക്സ് പ്ലാറ്റ്ഫോം. ചരക്ക് പരസ്യങ്ങൾ, ട്രക്ക് ലോഡ് കണ്ടെത്തൽ, ചെലവ് കുറയ്ക്കൽ രീതികൾ എന്നിവയെക്കുറിച്ചുള്ള ലേഖനങ്ങൾ.",
    "tagline": "ലോജിസ്റ്റിക്സ് & ഷിപ്പിംഗ് മാർക്കറ്റ്‌പ്ലേസ് ഗൈഡ്",
    "header1": "ലോജിസ്റ്റിക്സ് ലോകത്തെ",
    "headerAccent": "ഡിജിറ്റലൈസ് ചെയ്യുന്നു",
    "header2": "",
    "introText": "Loadly മാർക്കറ്റ്‌പ്ലേസ് ഉപയോഗിച്ച് ചരക്ക് മാച്ചിംഗ്, സപ്ലൈ ചെയിൻ മെച്ചപ്പെടുത്തൽ എന്നിവയെക്കുറിച്ചുള്ള പുതിയ ഗൈഡുകൾ കണ്ടെത്തൂ.",
    "searchPlaceholder": "ലേഖനങ്ങൾ തിരയുക...",
    "noArticles": "നിങ്ങളുടെ തിരച്ചിലിന് അനുയോജ്യമായ ലേഖനങ്ങളൊന്നും ലഭ്യമല്ല.",
    "faqTitle": "ലോജിസ്റ്റിക്സ് മാർക്കറ്റ്‌പ്ലേസിനെക്കുറിച്ച് സാധാരണയായി ചോദിക്കുന്ന ചോദ്യങ്ങൾ",
    "backToBlog": "ബ്ലോഗിലേക്ക് തിരികെ പോകുക",
    "readingTime": "വായിക്കാൻ എടുക്കുന്ന സമയം:",
    "readingTimeSuffix": "മിനിറ്റ് വായന",
    "authorRole": "ചീഫ് ടെക്നിക്കൽ എഡിറ്റർ",
    "shareTitle": "പങ്കുവെക്കാൻ മറക്കരുത്!",
    "shareDesc": "ഈ വിവരങ്ങൾ ഉപകാരപ്രദമാണെങ്കിൽ, ഗതാഗത മേഖലയിലുള്ള നിങ്ങളുടെ സുഹൃത്തുക്കളുമായി പങ്കുവെക്കൂ.",
    "loading": "ലേഖനം ലോഡ് ചെയ്യുന്നു...",
    "guides": [
      {
        "label": "ചരക്ക് കണ്ടെത്തുന്നതിനുള്ള ഗൈഡ്",
        "slug": "kamyon-tir-soforleri-yuk-bulma-rehberi"
      },
      {
        "label": "ചെലവ് കുറയ്ക്കൽ",
        "slug": "sehirler-arasi-nakliye-maliyet-dusurme"
      },
      {
        "label": "നിയമങ്ങളും വിവരങ്ങളും",
        "slug": "evden-eve-nakliyat-yasal-mevzuat-belgeler"
      }
    ],
    "faqs": [
      {
        "q": "എന്താണ് ലോജിസ്റ്റിക്സ് മാർക്കറ്റ്‌പ്ലേസ്?",
        "a": "ചരക്ക് ഉടമകളും കാരിയറുകളും നേരിട്ട് കണ്ട് ചരക്കുകൾ പോസ്റ്റ് ചെയ്യാനും ബിഡ് സമർപ്പിക്കാനും സഹായിക്കുന്ന ഡിജിറ്റൽ സംവിധാനമാണ് ലോജിസ്റ്റിക്സ് മാർക്കറ്റ്‌പ്ലേസ്."
      },
      {
        "q": "ലോഡ് ബോർഡ് കൊണ്ടുള്ള പ്രയോജനങ്ങൾ എന്തൊക്കെയാണ്?",
        "a": "ഇത് സമയം ലാഭിക്കുന്നു, തുകയിലെ സുതാര്യത വർദ്ധിപ്പിക്കുന്നു, കൂടാതെ ഒഴിഞ്ഞ ട്രിപ്പുകൾ ഒഴിവാക്കാൻ കാരിയറുകളെ സഹായിക്കുന്നു."
      },
      {
        "q": "സുരക്ഷ എങ്ങനെയാണ് ഉറപ്പാക്കുന്നത്?",
        "a": "എല്ലാ ഉപയോക്താക്കളുടെയും വിവരങ്ങൾ പരിശോധിക്കുകയും മുൻകാല സർവീസുകൾ റിവ്യൂ സിസ്റ്റം വഴി വിലയിരുത്തുകയും ചെയ്യുന്നു."
      }
    ]
  },
  sw: {
    "title": "Mwongozo wa Mizigo na Usafirishaji | Loadly",
    "description": "Jukwaa la kidijitali la usafirishaji. Pata makala kuhusu kuweka matangazo ya mizigo na kupunguza gharama za usafiri.",
    "tagline": "Mwongozo wa Soko la Usafirishaji na Mizigo",
    "header1": "Kuweka Digitali",
    "headerAccent": "Ulimwengu wa Usafirishaji",
    "header2": "",
    "introText": "Pata miongozo ya hivi karibuni kuhusu matangazo ya mizigo na uboreshaji wa mnyororo wa ugavi kupitia Loadly.",
    "searchPlaceholder": "Tafuta makala...",
    "noArticles": "Hakuna makala yaliyopatikana kulingana na utafutaji wako.",
    "faqTitle": "Maswali Yanayoulizwa Mara kwa Mara Kuhusu Soko la Usafirishaji",
    "backToBlog": "Rudi kwenye Blogu",
    "readingTime": "Muda wa kusoma:",
    "readingTimeSuffix": "dak ya kusoma",
    "authorRole": "Mhariri Mkuu wa Teknolojia",
    "shareTitle": "Usisahau Kusambaza!",
    "shareDesc": "Ikiwa umepata maudhui hii ya manufaa, washirikishe marafiki zako katika sekta ya usafirishaji.",
    "loading": "Inapakia makala...",
    "guides": [
      {
        "label": "Mwongozo wa Kupata Mzigo",
        "slug": "kamyon-tir-soforleri-yuk-bulma-rehberi"
      },
      {
        "label": "Kupunguza Gharama",
        "slug": "sehirler-arasi-nakliye-maliyet-dusurme"
      },
      {
        "label": "Kanuni na Sheria",
        "slug": "evden-eve-nakliyat-yasal-mevzuat-belgeler"
      }
    ],
    "faqs": [
      {
        "q": "Soko la usafirishaji ni nini?",
        "a": "Soko la usafirishaji ni mfumo wa kidijitali ambapo wamiliki wa mizigo na wasafirishaji kukutana moja kwa moja kuweka mizigo na kutoa nukuu."
      },
      {
        "q": "Faida za ubao wa mizigo ni zipi?",
        "a": "Huokoa muda, huongeza uwazi wa bei, na husaidia wasafirishaji kuepuka safari za kurudi tupu, hivyo kupunguza gharama."
      },
      {
        "q": "Ulinzi unadumishwa vipi?",
        "a": "Watumiaji wote wanathibitishwa, na historia za zamani za usafirishaji zinatathminiwa kupitia mfumo wa maoni."
      }
    ]
  },
  ne: {
    "title": "सामान ढुवानी र ट्रक लोड निर्देशिका | Loadly",
    "description": "डिजिटल लजिस्टिक्स प्लेटफर्म। ढुवानी विज्ञापन, ट्रक लोड खोज्ने र लजिस्टिक्स खर्च घटाउने तरिकाहरू।",
    "tagline": "लजिस्टिक्स र शिपिङ मार्केटप्लेस निर्देशिका",
    "header1": "लजिस्टिक्स संसारको",
    "headerAccent": "डिजिटलाइजेसन",
    "header2": "",
    "introText": "Loadly प्रयोग गरी सामान म्याचिङ र आपूर्ति श्रृंखला सुधार सम्बन्धी नयाँ गाइडहरू प्राप्त गर्नुहोस्।",
    "searchPlaceholder": "लेखहरू खोज्नुहोस्...",
    "noArticles": "तपाईंको खोजी अनुसार कुनै लेख भेटिएन।",
    "faqTitle": "लजिस्टिक्स मार्केटप्लेस सम्बन्धी बारम्बार सोधिने प्रश्नहरू",
    "backToBlog": "ब्लगमा फर्कनुहोस्",
    "readingTime": "पढ्ने समय:",
    "readingTimeSuffix": "मिनेट पढाइ",
    "authorRole": "प्रमुख प्राविधिक सम्पादक",
    "shareTitle": "सेयर गर्न नबिर्सनुहोस्!",
    "shareDesc": "यदि यो सामग्री उपयोगी लाग्यो भने, ढुवानी क्षेत्रका साथीहरूसँग सेयर गर्नुहोस्।",
    "loading": "लेख लोड हुँदैछ...",
    "guides": [
      {
        "label": "सामान खोज्ने निर्देशिका",
        "slug": "kamyon-tir-soforleri-yuk-bulma-rehberi"
      },
      {
        "label": "खर्च कटौती",
        "slug": "sehirler-arasi-nakliye-maliyet-dusurme"
      },
      {
        "label": "नियम तथा कानुन",
        "slug": "evden-eve-nakliyat-yasal-mevzuat-belgeler"
      }
    ],
    "faqs": [
      {
        "q": "लजिस्टिक्स मार्केटप्लेस भनेको के हो?",
        "a": "लजिस्टिक्स मार्केटप्लेस एउटा डिजिटल माध्यम हो जहाँ सामान धनी र ढुवानीकर्ताहरू सीधा भेटेर अफर गर्छन्।"
      },
      {
        "q": "लोड बोर्डका फाइदाहरू के हुन्?",
        "a": "यसले समय बचत गर्छ, मूल्यमा पारदर्शिता ल्याउँछ र रित्तो फिर्ता सवारी रोक्न मद्दत गर्छ।"
      },
      {
        "q": "सुरक्षा कसरी कायम गरिन्छ?",
        "a": "सबै प्रयोगकर्ताको विवरण प्रमाणित गरिन्छ र अघिल्ला ढुवानीको समीक्षा प्रणाली मार्फत मूल्याङ्कन गरिन्छ।"
      }
    ]
  },
  si: {
    "title": "ප්‍රවාහන සහ ට්‍රක් රථ බඩු මාර්ගෝපදේශය | Loadly",
    "description": "ඩිජිටල් ප්‍රවාහන වේදිකාව. බඩු ප්‍රවාහන දැන්වීම් පළ කිරීම සහ වියදම් අඩු කරගන්නා ආකාරය පිළිබඳ ලිපි.",
    "tagline": "ලොජිස්ටික්ස් සහ නැව්ගත කිරීමේ මාර්ගෝපදේශය",
    "header1": "ප්‍රවාහන ක්ෂේත්‍රය",
    "headerAccent": "ඩිජිටල්කරණය කිරීම",
    "header2": "",
    "introText": "Loadly වෙළඳපොළ භාවිතයෙන් ප්‍රවාහන දැන්වීම් සහ සැපයුම් ජාලය සක්‍රිය කිරීම පිළිබඳ නවතම තොරතුරු ලබාගන්න.",
    "searchPlaceholder": "ලිපි සොයන්න...",
    "noArticles": "ඔබේ සෙවීමට ගැළපෙන ලිපි හමු නොවීය.",
    "faqTitle": "ප්‍රවාහන වෙළඳපොළ පිළිබඳ නිතර අසන ප්‍රශ්න",
    "backToBlog": "නැවත බ්ලොග් අඩවියට",
    "readingTime": "කියවීමේ කාලය:",
    "readingTimeSuffix": "මිනිත්තු කියවීම",
    "authorRole": "ප්‍රධාන තාක්ෂණික කර්තෘ",
    "shareTitle": "බෙදා ගැනීමට අමතක නොකරන්න!",
    "shareDesc": "මෙම තොරතුරු ප්‍රයෝජනවත් නම්, ප්‍රවාහන ක්ෂේත්‍රයේ යහළුවන් අතර බෙදා ගන්න.",
    "loading": "ලිපිය එකතු වෙමින් පවතී...",
    "guides": [
      {
        "label": "බඩු සොයාගැනීමේ මාර්ගෝපදේශය",
        "slug": "kamyon-tir-soforleri-yuk-bulma-rehberi"
      },
      {
        "label": "වියදම් අඩු කරගැනීම",
        "slug": "sehirler-arasi-nakliye-maliyet-dusurme"
      },
      {
        "label": "නීති සහ රෙගුලාසි",
        "slug": "evden-eve-nakliyat-yasal-mevzuat-belgeler"
      }
    ],
    "faqs": [
      {
        "q": "ප්‍රවාහන වෙළඳපොළක් යනු කුමක්ද?",
        "a": "ප්‍රවාහන වෙළඳපොළක් යනු බඩු හිමියන් සහ ප්‍රවාහකයින් ඍජුවම හමුවී ප්‍රවාහන ලංසු තබන ඩිජිටල් වේදිකාවකි."
      },
      {
        "q": "ලෝඩ් බෝඩ් එකක ඇති වාසි මොනවාද?",
        "a": "එය කාලය ඉතිරි කරයි, මිල ගණන්වල විනිවිදභාවය වැඩි කරයි, සහ හිස් ගමන් වළක්වා ගැනීමට උපකාරී වේ."
      },
      {
        "q": "ආරක්ෂාව තහවුරු කරන්නේ කෙසේද?",
        "a": "සියලුම පරිශීලකයින්ගේ තොරතුරු තහවුරු කරනු ලබන අතර පෙර ප්‍රවාහන වාර්තා ශ්‍රේණිගත කිරීමේ පද්ධතියක් මගින් අගය කරනු ලැබේ."
      }
    ]
  },
};
