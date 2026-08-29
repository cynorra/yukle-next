import React from 'react';
import type { Locale } from '@/utils/translations';

interface SeoContentProps {
  page: 'home' | 'marketplace';
  locale: Locale;
}

const content: Record<string, Record<'home' | 'marketplace', { title: string; paragraphs: string[] }>> = {
  "tr": {
    "home": {
      "title": "Loadly: Küresel Lojistik ve Nakliye Bilgi Platformu",
      "paragraphs": [
        "Loadly, dünya çapındaki yük sahipleri, nakliyeciler ve lojistik profesyonelleri için 55 dilde pratik rehberler, güzergah analizleri ve sektör içerikleri yayınlayan bir platformdur.",
        "İster parsiyel (LTL) ister komple (FTL) taşımacılık araştırıyor olun, ister nakliye maliyetleri veya mevzuat gereksinimleri hakkında bilgi arıyor olun, düzenli olarak yayınlanan makalelerimiz bilinçli lojistik kararları almanıza yardımcı olmak için yazılıp editörden geçirilir."
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
      "title": "Loadly: Global Logistics & Freight Insights Platform",
      "paragraphs": [
        "Loadly is a logistics and freight content platform, publishing practical guides, route insights, and industry analysis in 55 languages for shippers, carriers, and logistics professionals worldwide.",
        "Whether you're researching Less Than Truckload (LTL) or Full Truckload (FTL) shipping, freight costs, or regulatory requirements, our regularly published articles are written and reviewed to help you make informed logistics decisions."
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
      "title": "Loadly: Globale Logistik- und Frachtinformationsplattform",
      "paragraphs": [
        "Loadly ist eine Content-Plattform für Logistik und Fracht, die praktische Leitfäden, Streckeninformationen und Branchenanalysen in 55 Sprachen für Verlader, Spediteure und Logistikfachleute weltweit veröffentlicht.",
        "Ob Sie sich über Teilladung (LTL) oder Komplettladung (FTL), Frachtkosten oder gesetzliche Anforderungen informieren möchten — unsere regelmäßig veröffentlichten Artikel werden geschrieben und geprüft, um Ihnen fundierte Logistikentscheidungen zu ermöglichen."
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
      "title": "Loadly : Plateforme Mondiale d'Information Logistique et Fret",
      "paragraphs": [
        "Loadly est une plateforme de contenu logistique et de fret, publiant des guides pratiques, des analyses d'itinéraires et des analyses sectorielles en 55 langues pour les chargeurs, transporteurs et professionnels de la logistique du monde entier.",
        "Que vous recherchiez des informations sur le transport en groupage (LTL) ou en charge complète (FTL), les coûts de fret ou les exigences réglementaires, nos articles publiés régulièrement sont rédigés et révisés pour vous aider à prendre des décisions logistiques éclairées."
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
      "title": "Loadly: Plataforma Global de Información Logística y de Carga",
      "paragraphs": [
        "Loadly es una plataforma de contenido sobre logística y transporte de carga que publica guías prácticas, análisis de rutas y estudios del sector en 55 idiomas para cargadores, transportistas y profesionales de la logística de todo el mundo.",
        "Ya sea que esté investigando sobre transporte de carga parcial (LTL) o completa (FTL), costos de flete o requisitos normativos, nuestros artículos publicados regularmente están escritos y revisados para ayudarle a tomar decisiones logísticas informadas."
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
      "title": "Loadly: Plataforma Global de Informações sobre Logística e Frete",
      "paragraphs": [
        "A Loadly é uma plataforma de conteúdo sobre logística e frete que publica guias práticos, análises de rotas e estudos do setor em 55 idiomas para expedidores, transportadoras e profissionais de logística em todo o mundo.",
        "Esteja você pesquisando sobre transporte fracionado (LTL) ou carga completa (FTL), custos de frete ou exigências regulatórias, nossos artigos publicados regularmente são escritos e revisados para ajudá-lo a tomar decisões logísticas informadas."
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
      "title": "Loadly: Piattaforma Globale di Informazioni su Logistica e Trasporto Merci",
      "paragraphs": [
        "Loadly è una piattaforma di contenuti su logistica e trasporto merci che pubblica guide pratiche, analisi di percorsi e approfondimenti di settore in 55 lingue per spedizionieri, vettori e professionisti della logistica in tutto il mondo.",
        "Che stiate cercando informazioni sul trasporto parziale (LTL) o completo (FTL), sui costi di trasporto o sui requisiti normativi, i nostri articoli pubblicati regolarmente sono scritti e revisionati per aiutarvi a prendere decisioni logistiche informate."
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
      "title": "Loadly: Globalna Platforma Wiedzy o Logistyce i Transporcie",
      "paragraphs": [
        "Loadly to platforma treści z zakresu logistyki i transportu towarów, publikująca praktyczne poradniki, analizy tras i analizy branżowe w 55 językach dla nadawców, przewoźników i specjalistów logistyki na całym świecie.",
        "Niezależnie od tego, czy szukasz informacji o transporcie drobnicowym (LTL), całopojazdowym (FTL), kosztach transportu czy wymogach regulacyjnych, nasze regularnie publikowane artykuły są pisane i weryfikowane, aby pomóc Ci podejmować świadome decyzje logistyczne."
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
      "title": "Loadly: Wereldwijd Platform voor Logistieke en Vrachtinformatie",
      "paragraphs": [
        "Loadly is een contentplatform voor logistiek en vracht dat praktische gidsen, route-inzichten en brancheanalyses publiceert in 55 talen voor verladers, vervoerders en logistieke professionals wereldwijd.",
        "Of u nu informatie zoekt over deelladingen (LTL) of volle ladingen (FTL), vrachtkosten of wettelijke vereisten, onze regelmatig gepubliceerde artikelen worden geschreven en beoordeeld om u te helpen weloverwogen logistieke beslissingen te nemen."
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
      "title": "Loadly: Глобальная Платформа Логистической и Грузовой Информации",
      "paragraphs": [
        "Loadly — это контент-платформа о логистике и грузоперевозках, публикующая практические руководства, обзоры маршрутов и отраслевую аналитику на 55 языках для грузоотправителей, перевозчиков и специалистов по логистике по всему миру.",
        "Ищете ли вы информацию о сборных грузах (LTL) или полной загрузке (FTL), стоимости перевозок или нормативных требованиях — наши регулярно публикуемые статьи пишутся и проверяются, чтобы помочь вам принимать взвешенные логистические решения."
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
      "title": "Loadly: Глобальна Платформа Логістичної та Вантажної Інформації",
      "paragraphs": [
        "Loadly — це контент-платформа про логістику та вантажні перевезення, яка публікує практичні посібники, огляди маршрутів та галузеву аналітику 55 мовами для вантажовідправників, перевізників та фахівців з логістики по всьому світу.",
        "Чи шукаєте ви інформацію про збірні вантажі (LTL), повне завантаження (FTL), вартість перевезень чи нормативні вимоги — наші регулярно публіковані статті пишуться та перевіряються, щоб допомогти вам приймати обґрунтовані логістичні рішення."
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
      "title": "Loadly：全球物流与货运资讯平台",
      "paragraphs": [
        "Loadly 是一个物流与货运内容平台，以55种语言为全球的货主、承运商和物流专业人士发布实用指南、路线洞察和行业分析。",
        "无论您是在研究零担运输（LTL）还是整车运输（FTL）、运费成本还是法规要求，我们定期发布的文章都经过撰写和审核，以帮助您做出明智的物流决策。"
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
      "title": "Loadly：グローバル物流・貨物インサイトプラットフォーム",
      "paragraphs": [
        "Loadlyは、世界中の荷主、運送業者、物流の専門家に向けて、実用的なガイド、ルート分析、業界分析を55言語で発信する物流・貨物コンテンツプラットフォームです。",
        "混載輸送（LTL）や貸切輸送（FTL）、運賃、法規制要件について調べている方に向けて、定期的に公開される記事は執筆・レビューを経て、的確な物流判断をサポートします。"
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
      "title": "Loadly: वैश्विक लॉजिस्टिक्स और फ्रेट जानकारी मंच",
      "paragraphs": [
        "Loadly एक लॉजिस्टिक्स और फ्रेट कंटेंट प्लेटफ़ॉर्म है, जो दुनिया भर के शिपर्स, कैरियर्स और लॉजिस्टिक्स पेशेवरों के लिए 55 भाषाओं में व्यावहारिक गाइड, रूट जानकारी और उद्योग विश्लेषण प्रकाशित करता है।",
        "चाहे आप लेस दैन ट्रकलोड (LTL) या फुल ट्रकलोड (FTL) शिपिंग, माल ढुलाई लागत, या नियामक आवश्यकताओं पर शोध कर रहे हों, हमारे नियमित रूप से प्रकाशित लेख सूचित लॉजिस्टिक्स निर्णय लेने में आपकी मदद के लिए लिखे और समीक्षा किए जाते हैं।"
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
      "title": "Loadly: منصة عالمية لمعلومات اللوجستيات والشحن",
      "paragraphs": [
        "Loadly هي منصة محتوى متخصصة في اللوجستيات والشحن، تنشر أدلة عملية وتحليلات للطرق ودراسات صناعية بـ 55 لغة لأصحاب البضائع والناقلين ومحترفي اللوجستيات حول العالم.",
        "سواء كنت تبحث عن الشحن الجزئي (LTL) أو الشحن الكامل (FTL) أو تكاليف الشحن أو المتطلبات التنظيمية، فإن مقالاتنا التي تُنشر بانتظام مكتوبة ومُراجعة لمساعدتك على اتخاذ قرارات لوجستية مدروسة."
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
      "title": "Loadly: پلتفرم جهانی اطلاعات لجستیک و حمل‌ونقل",
      "paragraphs": [
        "Loadly یک پلتفرم محتوایی در زمینه لجستیک و حمل‌ونقل بار است که راهنماهای کاربردی، تحلیل مسیرها و تحلیل‌های صنعتی را به ۵۵ زبان برای صاحبان بار، شرکت‌های حمل‌ونقل و متخصصان لجستیک در سراسر جهان منتشر می‌کند.",
        "چه به‌دنبال اطلاعاتی درباره حمل جزئی (LTL) یا حمل کامل (FTL)، هزینه‌های حمل‌ونقل یا الزامات قانونی باشید، مقالات ما که به‌طور منظم منتشر می‌شوند نوشته و بازبینی می‌شوند تا به شما در تصمیم‌گیری آگاهانه لجستیکی کمک کنند."
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
      "title": "Loadly: 글로벌 물류 및 화물 정보 플랫폼",
      "paragraphs": [
        "Loadly는 전 세계 화주, 운송업체, 물류 전문가를 위해 55개 언어로 실용적인 가이드, 경로 분석, 업계 분석을 게시하는 물류 및 화물 콘텐츠 플랫폼입니다.",
        "부분 적재(LTL)든 전체 적재(FTL)든, 운임 비용이든 규제 요건이든, 정기적으로 게시되는 저희 기사는 현명한 물류 결정을 내리는 데 도움이 되도록 작성 및 검토됩니다."
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
      "title": "Loadly: Nền Tảng Thông Tin Logistics & Vận Tải Toàn Cầu",
      "paragraphs": [
        "Loadly là nền tảng nội dung về logistics và vận tải hàng hóa, xuất bản các hướng dẫn thực tế, thông tin tuyến đường và phân tích ngành bằng 55 ngôn ngữ dành cho chủ hàng, đơn vị vận chuyển và chuyên gia logistics trên toàn thế giới.",
        "Dù bạn đang tìm hiểu về vận chuyển hàng lẻ (LTL) hay nguyên xe (FTL), chi phí vận chuyển hay các yêu cầu pháp lý, các bài viết được xuất bản định kỳ của chúng tôi đều được biên soạn và kiểm duyệt để giúp bạn đưa ra quyết định logistics sáng suốt."
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
      "title": "Loadly: Platform Wawasan Logistik & Kargo Global",
      "paragraphs": [
        "Loadly adalah platform konten logistik dan kargo yang menerbitkan panduan praktis, wawasan rute, dan analisis industri dalam 55 bahasa untuk pengirim, pengangkut, dan profesional logistik di seluruh dunia.",
        "Baik Anda mencari informasi tentang pengiriman LTL (Less Than Truckload) atau FTL (Full Truckload), biaya kargo, atau persyaratan regulasi, artikel kami yang diterbitkan secara rutin ditulis dan ditinjau untuk membantu Anda membuat keputusan logistik yang tepat."
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
      "title": "Loadly: বৈশ্বিক লজিস্টিক ও ফ্রেট তথ্য প্ল্যাটফর্ম",
      "paragraphs": [
        "Loadly একটি লজিস্টিক ও ফ্রেট কনটেন্ট প্ল্যাটফর্ম, যা বিশ্বজুড়ে শিপার, বাহক এবং লজিস্টিক পেশাদারদের জন্য ৫৫টি ভাষায় ব্যবহারিক গাইড, রুট বিশ্লেষণ এবং শিল্প বিশ্লেষণ প্রকাশ করে।",
        "আপনি লেস দ্যান ট্রাকলোড (LTL) বা ফুল ট্রাকলোড (FTL) শিপিং, ফ্রেট খরচ, বা নিয়ন্ত্রক প্রয়োজনীয়তা নিয়ে গবেষণা করছেন কিনা, আমাদের নিয়মিত প্রকাশিত নিবন্ধগুলো আপনাকে সঠিক লজিস্টিক সিদ্ধান্ত নিতে সাহায্য করার জন্য লেখা ও পর্যালোচনা করা হয়।"
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
      "title": "Loadly: عالمی لاجسٹکس اور فریٹ معلوماتی پلیٹ فارم",
      "paragraphs": [
        "Loadly ایک لاجسٹکس اور فریٹ کنٹینٹ پلیٹ فارم ہے، جو دنیا بھر کے شپرز، کیریئرز اور لاجسٹکس ماہرین کے لیے 55 زبانوں میں عملی گائیڈز، روٹ کی معلومات اور صنعتی تجزیے شائع کرتا ہے۔",
        "چاہے آپ لیس دین ٹرک لوڈ (LTL) ہو یا فل ٹرک لوڈ (FTL) شپنگ، فریٹ کے اخراجات، یا ریگولیٹری تقاضوں کے بارے میں تحقیق کر رہے ہوں، ہمارے باقاعدگی سے شائع ہونے والے مضامین آپ کو باخبر لاجسٹکس فیصلے کرنے میں مدد کے لیے لکھے اور جانچے جاتے ہیں۔"
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
      "title": "Loadly: แพลตฟอร์มข้อมูลโลจิสติกส์และการขนส่งสินค้าระดับโลก",
      "paragraphs": [
        "Loadly คือแพลตฟอร์มเนื้อหาด้านโลจิสติกส์และการขนส่งสินค้า ที่เผยแพร่คู่มือปฏิบัติ ข้อมูลเส้นทาง และการวิเคราะห์อุตสาหกรรมใน 55 ภาษา สำหรับผู้ส่งสินค้า ผู้ขนส่ง และผู้เชี่ยวชาญด้านโลจิสติกส์ทั่วโลก",
        "ไม่ว่าคุณกำลังค้นคว้าเกี่ยวกับการขนส่งแบบ LTL หรือ FTL ค่าขนส่ง หรือข้อกำหนดด้านกฎระเบียบ บทความที่เราเผยแพร่เป็นประจำได้รับการเขียนและตรวจสอบเพื่อช่วยให้คุณตัดสินใจด้านโลจิสติกส์ได้อย่างมีข้อมูล"
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
      "title": "Loadly: Platform Wawasan Logistik & Kargo Global",
      "paragraphs": [
        "Loadly ialah platform kandungan logistik dan kargo yang menerbitkan panduan praktikal, maklumat laluan, dan analisis industri dalam 55 bahasa untuk penghantar, pengangkut, dan profesional logistik di seluruh dunia.",
        "Sama ada anda mengkaji penghantaran LTL (Less Than Truckload) atau FTL (Full Truckload), kos kargo, atau keperluan pengawalseliaan, artikel kami yang diterbitkan secara berkala ditulis dan disemak untuk membantu anda membuat keputusan logistik yang termaklum."
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
      "title": "Loadly: Pandaigdigang Platform ng Logistics at Freight Insights",
      "paragraphs": [
        "Ang Loadly ay isang logistics at freight content platform, na naglalathala ng praktikal na mga gabay, kaalaman sa ruta, at pagsusuri ng industriya sa 55 wika para sa mga shipper, carrier, at logistics professional sa buong mundo.",
        "Kung ikaw man ay nag-aaral tungkol sa Less Than Truckload (LTL) o Full Truckload (FTL) shipping, mga gastos sa freight, o mga kinakailangang regulasyon, ang aming regular na inilalathalang mga artikulo ay isinusulat at sinusuri upang matulungan kang gumawa ng matalinong desisyon sa logistics."
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
      "title": "Loadly: Platformă Globală de Informații Logistice și de Transport",
      "paragraphs": [
        "Loadly este o platformă de conținut despre logistică și transport de marfă, care publică ghiduri practice, informații despre rute și analize de industrie în 55 de limbi pentru expeditori, transportatori și profesioniști din logistică din întreaga lume.",
        "Fie că cercetați transportul parțial (LTL) sau complet (FTL), costurile de transport sau cerințele de reglementare, articolele noastre publicate periodic sunt scrise și verificate pentru a vă ajuta să luați decizii logistice informate."
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
      "title": "Loadly: Global Plattform för Logistik- och Fraktinformation",
      "paragraphs": [
        "Loadly är en innehållsplattform för logistik och frakt som publicerar praktiska guider, ruttinsikter och branschanalyser på 55 språk för avlastare, transportörer och logistikproffs världen över.",
        "Oavsett om du undersöker delgods (LTL) eller helgods (FTL), fraktkostnader eller regulatoriska krav, är våra regelbundet publicerade artiklar skrivna och granskade för att hjälpa dig fatta välgrundade logistikbeslut."
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
      "title": "Loadly: Globální Platforma pro Logistické a Přepravní Informace",
      "paragraphs": [
        "Loadly je obsahová platforma zaměřená na logistiku a nákladní dopravu, která publikuje praktické průvodce, přehledy tras a analýzy odvětví v 55 jazycích pro odesílatele, dopravce a logistické profesionály po celém světě.",
        "Ať už zkoumáte kusovou přepravu (LTL) nebo celokamionovou přepravu (FTL), náklady na dopravu nebo regulační požadavky, naše pravidelně publikované články jsou psány a kontrolovány, aby vám pomohly činit informovaná logistická rozhodnutí."
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
      "title": "Loadly: Globális Logisztikai és Fuvarozási Információs Platform",
      "paragraphs": [
        "A Loadly egy logisztikai és fuvarozási tartalomplatform, amely 55 nyelven közöl gyakorlati útmutatókat, útvonal-elemzéseket és iparági elemzéseket feladók, fuvarozók és logisztikai szakemberek számára világszerte.",
        "Akár részrakományos (LTL), akár teljes rakományos (FTL) fuvarozást, fuvarköltségeket vagy szabályozási követelményeket kutat, rendszeresen megjelenő cikkeinket úgy írjuk és ellenőrizzük, hogy segítsenek megalapozott logisztikai döntéseket hozni."
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
      "title": "Loadly: Παγκόσμια Πλατφόρμα Πληροφοριών Εφοδιαστικής και Μεταφορών",
      "paragraphs": [
        "Το Loadly είναι μια πλατφόρμα περιεχομένου εφοδιαστικής και μεταφορών, που δημοσιεύει πρακτικούς οδηγούς, πληροφορίες διαδρομών και κλαδικές αναλύσεις σε 55 γλώσσες για αποστολείς, μεταφορείς και επαγγελματίες εφοδιαστικής παγκοσμίως.",
        "Είτε ερευνάτε μεταφορές LTL είτε FTL, κόστη μεταφοράς ή κανονιστικές απαιτήσεις, τα τακτικά μας άρθρα γράφονται και ελέγχονται ώστε να σας βοηθούν να λαμβάνετε τεκμηριωμένες αποφάσεις εφοδιαστικής."
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
      "title": "Loadly: Qlobal Logistika və Yük Daşıma Məlumat Platforması",
      "paragraphs": [
        "Loadly dünya üzrə yük sahibləri, daşıyıcılar və logistika mütəxəssisləri üçün 55 dildə praktiki bələdçilər, marşrut analizləri və sənaye təhlilləri dərc edən logistika və yük daşıma kontent platformasıdır.",
        "İstər LTL (natamam yük), istər FTL (tam yük) daşınması, yük xərcləri və ya tənzimləyici tələblər haqqında araşdırma aparırsınızsa, mütəmadi dərc olunan məqalələrimiz məlumatlı logistika qərarları qəbul etməyinizə kömək etmək üçün yazılır və nəzərdən keçirilir."
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
      "title": "Loadly: Жаһандық Логистика және Жүк Тасымалы Ақпарат Платформасы",
      "paragraphs": [
        "Loadly — бүкіл әлем бойынша жүк жөнелтушілер, тасымалдаушылар және логистика мамандары үшін 55 тілде практикалық нұсқаулықтар, бағыттар туралы ақпарат және салалық талдаулар жариялайтын логистика және жүк тасымалы контент платформасы.",
        "LTL (жартылай жүк) немесе FTL (толық жүк) тасымалын, жүк тасымалы шығындарын немесе нормативтік талаптарды зерттеп жатсаңыз да, тұрақты түрде жарияланатын мақалаларымыз сізге негізделген логистикалық шешімдер қабылдауға көмектесу үшін жазылады және тексеріледі."
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
      "title": "Loadly: פלטפורמה גלובלית למידע לוגיסטי ומשלוחים",
      "paragraphs": [
        "Loadly היא פלטפורמת תוכן העוסקת בלוגיסטיקה ומשלוחים, המפרסמת מדריכים מעשיים, תובנות מסלול וניתוחי תעשייה ב-55 שפות עבור שולחי מטענים, מובילים ואנשי מקצוע בתחום הלוגיסטיקה ברחבי העולם.",
        "בין אם אתם חוקרים משלוחים חלקיים (LTL) או משלוחים מלאים (FTL), עלויות הובלה או דרישות רגולטוריות, המאמרים שלנו המתפרסמים באופן קבוע נכתבים ונבדקים כדי לעזור לכם לקבל החלטות לוגיסטיות מושכלות."
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
      "title": "Loadly: Глобална Платформа за Логистична и Транспортна Информация",
      "paragraphs": [
        "Loadly е платформа за съдържание в областта на логистиката и товарния транспорт, която публикува практически ръководства, анализи на маршрути и индустриални анализи на 55 езика за товародатели, превозвачи и логистични специалисти по целия свят.",
        "Независимо дали проучвате частичен (LTL) или пълен (FTL) превоз, транспортни разходи или регулаторни изисквания, редовно публикуваните ни статии се пишат и преглеждат, за да ви помогнат да вземате информирани логистични решения."
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
      "title": "Loadly: Globalna Platforma za Logističke i Prijevozničke Informacije",
      "paragraphs": [
        "Loadly je platforma za sadržaj o logistici i prijevozu tereta koja objavljuje praktične vodiče, uvide o rutama i analize industrije na 55 jezika za pošiljatelje, prijevoznike i logističke stručnjake diljem svijeta.",
        "Bez obzira istražujete li djelomični (LTL) ili puni (FTL) prijevoz, troškove prijevoza ili regulatorne zahtjeve, naši redovito objavljeni članci pišu se i pregledavaju kako bi vam pomogli donijeti informirane logističke odluke."
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
      "title": "Loadly: Globalna Platforma za Logističke i Transportne Informacije",
      "paragraphs": [
        "Loadly je platforma za sadržaj o logistici i transportu tereta koja objavljuje praktične vodiče, uvide o rutama i analize industrije na 55 jezika za pošiljaoce, prevoznike i logističke stručnjake širom sveta.",
        "Bilo da istražujete delimični (LTL) ili pun (FTL) prevoz, troškove transporta ili regulatorne zahteve, naši redovno objavljeni članci se pišu i pregledaju kako bi vam pomogli da donesete informisane logističke odluke."
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
      "title": "Loadly: Globálna Platforma pre Logistické a Prepravné Informácie",
      "paragraphs": [
        "Loadly je obsahová platforma zameraná na logistiku a prepravu nákladu, ktorá publikuje praktické návody, prehľady trás a analýzy odvetvia v 55 jazykoch pre odosielateľov, dopravcov a logistických profesionálov po celom svete.",
        "Či už skúmate čiastočnú (LTL) alebo celokamiónovú (FTL) prepravu, náklady na prepravu alebo regulačné požiadavky, naše pravidelne publikované články sú napísané a kontrolované, aby vám pomohli robiť informované logistické rozhodnutia."
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
      "title": "Loadly: Global Platform for Logistik- og Fragtinformation",
      "paragraphs": [
        "Loadly er en indholdsplatform for logistik og fragt, der udgiver praktiske guides, ruteindsigt og brancheanalyser på 55 sprog for afsendere, transportører og logistikprofessionelle verden over.",
        "Uanset om du undersøger delvis (LTL) eller fuld (FTL) fragt, fragtomkostninger eller lovkrav, er vores regelmæssigt udgivne artikler skrevet og gennemgået for at hjælpe dig med at træffe informerede logistikbeslutninger."
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
      "title": "Loadly: Maailmanlaajuinen Logistiikka- ja Rahtitiedon Alusta",
      "paragraphs": [
        "Loadly on logistiikkaan ja rahtiin keskittyvä sisältöalusta, joka julkaisee käytännön oppaita, reittitietoa ja toimiala-analyysejä 55 kielellä lähettäjille, rahdinkuljettajille ja logistiikka-ammattilaisille ympäri maailman.",
        "Tutkitpa sitten osakuormaa (LTL) tai täyttä kuormaa (FTL), rahtikustannuksia tai säädösvaatimuksia, säännöllisesti julkaistavat artikkelimme kirjoitetaan ja tarkistetaan auttaakseen sinua tekemään perusteltuja logistiikkapäätöksiä."
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
      "title": "Loadly: Global Plattform for Logistikk- og Fraktinformasjon",
      "paragraphs": [
        "Loadly er en innholdsplattform for logistikk og frakt som publiserer praktiske guider, ruteinnsikt og bransjeanalyser på 55 språk for avsendere, transportører og logistikkfagfolk over hele verden.",
        "Enten du undersøker delgods (LTL) eller helgods (FTL), fraktkostnader eller regelverkskrav, er våre jevnlig publiserte artikler skrevet og gjennomgått for å hjelpe deg med å ta informerte logistikkbeslutninger."
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
      "title": "Loadly: Global Logistika va Yuk Tashish Ma'lumot Platformasi",
      "paragraphs": [
        "Loadly — dunyo bo'ylab yuk jo'natuvchilar, tashuvchilar va logistika mutaxassislari uchun 55 tilda amaliy qo'llanmalar, marshrut tahlillari va soha tahlillarini nashr etuvchi logistika va yuk tashish kontent platformasidir.",
        "LTL (qisman yuk) yoki FTL (to'liq yuk) tashish, yuk tashish xarajatlari yoki me'yoriy talablar haqida tadqiqot olib borayotgan bo'lsangiz, muntazam nashr etiladigan maqolalarimiz sizga asosli logistika qarorlarini qabul qilishga yordam berish uchun yoziladi va ko'rib chiqiladi."
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
      "title": "Loadly: உலகளாவிய லாஜிஸ்டிக்ஸ் & சரக்கு தகவல் தளம்",
      "paragraphs": [
        "Loadly என்பது உலகெங்கிலும் உள்ள அனுப்புநர்கள், கேரியர்கள் மற்றும் லாஜிஸ்டிக்ஸ் நிபுணர்களுக்காக 55 மொழிகளில் நடைமுறை வழிகாட்டிகள், பாதை நுண்ணறிவு மற்றும் தொழில்துறை பகுப்பாய்வுகளை வெளியிடும் லாஜிஸ்டிக்ஸ் மற்றும் சரக்கு உள்ளடக்க தளமாகும்.",
        "நீங்கள் பகுதி சுமை (LTL) அல்லது முழு சுமை (FTL) போக்குவரத்து, சரக்கு செலவுகள் அல்லது ஒழுங்குமுறை தேவைகள் பற்றி ஆராய்ந்தாலும், தொடர்ந்து வெளியிடப்படும் எங்கள் கட்டுரைகள் தகவலறிந்த லாஜிஸ்டிக்ஸ் முடிவுகளை எடுக்க உதவும் வகையில் எழுதப்பட்டு மதிப்பாய்வு செய்யப்படுகின்றன."
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
      "title": "Loadly: जागतिक लॉजिस्टिक्स आणि माल वाहतूक माहिती व्यासपीठ",
      "paragraphs": [
        "Loadly हे जगभरातील प्रेषक, वाहतूकदार आणि लॉजिस्टिक्स व्यावसायिकांसाठी 55 भाषांमध्ये व्यावहारिक मार्गदर्शक, मार्ग अंतर्दृष्टी आणि उद्योग विश्लेषण प्रकाशित करणारे लॉजिस्टिक्स आणि माल वाहतूक सामग्री व्यासपीठ आहे.",
        "तुम्ही लेस दॅन ट्रकलोड (LTL) किंवा फुल ट्रकलोड (FTL) शिपिंग, माल वाहतूक खर्च किंवा नियामक आवश्यकतांबद्दल संशोधन करत असाल, आमचे नियमितपणे प्रकाशित होणारे लेख तुम्हाला माहितीपूर्ण लॉजिस्टिक्स निर्णय घेण्यास मदत करण्यासाठी लिहिले आणि पुनरावलोकन केले जातात."
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
      "title": "Loadly: გლობალური ლოგისტიკისა და ტვირთის ინფორმაციის პლატფორმა",
      "paragraphs": [
        "Loadly არის ლოგისტიკისა და ტვირთგადაზიდვის კონტენტ-პლატფორმა, რომელიც აქვეყნებს პრაქტიკულ სახელმძღვანელოებს, მარშრუტების ანალიზს და ინდუსტრიის ანალიზს 55 ენაზე მსოფლიოს მასშტაბით გამგზავნების, გადამზიდველებისა და ლოგისტიკის პროფესიონალებისთვის.",
        "მიუხედავად იმისა, იკვლევთ თუ არა LTL თუ FTL გადაზიდვას, ტვირთის ღირებულებას თუ მარეგულირებელ მოთხოვნებს, ჩვენი რეგულარულად გამოქვეყნებული სტატიები იწერება და მოწმდება იმისთვის, რომ დაგეხმაროთ ინფორმირებული ლოგისტიკური გადაწყვეტილებების მიღებაში."
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
      "title": "Loadly: Pasaulinė Logistikos ir Krovinių Informacijos Platforma",
      "paragraphs": [
        "Loadly yra logistikos ir krovinių turinio platforma, publikuojanti praktinius vadovus, maršrutų įžvalgas ir pramonės analizes 55 kalbomis siuntėjams, vežėjams ir logistikos specialistams visame pasaulyje.",
        "Nesvarbu, ar tyrinėjate dalinį (LTL), ar pilną (FTL) krovinių vežimą, transportavimo išlaidas ar reguliavimo reikalavimus, mūsų reguliariai skelbiami straipsniai rašomi ir peržiūrimi, kad padėtų priimti pagrįstus logistikos sprendimus."
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
      "title": "Loadly: Globāla Loģistikas un Kravu Informācijas Platforma",
      "paragraphs": [
        "Loadly ir loģistikas un kravu satura platforma, kas publicē praktiskus ceļvežus, maršrutu ieskatus un nozares analīzi 55 valodās nosūtītājiem, pārvadātājiem un loģistikas profesionāļiem visā pasaulē.",
        "Neatkarīgi no tā, vai pētāt daļēju (LTL) vai pilnu (FTL) kravu pārvadāšanu, transportēšanas izmaksas vai regulējošās prasības, mūsu regulāri publicētie raksti tiek rakstīti un pārskatīti, lai palīdzētu jums pieņemt pamatotus loģistikas lēmumus."
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
      "title": "Loadly: Globaalne Logistika ja Veoinfo Platvorm",
      "paragraphs": [
        "Loadly on logistika ja veose sisuplatvorm, mis avaldab praktilisi juhendeid, marsruudiülevaateid ja tööstusanalüüse 55 keeles saatjatele, vedajatele ja logistikaspetsialistidele üle kogu maailma.",
        "Olenemata sellest, kas uurite osalist (LTL) või täislastiga (FTL) vedu, veokulusid või regulatiivseid nõudeid, kirjutatakse ja vaadatakse meie regulaarselt avaldatavad artiklid üle, et aidata teil teha teadlikke logistikaotsuseid."
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
      "title": "Loadly: Globalna Platforma za Logistične in Prevozne Informacije",
      "paragraphs": [
        "Loadly je platforma za vsebine s področja logistike in tovornega prometa, ki v 55 jezikih objavlja praktične vodnike, vpoglede v poti in panožne analize za pošiljatelje, prevoznike in logistične strokovnjake po vsem svetu.",
        "Ne glede na to, ali raziskujete delni (LTL) ali polni (FTL) prevoz, stroške prevoza ali regulativne zahteve, so naši redno objavljeni članki napisani in pregledani, da vam pomagajo sprejemati informirane logistične odločitve."
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
