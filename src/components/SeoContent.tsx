import React from 'react';
import type { Locale } from '@/utils/translations';

interface SeoContentProps {
  page: 'home' | 'marketplace';
  locale: Locale;
}

const content: Record<string, Record<'home' | 'marketplace', { title: string; paragraphs: string[] }>> = {
  tr: {
    home: {
      title: 'YükLe – Türkiye\'nin Dijital Lojistik ve Nakliye Platformu',
      paragraphs: [
        'YükLe (Loadly), nakliyeciler ve yük sahiplerini bir araya getiren Türkiye\'nin yenilikçi lojistik ve taşımacılık platformudur. Amacımız, Türkiye\'nin dört bir yanına ve uluslararası rotalara hızlı, güvenilir ve ekonomik yük taşıma hizmeti sunulmasını sağlamaktır. Sistemimizde binlerce doğrulanmış nakliye firması, tır, kamyon ve kamyonet sahibi yer almaktadır.',
        'Geleneksel nakliye süreçlerinin aksine, Loadly platformunda yükünüzü saniyeler içinde ilan edebilir ve yüzlerce uygun araçtan anında teklif alabilirsiniz. Gelişmiş eşleştirme algoritmamız sayesinde boş dönen araçları engelleyerek karbon ayak izini azaltmayı ve taşıma maliyetlerini minimuma indirmeyi hedefliyoruz.',
        'İster parsiyel taşıma (LTL), ister tam kapasite (FTL) tır yükü olsun, lojistik ihtiyaçlarınıza en uygun çözümleri platformumuz üzerinden bulabilirsiniz. Nakliye firmaları için ise her gün sürekli güncellenen binlerce yük ilanı sayesinde iş hacmini artırma ve düzenli seferler planlama imkânı sunulmaktadır.',
        'Loadly üzerinden yurt içi ve uluslararası nakliye ilanları yayınlayabilir, güvenilir nakliyecilerle güvenle çalışabilirsiniz. Platforma ücretsiz üye olarak hemen yük ilanınızı oluşturun ve dijital lojistik devrimine katılın.',
      ],
    },
    marketplace: {
      title: 'Güvenilir Nakliye İlanları ve Lojistik Fırsatları',
      paragraphs: [
        'Lojistik pazaryerimiz, nakliyeciler ve tır şoförleri için Türkiye ve Avrupa genelindeki güncel yük ilanlarını tek bir noktada listelemektedir. Şehiriçi taşıma, şehirlerarası nakliyat veya uluslararası lojistik seferleri arayan tüm taşıyıcılar için ideal bir platformdur.',
        'Yük ilanları detaylarında tonaj, kullanılacak araç türü (Tente, Frigo, Açık Kasa vb.), teslimat tarihleri ve güzergah gibi tüm önemli nakliye detayları şeffaf bir şekilde yer alır. Böylece nakliyeciler kendi rotalarına ve araç kapasitelerine en uygun işleri seçerek sefer verimliliklerini artırırlar.',
        'Yük sahipleri açısından bu pazaryeri, nakliye ihtiyaçlarına anında çözüm bulan dijital bir ortamdır. Güvenilir ve profil puanları yüksek taşımacılar ile çalışarak yüklerinizin güvenle taşınmasını garanti altına alabilir, rekabetçi fiyat teklifleri arasından bütçenize en uygun olanı tercih edebilirsiniz.',
        'Hem Türkiye içi hem de uluslararası nakliye ilanlarını filtreleyerek anlık yük eşleştirmesi yapabilirsiniz. Platform üzerinden doğrudan mesajlaşma ve teklif sistemi sayesinde aracısız, hızlı ve ekonomik nakliye çözümlerine ulaşın.',
      ],
    },
  },
  en: {
    home: {
      title: 'Loadly: Global Logistics & Freight Marketplace Platform',
      paragraphs: [
        'Loadly is an innovative logistics and transportation platform connecting shippers with reliable carriers worldwide. Our mission is to facilitate fast, secure, and cost-effective freight transport across domestic and international routes. We host thousands of verified logistics companies, truck owners, and drivers ready to move your cargo.',
        'Unlike traditional freight forwarding, Loadly allows you to post your loads in seconds and instantly receive competitive quotes from available vehicles. With our advanced load-matching algorithms, we aim to eliminate empty miles, reduce carbon footprints, and minimize overall transportation costs for businesses of all sizes.',
        'Whether you need Less Than Truckload (LTL) or Full Truckload (FTL) shipping, you can find the perfect logistics solution on our platform. For carriers, we offer the opportunity to increase business volume and plan regular routes through thousands of daily updated load boards.',
        'Join the digital logistics revolution by registering for free on Loadly. Post loads, receive offers, message carriers, and manage your entire shipping workflow in one place — accessible from any device, anytime.',
      ],
    },
    marketplace: {
      title: 'Reliable Freight Boards and Logistics Opportunities Worldwide',
      paragraphs: [
        'Our logistics marketplace lists up-to-date freight loads and truck routes across the globe in one centralized hub. It is the ideal platform for carriers looking for local deliveries, interstate transport, or international logistics assignments across Europe, the Middle East, and beyond.',
        'Load postings include all essential freight details such as tonnage, required truck type (Dry Van, Reefer, Flatbed, etc.), delivery dates, and route specifics. This transparency allows carriers to choose jobs that best fit their current routes and vehicle capacities, maximizing their operational efficiency.',
        'For shippers, this marketplace is a digital environment providing instant solutions to transport needs. By working with reliable carriers who maintain high profile ratings, you ensure the safe transit of your goods while taking advantage of competitive bidding from a wide network of verified professionals.',
        'Filter listings by origin, destination, vehicle type, and cargo weight to find the perfect match in seconds. Our real-time messaging system connects shippers and carriers directly — no brokers, no hidden fees, just efficient freight matching.',
      ],
    },
  },
  de: {
    home: {
      title: 'Loadly: Globale Logistik- und Frachtplattform',
      paragraphs: [
        'Loadly ist eine innovative Logistik- und Transportplattform, die Verlader mit zuverlässigen Spediteuren weltweit verbindet. Unsere Mission ist es, schnelle, sichere und kostengünstige Frachttransporte auf nationalen und internationalen Strecken zu ermöglichen.',
        'Mit Loadly können Sie Ihre Fracht in Sekunden aufgeben und sofort wettbewerbsfähige Angebote von verfügbaren Fahrzeugen erhalten. Unsere fortschrittlichen Algorithmen minimieren Leerfahrten und senken Transportkosten für Unternehmen jeder Größe.',
        'Ob Teilladung (LTL) oder Komplettladung (FTL) – auf unserer Plattform finden Sie die passende Logistiklösung. Registrieren Sie sich kostenlos und starten Sie noch heute.',
        'Verlader und Spediteure nutzen Loadly täglich für transparente, effiziente und günstige Frachtvermittlung — ohne Makler und ohne versteckte Gebühren.',
      ],
    },
    marketplace: {
      title: 'Aktuelle Frachtbörse und Logistikangebote',
      paragraphs: [
        'Unser Logistik-Marktplatz listet tagesaktuelle Frachten und LKW-Routen weltweit auf einem zentralen Hub. Ideal für Spediteure, die lokale, nationale oder internationale Transportaufträge suchen.',
        'Frachtangebote enthalten alle wichtigen Details wie Tonnage, Fahrzeugtyp, Liefertermine und Routeninfos — vollständig transparent für schnelle Entscheidungen.',
        'Für Verlader bietet dieser Marktplatz sofortige Lösungen für Transportbedürfnisse mit verifizierten Spediteuren und wettbewerbsfähigen Preisangeboten.',
        'Filtern Sie nach Abgangsort, Zielort und Fahrzeugtyp — und verbinden Sie sich direkt mit Spediteuren ohne Zwischenhändler.',
      ],
    },
  },
  fr: {
    home: {
      title: 'Loadly : Plateforme Mondiale de Logistique et Fret',
      paragraphs: [
        'Loadly est une plateforme innovante de logistique et de transport qui met en relation les expéditeurs avec des transporteurs fiables dans le monde entier. Notre mission est de faciliter le transport de fret rapide, sécurisé et économique sur les routes nationales et internationales.',
        'Avec Loadly, publiez vos chargements en quelques secondes et recevez instantanément des offres compétitives de transporteurs disponibles. Nos algorithmes avancés éliminent les trajets à vide et réduisent les coûts de transport.',
        'Que vous ayez besoin d\'un transport partiel (LTL) ou d\'un chargement complet (FTL), trouvez la solution logistique idéale sur notre plateforme. Inscrivez-vous gratuitement dès aujourd\'hui.',
        'Expéditeurs et transporteurs utilisent Loadly quotidiennement pour une mise en relation transparente, efficace et sans intermédiaires — accessible depuis n\'importe quel appareil.',
      ],
    },
    marketplace: {
      title: 'Bourse de Fret Fiable et Opportunités Logistiques',
      paragraphs: [
        'Notre marketplace logistique répertorie les frets actuels et les routes de camions dans le monde entier en un seul hub centralisé — idéal pour les transporteurs cherchant des missions locales, nationales ou internationales.',
        'Les offres de fret incluent tous les détails essentiels : tonnage, type de véhicule, dates de livraison et spécificités de route, pour une transparence totale.',
        'Pour les expéditeurs, ce marketplace offre des solutions immédiates avec des transporteurs vérifiés et des offres compétitives pour sécuriser votre fret au meilleur prix.',
        'Filtrez par origine, destination et type de véhicule pour trouver la correspondance parfaite en quelques secondes, sans courtiers ni frais cachés.',
      ],
    },
  },
  es: {
    home: {
      title: 'Loadly: Plataforma Global de Logística y Carga',
      paragraphs: [
        'Loadly es una plataforma innovadora de logística y transporte que conecta a expedidores con transportistas confiables en todo el mundo. Nuestra misión es facilitar el transporte de carga rápido, seguro y rentable en rutas nacionales e internacionales.',
        'Con Loadly, publique sus cargas en segundos y reciba cotizaciones competitivas al instante. Nuestros algoritmos avanzados eliminan los viajes en vacío y reducen los costos de transporte.',
        'Ya sea transporte parcial (LTL) o carga completa (FTL), encuentre la solución logística perfecta en nuestra plataforma. Regístrese gratis y empiece hoy.',
        'Expedidores y transportistas usan Loadly diariamente para conectarse de forma transparente y eficiente — sin intermediarios ni tarifas ocultas.',
      ],
    },
    marketplace: {
      title: 'Bolsa de Carga Confiable y Oportunidades Logísticas',
      paragraphs: [
        'Nuestro marketplace logístico lista cargas actualizadas y rutas de camiones en todo el mundo en un hub centralizado — ideal para transportistas que buscan trabajos locales, nacionales o internacionales.',
        'Los anuncios de carga incluyen todos los detalles esenciales: tonelaje, tipo de vehículo, fechas de entrega y especificidades de ruta para una total transparencia.',
        'Para los expedidores, este marketplace ofrece soluciones inmediatas con transportistas verificados y ofertas competitivas para asegurar su carga al mejor precio.',
        'Filtre por origen, destino y tipo de vehículo para encontrar la coincidencia perfecta en segundos, sin intermediarios ni comisiones ocultas.',
      ],
    },
  },
  pt: {
    home: {
      title: 'Loadly: Plataforma Global de Logística e Frete',
      paragraphs: [
        'Loadly é uma plataforma inovadora de logística e transporte que conecta embarcadores com transportadores confiáveis em todo o mundo. Nossa missão é facilitar o transporte de carga rápido, seguro e econômico em rotas nacionais e internacionais.',
        'Com o Loadly, publique suas cargas em segundos e receba cotações competitivas instantaneamente. Nossos algoritmos avançados eliminam viagens vazias e reduzem os custos de transporte.',
        'Seja transporte parcial (LTL) ou carga completa (FTL), encontre a solução logística perfeita em nossa plataforma. Cadastre-se gratuitamente e comece hoje.',
        'Embarcadores e transportadores usam o Loadly diariamente para se conectar de forma transparente e eficiente — sem intermediários nem taxas ocultas.',
      ],
    },
    marketplace: {
      title: 'Bolsa de Fretes Confiável e Oportunidades Logísticas',
      paragraphs: [
        'Nosso marketplace logístico lista fretes atualizados e rotas de caminhões em todo o mundo em um hub centralizado — ideal para transportadores que buscam trabalhos locais, nacionais ou internacionais.',
        'Os anúncios de carga incluem todos os detalhes essenciais: tonelagem, tipo de veículo, datas de entrega e especificidades de rota para total transparência.',
        'Para embarcadores, este marketplace oferece soluções imediatas com transportadores verificados e ofertas competitivas para garantir sua carga pelo melhor preço.',
        'Filtre por origem, destino e tipo de veículo para encontrar a combinação perfeita em segundos, sem corretores nem comissões ocultas.',
      ],
    },
  },
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
