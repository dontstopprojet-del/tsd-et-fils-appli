import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import Logo from './Logo';
import { useRealtimeProjects } from '../hooks/useRealtimeSync';
import IntelligentChatbot from './IntelligentChatbot';

interface VisitorHomePageProps {
  darkMode?: boolean;
  lang?: 'fr' | 'en' | 'ar';
  onNavigateToServices?: () => void;
  onNavigateToDevis?: () => void;
  onNavigateToContact?: () => void;
  onNavigateToTrack?: () => void;
  onNavigateToLogin?: () => void;
  onToggleDarkMode?: () => void;
  onChangeLang?: (lang: 'fr' | 'en' | 'ar') => void;
}

interface PublicChantier {
  id: string;
  title: string;
  location: string;
  description: string;
  client_name: string;
  rating: number;
  photos_after: string[];
  status: string;
  created_at: string;
}

const VisitorHomePage: React.FC<VisitorHomePageProps> = ({
  darkMode = false,
  lang = 'fr',
  onNavigateToServices,
  onNavigateToDevis,
  onNavigateToContact,
  onNavigateToTrack,
  onNavigateToLogin,
  onToggleDarkMode,
  onChangeLang,
}) => {
  const [publicChantiers, setPublicChantiers] = useState<PublicChantier[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [showChatbot, setShowChatbot] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const fetchPublicChantiers = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('chantiers')
        .select('id, title, location, description, client_name, rating, photos_after, status, created_at')
        .eq('is_validated', true)
        .eq('is_public', true)
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
        .limit(8);

      if (error) throw error;
      setPublicChantiers(data || []);
    } catch (error) {
      console.error('Error fetching public chantiers:', error);
      setPublicChantiers([]);
    } finally {
      setLoadingProjects(false);
    }
  }, []);

  useEffect(() => {
    fetchPublicChantiers();
  }, [fetchPublicChantiers]);

  useRealtimeProjects(fetchPublicChantiers, 'is_validated=eq.true');

  const texts = {
    fr: {
      companyName: 'TSD & FILS',
      tagline: "L'EXPERTISE PROFESSIONNELLE EN PLOMBERIE SANITAIRE",
      heroTitle: 'L\'Excellence Européenne au Service de la Guinée',
      heroSubtitle: 'Plomberie professionnelle, installation sanitaire et chauffe-eau avec plus de 6 ans d\'expérience acquise en Belgique.',
      experience: '6+ ans d\'expérience',
      trained: 'Formé en Belgique',
      emergency: 'Urgences 24/7',
      callNow: 'Appeler maintenant',
      getQuote: 'Demander un devis',
      trackQuote: 'Suivre mon devis',
      phone: '+224 610 55 32 55',
      servicesTitle: 'Nos Services',
      servicesSubtitle: 'Des Solutions Complètes',
      servicesDescription: 'De l\'installation à la maintenance, nous couvrons tous vos besoins en plomberie et sanitaire.',
      service1Title: 'Plomberie Générale',
      service1Desc: 'Installation et réparation de tous systèmes de tuyauterie, robinetterie et évacuation avec des matériaux de qualité européenne.',
      service2Title: 'Installation Sanitaire',
      service2Desc: 'Création et rénovation de salles de bain complètes, installation de WC, lavabos, douches et baignoires.',
      service3Title: 'Chauffe-eau',
      service3Desc: 'Installation, entretien et dépannage de chauffe-eau électriques et à gaz. Service rapide et efficace.',
      service4Title: 'Rénovation',
      service4Desc: 'Mise aux normes de vos installations existantes avec les techniques et standards européens.',
      service5Title: 'Maintenance',
      service5Desc: 'Contrats d\'entretien régulier pour prévenir les pannes et prolonger la durée de vie de vos installations.',
      service6Title: 'Urgences 24/7',
      service6Desc: 'Service d\'intervention rapide pour toutes vos urgences : fuites, canalisations bouchées, pannes de chauffe-eau.',
      realisationsTitle: 'Nos Réalisations',
      realisationsSubtitle: 'Découvrez quelques-uns de nos projets récents',
      project1Title: 'Salle de Bain Moderne',
      project1Desc: 'Rénovation complète avec douche italienne et robinetterie haut de gamme',
      project2Title: 'Installation Sanitaire Complète',
      project2Desc: 'Installation de WC, lavabos et système de plomberie pour une villa',
      project3Title: 'Chauffe-eau Électrique',
      project3Desc: 'Installation et mise en service d\'un système de chauffe-eau 300L',
      project4Title: 'Plomberie Commerciale',
      project4Desc: 'Système de plomberie complet pour un immeuble commercial',
      whyTitle: 'Pourquoi Nous Choisir',
      whySubtitle: 'L\'Expertise qui Fait la Différence',
      whyDescription: 'Une formation européenne au service de la qualité en Guinée',
      stat1Title: 'Années d\'Expérience',
      stat1Desc: 'En Belgique avec les plus grandes entreprises',
      stat2Title: 'Projets Réalisés',
      stat2Desc: 'Réalisés avec succès en Belgique',
      stat3Title: 'Disponibilité',
      stat3Desc: 'Service d\'urgence disponible à tout moment',
      stat4Title: 'Déplacement',
      stat4Desc: 'Enville à Cimenterie: 120 000 GNF',
      ctaTitle: 'Besoin d\'un Plombier de Confiance ?',
      ctaDescription: 'Contactez-nous dès maintenant pour un devis gratuit et sans engagement. Notre équipe est prête à intervenir rapidement.',
      contact: 'Nous Contacter',
      viewServices: 'Voir les Services',
      clientSpace: 'Espace Client',
      faqTitle: 'Questions Fréquentes (FAQ)',
      faqSubtitle: 'Trouvez rapidement les réponses à vos questions',
      tipsTitle: '6 Conseils en Plomberie & Sanitaire',
      tipsSubtitle: 'Des astuces professionnelles pour votre maison',
      chatWithUs: 'Discuter avec nous',
    },
    en: {
      companyName: 'TSD & SONS',
      tagline: 'PROFESSIONAL EXPERTISE IN PLUMBING',
      heroTitle: 'European Excellence Serving Guinea',
      heroSubtitle: 'Professional plumbing, sanitary installation and water heaters with over 7 years of experience acquired in Belgium.',
      experience: '7+ years experience',
      trained: 'Trained in Belgium',
      emergency: 'Emergency 24/7',
      callNow: 'Call now',
      getQuote: 'Request a quote',
      trackQuote: 'Track my quote',
      phone: '+224 610 55 32 55',
      servicesTitle: 'Our Services',
      servicesSubtitle: 'Complete Solutions',
      servicesDescription: 'From installation to maintenance, we cover all your plumbing and sanitary needs.',
      service1Title: 'General Plumbing',
      service1Desc: 'Installation and repair of all piping, faucet and drainage systems with European quality materials.',
      service2Title: 'Sanitary Installation',
      service2Desc: 'Creation and renovation of complete bathrooms, installation of toilets, sinks, showers and bathtubs.',
      service3Title: 'Water Heaters',
      service3Desc: 'Installation, maintenance and repair of electric and gas water heaters. Fast and efficient service.',
      service4Title: 'Renovation',
      service4Desc: 'Bringing your existing installations up to standard with European techniques and standards.',
      service5Title: 'Maintenance',
      service5Desc: 'Regular maintenance contracts to prevent breakdowns and extend the life of your installations.',
      service6Title: 'Emergency 24/7',
      service6Desc: 'Rapid response service for all your emergencies: leaks, clogged pipes, water heater failures.',
      realisationsTitle: 'Our Achievements',
      realisationsSubtitle: 'Discover some of our recent projects',
      project1Title: 'Modern Bathroom',
      project1Desc: 'Complete renovation with walk-in shower and premium faucets',
      project2Title: 'Complete Sanitary Installation',
      project2Desc: 'Installation of toilets, sinks and plumbing system for a villa',
      project3Title: 'Electric Water Heater',
      project3Desc: 'Installation and commissioning of a 300L water heater system',
      project4Title: 'Commercial Plumbing',
      project4Desc: 'Complete plumbing system for a commercial building',
      whyTitle: 'Why Choose Us',
      whySubtitle: 'The Expertise That Makes the Difference',
      whyDescription: 'European training serving quality in Guinea',
      stat1Title: 'Years of Experience',
      stat1Desc: 'In Belgium with the largest companies',
      stat2Title: 'Projects Completed',
      stat2Desc: 'In Europe and Guinea',
      stat3Title: 'Availability',
      stat3Desc: 'Emergency service available at any time',
      stat4Title: 'Quote Fees',
      stat4Desc: 'Free personalized quote without commitment',
      ctaTitle: 'Need a Trusted Plumber?',
      ctaDescription: 'Contact us now for a free quote without commitment. Our team is ready to intervene quickly.',
      contact: 'Contact Us',
      viewServices: 'View Services',
      clientSpace: 'Client Area',
      faqTitle: 'Frequently Asked Questions (FAQ)',
      faqSubtitle: 'Find answers to your questions quickly',
      tipsTitle: '6 Plumbing & Sanitary Tips',
      tipsSubtitle: 'Professional tips for your home',
      chatWithUs: 'Chat with us',
    },
    ar: {
      companyName: 'تي إس دي وأولاده',
      tagline: 'الخبرة المهنية في السباكة الصحية',
      heroTitle: 'التميز الأوروبي في خدمة غينيا',
      heroSubtitle: 'سباكة احترافية، تركيب صحي وسخانات مياه مع أكثر من 7 سنوات من الخبرة المكتسبة في بلجيكا.',
      experience: 'أكثر من 7 سنوات خبرة',
      trained: 'تدريب في بلجيكا',
      emergency: 'طوارئ 24/7',
      callNow: 'اتصل الآن',
      getQuote: 'طلب عرض سعر',
      trackQuote: 'تتبع عرض السعر',
      phone: '+224 610 55 32 55',
      servicesTitle: 'خدماتنا',
      servicesSubtitle: 'حلول شاملة',
      servicesDescription: 'من التركيب إلى الصيانة، نغطي جميع احتياجاتك في السباكة والصحية.',
      service1Title: 'السباكة العامة',
      service1Desc: 'تركيب وإصلاح جميع أنظمة الأنابيب والصنابير والصرف بمواد ذات جودة أوروبية.',
      service2Title: 'التركيب الصحي',
      service2Desc: 'إنشاء وتجديد حمامات كاملة، تركيب مراحيض، أحواض، دشات وأحواض استحمام.',
      service3Title: 'سخانات المياه',
      service3Desc: 'تركيب وصيانة وإصلاح سخانات المياه الكهربائية والغازية. خدمة سريعة وفعالة.',
      service4Title: 'التجديد',
      service4Desc: 'تحديث تركيباتك الحالية وفقًا للمعايير والتقنيات الأوروبية.',
      service5Title: 'الصيانة',
      service5Desc: 'عقود صيانة دورية لمنع الأعطال وإطالة عمر تركيباتك.',
      service6Title: 'طوارئ 24/7',
      service6Desc: 'خدمة استجابة سريعة لجميع حالات الطوارئ: التسربات، الأنابيب المسدودة، أعطال السخانات.',
      realisationsTitle: 'إنجازاتنا',
      realisationsSubtitle: 'اكتشف بعض مشاريعنا الأخيرة',
      project1Title: 'حمام عصري',
      project1Desc: 'تجديد كامل مع دش إيطالي وصنابير فاخرة',
      project2Title: 'تركيب صحي كامل',
      project2Desc: 'تركيب مراحيض، أحواض ونظام سباكة لفيلا',
      project3Title: 'سخان مياه كهربائي',
      project3Desc: 'تركيب وتشغيل نظام سخان مياه 300 لتر',
      project4Title: 'سباكة تجارية',
      project4Desc: 'نظام سباكة كامل لمبنى تجاري',
      whyTitle: 'لماذا تختارنا',
      whySubtitle: 'الخبرة التي تصنع الفرق',
      whyDescription: 'تدريب أوروبي في خدمة الجودة في غينيا',
      stat1Title: 'سنوات من الخبرة',
      stat1Desc: 'في بلجيكا مع أكبر الشركات',
      stat2Title: 'مشاريع منجزة',
      stat2Desc: 'في أوروبا وغينيا',
      stat3Title: 'التوافر',
      stat3Desc: 'خدمة طوارئ متاحة في أي وقت',
      stat4Title: 'رسوم العرض',
      stat4Desc: 'عرض سعر مجاني بدون التزام',
      ctaTitle: 'هل تحتاج إلى سباك موثوق؟',
      ctaDescription: 'اتصل بنا الآن للحصول على عرض سعر مجاني وبدون التزام. فريقنا جاهز للتدخل بسرعة.',
      contact: 'اتصل بنا',
      viewServices: 'عرض الخدمات',
      clientSpace: 'مساحة العميل',
      faqTitle: 'الأسئلة الشائعة',
      faqSubtitle: 'ابحث بسرعة عن إجابات لأسئلتك',
      tipsTitle: '6 نصائح في السباكة والصحية',
      tipsSubtitle: 'نصائح احترافية لمنزلك',
      chatWithUs: 'تحدث معنا',
    },
  };

  const t = texts[lang];

  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    background: darkMode
      ? 'linear-gradient(135deg, #0a1929 0%, #1a2332 100%)'
      : 'linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  };

  const headerStyle: React.CSSProperties = {
    background: darkMode ? '#1e293b' : '#FFFFFF',
    padding: '16px 20px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  };

  const navStyle: React.CSSProperties = {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
    flexWrap: 'wrap',
  };

  const navLinkStyle: React.CSSProperties = {
    color: darkMode ? '#e2e8f0' : '#334155',
    textDecoration: 'none',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'color 0.3s ease',
  };

  const heroStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '80px 20px 16px',
    maxWidth: '1200px',
    margin: '0 auto',
  };

  const heroTitleStyle: React.CSSProperties = {
    fontSize: '56px',
    fontWeight: '800',
    marginBottom: '24px',
    color: darkMode ? '#00e5ff' : '#006064',
    lineHeight: '1.2',
  };

  const heroSubtitleStyle: React.CSSProperties = {
    fontSize: '20px',
    color: darkMode ? '#94a3b8' : '#64748b',
    marginBottom: '32px',
    lineHeight: '1.6',
    maxWidth: '800px',
    margin: '0 auto 40px auto',
  };

  const badgesStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginBottom: '40px',
    flexWrap: 'wrap',
  };

  const badgeStyle: React.CSSProperties = {
    padding: '12px 24px',
    borderRadius: '50px',
    background: darkMode ? '#006064' : '#00acc1',
    color: '#FFFFFF',
    fontSize: '14px',
    fontWeight: '600',
  };

  const buttonsStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    gap: '16px',
    flexWrap: 'wrap',
  };

  const primaryButtonStyle: React.CSSProperties = {
    padding: '16px 32px',
    borderRadius: '12px',
    background: darkMode
      ? 'linear-gradient(135deg, #00838f, #00acc1)'
      : 'linear-gradient(135deg, #006064, #00838f)',
    color: '#FFFFFF',
    fontSize: '16px',
    fontWeight: '700',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  };

  const secondaryButtonStyle: React.CSSProperties = {
    padding: '16px 32px',
    borderRadius: '12px',
    background: 'transparent',
    color: darkMode ? '#00e5ff' : '#006064',
    fontSize: '16px',
    fontWeight: '700',
    border: `2px solid ${darkMode ? '#00838f' : '#00acc1'}`,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  };

  const sectionStyle: React.CSSProperties = {
    padding: '80px 20px',
    maxWidth: '1200px',
    margin: '0 auto',
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: '40px',
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: '16px',
    color: darkMode ? '#f1f5f9' : '#0f172a',
  };

  const sectionSubtitleStyle: React.CSSProperties = {
    fontSize: '18px',
    textAlign: 'center',
    marginBottom: '60px',
    color: darkMode ? '#94a3b8' : '#64748b',
  };

  const servicesGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '30px',
  };

  const serviceCardStyle: React.CSSProperties = {
    background: darkMode ? '#1e293b' : '#FFFFFF',
    padding: '40px',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    transition: 'all 0.3s ease',
  };

  const serviceIconStyle: React.CSSProperties = {
    fontSize: '48px',
    marginBottom: '20px',
  };

  const serviceTitleStyle: React.CSSProperties = {
    fontSize: '22px',
    fontWeight: '700',
    marginBottom: '12px',
    color: darkMode ? '#f1f5f9' : '#0f172a',
  };

  const serviceDescStyle: React.CSSProperties = {
    fontSize: '15px',
    lineHeight: '1.7',
    color: darkMode ? '#94a3b8' : '#64748b',
  };

  const statsGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '40px',
    marginTop: '60px',
  };

  const statCardStyle: React.CSSProperties = {
    textAlign: 'center',
  };

  const statNumberStyle: React.CSSProperties = {
    fontSize: '56px',
    fontWeight: '800',
    background: darkMode
      ? 'linear-gradient(135deg, #00bcd4, #00e5ff)'
      : 'linear-gradient(135deg, #006064, #00838f)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '8px',
  };

  const statTitleStyle: React.CSSProperties = {
    fontSize: '20px',
    fontWeight: '700',
    marginBottom: '8px',
    color: darkMode ? '#f1f5f9' : '#0f172a',
  };

  const statDescStyle: React.CSSProperties = {
    fontSize: '14px',
    color: darkMode ? '#94a3b8' : '#64748b',
  };

  const ctaSectionStyle: React.CSSProperties = {
    background: darkMode
      ? 'linear-gradient(135deg, #006064, #00838f)'
      : 'linear-gradient(135deg, #00838f, #00acc1)',
    padding: '80px 20px',
    textAlign: 'center',
    color: '#FFFFFF',
  };

  const ctaTitleStyle: React.CSSProperties = {
    fontSize: '40px',
    fontWeight: '800',
    marginBottom: '20px',
  };

  const ctaDescStyle: React.CSSProperties = {
    fontSize: '18px',
    marginBottom: '40px',
    maxWidth: '700px',
    margin: '0 auto 40px auto',
    lineHeight: '1.6',
  };

  const services = [
    { icon: '🔧', title: t.service1Title, desc: t.service1Desc },
    { icon: '🚿', title: t.service2Title, desc: t.service2Desc },
    { icon: '🌡️', title: t.service3Title, desc: t.service3Desc },
    { icon: '🔨', title: t.service4Title, desc: t.service4Desc },
    { icon: '🛠️', title: t.service5Title, desc: t.service5Desc },
    { icon: '🚨', title: t.service6Title, desc: t.service6Desc },
  ];

  const stats = [
    { number: '6+', title: t.stat1Title, desc: t.stat1Desc },
    { number: '100+', title: t.stat2Title, desc: t.stat2Desc },
    { number: '24/7', title: t.stat3Title, desc: t.stat3Desc },
    { number: '120K', title: t.stat4Title, desc: t.stat4Desc },
  ];

  const faqData = [
    {
      question: "Quels sont vos délais d'intervention ?",
      answer: "Pour les urgences, nous intervenons sous 30-60 minutes à Conakry centre. Pour les rendez-vous standards, nous proposons des créneaux sous 24-48h selon votre disponibilité."
    },
    {
      question: "Proposez-vous des garanties sur vos travaux ?",
      answer: "Oui, tous nos travaux sont garantis 12 mois sur la main d'œuvre. Les pièces et équipements bénéficient de la garantie constructeur (1 à 2 ans selon les marques)."
    },
    {
      question: "Quels sont les frais de déplacement ?",
      answer: "Le déplacement est payant. En ville jusqu'à la Cimenterie : 120 000 GNF. De la Cimenterie au reste de Conakry : 250 000 GNF. En dehors de Conakry (ex : Kindia) : à partir de 1 050 000 GNF. Seul le devis est gratuit."
    },
    {
      question: "Comment puis-je obtenir un devis ?",
      answer: "Le devis est GRATUIT ! Créez simplement votre compte, décrivez votre projet avec des photos, et recevez votre devis détaillé sous 24h maximum."
    },
    {
      question: "Acceptez-vous les paiements échelonnés ?",
      answer: "Oui ! Pour les projets de plus de 2 millions GNF, nous proposons des facilités de paiement en 2 ou 3 versements. Orange Money et MTN Money acceptés."
    },
    {
      question: "Intervenez-vous en urgence la nuit ?",
      answer: "Oui, notre service d'urgence est disponible 24/7, même la nuit et les weekends. Un tarif majoré de +30% s'applique pour les interventions nocturnes."
    },
    {
      question: "Vos techniciens sont-ils certifiés ?",
      answer: "Tous nos techniciens sont formés aux normes européennes avec minimum 3 ans d'expérience. Notre fondateur a 6+ ans d'expérience en Belgique."
    },
    {
      question: "Puis-je suivre l'avancement de mes travaux ?",
      answer: "Oui ! Via votre espace client, vous pouvez suivre en temps réel la position GPS du technicien, voir les photos du chantier, et communiquer directement avec l'équipe."
    }
  ];

  const plumbingTips = [
    {
      icon: '💧',
      title: lang === 'fr' ? "Coupez l'eau avant toute intervention" : lang === 'en' ? "Shut off water before any work" : "اقطع الماء قبل اي عمل",
      description: lang === 'fr'
        ? "Avant de toucher a un robinet, un WC ou un tuyau, fermez toujours la vanne d'arret generale. Cela evite les inondations et vous permet de travailler en securite."
        : lang === 'en'
        ? "Before touching any faucet, toilet or pipe, always close the main shutoff valve. This prevents flooding and lets you work safely."
        : "قبل لمس اي صنبور او مرحاض او انبوب، اغلق دائما صمام الاغلاق الرئيسي لتجنب الفيضانات."
    },
    {
      icon: '🚽',
      title: lang === 'fr' ? "Ne jetez rien dans les toilettes" : lang === 'en' ? "Don't flush anything in toilets" : "لا ترمي شيئا في المراحيض",
      description: lang === 'fr'
        ? "Seul le papier toilette est prevu pour les canalisations. Les lingettes, cotons-tiges, serviettes hygieniques et restes alimentaires provoquent des bouchons couteux a reparer."
        : lang === 'en'
        ? "Only toilet paper is designed for pipes. Wipes, cotton buds, sanitary pads and food waste cause expensive clogs to repair."
        : "فقط ورق المرحاض مصمم للانابيب. المناديل والاعواد والفوط الصحية وبقايا الطعام تسبب انسدادات مكلفة."
    },
    {
      icon: '🌡️',
      title: lang === 'fr' ? "Entretenez votre chauffe-eau chaque annee" : lang === 'en' ? "Service your water heater yearly" : "صيانة سخان الماء سنويا",
      description: lang === 'fr'
        ? "Le calcaire s'accumule dans votre chauffe-eau et reduit son efficacite. Une vidange annuelle par un professionnel prolonge sa duree de vie de 5 a 10 ans et reduit votre facture d'electricite."
        : lang === 'en'
        ? "Limescale builds up in your water heater and reduces efficiency. An annual drain by a professional extends its lifespan by 5-10 years and lowers your electricity bill."
        : "يتراكم الكلس في سخان الماء ويقلل كفاءته. تفريغه سنويا من قبل محترف يطيل عمره من 5 الى 10 سنوات."
    },
    {
      icon: '🔧',
      title: lang === 'fr' ? "Surveillez la pression de l'eau" : lang === 'en' ? "Monitor your water pressure" : "راقب ضغط الماء",
      description: lang === 'fr'
        ? "Une pression trop forte (au-dessus de 3 bars) use rapidement les joints et les robinets. Installez un reducteur de pression a l'entree de votre maison pour proteger toute votre installation."
        : lang === 'en'
        ? "Too much pressure (above 3 bars) quickly wears out seals and faucets. Install a pressure reducer at your home's entry to protect all your plumbing."
        : "الضغط المرتفع (فوق 3 بار) يبلي الحشيات والصنابير بسرعة. ركب مخفض ضغط عند مدخل منزلك."
    },
    {
      icon: '🚿',
      title: lang === 'fr' ? "Detartrez vos equipements sanitaires" : lang === 'en' ? "Descale your sanitary equipment" : "ازل الترسبات من معداتك الصحية",
      description: lang === 'fr'
        ? "Le calcaire reduit le debit de vos pommeaux de douche et robinets. Trempez-les dans du vinaigre blanc toutes les 6 semaines pour retrouver une pression optimale et eviter les pannes."
        : lang === 'en'
        ? "Limescale reduces the flow of your shower heads and faucets. Soak them in white vinegar every 6 weeks to restore optimal pressure and avoid breakdowns."
        : "الكلس يقلل تدفق رؤوس الدش والصنابير. انقعها في الخل الابيض كل 6 اسابيع لاستعادة الضغط الامثل."
    },
    {
      icon: '📞',
      title: lang === 'fr' ? "Reagissez vite en cas de fuite" : lang === 'en' ? "Act fast in case of a leak" : "تصرف بسرعة في حالة التسرب",
      description: lang === 'fr'
        ? "Une fuite, meme petite, peut gaspiller 100 litres par jour et causer des degats importants aux murs et sols. Coupez l'eau et appelez immediatement un professionnel au +224 610 55 32 55."
        : lang === 'en'
        ? "A leak, even a small one, can waste 100 liters per day and cause significant damage to walls and floors. Shut off the water and call a professional immediately at +224 610 55 32 55."
        : "التسرب حتى الصغير يمكن ان يهدر 100 لتر يوميا ويسبب اضرارا كبيرة. اقطع الماء واتصل فورا بمحترف على +224 610 55 32 55."
    }
  ];

  const getProjectIcon = (title: string): string => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('bain') || lowerTitle.includes('douche') || lowerTitle.includes('bathroom') || lowerTitle.includes('shower')) return '🚿';
    if (lowerTitle.includes('wc') || lowerTitle.includes('toilette') || lowerTitle.includes('toilet')) return '🚽';
    if (lowerTitle.includes('chauffe') || lowerTitle.includes('water heater') || lowerTitle.includes('heater')) return '🌡️';
    if (lowerTitle.includes('commercial') || lowerTitle.includes('immeuble') || lowerTitle.includes('building')) return '🏢';
    if (lowerTitle.includes('cuisine') || lowerTitle.includes('kitchen')) return '🍽️';
    return '🔧';
  };

  const projectsToDisplay = publicChantiers.map(chantier => ({
    icon: getProjectIcon(chantier.title),
    title: chantier.title,
    desc: chantier.description || chantier.location,
    image: chantier.photos_after && chantier.photos_after.length > 0
      ? chantier.photos_after[0]
      : 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=600',
    rating: chantier.rating,
    location: chantier.location,
  }));

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <Logo size="medium" darkMode={darkMode} />
        <nav style={{ ...navStyle, marginLeft: 'auto', marginRight: '0' }}>
          <a style={navLinkStyle} onClick={onNavigateToServices}>
            {t.viewServices}
          </a>
          <a style={navLinkStyle} onClick={onNavigateToDevis}>
            {t.getQuote}
          </a>
          <a style={navLinkStyle} onClick={onNavigateToTrack}>
            🔍 {t.trackQuote}
          </a>
          <a style={navLinkStyle} onClick={onNavigateToContact}>
            {t.contact}
          </a>
          <a style={{...navLinkStyle, color: darkMode ? '#00e5ff' : '#00838f'}} onClick={onNavigateToLogin}>
            {t.clientSpace}
          </a>
        </nav>
      </header>
      <div style={{
        position: 'sticky',
        top: '60px',
        zIndex: 99,
        display: 'flex',
        justifyContent: 'flex-end',
        padding: '8px 20px 0',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}>
          <select
            value={lang}
            onChange={(e) => onChangeLang?.(e.target.value as 'fr' | 'en' | 'ar')}
            style={{
              padding: '6px 10px',
              borderRadius: '8px',
              border: `2px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
              background: darkMode ? '#1e293b' : '#FFFFFF',
              color: darkMode ? '#f1f5f9' : '#0f172a',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              outline: 'none',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            }}
          >
            <option value="fr">🇫🇷 FR</option>
            <option value="en">🇬🇧 EN</option>
            <option value="ar">🇸🇦 AR</option>
          </select>
          <button
            onClick={onToggleDarkMode}
            style={{
              padding: '6px 10px',
              borderRadius: '8px',
              border: `2px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
              background: darkMode ? '#1e293b' : '#FFFFFF',
              color: darkMode ? '#f1f5f9' : '#0f172a',
              fontSize: '18px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            }}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </div>

      <section style={heroStyle}>
        <div style={{ fontSize: '14px', fontWeight: '600', color: darkMode ? '#00e5ff' : '#006064', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '2px' }}>
          {t.tagline}
        </div>
        <h1 style={heroTitleStyle}>{t.heroTitle}</h1>
        <p style={heroSubtitleStyle}>{t.heroSubtitle}</p>

        <div style={badgesStyle}>
          <div style={badgeStyle}>✅ {t.experience}</div>
          <div style={badgeStyle}>🎓 {t.trained}</div>
          <div style={badgeStyle}>🚨 {t.emergency}</div>
        </div>

        <div style={buttonsStyle}>
          <button
            style={primaryButtonStyle}
            onClick={() => window.location.href = `tel:${t.phone}`}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 131, 143, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            📞 {t.callNow}
          </button>
          <button
            style={secondaryButtonStyle}
            onClick={onNavigateToDevis}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = darkMode ? '#334155' : '#eff6ff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            📋 {t.getQuote}
          </button>
        </div>

        <div style={{ marginTop: '16px', fontSize: '24px', fontWeight: '700', color: darkMode ? '#00e5ff' : '#006064' }}>
          {t.phone}
        </div>
      </section>

      <section style={{...sectionStyle, paddingTop: '20px'}}>
        <h2 style={sectionTitleStyle}>{t.servicesTitle}</h2>
        <p style={sectionSubtitleStyle}>{t.servicesDescription}</p>

        <div style={servicesGridStyle}>
          {services.map((service, index) => (
            <div
              key={index}
              style={serviceCardStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
              }}
            >
              <div style={serviceIconStyle}>{service.icon}</div>
              <h3 style={serviceTitleStyle}>{service.title}</h3>
              <p style={serviceDescStyle}>{service.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{...sectionStyle, background: darkMode ? '#0f172a' : '#f8fafc'}}>
        <h2 style={sectionTitleStyle}>{t.realisationsTitle}</h2>
        <p style={sectionSubtitleStyle}>{t.realisationsSubtitle}</p>

        {loadingProjects ? (
          <div style={{ textAlign: 'center', padding: '40px', color: darkMode ? '#94a3b8' : '#64748b' }}>
            <div style={{ fontSize: '18px' }}>Chargement des projets...</div>
          </div>
        ) : publicChantiers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: darkMode ? '#94a3b8' : '#64748b' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏗️</div>
            <div style={{ fontSize: '24px', fontWeight: '600', marginBottom: '8px', color: darkMode ? '#e2e8f0' : '#334155' }}>
              {lang === 'fr' ? 'Aucune réalisation pour le moment' : lang === 'en' ? 'No achievements yet' : 'لا توجد إنجازات حتى الآن'}
            </div>
            <div style={{ fontSize: '16px' }}>
              {lang === 'fr' ? 'Nos projets seront bientôt disponibles ici' : lang === 'en' ? 'Our projects will be available here soon' : 'ستكون مشاريعنا متاحة هنا قريبًا'}
            </div>
          </div>
        ) : (
          <div style={servicesGridStyle}>
            {projectsToDisplay.map((project, index) => (
            <div
              key={index}
              style={{
                ...serviceCardStyle,
                padding: '0',
                overflow: 'hidden',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
              }}
            >
              <div style={{
                width: '100%',
                height: '220px',
                background: project.image ? `url(${project.image})` : darkMode
                  ? 'linear-gradient(135deg, #006064 0%, #00838f 100%)'
                  : 'linear-gradient(135deg, #00acc1 0%, #00e5ff 100%)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {!project.image && (
                  <div style={{
                    fontSize: '80px',
                    color: 'rgba(255, 255, 255, 0.3)',
                    position: 'absolute',
                  }}>
                    {project.icon}
                  </div>
                )}
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  left: '16px',
                  width: '56px',
                  height: '56px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.95)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                }}>
                  {project.icon}
                </div>
              </div>
              <div style={{ padding: '24px' }}>
                <h3 style={serviceTitleStyle}>{project.title}</h3>
                <p style={serviceDescStyle}>{project.desc}</p>
              </div>
            </div>
            ))}
          </div>
        )}
      </section>

      <section style={sectionStyle}>
        <h2 style={sectionTitleStyle}>{t.whyTitle}</h2>
        <p style={sectionSubtitleStyle}>{t.whyDescription}</p>

        <div style={statsGridStyle}>
          {stats.map((stat, index) => (
            <div key={index} style={statCardStyle}>
              <div style={statNumberStyle}>{stat.number}</div>
              <h3 style={statTitleStyle}>{stat.title}</h3>
              <p style={statDescStyle}>{stat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{...sectionStyle, background: darkMode ? '#0f172a' : '#f1f5f9'}}>
        <h2 style={sectionTitleStyle}>{t.faqTitle}</h2>
        <p style={sectionSubtitleStyle}>{t.faqSubtitle}</p>

        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          {faqData.map((faq, index) => (
            <div
              key={index}
              style={{
                background: darkMode ? '#1e293b' : '#FFFFFF',
                marginBottom: '16px',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                transition: 'all 0.3s ease',
              }}
            >
              <div
                onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                style={{
                  padding: '24px',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: expandedFAQ === index ? (darkMode ? '#006064' : '#00acc1') : 'transparent',
                  color: expandedFAQ === index ? '#FFFFFF' : (darkMode ? '#f1f5f9' : '#0f172a'),
                  transition: 'all 0.3s ease',
                }}
              >
                <h3 style={{ fontSize: '18px', fontWeight: '700', margin: 0, flex: 1 }}>{faq.question}</h3>
                <div style={{ fontSize: '24px', fontWeight: '700', marginLeft: '16px' }}>
                  {expandedFAQ === index ? '−' : '+'}
                </div>
              </div>
              {expandedFAQ === index && (
                <div
                  style={{
                    padding: '24px',
                    fontSize: '16px',
                    lineHeight: '1.7',
                    color: darkMode ? '#94a3b8' : '#64748b',
                    borderTop: `2px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
                  }}
                >
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={sectionTitleStyle}>{t.tipsTitle}</h2>
        <p style={sectionSubtitleStyle}>{t.tipsSubtitle}</p>

        <div style={servicesGridStyle}>
          {plumbingTips.map((tip, index) => (
            <div
              key={index}
              style={serviceCardStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
              }}
            >
              <div style={serviceIconStyle}>{tip.icon}</div>
              <h3 style={serviceTitleStyle}>{tip.title}</h3>
              <p style={serviceDescStyle}>{tip.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={ctaSectionStyle}>
        <h2 style={ctaTitleStyle}>{t.ctaTitle}</h2>
        <p style={ctaDescStyle}>{t.ctaDescription}</p>

        <div style={buttonsStyle}>
          <button
            style={{...primaryButtonStyle, background: '#FFFFFF', color: darkMode ? '#00838f' : '#006064'}}
            onClick={() => window.location.href = `tel:${t.phone}`}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(255, 255, 255, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            📞 {t.phone}
          </button>
          <button
            style={{...secondaryButtonStyle, borderColor: '#FFFFFF', color: '#FFFFFF'}}
            onClick={onNavigateToContact}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            {t.contact}
          </button>
          <button
            style={{...secondaryButtonStyle, borderColor: '#FFFFFF', color: '#FFFFFF'}}
            onClick={onNavigateToDevis}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            {t.getQuote}
          </button>
          <button
            style={{...secondaryButtonStyle, borderColor: '#FFFFFF', color: '#FFFFFF'}}
            onClick={onNavigateToTrack}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            🔍 {t.trackQuote}
          </button>
        </div>
      </section>

      <footer style={{ padding: '40px 20px', textAlign: 'center', background: darkMode ? '#0f172a' : '#1e293b', color: '#94a3b8' }}>
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
          <Logo size="small" darkMode={true} />
        </div>
        <div style={{ marginBottom: '16px' }}>
          {t.tagline}
        </div>
        <div style={{ fontSize: '20px', fontWeight: '700', color: '#00e5ff', marginBottom: '16px' }}>
          {t.phone}
        </div>
        <div style={{ fontSize: '14px' }}>
          © 2026 {t.companyName}. Tous droits réservés.
        </div>
      </footer>

      <button
        onClick={() => setShowChatbot(true)}
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: darkMode
            ? 'linear-gradient(135deg, #00838f, #00e5ff)'
            : 'linear-gradient(135deg, #006064, #00bcd4)',
          color: '#FFFFFF',
          border: '4px solid rgba(255, 255, 255, 0.3)',
          cursor: 'pointer',
          fontSize: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 12px 40px rgba(0, 188, 212, 0.5), 0 0 0 0 rgba(0, 188, 212, 0.4)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          zIndex: 10000,
          animation: 'pulse-ring 2s infinite',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.15) rotate(5deg)';
          e.currentTarget.style.boxShadow = '0 16px 56px rgba(0, 188, 212, 0.7), 0 0 0 20px rgba(0, 188, 212, 0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 188, 212, 0.5), 0 0 0 0 rgba(0, 188, 212, 0.4)';
        }}
      >
        <style>
          {`
            @keyframes pulse-ring {
              0% {
                box-shadow: 0 12px 40px rgba(0, 188, 212, 0.5), 0 0 0 0 rgba(0, 188, 212, 0.4);
              }
              50% {
                box-shadow: 0 12px 40px rgba(0, 188, 212, 0.5), 0 0 0 15px rgba(0, 188, 212, 0);
              }
              100% {
                box-shadow: 0 12px 40px rgba(0, 188, 212, 0.5), 0 0 0 0 rgba(0, 188, 212, 0);
              }
            }
          `}
        </style>
        💬
      </button>

      {showChatbot && (
        <IntelligentChatbot
          darkMode={darkMode}
          lang={lang}
          onClose={() => setShowChatbot(false)}
          currentUser={null}
        />
      )}
    </div>
  );
};

export default VisitorHomePage;
