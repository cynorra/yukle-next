import React from 'react';
import type { Locale } from '@/utils/translations';

interface SeoContentProps {
  page: 'home' | 'marketplace';
  locale: Locale;
}

const content: Record<string, Record<'home' | 'marketplace', { title: string; paragraphs: string[] }>> = {
  "tr": {
    "home": {
      "title": "YükLe – Türkiye'nin Dijital Lojistik ve Nakliye Platformu",
      "paragraphs": [
        "YükLe (Loadly), nakliyeciler ve yük sahiplerini bir araya getiren Türkiye'nin yenilikçi lojistik ve taşımacılık platformudur. Amacımız, Türkiye'nin dört bir yanına ve uluslararası rotalara hızlı, güvenilir ve ekonomik yük taşıma hizmeti sunulmasını sağlamaktır. Sistemimizde binlerce doğrulanmış nakliye firması, tır, kamyon ve kamyonet sahibi yer almaktadır.",
        "Geleneksel nakliye süreçlerinin aksine, Loadly platformunda yükünüzü saniyeler içinde ilan edebilir ve yüzlerce uygun araçtan anında teklif alabilirsiniz. Gelişmiş eşleştirme algoritmamız sayesinde boş dönen araçları engelleyerek karbon ayak izini azaltmayı ve taşıma maliyetlerini minimuma indirmeyi hedefliyoruz.",
        "İster parsiyel taşıma (LTL), ister tam kapasite (FTL) tır yükü olsun, lojistik ihtiyaçlarınıza en uygun çözümleri platformumuz üzerinden bulabilirsiniz. Nakliye firmaları için ise her gün sürekli güncellenen binlerce yük ilanı sayesinde iş hacmini artırma ve düzenli seferler planlama imkânı sunulmaktadır.",
        "Loadly üzerinden yurt içi ve uluslararası nakliye ilanları yayınlayabilir, güvenilir nakliyecilerle güvenle çalışabilirsiniz. Platforma ücretsiz üye olarak hemen yük ilanınızı oluşturun ve dijital lojistik devrimine katılın."
      ]
    },
    "marketplace": {
      "title": "Güvenilir Nakliye İlanları ve Lojistik Fırsatları",
      "paragraphs": [
        "Lojistik pazaryerimiz, nakliyeciler ve tır şoförleri için Türkiye ve Avrupa genelindeki güncel yük ilanlarını tek bir noktada listelemektedir. Şehiriçi taşıma, şehirlerarası nakliyat veya uluslararası lojistik seferleri arayan tüm taşıyıcılar için ideal bir platformdur.",
        "Yük ilanları detaylarında tonaj, kullanılacak araç türü (Tente, Frigo, Açık Kasa vb.), teslimat tarihleri ve güzergah gibi tüm önemli nakliye detayları şeffaf bir şekilde yer alır. Böylece nakliyeciler kendi rotalarına ve araç kapasitelerine en uygun işleri seçerek sefer verimliliklerini artırırlar.",
        "Yük sahipleri açısından bu pazaryeri, nakliye ihtiyaçlarına anında çözüm bulan dijital bir ortamdır. Güvenilir ve profil puanları yüksek taşımacılar ile çalışarak yüklerinizin güvenle taşınmasını garanti altına alabilir, rekabetçi fiyat teklifleri arasından bütçenize en uygun olanı tercih edebilirsiniz.",
        "Hem Türkiye içi hem de uluslararası nakliye ilanlarını filtreleyerek anlık yük eşleştirmesi yapabilirsiniz. Platform üzerinden doğrudan mesajlaşma ve teklif sistemi sayesinde aracısız, hızlı ve ekonomik nakliye çözümlerine ulaşın."
      ]
    }
  },
  "en": {
    "home": {
      "title": "Loadly: Global Logistics & Freight Marketplace Platform",
      "paragraphs": [
        "Loadly is an innovative logistics and transportation platform connecting shippers with reliable carriers worldwide. Our mission is to facilitate fast, secure, and cost-effective freight transport across domestic and international routes. We host thousands of verified logistics companies, truck owners, and drivers ready to move your cargo.",
        "Unlike traditional freight forwarding, Loadly allows you to post your loads in seconds and instantly receive competitive quotes from available vehicles. With our advanced load-matching algorithms, we aim to eliminate empty miles, reduce carbon footprints, and minimize overall transportation costs for businesses of all sizes.",
        "Whether you need Less Than Truckload (LTL) or Full Truckload (FTL) shipping, you can find the perfect logistics solution on our platform. For carriers, we offer the opportunity to increase business volume and plan regular routes through thousands of daily updated load boards.",
        "Join the digital logistics revolution by registering for free on Loadly. Post loads, receive offers, message carriers, and manage your entire shipping workflow in one place — accessible from any device, anytime."
      ]
    },
    "marketplace": {
      "title": "Reliable Freight Boards and Logistics Opportunities Worldwide",
      "paragraphs": [
        "Our logistics marketplace lists up-to-date freight loads and truck routes across the globe in one centralized hub. It is the ideal platform for carriers looking for local deliveries, interstate transport, or international logistics assignments across Europe, the Middle East, and beyond.",
        "Load postings include all essential freight details such as tonnage, required truck type (Dry Van, Reefer, Flatbed, etc.), delivery dates, and route specifics. This transparency allows carriers to choose jobs that best fit their current routes and vehicle capacities, maximizing their operational efficiency.",
        "For shippers, this marketplace is a digital environment providing instant solutions to transport needs. By working with reliable carriers who maintain high profile ratings, you ensure the safe transit of your goods while taking advantage of competitive bidding from a wide network of verified professionals.",
        "Filter listings by origin, destination, vehicle type, and cargo weight to find the perfect match in seconds. Our real-time messaging system connects shippers and carriers directly — no brokers, no hidden fees, just efficient freight matching."
      ]
    }
  },
  "de": {
    "home": {
      "title": "Loadly: Globale Logistik- und Frachtplattform",
      "paragraphs": [
        "Loadly ist eine innovative Logistik- und Transportplattform, die Verlader mit zuverlässigen Spediteuren weltweit verbindet. Unsere Mission ist es, schnelle, sichere und kostengünstige Frachttransporte auf nationalen und internationalen Strecken zu ermöglichen.",
        "Mit Loadly können Sie Ihre Fracht in Sekunden aufgeben und sofort wettbewerbsfähige Angebote von verfügbaren Fahrzeugen erhalten. Unsere fortschrittlichen Algorithmen minimieren Leerfahrten und senken Transportkosten für Unternehmen jeder Größe.",
        "Ob Teilladung (LTL) oder Komplettladung (FTL) – auf unserer Plattform finden Sie die passende Logistiklösung. Registrieren Sie sich kostenlos und starten Sie noch heute.",
        "Verlader und Spediteure nutzen Loadly täglich für transparente, effiziente und günstige Frachtvermittlung — ohne Makler und ohne versteckte Gebühren."
      ]
    },
    "marketplace": {
      "title": "Aktuelle Frachtbörse und Logistikangebote",
      "paragraphs": [
        "Unser Logistik-Marktplatz listet tagesaktuelle Frachten und LKW-Routen weltweit auf einem zentralen Hub. Ideal für Spediteure, die lokale, nationale oder internationale Transportaufträge suchen.",
        "Frachtangebote enthalten alle wichtigen Details wie Tonnage, Fahrzeugtyp, Liefertermine und Routeninfos — vollständig transparent für schnelle Entscheidungen.",
        "Für Verlader bietet dieser Marktplatz sofortige Lösungen für Transportbedürfnisse mit verifizierten Spediteuren und wettbewerbsfähigen Preisangeboten.",
        "Filtern Sie nach Abgangsort, Zielort und Fahrzeugtyp — und verbinden Sie sich direkt mit Spediteuren ohne Zwischenhändler."
      ]
    }
  },
  "fr": {
    "home": {
      "title": "Loadly : Plateforme Mondiale de Logistique et Fret",
      "paragraphs": [
        "Loadly est une plateforme innovante de logistique et de transport qui met en relation les expéditeurs avec des transporteurs fiables dans le monde entier. Notre mission est de faciliter le transport de fret rapide, sécurisé et économique sur les routes nationales et internationales.",
        "Avec Loadly, publiez vos chargements en quelques secondes et recevez instantanément des offres compétitives de transporteurs disponibles. Nos algorithmes avancés éliminent les trajets à vide et réduisent les coûts de transport.",
        "Que vous ayez besoin d'un transport partiel (LTL) ou d'un chargement complet (FTL), trouvez la solution logistique idéale sur notre plateforme. Inscrivez-vous gratuitement dès aujourd'hui.",
        "Expéditeurs et transporteurs utilisent Loadly quotidiennement pour une mise en relation transparente, efficace et sans intermédiaires — accessible depuis n'importe quel appareil."
      ]
    },
    "marketplace": {
      "title": "Bourse de Fret Fiable et Opportunités Logistiques",
      "paragraphs": [
        "Notre marketplace logistique répertorie les frets actuels et les routes de camions dans le monde entier en un seul hub centralisé — idéal pour les transporteurs cherchant des missions locales, nationales ou internationales.",
        "Les offres de fret incluent tous les détails essentiels : tonnage, type de véhicule, dates de livraison et spécificités de route, pour une transparence totale.",
        "Pour les expéditeurs, ce marketplace offre des solutions immédiates avec des transporteurs vérifiés et des offres compétitives pour sécuriser votre fret au meilleur prix.",
        "Filtrez par origine, destination et type de véhicule pour trouver la correspondance parfaite en quelques secondes, sans courtiers ni frais cachés."
      ]
    }
  },
  "es": {
    "home": {
      "title": "Loadly: Plataforma Global de Logística y Carga",
      "paragraphs": [
        "Loadly es una plataforma innovadora de logística y transporte que conecta a expedidores con transportistas confiables en todo el mundo. Nuestra misión es facilitar el transporte de carga rápido, seguro y rentable en rutas nacionales e internacionales.",
        "Con Loadly, publique sus cargas en segundos y reciba cotizaciones competitivas al instante. Nuestros algoritmos avanzados eliminan los viajes en vacío y reducen los costos de transporte.",
        "Ya sea transporte parcial (LTL) o carga completa (FTL), encuentre la solución logística perfecta en nuestra plataforma. Regístrese gratis y empiece hoy.",
        "Expedidores y transportistas usan Loadly diariamente para conectarse de forma transparente y eficiente — sin intermediarios ni tarifas ocultas."
      ]
    },
    "marketplace": {
      "title": "Bolsa de Carga Confiable y Oportunidades Logísticas",
      "paragraphs": [
        "Nuestro marketplace logístico lista cargas actualizadas y rutas de camiones en todo el mundo en un hub centralizado — ideal para transportistas que buscan trabajos locales, nacionales o internacionales.",
        "Los anuncios de carga incluyen todos los detalles esenciales: tonelaje, tipo de vehículo, fechas de entrega y especificidades de ruta para una total transparencia.",
        "Para los expedidores, este marketplace ofrece soluciones inmediatas con transportistas verificados y ofertas competitivas para asegurar su carga al mejor precio.",
        "Filtre por origen, destino y tipo de vehículo para encontrar la coincidencia perfecta en segundos, sin intermediarios ni comisiones ocultas."
      ]
    }
  },
  "pt": {
    "home": {
      "title": "Loadly: Plataforma Global de Logística e Frete",
      "paragraphs": [
        "Loadly é uma plataforma inovadora de logística e transporte que conecta embarcadores com transportadores confiáveis em todo o mundo. Nossa missão é facilitar o transporte de carga rápido, seguro e econômico em rotas nacionais e internacionais.",
        "Com o Loadly, publique suas cargas em segundos e receba cotações competitivas instantaneamente. Nossos algoritmos avançados eliminam viagens vazias e reduzem os custos de transporte.",
        "Seja transporte parcial (LTL) ou carga completa (FTL), encontre a solução logística perfeita em nossa plataforma. Cadastre-se gratuitamente e comece hoje.",
        "Embarcadores e transportadores usam o Loadly diariamente para se conectar de forma transparente e eficiente — sem intermediários nem taxas ocultas."
      ]
    },
    "marketplace": {
      "title": "Bolsa de Fretes Confiável e Oportunidades Logísticas",
      "paragraphs": [
        "Nosso marketplace logístico lista fretes atualizados e rotas de caminhões em todo o mundo em um hub centralizado — ideal para transportadores que buscam trabalhos locais, nacionais ou internacionais.",
        "Os anúncios de carga incluem todos os detalhes essenciais: tonelagem, tipo de veículo, datas de entrega e especificidades de rota para total transparência.",
        "Para embarcadores, este marketplace oferece soluções imediatas com transportadores verificados e ofertas competitivas para garantir sua carga pelo melhor preço.",
        "Filtre por origem, destino e tipo de veículo para encontrar a combinação perfeita em segundos, sem corretores nem comissões ocultas."
      ]
    }
  },
  "it": {
    "home": {
      "title": "Carico: piattaforma di mercato globale per la logistica e il trasporto merci",
      "paragraphs": [
        "Loadly è un'innovativa piattaforma logistica e di trasporto che collega gli spedizionieri con vettori affidabili in tutto il mondo. La nostra missione è facilitare il trasporto merci veloce, sicuro ed economico su rotte nazionali e internazionali. Ospitiamo migliaia di aziende di logistica verificate, proprietari di camion e autisti pronti a spostare il tuo carico.",
        "A differenza delle spedizioni tradizionali, Loadly ti consente di pubblicare i tuoi carichi in pochi secondi e ricevere istantaneamente preventivi competitivi dai veicoli disponibili. Con i nostri algoritmi avanzati di corrispondenza del carico, miriamo a eliminare le miglia vuote, ridurre l'impronta di carbonio e ridurre al minimo i costi di trasporto complessivi per le aziende di tutte le dimensioni.",
        "Che tu abbia bisogno di una spedizione Less Than Truckload (LTL) o Full Truckload (FTL), puoi trovare la soluzione logistica perfetta sulla nostra piattaforma. Per i vettori, offriamo l'opportunità di aumentare il volume d'affari e pianificare rotte regolari attraverso migliaia di pannelli di carico aggiornati quotidianamente.",
        "Unisciti alla rivoluzione della logistica digitale registrandoti gratuitamente su Loadly. Pubblica carichi, ricevi offerte, invia messaggi ai corrieri e gestisci l'intero flusso di lavoro di spedizione in un unico posto, accessibile da qualsiasi dispositivo, in qualsiasi momento."
      ]
    },
    "marketplace": {
      "title": "Carichi affidabili e opportunità logistiche in tutto il mondo",
      "paragraphs": [
        "Il nostro marketplace logistico elenca i carichi merci e le rotte dei camion aggiornati in tutto il mondo in un unico hub centralizzato. È la piattaforma ideale per i vettori che cercano consegne locali, trasporti interstatali o incarichi logistici internazionali in Europa, Medio Oriente e oltre.",
        "I messaggi di carico includono tutti i dettagli essenziali del trasporto come il tonnellaggio, il tipo di camion richiesto (Dry Van, Reefer, Flatbed, ecc.), le date di consegna e le specifiche del percorso. Questa trasparenza consente ai vettori di scegliere i lavori che meglio si adattano ai loro percorsi attuali e alle capacità dei veicoli, massimizzando la loro efficienza operativa.",
        "Per gli spedizionieri, questo marketplace è un ambiente digitale che fornisce soluzioni istantanee alle esigenze di trasporto. Lavorando con corrieri affidabili che mantengono valutazioni di alto profilo, garantisci il transito sicuro delle tue merci sfruttando le offerte competitive di un'ampia rete di professionisti verificati.",
        "Filtra gli annunci per origine, destinazione, tipo di veicolo e peso del carico per trovare la corrispondenza perfetta in pochi secondi. Il nostro sistema di messaggistica in tempo reale collega direttamente spedizionieri e corrieri: nessun broker, nessuna commissione nascosta, solo una corrispondenza efficiente del trasporto."
      ]
    }
  },
  "pl": {
    "home": {
      "title": "Ładunek: platforma Global Logistics & Freight Marketplace",
      "paragraphs": [
        "Loadly to innowacyjna platforma logistyczna i transportowa łącząca spedytorów z niezawodnymi przewoźnikami na całym świecie. Naszą misją jest ułatwienie szybkiego, bezpiecznego i opłacalnego transportu towarowego na trasach krajowych i międzynarodowych. Przyjmujemy tysiące zweryfikowanych firm logistycznych, właścicieli ciężarówek i kierowców gotowych do transportu Twojego ładunku.",
        "W przeciwieństwie do tradycyjnej spedycji, Loadly umożliwia wysyłanie ładunków w ciągu kilku sekund i natychmiastowe otrzymywanie konkurencyjnych ofert od dostępnych pojazdów. Dzięki naszym zaawansowanym algorytmom dopasowywania obciążenia staramy się wyeliminować puste mile, zmniejszyć ślad węglowy i zminimalizować ogólne koszty transportu dla firm każdej wielkości.",
        "Niezależnie od tego, czy potrzebujesz przesyłki drobnicowej (LTL), czy całopojazdowej (FTL), na naszej platformie znajdziesz idealne rozwiązanie logistyczne. Przewoźnikom oferujemy możliwość zwiększenia wolumenu działalności i planowania regularnych tras poprzez tysiące codziennie aktualizowanych tablic ładunkowych.",
        "Dołącz do cyfrowej rewolucji logistycznej, rejestrując się bezpłatnie na Loadly. Publikuj ładunki, otrzymuj oferty, nośniki wiadomości i zarządzaj całym przepływem pracy związanym z wysyłką w jednym miejscu — dostępnym z dowolnego urządzenia i w dowolnym momencie."
      ]
    },
    "marketplace": {
      "title": "Niezawodne tablice towarowe i możliwości logistyczne na całym świecie",
      "paragraphs": [
        "Nasz rynek logistyczny wymienia aktualne ładunki i trasy ciężarówek na całym świecie w jednym scentralizowanym centrum. Jest to idealna platforma dla przewoźników szukających lokalnych dostaw, transportu międzypaństwowego lub międzynarodowych zadań logistycznych w Europie, na Bliskim Wschodzie i poza nią.",
        "Przesyłki ładunkowe obejmują wszystkie istotne szczegóły dotyczące ładunku, takie jak tonaż, wymagany typ ciężarówki (sucha furgonetka, chłodnia, platforma itp.), daty dostawy i szczegóły trasy. Ta przejrzystość pozwala przewoźnikom wybierać zadania, które najlepiej pasują do ich obecnych tras i pojemności pojazdów, maksymalizując ich wydajność operacyjną.",
        "Dla spedytorów ten rynek jest środowiskiem cyfrowym zapewniającym natychmiastowe rozwiązania dla potrzeb transportowych. Współpracując z wiarygodnymi przewoźnikami, którzy utrzymują wysokie oceny, zapewniasz bezpieczny tranzyt swoich towarów, jednocześnie korzystając z konkurencyjnych ofert od szerokiej sieci zweryfikowanych profesjonalistów.",
        "Filtruj oferty według miejsca pochodzenia, miejsca docelowego, rodzaju pojazdu i wagi ładunku, aby znaleźć idealne dopasowanie w ciągu kilku sekund. Nasz system wiadomości w czasie rzeczywistym bezpośrednio łączy nadawców i przewoźników — bez pośredników, bez ukrytych opłat, tylko efektywne dopasowywanie ładunków."
      ]
    }
  },
  "nl": {
    "home": {
      "title": "Loadly: Wereldwijd platform voor logistiek en vrachtmarktplaats",
      "paragraphs": [
        "Loadly is een innovatief logistiek- en transportplatform dat verladers verbindt met betrouwbare vervoerders over de hele wereld. Onze missie is om snel, veilig en kosteneffectief vrachtvervoer over binnenlandse en internationale routes mogelijk te maken. We bieden onderdak aan duizenden geverifieerde logistieke bedrijven, vrachtwagenbezitters en chauffeurs die klaar staan om je lading te vervoeren.",
        "In tegenstelling tot traditionele expeditie, kunt u met Loadly uw ladingen binnen enkele seconden boeken en direct concurrerende offertes ontvangen van beschikbare voertuigen. Met onze geavanceerde algoritmen voor ladingafstemming streven we ernaar lege kilometers te elimineren, de koolstofvoetafdruk te verkleinen en de totale transportkosten voor bedrijven van elke omvang te minimaliseren.",
        "Of u nu minder dan vrachtwagenlading (LTL) of volledige vrachtwagenlading (FTL) nodig heeft, u vindt de perfecte logistieke oplossing op ons platform. Voor vervoerders bieden we de mogelijkheid om het bedrijfsvolume te vergroten en regelmatige routes te plannen via duizenden dagelijks bijgewerkte laadborden.",
        "Doe mee aan de digitale logistieke revolutie door je gratis te registreren op Loadly. Plaats ladingen, ontvang aanbiedingen, berichtvervoerders en beheer je volledige verzendworkflow op één plek — altijd toegankelijk vanaf elk apparaat."
      ]
    },
    "marketplace": {
      "title": "Betrouwbare vrachtborden en logistieke kansen wereldwijd",
      "paragraphs": [
        "Onze logistieke marktplaats geeft een overzicht van actuele vrachtladingen en vrachtwagenroutes over de hele wereld in één gecentraliseerde hub. Het is het ideale platform voor vervoerders die op zoek zijn naar lokale leveringen, interstatelijk transport of internationale logistieke opdrachten in Europa, het Midden-Oosten en daarbuiten.",
        "Laadposten bevatten alle essentiële vrachtgegevens zoals tonnage, vereist type vrachtwagen (droge bestelwagen, Reefer, flatbed, enz.), leveringsdatums en routegegevens. Deze transparantie stelt vervoerders in staat om opdrachten te kiezen die het beste passen bij hun huidige routes en voertuigcapaciteiten, waardoor hun operationele efficiëntie wordt gemaximaliseerd.",
        "Voor verladers is deze marktplaats een digitale omgeving die onmiddellijke oplossingen biedt voor transportbehoeften. Door samen te werken met betrouwbare vervoerders die hoge beoordelingen behouden, zorgt u voor de veilige doorvoer van uw goederen en profiteert u van concurrerende biedingen van een breed netwerk van geverifieerde professionals.",
        "Filter advertenties op herkomst, bestemming, voertuigtype en vrachtgewicht om binnen enkele seconden de perfecte match te vinden. Ons real-time berichtensysteem verbindt verladers en vervoerders rechtstreeks — geen makelaars, geen verborgen kosten, alleen efficiënte vrachtmatching."
      ]
    }
  },
  "ru": {
    "home": {
      "title": "Loadly: Глобальная платформа для логистики и грузоперевозок",
      "paragraphs": [
        "Loadly - это инновационная логистическая и транспортная платформа, соединяющая грузоотправителей с надежными перевозчиками по всему миру. Наша миссия заключается в содействии быстрым, безопасным и экономически эффективным грузовым перевозкам по внутренним и международным маршрутам. Мы принимаем тысячи проверенных логистических компаний, владельцев грузовиков и водителей, готовых перевезти ваш груз.",
        "В отличие от традиционного экспедирования грузов, Loadly позволяет публиковать свои грузы за считанные секунды и мгновенно получать конкурентные котировки от доступных транспортных средств. С помощью наших передовых алгоритмов сопоставления нагрузки мы стремимся устранить пустые мили, сократить выбросы углекислого газа и свести к минимуму общие транспортные расходы для предприятий любого размера.",
        "Независимо от того, нужна ли вам доставка «меньше, чем грузовик» (LTL) или «полный грузовик» (FTL), вы можете найти идеальное логистическое решение на нашей платформе. Для перевозчиков мы предлагаем возможность увеличить объем бизнеса и планировать регулярные маршруты через тысячи ежедневно обновляемых грузовых плат.",
        "Присоединяйтесь к цифровой логистической революции, зарегистрировавшись бесплатно на Loadly. Публикуйте грузы, получайте предложения, отправляйте сообщения и управляйте всем процессом доставки в одном месте — доступно с любого устройства в любое время."
      ]
    },
    "marketplace": {
      "title": "Надежные грузовые табло и логистические возможности по всему миру",
      "paragraphs": [
        "Наш логистический рынок перечисляет актуальные грузовые грузы и грузовые маршруты по всему миру в одном централизованном центре. Это идеальная платформа для перевозчиков, которые ищут местные поставки, межгосударственные перевозки или международные логистические задания по всей Европе, на Ближнем Востоке и за его пределами.",
        "Грузовые проводки включают все основные данные о грузе, такие как тоннаж, требуемый тип грузовика (сухогрузный фургон, рефрижератор, планшет и т. д.), даты доставки и особенности маршрута. Такая прозрачность позволяет перевозчикам выбирать работу, которая наилучшим образом соответствует их текущим маршрутам и вместимости транспортных средств, максимизируя их эксплуатационную эффективность.",
        "Для грузоотправителей этот рынок представляет собой цифровую среду, обеспечивающую мгновенные решения для транспортных потребностей. Работая с надежными перевозчиками, поддерживающими высокие рейтинги, вы обеспечиваете безопасный транзит ваших грузов, пользуясь преимуществами конкурентных торгов от широкой сети проверенных профессионалов.",
        "Отфильтруйте объявления по происхождению, месту назначения, типу транспортного средства и весу груза, чтобы найти идеальное совпадение за считанные секунды. Наша система обмена сообщениями в режиме реального времени напрямую связывает грузоотправителей и перевозчиков — никаких брокеров, никаких скрытых комиссий, просто эффективное сопоставление грузов."
      ]
    }
  },
  "uk": {
    "home": {
      "title": "Loadly: Глобальна платформа ринку логістики та вантажних перевезень",
      "paragraphs": [
        "Loadly - це інноваційна логістична та транспортна платформа, що з 'єднує вантажовідправників з надійними перевізниками по всьому світу. Наша місія полягає в тому, щоб полегшити швидкі, безпечні та економічно ефективні вантажні перевезення внутрішніми та міжнародними маршрутами. Ми приймаємо тисячі перевірених логістичних компаній, власників вантажівок і водіїв, готових перевезти ваш вантаж.",
        "На відміну від традиційного експедирування вантажів, Loadly дозволяє публікувати вантажі за лічені секунди та миттєво отримувати конкурентні пропозиції від доступних транспортних засобів. Завдяки нашим вдосконаленим алгоритмам підбору вантажу ми прагнемо усунути порожні милі, зменшити викиди вуглекислого газу та мінімізувати загальні транспортні витрати для підприємств будь-якого розміру.",
        "Незалежно від того, чи потрібна вам доставка менше вантажу (LTL) або повна вантажівка (FTL), ви можете знайти ідеальне логістичне рішення на нашій платформі. Для перевізників ми пропонуємо можливість збільшити обсяг бізнесу та планувати регулярні маршрути через тисячі щоденно оновлюваних плат вантажів.",
        "Приєднуйтесь до цифрової логістичної революції, зареєструвавшись безкоштовно на Loadly. Публікуйте вантажі, отримуйте пропозиції, повідомляйте носіїв і керуйте всім робочим процесом доставки в одному місці — доступному з будь-якого пристрою в будь-який час."
      ]
    },
    "marketplace": {
      "title": "Надійні ради з вантажних перевезень та логістичні можливості по всьому світу",
      "paragraphs": [
        "Наш логістичний ринок перераховує актуальні вантажні вантажі та вантажні маршрути по всьому світу в одному централізованому центрі. Це ідеальна платформа для перевізників, які шукають місцеві доставки, міждержавні перевезення або міжнародні логістичні завдання в Європі, на Близькому Сході та за його межами.",
        "Розміщення вантажу включає всі основні відомості про вантаж, такі як тоннаж, необхідний тип вантажівки (сухий фургон, рефрижератор, планшет тощо), дати доставки та особливості маршруту. Така прозорість дозволяє перевізникам вибирати роботу, яка найкраще відповідає їхнім поточним маршрутам та можливостям транспортних засобів, максимізуючи їхню операційну ефективність.",
        "Для вантажовідправників цей ринок є цифровим середовищем, що забезпечує миттєві рішення для потреб транспорту. Працюючи з надійними перевізниками, які підтримують високі рейтинги, ви забезпечуєте безпечний транзит своїх товарів, користуючись перевагами конкурентних торгів від широкої мережі перевірених професіоналів.",
        "Фільтруйте оголошення за походженням, місцем призначення, типом транспортного засобу та вагою вантажу, щоб знайти ідеальну відповідність за лічені секунди. Наша система обміну повідомленнями в режимі реального часу безпосередньо з 'єднує вантажовідправників і перевізників — ніяких брокерів, ніяких прихованих зборів, просто ефективне узгодження вантажів."
      ]
    }
  },
  "zh": {
    "home": {
      "title": "Loadly ：全球物流和货运市场平台",
      "paragraphs": [
        "LOADLY是一个创新的物流和运输平台，将托运人与全球可靠的承运人联系起来。我们的使命是促进跨越国内和国际航线的快速、安全和具有成本效益的货运。我们接待了数千家经过验证的物流公司、卡车车主和司机，随时准备运送您的货物。",
        "与传统的货运代理不同， Loadly允许您在几秒钟内发布货物，并立即收到可用车辆的竞争性报价。借助我们先进的负载匹配算法，我们的目标是为各种规模的企业消除空行驶里程，减少碳足迹，并最大限度地降低总体运输成本。",
        "无论您需要少于卡车载荷（ LTL ）还是全卡车载荷（ FTL ）运输，您都可以在我们的平台上找到完美的物流解决方案。对于承运商，我们提供机会通过数千个每日更新的负载板来增加业务量和规划定期路线。",
        "在Loadly上免费注册，加入数字物流革命。在一个地方发布货运任务、接收优惠、消息载体并管理您的整个发货工作流程，您可以随时通过任何设备进行访问。"
      ]
    },
    "marketplace": {
      "title": "全球范围内可靠的货运板和物流机会",
      "paragraphs": [
        "我们的物流市场在一个集中的枢纽中列出了全球最新的货运货物和卡车路线。对于在欧洲、中东及其他地区寻找本地配送、州际运输或国际物流任务的承运人来说，这是一个理想的平台。",
        "货物张贴包括所有基本的货运详细信息，如吨位、所需的卡车类型（干货车、冷藏车、平板车等）、交货日期和路线细节。这种透明度使运营商能够选择最适合其当前路线和车辆容量的工作，从而最大限度地提高运营效率。",
        "对于托运人来说，这个市场是一个数字环境，为运输需求提供即时解决方案。通过与保持高知名度评级的可靠承运商合作，您可以确保货物的安全运输，同时利用由经过认证的专业人士组成的广泛网络提供的竞争性投标。",
        "按出发地、目的地、车辆类型和货物重量筛选房源，在几秒钟内找到完美匹配的房源。我们的实时消息系统直接连接托运人和承运人—没有经纪人，没有隐藏费用，只有高效的货运匹配。"
      ]
    }
  },
  "ja": {
    "home": {
      "title": "Loadly ：グローバルロジスティクス＆貨物マーケットプレイスプラットフォーム",
      "paragraphs": [
        "Loadlyは、世界中の荷主と信頼できる運送業者を結ぶ革新的な物流および輸送プラットフォームです。当社の使命は、国内外のルートで迅速、安全、かつ費用対効果の高い貨物輸送を促進することです。何千もの検証済みの物流会社、トラック所有者、ドライバーが、お客様の貨物を移動する準備ができています。",
        "従来の貨物輸送とは異なり、Loadlyを使用すると、荷物を数秒で投稿し、利用可能な車両から競争力のある見積もりを即座に受け取ることができます。高度な負荷マッチングアルゴリズムにより、空のマイルを排除し、二酸化炭素排出量を削減し、あらゆる規模の企業の全体的な輸送コストを最小限に抑えることを目指しています。",
        "Less Than Truckload （ LTL ）またはFull Truckload （ FTL ）の出荷が必要な場合でも、当社のプラットフォームで完璧なロジスティクスソリューションを見つけることができます。配送業者には、毎日更新される何千ものロードボードを通じて、ビジネス量を増やし、定期的なルートを計画する機会を提供しています。",
        "Loadlyに無料で登録して、デジタルロジスティクス革命に参加しましょう。荷物の投稿、オファーの受け取り、メッセージキャリア、配送ワークフロー全体の管理を1か所で行うことができ、いつでもどのデバイスからでもアクセスできます。"
      ]
    },
    "marketplace": {
      "title": "世界中の信頼性の高い貨物ボードと物流の機会",
      "paragraphs": [
        "当社の物流マーケットプレイスでは、世界中の最新の貨物輸送とトラックルートを1つの一元化されたハブにリストアップしています。これは、ヨーロッパ、中東、その他の地域で現地配送、州間輸送、または国際物流業務を探しているキャリアにとって理想的なプラットフォームです。",
        "積荷の掲示には、トン数、必要なトラックの種類（ドライバン、リーファー、フラットベッドなど）、納期、ルートの詳細など、すべての重要な貨物の詳細が含まれます。この透明性により、キャリアは現在のルートと車両キャパシティに最適なジョブを選択し、運用効率を最大限に高めることができます。",
        "荷送人にとって、このマーケットプレイスは、輸送ニーズに即座にソリューションを提供するデジタル環境です。高い評価を維持する信頼できる配送業者と協力することで、検証済みのプロフェッショナルの幅広いネットワークからの競争入札を活用しながら、商品の安全な輸送を確保できます。",
        "出発地、目的地、車種、貨物重量でリスティングを絞り込み、最適なものを数秒で見つけましょう。当社のリアルタイムメッセージングシステムは、荷主と配送業者を直接接続します。ブローカーも、隠れた手数料もなく、効率的な貨物マッチングだけです。"
      ]
    }
  },
  "hi": {
    "home": {
      "title": "लोडली: ग्लोबल लॉजिस्टिक्स एंड फ्रेट मार्केटप्लेस प्लेटफॉर्म",
      "paragraphs": [
        "Loadly एक इनोवेटिव लॉजिस्टिक्स और ट्रांसपोर्टेशन प्लैटफ़ॉर्म है, जो शिपर्स को दुनिया भर के भरोसेमंद कैरियर से जोड़ता है। हमारा मिशन घरेलू और अंतरराष्ट्रीय मार्गों पर तेज़, सुरक्षित और किफ़ायती माल ढुलाई की सुविधा प्रदान करना है। हम हज़ारों परखे हुए लॉजिस्टिक्स कंपनियों, ट्रक मालिकों और आपके कार्गो को ले जाने के लिए तैयार ड्राइवर पार्टनर की मेज़बानी करते हैं।",
        "पारंपरिक फ्रेट फ़ॉरवर्डिंग के विपरीत, लोडली आपको सेकंड में अपने लोड पोस्ट करने और तुरंत उपलब्ध वाहनों से प्रतिस्पर्धी उद्धरण प्राप्त करने की अनुमति देता है। हमारे उन्नत लोड - मैचिंग एल्गोरिदम के साथ, हमारा लक्ष्य खाली मील को खत्म करना, कार्बन फुटप्रिंट को कम करना और सभी आकारों के व्यवसायों के लिए समग्र परिवहन लागत को कम करना है।",
        "चाहे आपको ट्रक लोड से कम (LTL) या पूर्ण ट्रक लोड (FTL) शिपिंग की आवश्यकता हो, आप हमारे प्लेटफ़ॉर्म पर सही रसद समाधान पा सकते हैं। कैरियर के लिए, हम व्यापार की मात्रा बढ़ाने और हजारों दैनिक अद्यतन लोड बोर्डों के माध्यम से नियमित मार्गों की योजना बनाने का अवसर प्रदान करते हैं।",
        "Loadly पर मुफ़्त में रजिस्टर करके डिजिटल लॉजिस्टिक्स क्रांति में शामिल हों। लोड पोस्ट करें, ऑफ़र प्राप्त करें, मैसेज कैरियर प्राप्त करें, और अपने पूरे शिपिंग वर्कफ़्लो को एक ही स्थान पर प्रबंधित करें — किसी भी डिवाइस से, किसी भी समय सुलभ।"
      ]
    },
    "marketplace": {
      "title": "दुनिया भर में विश्वसनीय फ्रेट बोर्ड और लॉजिस्टिक्स के अवसर",
      "paragraphs": [
        "हमारा लॉजिस्टिक्स मार्केटप्लेस एक केंद्रीकृत हब में दुनिया भर में अप - टू - डेट फ्रेट लोड और ट्रक मार्गों को सूचीबद्ध करता है। यह यूरोप, मध्य पूर्व और उससे आगे के देशों में स्थानीय डिलीवरी, अंतरराज्यीय परिवहन या अंतरराष्ट्रीय लॉजिस्टिक्स असाइनमेंट की तलाश करने वाले कैरियर के लिए आदर्श प्लैटफ़ॉर्म है।",
        "लोड पोस्टिंग में सभी आवश्यक माल ढुलाई विवरण जैसे टन भार, आवश्यक ट्रक प्रकार (ड्राई वैन, रीफर, फ्लैटबेड, आदि), डिलीवरी की तारीखें और मार्ग विवरण शामिल हैं। यह पारदर्शिता कैरियर को उन नौकरियों को चुनने की अनुमति देती है जो उनके वर्तमान मार्गों और वाहन क्षमताओं के लिए सबसे उपयुक्त हैं, जो उनकी परिचालन दक्षता को अधिकतम करते हैं।",
        "शिपर्स के लिए, यह मार्केटप्लेस एक डिजिटल वातावरण है जो परिवहन आवश्यकताओं के तत्काल समाधान प्रदान करता है। उच्च प्रोफ़ाइल रेटिंग बनाए रखने वाले विश्वसनीय कैरियर के साथ काम करके, आप सत्यापित पेशेवरों के एक विस्तृत नेटवर्क से प्रतिस्पर्धी बोली का लाभ उठाते हुए अपने सामान के सुरक्षित पारगमन को सुनिश्चित करते हैं।",
        "कुछ ही सेकंड में सही मैच ढूँढने के लिए लिस्टिंग को मूल, डेस्टिनेशन, गाड़ी के प्रकार और कार्गो के वज़न के हिसाब से फ़िल्टर करें। हमारा रीयल - टाइम मैसेजिंग सिस्टम शिपर्स और कैरियर को सीधे जोड़ता है — कोई ब्रोकर नहीं, कोई छिपा हुआ शुल्क नहीं, बस कुशल माल ढुलाई मिलान।"
      ]
    }
  },
  "ar": {
    "home": {
      "title": "Loadly: منصة سوق الخدمات اللوجستية والشحن العالمية",
      "paragraphs": [
        "Loadly هي منصة لوجستية ونقل مبتكرة تربط الشاحنين بشركات نقل موثوقة في جميع أنحاء العالم. مهمتنا هي تسهيل نقل البضائع بسرعة وأمان وفعالية من حيث التكلفة عبر الطرق المحلية والدولية. نستضيف الآلاف من شركات الخدمات اللوجستية التي تم التحقق منها ومالكي الشاحنات والسائقين المستعدين لنقل حمولتك.",
        "على عكس الشحن التقليدي، يسمح لك Loadly بنشر حمولاتك في ثوانٍ وتلقي عروض أسعار تنافسية على الفور من المركبات المتاحة. من خلال خوارزميات مطابقة الأحمال المتقدمة لدينا، نهدف إلى القضاء على الأميال الفارغة، وتقليل آثار الكربون، وتقليل تكاليف النقل الإجمالية للشركات من جميع الأحجام.",
        "سواء كنت بحاجة إلى شحن أقل من حمولة الشاحنة (LTL) أو حمولة شاحنة كاملة (FTL)، يمكنك العثور على الحل اللوجستي المثالي على منصتنا. بالنسبة لشركات النقل، نقدم الفرصة لزيادة حجم الأعمال وتخطيط المسارات العادية من خلال الآلاف من لوحات التحميل المحدثة يوميًا.",
        "انضم إلى ثورة الخدمات اللوجستية الرقمية من خلال التسجيل مجانًا على Loadly. انشر الحمولات، واستلم العروض، وناقلات الرسائل، وقم بإدارة سير عمل الشحن بالكامل في مكان واحد — يمكن الوصول إليه من أي جهاز وفي أي وقت."
      ]
    },
    "marketplace": {
      "title": "لوحات شحن موثوقة وفرص لوجستية في جميع أنحاء العالم",
      "paragraphs": [
        "يسرد سوق الخدمات اللوجستية لدينا حمولات الشحن الحديثة وطرق الشاحنات في جميع أنحاء العالم في مركز مركز واحد. إنها المنصة المثالية لشركات النقل التي تبحث عن عمليات التسليم المحلية أو النقل بين الولايات أو المهام اللوجستية الدولية في جميع أنحاء أوروبا والشرق الأوسط وخارجها.",
        "تتضمن منشورات الحمولة جميع تفاصيل الشحن الأساسية مثل الحمولة ونوع الشاحنة المطلوبة (الشاحنة الجافة، المبردة، المسطحة، إلخ) وتواريخ التسليم وتفاصيل الطريق. تسمح هذه الشفافية لشركات النقل باختيار الوظائف التي تناسب مساراتها الحالية وقدرات المركبات، مما يزيد من كفاءتها التشغيلية.",
        "بالنسبة للشاحنين، يعد هذا السوق بيئة رقمية توفر حلولًا فورية لاحتياجات النقل. من خلال العمل مع شركات النقل الموثوقة التي تحافظ على تصنيفات عالية، فإنك تضمن النقل الآمن لبضائعك مع الاستفادة من العطاءات التنافسية من شبكة واسعة من المهنيين الذين تم التحقق منهم.",
        "قم بتصفية الإعلانات حسب المنشأ والوجهة ونوع السيارة ووزن الحمولة للعثور على التطابق المثالي في ثوانٍ. يربط نظام المراسلة في الوقت الفعلي بين الشاحنين وشركات النقل مباشرة — لا يوجد وسطاء، ولا رسوم خفية، فقط مطابقة فعالة للشحن."
      ]
    }
  },
  "fa": {
    "home": {
      "title": "لودلی: پلتفرم بازار جهانی لجستیک و حمل و نقل",
      "paragraphs": [
        "لودلی یک پلتفرم نوآورانه لجستیک و حمل و نقل است که شرکت‌های حمل و نقل را به شرکت‌های حمل و نقل معتبر در سراسر جهان متصل می‌کند. ماموریت ما تسهیل حمل و نقل سریع، ایمن و مقرون به صرفه بار در مسیرهای داخلی و بین‌المللی است. ما میزبان هزاران شرکت لجستیکی، صاحبان کامیون و رانندگان تأیید شده هستیم که آماده جابجایی محموله شما هستند.",
        "برخلاف حمل و نقل سنتی، Loadly به شما این امکان را می‌دهد که بارهای خود را در عرض چند ثانیه ارسال کنید و فوراً از وسایل نقلیه موجود، قیمت‌های رقابتی دریافت کنید. با الگوریتم‌های پیشرفته تطبیق بار، هدف ما حذف مسافت‌های خالی، کاهش ردپای کربن و به حداقل رساندن هزینه‌های کلی حمل و نقل برای مشاغل در هر اندازه‌ای است.",
        "چه به حمل و نقل با ظرفیت کمتر از کامیون (LTL) نیاز داشته باشید و چه با ظرفیت کامل کامیون (FTL)، می‌توانید راه‌حل لجستیکی ایده‌آل خود را در پلتفرم ما بیابید. برای شرکت‌های حمل و نقل، ما این فرصت را فراهم می‌کنیم که حجم تجارت خود را افزایش داده و مسیرهای منظمی را از طریق هزاران تابلوی بار که روزانه به‌روزرسانی می‌شوند، برنامه‌ریزی کنند.",
        "با ثبت نام رایگان در Loadly به انقلاب لجستیک دیجیتال بپیوندید. بارها را ثبت کنید، پیشنهادها را دریافت کنید، به حامل‌های پیام پیام دهید و کل گردش کار حمل و نقل خود را در یک مکان مدیریت کنید - از هر دستگاهی و در هر زمان قابل دسترسی است."
      ]
    },
    "marketplace": {
      "title": "هیئت‌های حمل و نقل قابل اعتماد و فرصت‌های لجستیکی در سراسر جهان",
      "paragraphs": [
        "بازار لجستیک ما، فهرست به‌روزی از بارهای حمل‌ونقل و مسیرهای کامیون در سراسر جهان را در یک مرکز متمرکز ارائه می‌دهد. این پلتفرم ایده‌آلی برای شرکت‌های حمل‌ونقل است که به دنبال تحویل محلی، حمل‌ونقل بین ایالتی یا انجام وظایف لجستیکی بین‌المللی در سراسر اروپا، خاورمیانه و فراتر از آن هستند.",
        "آگهی‌های بار شامل تمام جزئیات ضروری بار مانند تناژ، نوع کامیون مورد نیاز (وانت خشک، یخچالی، کفی و غیره)، تاریخ تحویل و مشخصات مسیر است. این شفافیت به شرکت‌های حمل و نقل اجازه می‌دهد تا کارهایی را انتخاب کنند که به بهترین وجه با مسیرها و ظرفیت‌های فعلی وسایل نقلیه آنها مطابقت داشته باشد و کارایی عملیاتی آنها را به حداکثر برساند.",
        "برای شرکت‌های حمل و نقل، این بازار یک محیط دیجیتال است که راه‌حل‌های فوری برای نیازهای حمل و نقل ارائه می‌دهد. با همکاری با شرکت‌های حمل و نقل معتبر که رتبه‌بندی‌های بالایی دارند، شما حمل و نقل ایمن کالاهای خود را تضمین می‌کنید و در عین حال از مزایای پیشنهاد قیمت رقابتی از سوی شبکه گسترده‌ای از متخصصان تأیید شده بهره‌مند می‌شوید.",
        "فهرست‌ها را بر اساس مبدا، مقصد، نوع وسیله نقلیه و وزن بار فیلتر کنید تا در عرض چند ثانیه مورد مناسب را پیدا کنید. سیستم پیام‌رسانی آنی ما، فرستندگان کالا و شرکت‌های حمل و نقل را مستقیماً به هم متصل می‌کند - بدون واسطه، بدون هزینه‌های پنهان، فقط تطبیق کارآمد بار."
      ]
    }
  },
  "ko": {
    "home": {
      "title": "Loadly: 글로벌 물류 및 화물 마켓플레이스 플랫폼",
      "paragraphs": [
        "Loadly는 전 세계 화주와 신뢰할 수 있는 운송업체를 연결하는 혁신적인 물류 및 운송 플랫폼입니다. 당사의 임무는 국내 및 국제 노선을 통해 빠르고 안전하며 비용 효율적인 화물 운송을 촉진하는 것입니다. 수천 개의 검증된 물류 회사, 트럭 소유주, 기사님이 화물을 옮길 준비가 되어 있습니다.",
        "기존 화물 운송과 달리 Loadly를 사용하면 몇 초 만에 화물을 게시하고 사용 가능한 차량에서 경쟁력 있는 견적을 즉시 받을 수 있습니다. 당사의 첨단 부하 매칭 알고리즘을 통해 모든 규모의 비즈니스에서 빈 마일을 제거하고 탄소 발자국을 줄이며 전체 운송 비용을 최소화하는 것을 목표로 합니다.",
        "LTL (Less Than Truckload) 또는 FTL (Full Truckload) 운송이 필요한 경우 당사의 플랫폼에서 완벽한 물류 솔루션을 찾을 수 있습니다. 운송업체의 경우, 당사는 매일 업데이트되는 수천 개의 로드 보드를 통해 비즈니스 규모를 늘리고 정기적인 경로를 계획할 수 있는 기회를 제공합니다.",
        "Loadly에서 무료로 등록하여 디지털 물류 혁명에 동참하세요. 화물을 게시하고, 혜택을 받고, 운송업체에 메시지를 보내고, 전체 배송 워크플로우를 한 곳에서 관리하세요. 언제 어디서나 모든 장치에서 액세스할 수 있습니다."
      ]
    },
    "marketplace": {
      "title": "전 세계의 신뢰할 수 있는 화물 보드 및 물류 기회",
      "paragraphs": [
        "당사의 물류 마켓플레이스는 전 세계의 최신 화물 화물 및 트럭 경로를 하나의 중앙 허브에 나열합니다. 유럽, 중동 등지에서 현지 배송, 주간 운송 또는 국제 물류 업무를 원하는 운송인에게 이상적인 플랫폼입니다.",
        "적재 포스팅에는 톤수, 필요한 트럭 유형 (드라이 밴, 리퍼, 플랫베드 등), 인도 날짜 및 경로 세부 사항과 같은 모든 필수 화물 세부 정보가 포함됩니다. 이러한 투명성을 통해 운송업체는 현재 경로와 차량 용량에 가장 적합한 작업을 선택하여 운영 효율성을 극대화할 수 있습니다.",
        "배송업체에게 이 마켓플레이스는 운송 요구 사항에 대한 즉각적인 솔루션을 제공하는 디지털 환경입니다. 높은 프로필 등급을 유지하는 신뢰할 수 있는 운송업체와 협력하면 검증된 광범위한 전문가 네트워크의 경쟁 입찰을 활용하는 동시에 상품을 안전하게 운송할 수 있습니다.",
        "출발지, 목적지, 차량 유형, 화물 중량별로 숙소를 필터링하여 단 몇 초 만에 완벽한 매칭을 찾아보세요. 당사의 실시간 메시징 시스템은 송하인과 운송인을 직접 연결합니다. 브로커, 숨겨진 수수료 없이 효율적인 화물 매칭만 가능합니다."
      ]
    }
  },
  "vi": {
    "home": {
      "title": "Tải trọng: Nền tảng thị trường vận tải và hậu cần toàn cầu",
      "paragraphs": [
        "Loadly là một nền tảng vận chuyển và hậu cần sáng tạo kết nối các chủ hàng với các hãng vận chuyển đáng tin cậy trên toàn thế giới. Sứ mệnh của chúng tôi là tạo điều kiện vận chuyển hàng hóa nhanh chóng, an toàn và tiết kiệm chi phí trên các tuyến nội địa và quốc tế. Chúng tôi cung cấp chỗ ở cho hàng ngàn công ty hậu cần, chủ xe tải và tài xế đã được xác minh sẵn sàng vận chuyển hàng hóa của bạn.",
        "Không giống như giao nhận vận tải truyền thống, Loadly cho phép bạn đăng lô hàng của mình trong vài giây và ngay lập tức nhận được báo giá cạnh tranh từ các phương tiện có sẵn. Với các thuật toán đối sánh tải tiên tiến, chúng tôi mong muốn loại bỏ số dặm trống, giảm lượng khí thải carbon và giảm thiểu chi phí vận chuyển tổng thể cho các doanh nghiệp thuộc mọi quy mô.",
        "Cho dù bạn cần vận chuyển ít hơn xe tải (LTL) hay đầy tải (FTL), bạn có thể tìm thấy giải pháp hậu cần hoàn hảo trên nền tảng của chúng tôi. Đối với các hãng vận tải, chúng tôi cung cấp cơ hội để tăng khối lượng kinh doanh và lập kế hoạch các tuyến đường thường xuyên thông qua hàng ngàn bảng tải được cập nhật hàng ngày.",
        "Tham gia cuộc cách mạng hậu cần kỹ thuật số bằng cách đăng ký miễn phí trên Loadly. Đăng tải, nhận ưu đãi, gửi tin nhắn và quản lý toàn bộ quy trình vận chuyển của bạn ở một nơi — có thể truy cập từ bất kỳ thiết bị nào, bất cứ lúc nào."
      ]
    },
    "marketplace": {
      "title": "Bảng vận chuyển hàng hóa đáng tin cậy và cơ hội hậu cần trên toàn thế giới",
      "paragraphs": [
        "Thị trường logistics của chúng tôi liệt kê các lô hàng mới nhất và các tuyến xe tải trên toàn cầu trong một trung tâm tập trung. Đây là nền tảng lý tưởng cho các hãng vận tải đang tìm kiếm dịch vụ giao hàng địa phương, vận tải liên tiểu bang hoặc các nhiệm vụ hậu cần quốc tế trên khắp châu Âu, Trung Đông và hơn thế nữa.",
        "Các bài đăng tải bao gồm tất cả các chi tiết vận chuyển hàng hóa thiết yếu như trọng tải, loại xe tải cần thiết (Dry Van, Reefer, Flatbed, v.v.), ngày giao hàng và chi tiết cụ thể về tuyến đường. Tính minh bạch này cho phép các đơn vị vận chuyển lựa chọn các công việc phù hợp nhất với tuyến đường và công suất phương tiện hiện tại của họ, tối đa hóa hiệu quả hoạt động.",
        "Đối với các chủ hàng, thị trường này là một môi trường kỹ thuật số cung cấp các giải pháp tức thời cho nhu cầu vận chuyển. Bằng cách làm việc với các hãng vận chuyển đáng tin cậy duy trì xếp hạng hồ sơ cao, bạn đảm bảo vận chuyển hàng hóa an toàn trong khi tận dụng lợi thế của đấu thầu cạnh tranh từ một mạng lưới rộng lớn các chuyên gia đã được xác minh.",
        "Lọc nhà/phòng cho thuê theo điểm xuất phát, điểm đến, loại xe và trọng lượng hàng hóa để tìm người phù hợp hoàn hảo chỉ trong vài giây. Hệ thống nhắn tin thời gian thực của chúng tôi kết nối trực tiếp các chủ hàng và nhà cung cấp dịch vụ — không có nhà môi giới, không có phí ẩn, chỉ phù hợp với vận chuyển hàng hóa hiệu quả."
      ]
    }
  },
  "id": {
    "home": {
      "title": "Loadly: Platform Pasar Logistik & Kargo Global",
      "paragraphs": [
        "Loadly adalah platform logistik dan transportasi inovatif yang menghubungkan pengirim dengan operator yang andal di seluruh dunia. Misi kami adalah memfasilitasi transportasi barang yang cepat, aman, dan hemat biaya melintasi rute domestik dan internasional. Kami menerima ribuan perusahaan logistik terverifikasi, pemilik truk, dan mitra pengemudi yang siap memindahkan kargo Anda.",
        "Tidak seperti pengiriman barang tradisional, Loadly memungkinkan Anda untuk memposting muatan Anda dalam hitungan detik dan langsung menerima penawaran harga yang kompetitif dari kendaraan yang tersedia. Dengan algoritme pencocokan beban tingkat lanjut kami, kami bertujuan untuk menghilangkan jarak tempuh yang kosong, mengurangi jejak karbon, dan meminimalkan biaya transportasi secara keseluruhan untuk bisnis dari semua ukuran.",
        "Baik Anda membutuhkan pengiriman kurang dari muatan truk (LTL) maupun muatan truk penuh (FTL), Anda dapat menemukan solusi logistik yang sempurna di platform kami. Bagi operator, kami menawarkan kesempatan untuk meningkatkan volume bisnis dan merencanakan rute reguler melalui ribuan papan muatan yang diperbarui setiap hari.",
        "Bergabunglah dengan revolusi logistik digital dengan mendaftar secara gratis di Loadly. Pasang muatan, terima penawaran, kirim pesan, dan kelola seluruh alur kerja pengiriman Anda di satu tempat — dapat diakses dari perangkat apa pun, kapan saja."
      ]
    },
    "marketplace": {
      "title": "Papan Muatan Tepercaya dan Peluang Logistik di Seluruh Dunia",
      "paragraphs": [
        "Pasar logistik kami mencantumkan muatan barang dan rute truk terbaru di seluruh dunia dalam satu pusat terpusat. Ini adalah platform ideal bagi operator yang mencari pengiriman lokal, transportasi antar negara, atau penugasan logistik internasional di seluruh Eropa, Timur Tengah, dan sekitarnya.",
        "Posting muatan mencakup semua detail pengiriman penting seperti tonase, jenis truk yang diperlukan (Dry Van, Reefer, Flatbed, dll.), tanggal pengiriman, dan detail rute. Transparansi ini memungkinkan operator untuk memilih pekerjaan yang paling sesuai dengan rute dan kapasitas kendaraan mereka saat ini, memaksimalkan efisiensi operasional mereka.",
        "Untuk pengirim, pasar ini adalah lingkungan digital yang menyediakan solusi instan untuk kebutuhan transportasi. Dengan bekerja sama dengan operator tepercaya yang mempertahankan peringkat profil tinggi, Anda memastikan transit barang Anda aman sambil memanfaatkan penawaran kompetitif dari jaringan profesional terverifikasi yang luas.",
        "Saring tempat berdasarkan asal, tujuan, jenis kendaraan, dan berat kargo untuk menemukan tempat yang cocok dalam hitungan detik. Sistem perpesanan real - time kami menghubungkan pengirim dan operator secara langsung — tidak ada broker, tidak ada biaya tersembunyi, hanya pencocokan pengiriman yang efisien."
      ]
    }
  },
  "bn": {
    "home": {
      "title": "লোডলি: গ্লোবাল লজিস্টিকস অ্যান্ড ফ্রেইট মার্কেটপ্লেস প্ল্যাটফর্ম",
      "paragraphs": [
        "লোডলি একটি উদ্ভাবনী লজিস্টিক এবং পরিবহন প্ল্যাটফর্ম যা বিশ্বব্যাপী নির্ভরযোগ্য ক্যারিয়ারের সাথে শিপারদের সংযুক্ত করে । আমাদের লক্ষ্য হল দেশীয় এবং আন্তর্জাতিক রুটে দ্রুত, সুরক্ষিত এবং সাশ্রয়ী মূল্যের মালামাল পরিবহন সহজতর করা । আমরা হাজার হাজার যাচাইকৃত লজিস্টিক কোম্পানি, ট্রাক মালিক এবং ড্রাইভারকে আপনার মালামাল সরানোর জন্য প্রস্তুত করি ।",
        "প্রথাগত ফ্রেইট ফরওয়ার্ডিংয়ের বিপরীতে, লোডলি আপনাকে সেকেন্ডের মধ্যে আপনার লোড পোস্ট করতে এবং তাত্ক্ষণিকভাবে উপলভ্য যানবাহন থেকে প্রতিযোগিতামূলক কোট পেতে দেয় । আমাদের উন্নত লোড-ম্যাচিং অ্যালগরিদমগুলির সাহায্যে, আমাদের লক্ষ্য খালি মাইলগুলি দূর করা, কার্বন পদচিহ্নগুলি হ্রাস করা এবং সমস্ত আকারের ব্যবসায়ের জন্য সামগ্রিক পরিবহন ব্যয় হ্রাস করা ।",
        "আপনার কম ট্রাক লোড (LTL) বা ফুল ট্রাক লোড (FTL) শিপিংয়ের প্রয়োজন হোক না কেন, আপনি আমাদের প্ল্যাটফর্মে নিখুঁত লজিস্টিক সমাধান খুঁজে পেতে পারেন । ক্যারিয়ারদের জন্য, আমরা প্রতিদিন আপডেট হওয়া হাজার হাজার লোড বোর্ডের মাধ্যমে ব্যবসার পরিমাণ বৃদ্ধি এবং নিয়মিত রুটের পরিকল্পনা করার সুযোগ প্রদান করি ।",
        "লোডলি-তে বিনামূল্যে নিবন্ধন করে ডিজিটাল লজিস্টিক বিপ্লবে যোগ দিন । লোডগুলি পোস্ট করুন, অফারগুলি পান, বার্তা বাহকগুলি পান এবং আপনার পুরো শিপিং ওয়ার্কফ্লোটি এক জায়গায় পরিচালনা করুন — যে কোনও ডিভাইস থেকে যে কোনও সময় অ্যাক্সেসযোগ্য ।"
      ]
    },
    "marketplace": {
      "title": "বিশ্বব্যাপী নির্ভরযোগ্য ফ্রেইট বোর্ড এবং লজিস্টিক সুযোগ",
      "paragraphs": [
        "আমাদের লজিস্টিক মার্কেটপ্লেস একটি কেন্দ্রীভূত কেন্দ্রে সারা বিশ্ব জুড়ে আপ-টু-ডেট মালবাহী লোড এবং ট্রাক রুটগুলি তালিকাভুক্ত করে । এটি ইউরোপ, মধ্যপ্রাচ্য এবং এর বাইরেও স্থানীয় ডেলিভারি, আন্তঃদেশীয় পরিবহন বা আন্তর্জাতিক লজিস্টিক অ্যাসাইনমেন্ট খুঁজছেন এমন বাহকদের জন্য আদর্শ প্ল্যাটফর্ম ।",
        "লোড পোস্টিংয়ে সমস্ত প্রয়োজনীয় মালামালের বিবরণ যেমন টনেজ, প্রয়োজনীয় ট্রাকের ধরন (শুকনো ভ্যান, রেফার, ফ্ল্যাটবেড ইত্যাদি), ডেলিভারির তারিখ এবং রুটের সুনির্দিষ্ট বিবরণ অন্তর্ভুক্ত রয়েছে । এই স্বচ্ছতা ক্যারিয়ারগুলিকে এমন কাজগুলি বেছে নিতে দেয় যা তাদের বর্তমান রুট এবং গাড়ির ক্ষমতার সাথে সর্বোত্তমভাবে মানানসই, তাদের কার্যক্ষম দক্ষতা সর্বাধিক করে ।",
        "শিপারদের জন্য, এই মার্কেটপ্লেসটি একটি ডিজিটাল পরিবেশ যা পরিবহনের প্রয়োজনীয়তার তাত্ক্ষণিক সমাধান প্রদান করে । নির্ভরযোগ্য বাহকদের সাথে কাজ করে যারা উচ্চ প্রোফাইল রেটিং বজায় রাখে, যাচাইকৃত পেশাদারদের একটি বিস্তৃত নেটওয়ার্ক থেকে প্রতিযোগিতামূলক বিডিংয়ের সুবিধা গ্রহণ করার সময় আপনি আপনার পণ্যের নিরাপদ ট্রানজিট নিশ্চিত করেন ।",
        "সেকেন্ডে নিখুঁত মিল খুঁজে পেতে মূল, গন্তব্য, গাড়ির ধরন এবং কার্গো ওজন অনুসারে ফিল্টার তালিকা । আমাদের রিয়েল-টাইম মেসেজিং সিস্টেম সরাসরি শিপার এবং ক্যারিয়ারকে সংযুক্ত করে — কোনও দালাল, কোনও লুকানো ফি নেই, কেবল দক্ষ ফ্রেইট ম্যাচিং ।"
      ]
    }
  },
  "ur": {
    "home": {
      "title": "لوڈلی: گلوبل لاجسٹکس اینڈ فریٹ مارکیٹ پلیس پلیٹ فارم",
      "paragraphs": [
        "Loadly ایک جدید لاجسٹکس اور ٹرانسپورٹیشن پلیٹ فارم ہے جو دنیا بھر میں قابل اعتماد کیریئرز کے ساتھ ترسیل کنندگان کو جوڑتا ہے ۔ ہمارا مشن گھریلو اور بین الاقوامی راستوں پر تیز، محفوظ اور سستے مال کی نقل و حمل کی سہولت فراہم کرنا ہے ۔ ہم ہزاروں توثیق شدہ لاجسٹک کمپنیوں، ٹرک مالکان اور آپ کے کارگو کو منتقل کرنے کے لیے تیار ڈرائیورز کی میزبانی کرتے ہیں ۔",
        "روایتی فریٹ فارورڈنگ کے برعکس، لوڈلی آپ کو سیکنڈوں میں اپنے بوجھ پوسٹ کرنے اور فوری طور پر دستیاب گاڑیوں سے مسابقتی قیمت درج کرنے کی اجازت دیتا ہے ۔ اپنے ایڈوانسڈ لوڈ میچنگ الگورتھمز کے ساتھ، ہمارا مقصد خالی میلوں کو ختم کرنا، کاربن کے نشانات کو کم کرنا اور ہر سائز کے کاروباروں کے لیے ٹرانسپورٹیشن کے مجموعی اخراجات کو کم کرنا ہے ۔",
        "چاہے آپ کو ٹرک لوڈ (LTL) یا فل ٹرک لوڈ (FTL) شپنگ سے کم کی ضرورت ہو، آپ ہمارے پلیٹ فارم پر لاجسٹک کا بہترین حل تلاش کر سکتے ہیں ۔ کیریئرز کے لیے، ہم کاروباری حجم بڑھانے اور روزانہ ہزاروں اپ ڈیٹ شدہ لوڈ بورڈز کے ذریعے باقاعدہ راستوں کی منصوبہ بندی کرنے کا موقع پیش کرتے ہیں ۔",
        "Loadly پر مفت رجسٹر کر کے ڈیجیٹل لاجسٹکس انقلاب میں شامل ہوں ۔ لوڈز پوسٹ کریں، آفرز موصول کریں، کیریئرز کو پیغام بھیجیں، اور ایک ہی جگہ پر اپنے پورے شپنگ ورک فلو کا نظم کریں — کسی بھی ڈیوائس سے، کسی بھی وقت قابل رسائی ۔"
      ]
    },
    "marketplace": {
      "title": "دنیا بھر میں قابل اعتماد فریٹ بورڈز اور لاجسٹکس کے مواقع",
      "paragraphs": [
        "ہمارا لاجسٹک مارکیٹ پلیس ایک مرکزی مرکز میں دنیا بھر میں تازہ ترین فریٹ لوڈز اور ٹرک کے راستوں کی فہرست بناتا ہے ۔ یہ یورپ، مشرق وسطیٰ اور اس سے آگے مقامی ڈیلیوریز، بین ریاستی ٹرانسپورٹ یا بین الاقوامی لاجسٹکس اسائنمنٹس تلاش کرنے والے کیریئرز کے لیے مثالی پلیٹ فارم ہے ۔",
        "لوڈ پوسٹنگ میں تمام ضروری فریٹ کی تفصیلات جیسے ٹننیج، مطلوبہ ٹرک کی قسم (ڈرائی وین، ریفر، فلیٹ بیڈ وغیرہ)، ڈیلیوری کی تاریخیں اور راستے کی تفصیلات شامل ہیں ۔ یہ شفافیت کیریئرز کو ایسی ملازمتوں کا انتخاب کرنے کی اجازت دیتی ہے جو ان کے موجودہ راستوں اور گاڑی کی صلاحیتوں کے مطابق ہوں، جس سے ان کی آپریشنل کارکردگی زیادہ سے زیادہ ہو ۔",
        "ترسیل کنندگان کے لئے، یہ مارکیٹ پلیس ایک ڈیجیٹل ماحول ہے جو نقل و حمل کی ضروریات کو فوری حل فراہم کرتا ہے ۔ اعلی پروفائل درجہ بندیاں برقرار رکھنے والے قابل اعتماد کیریئرز کے ساتھ کام کرکے، آپ تصدیق شدہ پیشہ ور افراد کے وسیع نیٹ ورک سے مسابقتی بولی کا فائدہ اٹھاتے ہوئے اپنے سامان کی محفوظ ٹرانزٹ کو یقینی بناتے ہیں ۔",
        "سیکنڈز میں بہترین میچ تلاش کرنے کے لیے لسٹنگز کو اصل، منزل، گاڑی کی قسم اور کارگو کے وزن کے لحاظ سے فلٹر کریں ۔ ہمارا ریئل ٹائم میسجنگ سسٹم ترسیل کنندگان اور کیریئرز کو براہ راست جوڑتا ہے — کوئی بروکرز نہیں، کوئی پوشیدہ فیس نہیں، صرف موثر فریٹ مماثلت ۔"
      ]
    }
  },
  "th": {
    "home": {
      "title": "Loadly: แพลตฟอร์มโลจิสติกส์และการขนส่งสินค้าทั่วโลก",
      "paragraphs": [
        "Loadly เป็นนวัตกรรมด้านโลจิสติกส์และแพลตฟอร์มการขนส่งที่เชื่อมต่อผู้ส่งสินค้ากับผู้ให้บริการที่เชื่อถือได้ทั่วโลกภารกิจของเราคือการอำนวยความสะดวกในการขนส่งสินค้าที่รวดเร็วปลอดภัยและคุ้มค่าในเส้นทางภายในประเทศและระหว่างประเทศเราให้บริการบริษัทโลจิสติกเจ้าของรถบรรทุกและคนขับที่ผ่านการตรวจสอบแล้วหลายพันรายพร้อมให้บริการขนย้ายสินค้าของคุณ",
        "ซึ่งแตกต่างจากการขนส่งสินค้าแบบดั้งเดิม Loadly ช่วยให้คุณสามารถโพสต์โหลดของคุณในไม่กี่วินาทีและรับราคาที่แข่งขันได้ทันทีจากยานพาหนะที่มีอยู่ด้วยอัลกอริทึมการจับคู่โหลดขั้นสูงของเราเรามุ่งมั่นที่จะกำจัดไมล์ที่ว่างเปล่าลดรอยเท้าคาร์บอนและลดต้นทุนการขนส่งโดยรวมสำหรับธุรกิจทุกขนาด",
        "ไม่ว่าคุณจะต้องการการจัดส่งน้อยกว่า Truckload (LTL) หรือ Full Truckload (FTL) คุณสามารถค้นหาโซลูชันโลจิสติกส์ที่สมบูรณ์แบบได้บนแพลตฟอร์มของเราสำหรับผู้ให้บริการเรามีโอกาสที่จะเพิ่มปริมาณธุรกิจและวางแผนเส้นทางปกติผ่านกระดานโหลดที่อัปเดตหลายพันรายการต่อวัน",
        "เข้าร่วมการปฏิวัติโลจิสติกส์ดิจิทัลโดยลงทะเบียนฟรีบน Loadly โพสต์โหลดรับข้อเสนอส่งข้อความถึงผู้ให้บริการขนส่งและจัดการเวิร์กโฟลว์การจัดส่งทั้งหมดของคุณได้ในที่เดียว — เข้าถึงได้จากทุกอุปกรณ์ทุกที่ทุกเวลา"
      ]
    },
    "marketplace": {
      "title": "บอร์ดขนส่งสินค้าและโอกาสด้านโลจิสติกส์ที่เชื่อถือได้ทั่วโลก",
      "paragraphs": [
        "ตลาดโลจิสติกส์ของเราแสดงรายการโหลดสินค้าและเส้นทางรถบรรทุกที่ทันสมัยทั่วโลกในศูนย์กลางเดียวเป็นแพลตฟอร์มที่เหมาะสำหรับผู้ให้บริการที่กำลังมองหาการจัดส่งในท้องถิ่นการขนส่งระหว่างรัฐหรืองานโลจิสติกส์ระหว่างประเทศทั่วยุโรปตะวันออกกลางและอื่นๆ",
        "โพสต์การโหลดรวมถึงรายละเอียดการขนส่งสินค้าที่สำคัญทั้งหมดเช่นน้ำหนักบรรทุกประเภทรถบรรทุกที่จำเป็น (Dry Van, Reefer, Flatbed ฯลฯ) วันที่จัดส่งและข้อมูลเฉพาะเส้นทางความโปร่งใสนี้ช่วยให้ผู้ให้บริการสามารถเลือกงานที่เหมาะสมกับเส้นทางและขีดความสามารถของยานพาหนะในปัจจุบันมากที่สุดเพื่อเพิ่มประสิทธิภาพในการดำเนินงาน",
        "สำหรับผู้ส่งสินค้าตลาดนี้เป็นสภาพแวดล้อมดิจิทัลที่ให้บริการโซลูชั่นทันทีเพื่อตอบสนองความต้องการในการขนส่งด้วยการทำงานร่วมกับผู้ให้บริการที่เชื่อถือได้ซึ่งรักษาคะแนนรายละเอียดสูงคุณจะมั่นใจได้ถึงการขนส่งสินค้าของคุณอย่างปลอดภัยในขณะที่ใช้ประโยชน์จากการเสนอราคาที่แข่งขันได้จากเครือข่ายผู้เชี่ยวชาญที่ได้รับการยืนยันอย่างกว้างขวาง",
        "กรองที่พักตามต้นทางปลายทางประเภทรถและน้ำหนักสินค้าเพื่อค้นหาที่พักที่เข้ากันได้ในไม่กี่วินาทีระบบรับส่งข้อความแบบเรียลไทม์ของเราเชื่อมต่อผู้ส่งสินค้าและผู้ให้บริการโดยตรงไม่มีโบรกเกอร์ไม่มีค่าธรรมเนียมแอบแฝงมีเพียงการจับคู่ค่าขนส่งที่มีประสิทธิภาพ"
      ]
    }
  },
  "ms": {
    "home": {
      "title": "Loadly: Platform Pasaran Logistik & Pengangkutan Global",
      "paragraphs": [
        "Loadly adalah platform logistik dan pengangkutan inovatif yang menghubungkan penghantar dengan pembawa yang boleh dipercayai di seluruh dunia. Misi kami adalah untuk memudahkan pengangkutan barang yang cepat, selamat dan kos efektif merentasi laluan domestik dan antarabangsa. Kami menjadi hos kepada beribu-ribu syarikat logistik yang disahkan, pemilik trak, dan pemandu yang bersedia untuk memindahkan kargo anda.",
        "Tidak seperti penghantaran barang tradisional, Loadly membolehkan anda menyiarkan muatan anda dalam beberapa saat dan menerima sebut harga yang kompetitif dengan serta-merta daripada kenderaan yang tersedia. Dengan algoritma pemadanan beban lanjutan kami, kami berhasrat untuk menghapuskan batu kosong, mengurangkan jejak karbon, dan meminimumkan kos pengangkutan keseluruhan untuk perniagaan dari semua saiz.",
        "Sama ada anda memerlukan penghantaran Kurang Daripada Muatan Lori (LTL) atau Muatan Lori Penuh (FTL), anda boleh mencari penyelesaian logistik yang sempurna di platform kami. Untuk pembawa, kami menawarkan peluang untuk meningkatkan jumlah perniagaan dan merancang laluan biasa melalui beribu-ribu papan muatan yang dikemas kini setiap hari.",
        "Sertai revolusi logistik digital dengan mendaftar secara percuma di Loadly. Siarkan muatan, terima tawaran, pembawa mesej, dan uruskan keseluruhan aliran kerja penghantaran anda di satu tempat — boleh diakses dari mana-mana peranti, pada bila-bila masa."
      ]
    },
    "marketplace": {
      "title": "Papan Barang dan Peluang Logistik yang Boleh Dipercayai di Seluruh Dunia",
      "paragraphs": [
        "Pasaran logistik kami menyenaraikan muatan barang dan laluan trak terkini di seluruh dunia dalam satu hab berpusat. Ia adalah platform yang ideal untuk syarikat penerbangan yang mencari penghantaran tempatan, pengangkutan antara negeri, atau tugasan logistik antarabangsa di seluruh Eropah, Timur Tengah, dan seterusnya.",
        "Pengeposan muatan merangkumi semua butiran pengangkutan penting seperti tan, jenis trak yang diperlukan (Dry Van, Reefer, Flatbed, dll.), tarikh penghantaran, dan butiran laluan. Ketelusan ini membolehkan syarikat penerbangan memilih pekerjaan yang paling sesuai dengan laluan semasa dan kapasiti kenderaan mereka, memaksimumkan kecekapan operasi mereka.",
        "Bagi penghantar, pasaran ini adalah persekitaran digital yang menyediakan penyelesaian segera untuk keperluan pengangkutan. Dengan bekerjasama dengan syarikat penerbangan yang boleh dipercayai yang mengekalkan penarafan berprofil tinggi, anda memastikan transit barangan anda selamat sambil memanfaatkan pembidaan kompetitif daripada rangkaian profesional yang disahkan secara meluas.",
        "Tapis penyenaraian mengikut asal, destinasi, jenis kenderaan, dan berat kargo untuk mencari padanan yang sempurna dalam beberapa saat. Sistem pemesejan masa nyata kami menghubungkan penghantar dan pembawa secara langsung — tiada broker, tiada yuran tersembunyi, hanya padanan pengangkutan yang cekap."
      ]
    }
  },
  "tl": {
    "home": {
      "title": "Mag - load: Global Logistics at Freight Marketplace Platform",
      "paragraphs": [
        "Loadly ay isang makabagong logistik at transportasyon platform pagkonekta shippers na may maaasahang carrier sa buong mundo. Ang aming misyon ay upang mapadali ang mabilis, ligtas, at cost - effective na kargamento transportasyon sa kabuuan ng domestic at internasyonal na mga ruta. Nagho - host kami ng libu - libong beripikadong kompanya ng logistik, may - ari ng trak, at driver na handang ilipat ang iyong kargamento.",
        "Hindi tulad ng tradisyunal na pagpapasa ng kargamento, pinapayagan ka ng Loadly na i - post ang iyong mga naglo - load sa mga segundo at agad na makatanggap ng mga mapagkumpitensyang quote mula sa mga magagamit na sasakyan. Gamit ang aming mga advanced na algorithm ng pagtutugma ng pag - load, nilalayon naming alisin ang mga walang laman na milya, bawasan ang carbon footprints, at i - minimize ang pangkalahatang gastos sa transportasyon para sa mga negosyo ng lahat ng laki.",
        "Kung kailangan mo ng pagpapadala ng Less Than Truckload (LTL) o Full Truckload (FTL), maaari mong mahanap ang perpektong solusyon sa logistik sa aming platform. Para sa mga carrier, nag - aalok kami ng pagkakataon upang madagdagan ang dami ng negosyo at magplano ng mga regular na ruta sa pamamagitan ng libu - libong araw - araw na na - update na mga load board.",
        "Sumali sa digital logistics revolution sa pamamagitan ng pagpaparehistro nang libre sa Loadly. Mag - post ng mga naglo - load, tumanggap ng mga alok, mga carrier ng mensahe, at pamahalaan ang iyong buong daloy ng trabaho sa pagpapadala sa isang lugar — naa — access mula sa anumang aparato, anumang oras."
      ]
    },
    "marketplace": {
      "title": "Maaasahang Freight Boards at Logistics Oportunidad sa buong mundo",
      "paragraphs": [
        "Ang aming logistics marketplace ay naglilista ng mga up - to - date na kargamento ng kargamento at mga ruta ng trak sa buong mundo sa isang sentralisadong hub. Ito ay ang perpektong platform para sa mga carrier na naghahanap ng mga lokal na paghahatid, interstate transport, o internasyonal na mga takdang - aralin sa logistik sa buong Europa, Gitnang Silangan, at higit pa.",
        "Kasama sa mga pag - post ng pag - load ang lahat ng mahahalagang detalye ng kargamento tulad ng tonnage, kinakailangang uri ng trak (Dry Van, Reefer, Flatbed, atbp.), Mga petsa ng paghahatid, at mga detalye ng ruta. Pinapayagan ng transparency na ito ang mga carrier na pumili ng mga trabaho na pinakamahusay na umaangkop sa kanilang kasalukuyang mga ruta at kapasidad ng sasakyan, na pinapalaki ang kanilang kahusayan sa pagpapatakbo.",
        "Para sa mga shippers, ang marketplace na ito ay isang digital na kapaligiran na nagbibigay ng mga instant na solusyon sa mga pangangailangan sa transportasyon. Sa pamamagitan ng pakikipagtulungan sa mga maaasahang carrier na nagpapanatili ng mataas na rating sa profile, tinitiyak mo ang ligtas na pagbibiyahe ng iyong mga kalakal habang sinasamantala ang mapagkumpitensyang pag - bid mula sa isang malawak na network ng mga na - verify na propesyonal.",
        "I - filter ang mga listing ayon sa pinagmulan, destinasyon, uri ng sasakyan, at timbang ng kargamento para mahanap ang perpektong tugma sa loob ng ilang segundo. Ang aming real - time na sistema ng pagmemensahe ay nag - uugnay sa mga shippers at carrier nang direkta — walang mga broker, walang mga nakatagong bayad, mahusay lamang na pagtutugma ng kargamento."
      ]
    }
  },
  "ro": {
    "home": {
      "title": "Loadly: Platforma globală de logistică și piață de transport de marfă",
      "paragraphs": [
        "Loadly este o platformă inovatoare de logistică și transport care conectează expeditorii cu transportatori de încredere din întreaga lume. Misiunea noastră este de a facilita transportul de mărfuri rapid, sigur și rentabil pe rutele interne și internaționale. Găzduim mii de companii de logistică verificate, proprietari de camioane și șoferi gata să-ți transporte încărcătura.",
        "Spre deosebire de expedierea tradițională de mărfuri, Loadly vă permite să postați încărcăturile în câteva secunde și să primiți instantaneu oferte competitive de la vehiculele disponibile. Cu algoritmii noștri avansați de potrivire a încărcăturii, ne propunem să eliminăm milele goale, să reducem amprenta de carbon și să minimizăm costurile generale de transport pentru întreprinderile de toate dimensiunile.",
        "Indiferent dacă aveți nevoie de expediere cu încărcături mai mici (LTL) sau cu încărcături complete (FTL), puteți găsi soluția logistică perfectă pe platforma noastră. Pentru transportatori, oferim posibilitatea de a crește volumul de afaceri și de a planifica rute regulate prin mii de platforme de încărcare actualizate zilnic.",
        "Alăturați-vă revoluției logistice digitale înregistrându-vă gratuit pe Loadly. Postează încărcături, primește oferte, trimite mesaje și gestionează întregul flux de lucru de expediere într-un singur loc — accesibil de pe orice dispozitiv, oricând."
      ]
    },
    "marketplace": {
      "title": "Borduri de transport de marfă fiabile și oportunități logistice la nivel mondial",
      "paragraphs": [
        "Piața noastră de logistică listează încărcături de marfă și rute de camioane actualizate pe tot globul într-un singur centru centralizat. Este platforma ideală pentru transportatorii care caută livrări locale, transport interstatal sau misiuni logistice internaționale în Europa, Orientul Mijlociu și nu numai.",
        "Anunțurile privind încărcăturile includ toate detaliile esențiale privind transportul de marfă, cum ar fi tonajul, tipul de camion necesar (Dry Van, Reefer, Flatbed etc.), datele de livrare și specificul traseului. Această transparență permite transportatorilor să aleagă locurile de muncă care se potrivesc cel mai bine rutelor lor actuale și capacităților vehiculelor, maximizând eficiența lor operațională.",
        "Pentru expeditori, această piață este un mediu digital care oferă soluții instantanee pentru nevoile de transport. Colaborând cu transportatori de încredere care mențin evaluări de profil ridicate, asigurați tranzitul în siguranță al bunurilor dvs., profitând în același timp de oferte competitive de la o rețea largă de profesioniști verificați.",
        "Filtrează anunțurile în funcție de origine, destinație, tipul de vehicul și greutatea încărcăturii pentru a găsi potrivirea perfectă în câteva secunde. Sistemul nostru de mesagerie în timp real conectează direct expeditorii și transportatorii — fără brokeri, fără taxe ascunse, doar potrivire eficientă a transportului de marfă."
      ]
    }
  },
  "sv": {
    "home": {
      "title": "Loadly: Global Logistics & Freight Marketplace-plattform",
      "paragraphs": [
        "Loadly är en innovativ logistik- och transportplattform som förbinder speditörer med pålitliga transportörer över hela världen. Vårt uppdrag är att underlätta snabba, säkra och kostnadseffektiva godstransporter över inrikes och internationella rutter. Vi är värdar för tusentals verifierade logistikföretag, lastbilsägare och förare som är redo att transportera din last.",
        "Till skillnad från traditionell spedition låter Loadly dig publicera dina laster på några sekunder och omedelbart få konkurrenskraftiga offerter från tillgängliga fordon. Med våra avancerade belastningsmatchande algoritmer strävar vi efter att eliminera tomma mil, minska koldioxidavtrycket och minimera de totala transportkostnaderna för företag av alla storlekar.",
        "Oavsett om du behöver mindre än lastbilslast (LTL) eller full lastbilslast (FTL) frakt, kan du hitta den perfekta logistiklösningen på vår plattform. För transportörer erbjuder vi möjligheten att öka affärsvolymen och planera reguljära rutter genom tusentals dagligen uppdaterade lasttavlor.",
        "Gå med i den digitala logistikrevolutionen genom att registrera dig gratis på Loadly. Lägg upp laddningar, ta emot erbjudanden, skicka meddelanden till transportörer och hantera hela ditt fraktarbetsflöde på ett ställe — tillgängligt från vilken enhet som helst, när som helst."
      ]
    },
    "marketplace": {
      "title": "Pålitliga frakttavlor och logistikmöjligheter över hela världen",
      "paragraphs": [
        "Vår logistikmarknadsplats listar aktuella fraktlaster och lastbilsrutter över hela världen i ett centraliserat nav. Det är den perfekta plattformen för transportörer som letar efter lokala leveranser, mellanstatliga transporter eller internationella logistikuppdrag över hela Europa, Mellanöstern och utanför.",
        "Lastposteringar inkluderar alla väsentliga fraktuppgifter som tonnage, önskad lastbilstyp (torr skåpbil, kylare, flak, etc.), leveransdatum och ruttuppgifter. Denna transparens gör det möjligt för transportörer att välja jobb som bäst passar deras nuvarande rutter och fordonskapacitet, vilket maximerar deras operativa effektivitet.",
        "För speditörer är denna marknadsplats en digital miljö som ger omedelbara lösningar på transportbehov. Genom att arbeta med pålitliga transportörer som upprätthåller höga profilbetyg säkerställer du en säker transitering av dina varor samtidigt som du drar nytta av konkurrensutsatt budgivning från ett brett nätverk av verifierade proffs.",
        "Filtrera annonser efter ursprung, destination, fordonstyp och lastvikt för att hitta den perfekta matchningen på några sekunder. Vårt meddelandesystem i realtid kopplar samman speditörer och transportörer direkt — inga mäklare, inga dolda avgifter, bara effektiv fraktmatchning."
      ]
    }
  },
  "cs": {
    "home": {
      "title": "Loadly: Globální platforma pro logistiku a nákladní dopravu",
      "paragraphs": [
        "Loadly je inovativní logistická a dopravní platforma spojující odesílatele se spolehlivými dopravci po celém světě. Naším posláním je usnadnit rychlou, bezpečnou a nákladově efektivní nákladní dopravu na vnitrostátních i mezinárodních trasách. Hostíme tisíce ověřených logistických společností, majitelů nákladních vozidel a řidičů, kteří jsou připraveni přepravit váš náklad.",
        "Na rozdíl od tradičního spedičního systému vám služba Loadly umožňuje odesílat nakládky během několika sekund a okamžitě dostávat konkurenční nabídky od dostupných vozidel. S našimi pokročilými algoritmy pro porovnávání zatížení se snažíme eliminovat prázdné kilometry, snížit uhlíkovou stopu a minimalizovat celkové náklady na dopravu pro podniky všech velikostí.",
        "Ať už potřebujete přepravu méně než kamionů (LTL) nebo celovozovou přepravu (FTL), na naší platformě najdete perfektní logistické řešení. Pro dopravce nabízíme možnost zvýšit objem obchodů a naplánovat pravidelné trasy prostřednictvím tisíců denně aktualizovaných nakládacích desek.",
        "Připojte se k revoluci digitální logistiky tím, že se zaregistrujete zdarma na Loadly. Zveřejňujte nakládky, dostávejte nabídky, posílejte zprávy a spravujte celý pracovní postup přepravy na jednom místě — kdykoli a z jakéhokoli zařízení."
      ]
    },
    "marketplace": {
      "title": "Spolehlivé přepravní desky a logistické příležitosti po celém světě",
      "paragraphs": [
        "Náš logistický trh uvádí aktuální nákladní náklady a trasy nákladních automobilů po celém světě v jednom centralizovaném centru. Je to ideální platforma pro dopravce, kteří hledají místní dodávky, mezistátní přepravu nebo mezinárodní logistické zakázky po celé Evropě, na Středním východě i mimo ni.",
        "Inzeráty nákladů obsahují všechny podstatné údaje o přepravě, jako je tonáž, požadovaný typ vozidla (dodávka, chladicí vůz, valník atd.), termíny dodání a podrobnosti trasy. Tato transparentnost umožňuje dopravcům vybírat zakázky, které nejlépe odpovídají jejich aktuálním trasám a kapacitě vozidel, čímž maximalizují svou provozní efektivitu.",
        "Pro odesílatele je tento trh digitálním prostředím poskytujícím okamžitá řešení přepravních potřeb. Spoluprací se spolehlivými dopravci s vysokým hodnocením zajistíte bezpečnou přepravu svého zboží a zároveň využijete konkurenčních nabídek od široké sítě ověřených profesionálů.",
        "Filtrujte nabídky podle místa odjezdu, cíle, typu vozidla a hmotnosti nákladu a najděte dokonalou shodu během několika sekund. Náš systém zpráv v reálném čase propojuje odesílatele a dopravce přímo — žádní zprostředkovatelé, žádné skryté poplatky, jen efektivní párování nákladu."
      ]
    }
  },
  "hu": {
    "home": {
      "title": "Loadly: Globális Logisztikai és Fuvarpiaci Platform",
      "paragraphs": [
        "A Loadly egy innovatív logisztikai és szállítási platform, amely megbízható fuvarozókkal köti össze a feladókat világszerte. Küldetésünk, hogy gyors, biztonságos és költséghatékony árufuvarozást tegyünk lehetővé belföldi és nemzetközi útvonalakon egyaránt. Több ezer ellenőrzött logisztikai céget, kamiontulajdonost és sofőrt fogadunk, akik készen állnak az Ön rakományának szállítására.",
        "A hagyományos fuvarszervezéssel ellentétben a Loadly lehetővé teszi, hogy másodpercek alatt hirdesse meg rakományát, és azonnal versenyképes ajánlatokat kapjon elérhető járművektől. Fejlett rakomány-egyeztető algoritmusaink segítségével célunk az üres kilométerek megszüntetése, a szén-dioxid-kibocsátás csökkentése és a szállítási költségek minimalizálása minden méretű vállalkozás számára.",
        "Legyen szó részrakományról (LTL) vagy teljes kamionrakományról (FTL), platformunkon megtalálja a tökéletes logisztikai megoldást. Fuvarozóink számára lehetőséget kínálunk üzleti forgalmuk növelésére és rendszeres útvonalak tervezésére a naponta frissülő rakománytáblák ezrein keresztül.",
        "Csatlakozzon a digitális logisztikai forradalomhoz, regisztráljon ingyenesen a Loadlyn. Hirdessen rakományokat, fogadjon ajánlatokat, üzenjen a fuvarozóknak, és kezelje teljes szállítási folyamatát egy helyen — bármely eszközről, bármikor elérhető módon."
      ]
    },
    "marketplace": {
      "title": "Megbízható Fuvarpiac és Logisztikai Lehetőségek Világszerte",
      "paragraphs": [
        "Logisztikai piacterünk egy központi felületen sorolja fel a világ aktuális fuvarrakományait és kamionútvonalait. Ideális platform azoknak a fuvarozóknak, akik helyi szállítást, államközi fuvart vagy nemzetközi logisztikai megbízást keresnek Európában, a Közel-Keleten és azon túl.",
        "A rakományhirdetések tartalmazzák az összes lényeges fuvarozási adatot, például a tonnaszámot, a szükséges járműtípust (ponyvás, hűtős, nyitott platós stb.), a szállítási dátumokat és az útvonal részleteit. Ez az átláthatóság lehetővé teszi a fuvarozók számára, hogy az aktuális útvonalukhoz és jármű-kapacitásukhoz legjobban illő munkákat válasszák, maximalizálva működési hatékonyságukat.",
        "A feladók számára ez a piactér digitális környezetet biztosít, amely azonnali megoldást kínál szállítási igényeikre. A magas értékelésű, megbízható fuvarozókkal való együttműködés garantálja áruik biztonságos szállítását, miközben kihasználhatják az ellenőrzött szakemberek széles hálózatának versenyképes ajánlatait.",
        "Szűrje a hirdetéseket kiindulási hely, célállomás, járműtípus és rakomány súlya szerint, hogy másodpercek alatt megtalálja a tökéletes párt. Valós idejű üzenetküldő rendszerünk közvetlenül összeköti a feladókat és a fuvarozókat — nincs közvetítő, nincs rejtett díj, csak hatékony fuvaregyeztetés."
      ]
    }
  },
  "el": {
    "home": {
      "title": "Loadly: Παγκόσμια Πλατφόρμα Logistics & Αγορά Εμπορευμάτων",
      "paragraphs": [
        "Το Loadly είναι μια καινοτόμος πλατφόρμα logistics και μεταφορών που συνδέει αποστολείς με αξιόπιστους μεταφορείς παγκοσμίως. Αποστολή μας είναι να διευκολύνουμε τη γρήγορη, ασφαλή και οικονομική μεταφορά εμπορευμάτων σε εγχώριες και διεθνείς διαδρομές. Διαθέτουμε χιλιάδες πιστοποιημένες εταιρείες logistics, ιδιοκτήτες φορτηγών και οδηγούς έτοιμους να μεταφέρουν το φορτίο σας.",
        "Σε αντίθεση με τις παραδοσιακές μεταφορές, το Loadly σας επιτρέπει να δημοσιεύετε τα φορτία σας σε δευτερόλεπτα και να λαμβάνετε άμεσα ανταγωνιστικές προσφορές από διαθέσιμα οχήματα. Με τους προηγμένους αλγόριθμους αντιστοίχισης φορτίου, στοχεύουμε να εξαλείψουμε τα άδεια χιλιόμετρα, να μειώσουμε το αποτύπωμα άνθρακα και να ελαχιστοποιήσουμε το συνολικό κόστος μεταφοράς για επιχειρήσεις κάθε μεγέθους.",
        "Είτε χρειάζεστε αποστολή LTL είτε FTL, μπορείτε να βρείτε την τέλεια λύση logistics στην πλατφόρμα μας. Για τους μεταφορείς, προσφέρουμε την ευκαιρία να αυξήσουν τον όγκο των εργασιών τους και να σχεδιάσουν τακτικές διαδρομές μέσω χιλιάδων καθημερινά ενημερωμένων πινάκων φορτίου.",
        "Εγγραφείτε δωρεάν στο Loadly και γίνετε μέλος της ψηφιακής επανάστασης των logistics. Δημοσιεύστε φορτία, λάβετε προσφορές, στείλτε μηνύματα σε μεταφορείς και διαχειριστείτε ολόκληρη τη διαδικασία αποστολής σε ένα μέρος — προσβάσιμο από οποιαδήποτε συσκευή, οποτεδήποτε."
      ]
    },
    "marketplace": {
      "title": "Αξιόπιστοι Πίνακες Εμπορευμάτων και Ευκαιρίες Logistics Παγκοσμίως",
      "paragraphs": [
        "Η αγορά logistics μας παραθέτει ενημερωμένα φορτία και διαδρομές φορτηγών σε όλο τον κόσμο σε έναν κεντρικό κόμβο. Είναι η ιδανική πλατφόρμα για μεταφορείς που αναζητούν τοπικές παραδόσεις, διακρατικές μεταφορές ή διεθνείς αναθέσεις logistics σε όλη την Ευρώπη, τη Μέση Ανατολή και πέρα από αυτήν.",
        "Οι αναρτήσεις φορτίου περιλαμβάνουν όλες τις βασικές λεπτομέρειες, όπως χωρητικότητα, απαιτούμενο τύπο φορτηγού, ημερομηνίες παράδοσης και λεπτομέρειες διαδρομής. Αυτή η διαφάνεια επιτρέπει στους μεταφορείς να επιλέγουν εργασίες που ταιριάζουν καλύτερα στις τρέχουσες διαδρομές και τις χωρητικότητες των οχημάτων τους, μεγιστοποιώντας την επιχειρησιακή τους απόδοση.",
        "Για τους αποστολείς, αυτή η αγορά είναι ένα ψηφιακό περιβάλλον που παρέχει άμεσες λύσεις στις ανάγκες μεταφοράς. Συνεργαζόμενοι με αξιόπιστους μεταφορείς που διατηρούν υψηλές βαθμολογίες, διασφαλίζετε την ασφαλή μεταφορά των αγαθών σας, ενώ επωφελείστε από ανταγωνιστικές προσφορές από ένα ευρύ δίκτυο πιστοποιημένων επαγγελματιών.",
        "Φιλτράρετε τις καταχωρίσεις ανά προέλευση, προορισμό, τύπο οχήματος και βάρος φορτίου για να βρείτε το τέλειο ταίριασμα σε δευτερόλεπτα. Το σύστημα ανταλλαγής μηνυμάτων σε πραγματικό χρόνο συνδέει άμεσα αποστολείς και μεταφορείς — χωρίς μεσάζοντες, χωρίς κρυφές χρεώσεις, μόνο αποτελεσματική αντιστοίχιση φορτίου."
      ]
    }
  },
  "az": {
    "home": {
      "title": "Loadly: Qlobal Logistika və Yük Daşıma Platforması",
      "paragraphs": [
        "Loadly yükgöndərənləri və etibarlı daşıyıcıları birləşdirən innovativ logistika və nəqliyyat platformasıdır. Məqsədimiz yerli və beynəlxalq marşrutlar üzrə sürətli, təhlükəsiz və sərfəli yük daşımalarını asanlaşdırmaqdır. Biz yükünüzü daşımağa hazır minlərlə təsdiqlənmiş logistika şirkətini və sürücünü bir araya gətiririk.",
        "Ənənəvi ekspeditorlardan fərqli olaraq, Loadly yüklərinizi saniyələr ərzində elan etməyə və dərhal rəqabətədavamlı təkliflər almağa imkan verir. Qabaqcıl alqoritmlərimizlə boş gedişləri aradan qaldırmağı, karbon izini azaltmağı və bütün müəssisələr üçün nəqliyyat xərclərini minimuma endirməyi hədəfləyirik.",
        "İstər LTL, istərsə də FTL daşımalarına ehtiyacınız olsun, platformamızda mükəmməl logistika həllini tapa bilərsiniz. Daşıyıcılar üçün gündəlik yenilənən minlərlə yük elanı vasitəsilə iş həcmini artırmaq və müntəzəm marşrutlar planlaşdırmaq imkanı təklif edirik.",
        "Loadly-də pulsuz qeydiyyatdan keçərək rəqəmsal logistika inqilabına qoşulun. Yükləri elan edin, təkliflər alın və bütün daşıma prosesini istənilən cihazdan bir yerdə idarə edin."
      ]
    },
    "marketplace": {
      "title": "Dünya üzrə Etibarlı Yük Elanları və Logistika İmkanları",
      "paragraphs": [
        "Logistika bazarımız dünyanın hər yerindən ən son yük və yük maşını marşrutlarını bir mərkəzdə cəmləşdirir. Bu, Avropa, Yaxın Şərq və digər regionlarda yerli və beynəlxalq logistika tapşırıqları axtaran daşıyıcılar üçün ideal platformadır.",
        "Yük elanlarına tonaj, tələb olunan yük maşını növü, çatdırılma tarixləri və marşrut detalları kimi bütün zəruri məlumatlar daxildir. Bu şəffaflıq daşıyıcılara ən uyğun işləri seçməyə və əməliyyat səmərəliliyini artırmağa imkan verir.",
        "Yükgöndərənlər üçün bu bazar nəqliyyat ehtiyaclarına dərhal həllər təqdim edən rəqəmsal mühitdir. Yüksək reytinqli etibarlı daşıyıcılarla işləyərək yüklərinizin təhlükəsiz tranzitini təmin edirsiniz.",
        "Mənşə, təyinat, nəqliyyat vasitəsi növü və yükün çəkisinə görə elanları filtrləyərək saniyələr ərzində mükəmməl uyğunluğu tapın. Gerçək zamanlı mesajlaşma sistemimiz yükgöndərənləri və daşıyıcıları birbaşa bağlayır — vasitəçi və gizli ödənişlər olmadan."
      ]
    }
  },
  "kk": {
    "home": {
      "title": "Loadly: Ғаламдық логистика және жүк тасымалдау платформасы",
      "paragraphs": [
        "Loadly - бұл жүк жөнелтушілерді сенімді тасымалдаушылармен байланыстыратын инновациялық логистикалық және көлік платформасы. Біздің мақсатымыз - ішкі және халықаралық бағыттар бойынша жылдам, қауіпсіз және үнемді жүк тасымалын жеңілдету.",
        "Дәстүрлі экспедиторлардан айырмашылығы, Loadly жүктеріңізді бірнеше секунд ішінде жариялауға және бірден бәсекеге қабілетті ұсыныстар алуға мүмкіндік береді. Озық алгоритмдеріміздің арқасында біз бос жүрістерді жоюды және тасымалдау шығындарын азайтуды мақсат етеміз.",
        "Сізге LTL немесе FTL тасымалы қажет болса да, платформамыздан тамаша логистикалық шешім таба аласыз. Тасымалдаушылар үшін күн сайын жаңартылатын мыңдаған жүк хабарландырулары арқылы жұмыс көлемін арттыру мүмкіндігін ұсынамыз.",
        "Loadly-ге тегін тіркеліп, сандық логистикалық революцияға қосылыңыз. Жүктерді жариялаңыз, ұсыныстар алыңыз және барлық тасымалдау процесін кез келген құрылғыдан басқарыңыз."
      ]
    },
    "marketplace": {
      "title": "Дүние жүзі бойынша сенімді жүк хабарландырулары",
      "paragraphs": [
        "Біздің логистикалық нарығымыз бүкіл әлемдегі соңғы жүк және жүк көліктері бағыттарын бір орталықта жинайды. Бұл Еуропа, Таяу Шығыс және басқа аймақтарда тасымалдау жұмыстарын іздейтін тасымалдаушылар үшін тамаша платформа.",
        "Жүк хабарландыруларына тоннаж, көлік түрі, жеткізу күндері және бағыт мәліметтері сияқты барлық қажетті ақпарат кіреді. Бұл ашықтық тасымалдаушыларға ең қолайлы жұмыстарды таңдауға мүмкіндік береді.",
        "Жүк жөнелтушілер үшін бұл нарық көлік қажеттіліктеріне жедел шешімдер ұсынатын сандық орта болып табылады. Жоғары рейтингті сенімді тасымалдаушылармен жұмыс істей отырып, жүктеріңіздің қауіпсіздігін қамтамасыз етесіз.",
        "Шығу, келу орны, көлік түрі және жүк салмағы бойынша хабарландыруларды сүзіп, бірнеше секунд ішінде тамаша сәйкестікті табыңыз. Біздің нақты уақыттағы хабарлама жүйеміз делдалсыз тікелей байланыс орнатады."
      ]
    }
  },
  "he": {
    "home": {
      "title": "Loadly: הפלטפורמה העולמית ללוגיסטיקה ושילוח מטענים",
      "paragraphs": [
        "Loadly היא פלטפורמת לוגיסטיקה ותחבורה חדשנית המחברת בין שולחים למובילים אמינים ברחבי העולם. המשימה שלנו היא לאפשר הובלת מטענים מהירה, מאובטחת וחסכונית במסלולים מקומיים ובינלאומיים.",
        "בניגוד לשילוח המסורתי, Loadly מאפשרת לך לפרסם את המטענים שלך בשניות ולקבל הצעות מחיר תחרותיות מיידיות. בעזרת האלגוריתמים המתקדמים שלנו, אנו שואפים לחסל נסיעות ריקות ולהפחית משמעותית את עלויות ההובלה.",
        "בין אם אתה צריך הובלה חלקית (LTL) או מלאה (FTL), תוכל למצוא את הפתרון הלוגיסטי המושלם בפלטפורמה שלנו. למובילים, אנו מציעים הזדמנות להגדיל את נפח העסקים דרך אלפי לוחות מטענים המתעדכנים מדי יום.",
        "הצטרף למהפכת הלוגיסטיקה הדיגיטלית על ידי הרשמה בחינם ב-Loadly. פרסם מטענים, קבל הצעות, ונהל את כל תהליך השילוח במקום אחד - נגיש מכל מכשיר, בכל עת."
      ]
    },
    "marketplace": {
      "title": "לוחות מטענים אמינים והזדמנויות לוגיסטיות ברחבי העולם",
      "paragraphs": [
        "זירת המסחר הלוגיסטית שלנו מרכזת מטענים עדכניים ומסלולי משאיות ברחבי העולם במרכז אחד. זוהי הפלטפורמה האידיאלית למובילים המחפשים הובלות מקומיות או בינלאומיות ברחבי אירופה והמזרח התיכון.",
        "פרסומי המטענים כוללים את כל הפרטים החיוניים כגון משקל, סוג משאית נדרש, תאריכי אספקה ופרטי מסלול. שקיפות זו מאפשרת למובילים לבחור עבודות המתאימות ביותר ליכולותיהם.",
        "לשולחים, פלטפורמה זו מספקת פתרונות מיידיים לצרכי תחבורה. עבודה עם מובילים אמינים בעלי דירוג גבוה מבטיחה מעבר בטוח של הסחורה שלך.",
        "סנן רשומות לפי מוצא, יעד, סוג רכב ומשקל כדי למצוא את ההתאמה המושלמת בשניות. מערכת ההודעות שלנו בזמן אמת מחברת בין שולחים למובילים ישירות - ללא מתווכים או עמלות נסתרות."
      ]
    }
  },
  "bg": {
    "home": {
      "title": "Loadly: Глобална платформа за логистика и товарни превози",
      "paragraphs": [
        "Loadly е иновативна платформа за логистика и транспорт, която свързва изпращачи с надеждни превозвачи по целия свят. Нашата мисия е да улесним бързия, сигурен и рентабилен превоз на товари по вътрешни и международни маршрути.",
        "За разлика от традиционната спедиция, Loadly ви позволява да публикувате товарите си за секунди и незабавно да получавате конкурентни оферти. С нашите усъвършенствани алгоритми целим да премахнем празните пробези и да намалим транспортните разходи.",
        "Независимо дали се нуждаете от LTL или FTL транспорт, можете да намерите перфектното логистично решение при нас. За превозвачите предлагаме възможност да увеличат обема на бизнеса си чрез хиляди ежедневно актуализирани борси за товари.",
        "Присъединете се към дигиталната логистична революция, като се регистрирате безплатно в Loadly. Публикувайте товари, получавайте оферти и управлявайте целия процес от едно място."
      ]
    },
    "marketplace": {
      "title": "Надеждни борси за товари и логистични възможности",
      "paragraphs": [
        "Нашият логистичен пазар изброява актуални товари и маршрути на камиони по целия свят в един централизиран хъб. Това е идеалната платформа за превозвачи, търсещи локални или международни задачи в Европа и Близкия изток.",
        "Обявите за товари включват всички основни детайли като тонаж, изискван тип камион, дати за доставка и специфика на маршрута. Тази прозрачност позволява на превозвачите да избират задачи, които най-добре отговарят на техните капацитети.",
        "За изпращачите този пазар предоставя незабавни решения на транспортните нужди. Работата с надеждни превозвачи гарантира сигурния транзит на вашите стоки.",
        "Филтрирайте обявите по произход, дестинация и тип превозно средство, за да намерите перфектното съвпадение за секунди. Нашата система за съобщения свързва изпращачи и превозвачи директно – без брокери и скрити такси."
      ]
    }
  },
  "hr": {
    "home": {
      "title": "Loadly: Globalna platforma za logistiku i tržište tereta",
      "paragraphs": [
        "Loadly je inovativna platforma za logistiku i transport koja povezuje pošiljatelje s pouzdanim prijevoznicima diljem svijeta. Naša je misija olakšati brz, siguran i isplativ prijevoz tereta na domaćim i međunarodnim rutama.",
        "Za razliku od tradicionalnog otpremništva, Loadly vam omogućuje objavljivanje tereta u nekoliko sekundi i trenutačno primanje konkurentnih ponuda. Našim naprednim algoritmima ciljamo na uklanjanje praznih vožnji i smanjenje troškova transporta.",
        "Bez obzira trebate li LTL ili FTL otpremu, na našoj platformi možete pronaći savršeno logističko rješenje. Za prijevoznike nudimo priliku za povećanje obujma poslovanja putem tisuća svakodnevno ažuriranih oglasnika za teret.",
        "Pridružite se digitalnoj logističkoj revoluciji besplatnom registracijom na Loadly. Objavljujte terete, primajte ponude i upravljajte cijelim procesom s jednog mjesta."
      ]
    },
    "marketplace": {
      "title": "Pouzdane burze tereta i logističke prilike diljem svijeta",
      "paragraphs": [
        "Naše logističko tržište navodi ažurne terete i rute kamiona diljem svijeta u jednom centraliziranom čvorištu. Ovo je idealna platforma za prijevoznike koji traže lokalne ili međunarodne zadatke diljem Europe i Bliskog istoka.",
        "Objave o teretu uključuju sve bitne detalje poput tonaže, potrebne vrste kamiona, datuma isporuke i specifičnosti rute. Ova transparentnost omogućuje prijevoznicima odabir poslova koji najbolje odgovaraju njihovim kapacitetima.",
        "Za pošiljatelje, ovo tržište pruža trenutačna rješenja za transportne potrebe. Rad s pouzdanim prijevoznicima osigurava siguran tranzit vaše robe.",
        "Filtrirajte oglase prema podrijetlu, odredištu i vrsti vozila kako biste u nekoliko sekundi pronašli savršeno podudaranje. Naš sustav poruka izravno povezuje pošiljatelje i prijevoznike - bez posrednika i skrivenih naknada."
      ]
    }
  },
  "sr": {
    "home": {
      "title": "Loadly: Globalna platforma za logistiku i tržište tereta",
      "paragraphs": [
        "Loadly je inovativna platforma za logistiku i transport koja povezuje pošiljaoce sa pouzdanim prevoznicima širom sveta. Naša misija je da olakšamo brz, siguran i isplativ prevoz tereta na domaćim i međunarodnim rutama.",
        "Za razliku od tradicionalnog špediterstva, Loadly vam omogućava da objavite svoj teret u sekundi i odmah dobijete konkurentne ponude. Sa našim naprednim algoritmima ciljamo na smanjenje praznih vožnji i optimizaciju troškova.",
        "Bilo da vam je potreban LTL ili FTL prevoz, na našoj platformi možete pronaći savršeno logističko rešenje. Prevoznicima nudimo priliku za povećanje poslovanja putem hiljada svakodnevno ažuriranih berzi tereta.",
        "Pridružite se digitalnoj logističkoj revoluciji besplatnom registracijom na Loadly. Objavljujte terete, dobijajte ponude i upravljajte celim procesom sa jednog mesta."
      ]
    },
    "marketplace": {
      "title": "Pouzdane berze tereta i logističke prilike širom sveta",
      "paragraphs": [
        "Naše logističko tržište navodi ažurne terete i rute kamiona širom sveta na jednom mestu. Ovo je idealna platforma za prevoznike koji traže lokalne ili međunarodne logističke zadatke širom Evrope i Bliskog istoka.",
        "Objave o teretu uključuju sve bitne detalje poput tonaže, potrebne vrste kamiona, datuma isporuke i specifičnosti rute. Ova transparentnost omogućava prevoznicima da biraju poslove koji najbolje odgovaraju njihovim kapacitetima.",
        "Za pošiljaoce, ovo tržište pruža trenutna rešenja za transportne potrebe. Rad sa pouzdanim prevoznicima osigurava bezbedan tranzit vaše robe.",
        "Filtrirajte oglase prema poreklu, odredištu i vrsti vozila da biste u sekundi pronašli savršeno podudaranje. Naš sistem poruka u realnom vremenu direktno povezuje pošiljaoce i prevoznike."
      ]
    }
  },
  "sk": {
    "home": {
      "title": "Loadly: Globálna platforma pre logistiku a trh s nákladom",
      "paragraphs": [
        "Loadly je inovatívna platforma pre logistiku a dopravu, ktorá spája odosielateľov s dôveryhodnými dopravcami po celom svete. Našou misiou je uľahčiť rýchlu, bezpečnú a nákladovo efektívnu prepravu tovaru na domácich aj medzinárodných trasách.",
        "Na rozdiel od tradičného špeditéra vám Loadly umožňuje zverejniť váš náklad v priebehu niekoľkých sekúnd a okamžite získať konkurencieschopné ponuky. Naším cieľom je znížiť počet jázd naprázdno a minimalizovať náklady.",
        "Či už potrebujete prepravu LTL alebo FTL, na našej platforme nájdete dokonalé logistické riešenie. Dopravcom ponúkame možnosť zvýšiť objem podnikania prostredníctvom tisícok denne aktualizovaných búrz nákladov.",
        "Pripojte sa k digitálnej logistickej revolúcii a zaregistrujte sa bezplatne na Loadly. Spravujte celý proces prepravy z jedného miesta."
      ]
    },
    "marketplace": {
      "title": "Spoľahlivé burzy nákladov a logistické príležitosti",
      "paragraphs": [
        "Náš logistický trh centralizuje aktuálne náklady a trasy nákladných áut po celom svete. Je to ideálna platforma pre dopravcov hľadajúcich prácu po celej Európe a na Blízkom východe.",
        "Zverejnenia nákladu zahŕňajú všetky dôležité detaily, ako je tonáž, typ vozidla, dátumy dodania a špecifiká trasy. Táto transparentnosť umožňuje dopravcom vybrať si najvhodnejšie úlohy.",
        "Pre odosielateľov poskytuje tento trh okamžité riešenia. Spolupráca so spoľahlivými dopravcami zaisťuje bezpečný tranzit vášho tovaru.",
        "Filtrujte záznamy podľa pôvodu, cieľa a typu vozidla. Náš systém správ prepája odosielateľov a dopravcov priamo - bez maklérov a skrytých poplatkov."
      ]
    }
  },
  "da": {
    "home": {
      "title": "Loadly: Global platform for logistik og fragtmarked",
      "paragraphs": [
        "Loadly er en innovativ logistik- og transportplatform, der forbinder afsendere med pålidelige transportører over hele verden. Vores mission er at lette hurtig, sikker og omkostningseffektiv godstransport på tværs af indenlandske og internationale ruter.",
        "I modsætning til traditionel spedition giver Loadly dig mulighed for at bogføre dine laster på få sekunder og straks modtage konkurrencedygtige tilbud. Vi sigter mod at fjerne tomme kilometer og reducere transportomkostningerne.",
        "Uanset om du har brug for LTL- eller FTL-forsendelse, kan du finde den perfekte logistikløsning på vores platform. For transportører tilbyder vi muligheden for at øge forretningsvolumen gennem tusindvis af dagligt opdaterede fragttavler.",
        "Deltag i den digitale logistikrevolution ved at registrere dig gratis på Loadly. Bogfør laster, modtag tilbud og administrer hele din forsendelsesproces på ét sted."
      ]
    },
    "marketplace": {
      "title": "Pålidelige fragttavler og logistikmuligheder på verdensplan",
      "paragraphs": [
        "Vores logistikmarkedsplads lister opdaterede fragtbelastninger og lastbilruter over hele kloden i ét centraliseret hub. Det er den ideelle platform for transportører, der søger opgaver i hele Europa og Mellemøsten.",
        "Fragtposteringer inkluderer alle væsentlige detaljer såsom tonnage, krævet lastbiltype, leveringsdatoer og rutespecifikationer. Denne gennemsigtighed giver transportører mulighed for at vælge de bedste opgaver.",
        "For afsendere giver denne markedsplads øjeblikkelige løsninger til transportbehov. Arbejde med pålidelige transportører sikrer sikker transit af dine varer.",
        "Filtrer lister efter oprindelse, destination og køretøjstype. Vores meddelelsessystem forbinder afsendere og transportører direkte - uden mæglere og skjulte gebyrer."
      ]
    }
  },
  "fi": {
    "home": {
      "title": "Loadly: Maailmanlaajuinen logistiikka- ja rahtimarkkinapaikka",
      "paragraphs": [
        "Loadly on innovatiivinen logistiikka- ja kuljetusalusta, joka yhdistää lähettäjät luotettaviin rahdinkuljettajiin maailmanlaajuisesti. Missiomme on helpottaa nopeaa, turvallista ja kustannustehokasta tavaraliikennettä.",
        "Toisin kuin perinteinen huolinta, Loadly antaa sinun julkaista rahtisi sekunneissa ja saada välittömästi kilpailukykyisiä tarjouksia. Pyrimme poistamaan tyhjät ajokilometrit ja vähentämään kuljetuskustannuksia.",
        "Tarvitsitpa sitten LTL- tai FTL-kuljetusta, löydät täydellisen logistiikkaratkaisun alustaltamme. Rahdinkuljettajille tarjoamme mahdollisuuden kasvattaa liiketoimintaa tuhansien päivittäin päivitettävien rahtitaulujen avulla.",
        "Liity digitaaliseen logistiikkavallankumoukseen rekisteröitymällä ilmaiseksi Loadlyyn. Julkaise rahteja, vastaanota tarjouksia ja hallinnoi koko lähetysprosessia yhdessä paikassa."
      ]
    },
    "marketplace": {
      "title": "Luotettavat rahtitaulut ja logistiikkamahdollisuudet",
      "paragraphs": [
        "Logistiikkamarkkinapaikkamme listaa ajantasaiset rahdit ja kuorma-autoreitit ympäri maailmaa yhdessä keskitetyssä paikassa. Se on ihanteellinen alusta rahdinkuljettajille ympäri Eurooppaa ja Lähi-itää.",
        "Rahtijulkaisut sisältävät kaikki olennaiset tiedot, kuten vetoisuuden, tarvittavan kuorma-autotyypin, toimituspäivät ja reittitiedot. Tämä avoimuus antaa rahdinkuljettajille mahdollisuuden valita parhaat työt.",
        "Lähettäjille tämä markkinapaikka tarjoaa välittömiä ratkaisuja kuljetustarpeisiin. Työskentely luotettavien rahdinkuljettajien kanssa takaa tavaroiden turvallisen kuljetuksen.",
        "Suodata ilmoituksia alkuperän, määränpään ja ajoneuvotyypin mukaan. Viestijärjestelmämme yhdistää lähettäjät ja rahdinkuljettajat suoraan - ilman välittäjiä tai piilokuluja."
      ]
    }
  },
  "no": {
    "home": {
      "title": "Loadly: Global plattform for logistikk og fraktmarked",
      "paragraphs": [
        "Loadly er en innovativ logistikk- og transportplattform som forbinder avsendere med pålitelige transportører over hele verden. Vår misjon er å legge til rette for rask, sikker og kostnadseffektiv godstransport.",
        "I motsetning til tradisjonell spedisjon, lar Loadly deg legge ut lastene dine på sekunder og umiddelbart motta konkurransedyktige tilbud. Vi tar sikte på å eliminere tomme kilometer og redusere transportkostnadene.",
        "Enten du trenger LTL- eller FTL-frakt, kan du finne den perfekte logistikkløsningen på vår plattform. For transportører tilbyr vi muligheten til å øke forretningsvolumet gjennom tusenvis av daglig oppdaterte frakttavler.",
        "Bli med i den digitale logistikkrevolusjonen ved å registrere deg gratis på Loadly. Legg ut laster, motta tilbud og administrer hele forsendelsesprosessen på ett sted."
      ]
    },
    "marketplace": {
      "title": "Pålitelige frakttavler og logistikkmuligheter over hele verden",
      "paragraphs": [
        "Vår logistikkmarkedsplass lister oppdaterte fraktlaster og lastebilruter over hele kloden i ett sentralisert knutepunkt. Det er den ideelle plattformen for transportører over hele Europa og Midtøsten.",
        "Fraktposter inkluderer alle viktige detaljer som tonnasje, nødvendig lastebiltype, leveringsdatoer og rutespesifikasjoner. Denne åpenheten gjør det mulig for transportører å velge de beste jobbene.",
        "For avsendere gir denne markedsplassen umiddelbare løsninger på transportbehov. Samarbeid med pålitelige transportører sikrer trygg transitt av varene dine.",
        "Filtrer oppføringer etter opprinnelse, destinasjon og kjøretøytype. Vårt meldingssystem forbinder avsendere og transportører direkte - uten meglere og skjulte avgifter."
      ]
    }
  },
  "uz": {
    "home": {
      "title": "Loadly: Global logistika va yuk tashish platformasi",
      "paragraphs": [
        "Loadly - bu yuk jo'natuvchilarni ishonchli tashuvchilar bilan bog'laydigan innovatsion logistika va transport platformasi. Bizning vazifamiz ichki va xalqaro yo'nalishlar bo'ylab tez, xavfsiz va tejamkor yuk tashishni osonlashtirishdir.",
        "An'anaviy ekspeditorlardan farqli o'laroq, Loadly yuklaringizni bir necha soniya ichida joylashtirish va darhol raqobatbardosh takliflarni olish imkonini beradi. Ilg'or algoritmlarimiz bilan biz bo'sh qatnovlarni yo'q qilishni va transport xarajatlarini kamaytirishni maqsad qilganmiz.",
        "Sizga LTL yoki FTL yuki kerak bo'ladimi, bizning platformamizdan mukammal logistika yechimini topishingiz mumkin. Tashuvchilar uchun biz har kuni yangilanadigan minglab yuk e'lonlari orqali biznes hajmini oshirish imkoniyatini taklif qilamiz.",
        "Loadly-da bepul ro'yxatdan o'tib, raqamli logistika inqilobiga qo'shiling. Yuklarni joylashtiring, takliflar oling va butun jo'natish jarayonini bir joydan boshqaring."
      ]
    },
    "marketplace": {
      "title": "Butun dunyo bo'ylab ishonchli yuk e'lonlari",
      "paragraphs": [
        "Bizning logistika bozorimiz butun dunyo bo'ylab eng yangi yuklar va yuk mashinalari yo'nalishlarini bitta markazda sanab o'tadi. Bu Yevropa va Yaqin Sharq bo'ylab tashuvchilar uchun ideal platformadir.",
        "Yuk e'lonlari tonnaj, talab qilinadigan yuk mashinasi turi, yetkazib berish sanalari va yo'nalish xususiyatlari kabi barcha muhim tafsilotlarni o'z ichiga oladi. Bu ochiqlik tashuvchilarga eng mos ishlarni tanlash imkonini beradi.",
        "Yuk jo'natuvchilar uchun bu bozor transport ehtiyojlariga tezkor yechimlar taqdim etadi. Ishonchli tashuvchilar bilan ishlash orqali yuklaringiz xavfsizligini ta'minlaysiz.",
        "Ro'yxatlarni kelib chiqishi, manzili va avtomobil turi bo'yicha filtrlash orqali mukammal moslikni toping. Bizning xabar almashish tizimimiz vositachilarsiz to'g'ridan-to'g'ri bog'laydi."
      ]
    }
  },
  "ta": {
    "home": {
      "title": "Loadly: உலகளாவிய தளவாடங்கள் மற்றும் சரக்கு சந்தை தளம்",
      "paragraphs": [
        "Loadly என்பது உலகெங்கிலும் உள்ள நம்பகமான கேரியர்களுடன் சரக்கு ஏற்றுமதி செய்பவர்களை இணைக்கும் ஒரு புதுமையான தளவாட மற்றும் போக்குவரத்து தளமாகும். விரைவான, பாதுகாப்பான மற்றும் செலவு குறைந்த சரக்கு போக்குவரத்தை எளிதாக்குவதே எங்கள் நோக்கம்.",
        "பாரம்பரிய சரக்கு பகிர்தல் போலல்லாமல், Loadly உங்கள் சுமைகளை நொடிகளில் பதிவு செய்து, உடனடியாக போட்டி விலைகளைப் பெற அனுமதிக்கிறது. மேம்பட்ட அல்காரிதம்கள் மூலம், வெற்று மைல்களை அகற்றுவதையும் போக்குவரத்து செலவுகளைக் குறைப்பதையும் நோக்கமாகக் கொண்டுள்ளோம்.",
        "உங்களுக்கு LTL அல்லது FTL ஷிப்பிங் தேவைப்பட்டாலும், எங்களது தளத்தில் சரியான தளவாட தீர்வை நீங்கள் கண்டறியலாம். கேரியர்களுக்காக, தினசரி புதுப்பிக்கப்படும் ஆயிரக்கணக்கான சரக்கு பலகைகள் மூலம் வணிக அளவை அதிகரிக்க வாய்ப்பளிக்கிறோம்.",
        "Loadly இல் இலவசமாக பதிவு செய்வதன் மூலம் டிஜிட்டல் தளவாடப் புரட்சியில் சேரவும். சுமைகளை பதிவு செய்யவும், சலுகைகளைப் பெறவும் மற்றும் உங்கள் முழு ஷிப்பிங் செயல்முறையையும் ஒரே இடத்தில் நிர்வகிக்கவும்."
      ]
    },
    "marketplace": {
      "title": "நம்பகமான சரக்கு பலகைகள் மற்றும் உலகளாவிய தளவாட வாய்ப்புகள்",
      "paragraphs": [
        "எங்கள் தளவாட சந்தையானது உலகம் முழுவதிலுமுள்ள புதுப்பித்த சரக்கு சுமைகள் மற்றும் டிரக் வழிகளை ஒரே மையப்படுத்தப்பட்ட இடத்தில் பட்டியலிடுகிறது. இது ஐரோப்பா மற்றும் மத்திய கிழக்கு முழுவதும் கேரியர்களுக்கு ஏற்ற தளமாகும்.",
        "சரக்கு பதிவுகள் டன் கணக்கு, தேவையான டிரக் வகை, விநியோக தேதிகள் மற்றும் வழித்தட விவரங்கள் போன்ற அனைத்து அத்தியாவசிய விவரங்களையும் உள்ளடக்கியது. இந்த வெளிப்படைத்தன்மை கேரியர்கள் சிறந்த வேலைகளைத் தேர்வு செய்ய அனுமதிக்கிறது.",
        "ஏற்றுமதி செய்பவர்களுக்கு, இந்த சந்தையானது போக்குவரத்து தேவைகளுக்கு உடனடி தீர்வுகளை வழங்கும் டிஜிட்டல் சூழலாகும். நம்பகமான கேரியர்களுடன் பணிபுரிவது உங்கள் பொருட்களின் பாதுகாப்பான போக்குவரத்தை உறுதி செய்கிறது.",
        "இடங்கள், சேருமிடம் மற்றும் வாகன வகை மூலம் பட்டியல்களை வடிகட்டி சரியான பொருத்தத்தை நொடிகளில் கண்டறியவும். எங்கள் செய்தியிடல் அமைப்பு இடைத்தரகர்கள் இல்லாமல் நேரடியாக இணைக்கிறது."
      ]
    }
  },
  "mr": {
    "home": {
      "title": "Loadly: जागतिक लॉजिस्टिक आणि फ्रेट मार्केटप्लेस प्लॅटफॉर्म",
      "paragraphs": [
        "Loadly हे एक नाविन्यपूर्ण लॉजिस्टिक आणि परिवहन प्लॅटफॉर्म आहे जे जगभरातील विश्वसनीय वाहकांसह शिपर्सना जोडते. जलद, सुरक्षित आणि किफायतशीर मालवाहतूक सुलभ करणे हे आमचे ध्येय आहे.",
        "पारंपारिक फ्रेट फॉरवर्डिंगच्या विपरीत, Loadly तुम्हाला तुमचे लोड सेकंदात पोस्ट करू देते आणि त्वरित स्पर्धात्मक कोट्स प्राप्त करू देते. प्रगत अल्गोरिदमसह, आम्ही रिकामे मैल दूर करण्याचे आणि वाहतूक खर्च कमी करण्याचे उद्दिष्ट ठेवतो.",
        "तुम्हाला LTL किंवा FTL शिपिंगची आवश्यकता असो, तुम्हाला आमच्या प्लॅटफॉर्मवर परिपूर्ण लॉजिस्टिक उपाय सापडेल. वाहकांसाठी, आम्ही दररोज अपडेट होणाऱ्या हजारो लोड बोर्डद्वारे व्यवसायाचे प्रमाण वाढवण्याची संधी देतो.",
        "Loadly वर विनामूल्य नोंदणी करून डिजिटल लॉजिस्टिक क्रांतीमध्ये सामील व्हा. लोड पोस्ट करा, ऑफर मिळवा आणि तुमची संपूर्ण शिपिंग प्रक्रिया एकाच ठिकाणाहून व्यवस्थापित करा."
      ]
    },
    "marketplace": {
      "title": "जगभरातील विश्वसनीय फ्रेट बोर्ड आणि लॉजिस्टिक संधी",
      "paragraphs": [
        "आमचे लॉजिस्टिक मार्केटप्लेस एकाच केंद्रीकृत हबमध्ये जगभरातील अद्ययावित मालवाहतूक आणि ट्रकचे मार्ग सूचीबद्ध करते. युरोप आणि मध्य पूर्वेतील वाहकांसाठी हे एक आदर्श व्यासपीठ आहे.",
        "लोड पोस्टिंगमध्ये सर्व आवश्यक तपशील समाविष्ट आहेत जसे की टनेज, आवश्यक ट्रकचा प्रकार, वितरणाच्या तारखा आणि मार्गाचे तपशील. ही पारदर्शकता वाहकांना सर्वोत्तम नोकऱ्या निवडण्याची परवानगी देते.",
        "शिपर्ससाठी, हे मार्केटप्लेस वाहतूक गरजांसाठी त्वरित उपाय प्रदान करते. विश्वसनीय वाहकांसह काम केल्याने तुमच्या वस्तूंच्या सुरक्षित संक्रमणाची खात्री होते.",
        "मूळ, गंतव्य आणि वाहनाचा प्रकार यानुसार सूची फिल्टर करा. आमची मेसेजिंग सिस्टीम शिपर्स आणि वाहकांना थेट जोडते - कोणतेही दलाल आणि छुप्या शुल्काशिवाय."
      ]
    }
  },
  "ka": {
    "home": {
      "title": "Loadly: გლობალური ლოგისტიკისა და სატვირთო ბაზრის პლატფორმა",
      "paragraphs": [
        "Loadly არის ინოვაციური ლოგისტიკური და სატრანსპორტო პლატფორმა, რომელიც აკავშირებს გამგზავნებს სანდო გადამზიდავებთან მთელ მსოფლიოში. ჩვენი მისიაა ხელი შევუწყოთ ტვირთის სწრაფ, უსაფრთხო და ეკონომიურ ტრანსპორტირებას.",
        "ტრადიციული ექსპედიტორებისგან განსხვავებით, Loadly გაძლევთ საშუალებას გამოაქვეყნოთ თქვენი ტვირთი წამებში და დაუყოვნებლივ მიიღოთ კონკურენტუნარიანი შეთავაზებები. ჩვენი მიზანია შევამციროთ ცარიელი გარბენი და ტრანსპორტირების ხარჯები.",
        "გჭირდებათ LTL თუ FTL გადაზიდვა, ჩვენს პლატფორმაზე იპოვით სრულყოფილ ლოგისტიკურ გადაწყვეტას. გადამზიდავებისთვის ჩვენ გთავაზობთ ბიზნესის მოცულობის გაზრდის შესაძლებლობას ათასობით ყოველდღიურად განახლებადი ტვირთის დაფის საშუალებით.",
        "შემოუერთდით ციფრულ ლოგისტიკურ რევოლუციას Loadly-ზე უფასოდ დარეგისტრირებით. მართეთ მთელი გადაზიდვის პროცესი ერთი ადგილიდან."
      ]
    },
    "marketplace": {
      "title": "სანდო სატვირთო დაფები და ლოგისტიკური შესაძლებლობები",
      "paragraphs": [
        "ჩვენი ლოგისტიკური ბაზარი აერთიანებს განახლებულ ტვირთებსა და სატვირთო მარშრუტებს მთელს მსოფლიოში ერთ ცენტრალიზებულ ჰაბში. ეს იდეალური პლატფორმაა გადამზიდავებისთვის ევროპასა და ახლო აღმოსავლეთში.",
        "ტვირთის პუბლიკაციები მოიცავს ყველა აუცილებელ დეტალს, როგორიცაა ტონაჟი, სატვირთოს ტიპი, მიწოდების თარიღები და მარშრუტის სპეციფიკა. ეს გამჭვირვალობა საშუალებას აძლევს გადამზიდავებს აირჩიონ საუკეთესო სამუშაოები.",
        "გამგზავნებისთვის ეს ბაზარი უზრუნველყოფს ტრანსპორტირების საჭიროებების მყისიერ გადაწყვეტილებებს. სანდო გადამზიდავებთან მუშაობა უზრუნველყოფს თქვენი საქონლის უსაფრთხო ტრანზიტს.",
        "გაფილტრეთ განცხადებები წარმოშობის, დანიშნულების და მანქანის ტიპის მიხედვით. ჩვენი შეტყობინებების სისტემა პირდაპირ აკავშირებს გამგზავნებსა და გადამზიდავებს - შუამავლებისა და ფარული გადასახადების გარეშე."
      ]
    }
  },
  "lt": {
    "home": {
      "title": "Loadly: Globali logistikos ir krovinių pervežimo rinka",
      "paragraphs": [
        "Loadly yra inovatyvi logistikos ir transporto platforma, jungianti siuntėjus su patikimais vežėjais visame pasaulyje. Mūsų misija yra palengvinti greitą, saugų ir ekonomišką krovinių vežimą.",
        "Priešingai nei tradiciniai ekspeditoriai, Loadly leidžia jums paskelbti savo krovinius per kelias sekundes ir iškart gauti konkurencingus pasiūlymus. Mes siekiame pašalinti tuščius reisus ir sumažinti transportavimo išlaidas.",
        "Nesvarbu, ar jums reikia LTL, ar FTL siuntos, mūsų platformoje rasite tobulą logistikos sprendimą. Vežėjams siūlome galimybę padidinti verslo apimtis per tūkstančius kasdien atnaujinamų krovinių lentų.",
        "Prisijunkite prie skaitmeninės logistikos revoliucijos nemokamai užsiregistruodami Loadly. Skelbkite krovinius, gaukite pasiūlymus ir valdykite visą siuntimo procesą iš vienos vietos."
      ]
    },
    "marketplace": {
      "title": "Patikimos krovinių lentos ir logistikos galimybės",
      "paragraphs": [
        "Mūsų logistikos rinkoje viename centralizuotame centre pateikiami atnaujinti kroviniai ir sunkvežimių maršrutai visame pasaulyje. Tai ideali platforma vežėjams visoje Europoje ir Artimuosiuose Rytuose.",
        "Krovinių skelbimuose pateikiama visa svarbiausia informacija, pvz., tonažas, reikalingas sunkvežimio tipas, pristatymo datos ir maršruto specifika. Šis skaidrumas leidžia vežėjams pasirinkti geriausius darbus.",
        "Siuntėjams ši rinka suteikia neatidėliotinų sprendimų transporto poreikiams tenkinti. Darbas su patikimais vežėjais užtikrina saugų jūsų prekių tranzitą.",
        "Filtruokite skelbimus pagal kilmę, paskirties vietą ir transporto priemonės tipą. Mūsų pranešimų sistema tiesiogiai sujungia siuntėjus ir vežėjus – jokių tarpininkų ar paslėptų mokesčių."
      ]
    }
  },
  "lv": {
    "home": {
      "title": "Loadly: Globālā loģistikas un kravu tirgus platforma",
      "paragraphs": [
        "Loadly ir inovatīva loģistikas un transporta platforma, kas savieno nosūtītājus ar uzticamiem pārvadātājiem visā pasaulē. Mūsu misija ir atvieglot ātru, drošu un rentablu kravu pārvadājumus.",
        "Atšķirībā no tradicionālajiem ekspeditoriem, Loadly ļauj jums sekundēs ievietot savas kravas un nekavējoties saņemt konkurētspējīgus piedāvājumus. Mūsu mērķis ir likvidēt tukšos nobraukumus un samazināt transporta izmaksas.",
        "Neatkarīgi no tā, vai jums nepieciešams LTL vai FTL sūtījums, mūsu platformā atradīsiet ideālu loģistikas risinājumu. Pārvadātājiem mēs piedāvājam iespēju palielināt biznesa apjomu, izmantojot tūkstošiem ikdienas atjauninātu kravu dēļu.",
        "Pievienojieties digitālās loģistikas revolūcijai, bez maksas reģistrējoties Loadly. Pārvaldiet visu piegādes procesu no vienas vietas."
      ]
    },
    "marketplace": {
      "title": "Uzticami kravu dēļi un loģistikas iespējas",
      "paragraphs": [
        "Mūsu loģistikas tirgū vienā centralizētā centrā ir norādītas aktuālās kravas un kravas automašīnu maršruti visā pasaulē. Tas ir ideāls platforma pārvadātājiem visā Eiropā un Tuvajos Austrumos.",
        "Kravu sludinājumos ir iekļauta visa būtiskā informācija, piemēram, tonnāža, nepieciešamais kravas automašīnas tips, piegādes datumi un maršruta specifika. Šī pārredzamība ļauj pārvadātājiem izvēlēties labākos darbus.",
        "Nosūtītājiem šis tirgus nodrošina tūlītējus risinājumus transporta vajadzībām. Darbs ar uzticamiem pārvadātājiem nodrošina drošu preču tranzītu.",
        "Filtrējiet sludinājumus pēc izcelsmes, galamērķa un transportlīdzekļa tipa. Mūsu ziņojumapmaiņas sistēma tieši savieno nosūtītājus un pārvadātājus - bez starpniekiem un slēptām maksām."
      ]
    }
  },
  "et": {
    "home": {
      "title": "Loadly: Globaalne logistika ja kaubaveo turg",
      "paragraphs": [
        "Loadly on uuenduslik logistika- ja transpordiplatvorm, mis ühendab saatjad usaldusväärsete vedajatega kogu maailmas. Meie missioon on hõlbustada kiiret, turvalist ja kulutõhusat kaubavedu.",
        "Erinevalt traditsioonilisest ekspedeerimisest võimaldab Loadly teil postitada oma laadungi sekunditega ja saada koheselt konkurentsivõimelisi pakkumisi. Meie eesmärk on kaotada tühjad kilomeetrid ja vähendada transpordikulusid.",
        "Ükskõik, kas vajate LTL või FTL saadetist, leiate meie platvormilt täiusliku logistikalahenduse. Vedajatele pakume võimalust suurendada ärimahtu tuhandete igapäevaselt uuendatavate kaubatahvlite kaudu.",
        "Liituge digitaalse logistika revolutsiooniga, registreerudes Loadly's tasuta. Hallake kogu saatmisprotsessi ühest kohast."
      ]
    },
    "marketplace": {
      "title": "Usaldusväärsed kaubatahvlid ja logistikavõimalused",
      "paragraphs": [
        "Meie logistikaturg loetleb ühes tsentraliseeritud jaoturis ajakohased kaubalaadungid ja veoautomarsruudid kogu maailmas. See on ideaalne platvorm vedajatele kogu Euroopas ja Lähis-Idas.",
        "Kaubapostitused sisaldavad kõiki olulisi üksikasju, nagu tonnaaž, nõutav veoki tüüp, tarnekuupäevad ja marsruudi eripärad. See läbipaistvus võimaldab vedajatel valida parimad töökohad.",
        "Saatjatele pakub see turg koheseid lahendusi transpordivajadustele. Töö usaldusväärsete vedajatega tagab teie kaupade ohutu transiidi.",
        "Filtreerige kirjeid päritolu, sihtkoha ja sõiduki tüübi järgi. Meie sõnumisüsteem ühendab saatjad ja vedajad otse - ilma maaklerite ja varjatud tasudeta."
      ]
    }
  },
  "sl": {
    "home": {
      "title": "Loadly: Globalna logistična in tovorna platforma",
      "paragraphs": [
        "Loadly je inovativna logistična in transportna platforma, ki povezuje pošiljatelje z zanesljivimi prevozniki po vsem svetu. Naše poslanstvo je olajšati hiter, varen in stroškovno učinkovit prevoz tovora.",
        "V nasprotju s tradicionalnim špediterstvom vam Loadly omogoča, da svoj tovor objavite v nekaj sekundah in takoj prejmete konkurenčne ponudbe. Naš cilj je odpraviti prazne vožnje in zmanjšati stroške prevoza.",
        "Ne glede na to, ali potrebujete LTL ali FTL pošiljko, boste na naši platformi našli popolno logistično rešitev. Prevoznikom ponujamo priložnost za povečanje obsega poslovanja prek tisočih dnevno posodobljenih tovarnih desk.",
        "Pridružite se digitalni logistični revoluciji z brezplačno registracijo na Loadly. Upravljajte celoten postopek pošiljanja z enega mesta."
      ]
    },
    "marketplace": {
      "title": "Zanesljive tovorne deske in logistične priložnosti",
      "paragraphs": [
        "Naš logistični trg navaja posodobljene tovore in poti tovornjakov po vsem svetu v enem centraliziranem središču. To je idealna platforma za prevoznike po vsej Evropi in Bližnjem vzhodu.",
        "Objave o tovoru vključujejo vse bistvene podrobnosti, kot so tonaža, zahtevana vrsta tovornjaka, datumi dostave in posebnosti poti. Ta preglednost omogoča prevoznikom, da izberejo najboljša dela.",
        "Za pošiljatelje ta trg ponuja takojšnje rešitve za transportne potrebe. Delo z zanesljivimi prevozniki zagotavlja varen tranzit vašega blaga.",
        "Filtrirajte sezname po izvoru, cilju in vrsti vozila. Naš sistem za sporočanje neposredno povezuje pošiljatelje in prevoznike - brez posrednikov in skritih provizij."
      ]
    }
  }
};

const DEFAULT_LOCALE = 'en';

function getContent(locale: string, page: 'home' | 'marketplace') {
  return content[locale]?.[page] ?? content[DEFAULT_LOCALE][page];
}

export function SeoContent({ page, locale }: SeoContentProps) {
  const data = getContent(locale, page);

  return (
    <section className="py-16 px-4 bg-background-light dark:bg-background-dark border-t border-border-light dark:border-border-dark mt-10">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-fg mb-6 tracking-tight">
          {data.title}
        </h2>
        <div className="space-y-4 text-muted text-sm sm:text-base leading-relaxed">
          {data.paragraphs.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
