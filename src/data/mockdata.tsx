import type { Pro, Conversation, FaqItem } from '../types';

// ─── Prestataires ─────────────────────────────────────────────────────────────
export const PROS: Pro[] = [

  // ── PLOMBERIE ──────────────────────────────────────────────────────────────
  {
    id: 1, name: 'Ahmed Karimi', specialty: 'Plombier certifié', category: 'Plomberie',
    rating: 4.9, reviews: 127, location: 'Maarif, Casablanca', distance: 1.2, price: 150,
    available: true, avatar: 'AK', avatarColor: 'from-blue-500 to-blue-700',
    tags: ['Urgence', 'Chauffe-eau', 'Fuite'],
    bio: 'Plombier avec 12 ans d\'expérience. Spécialisé dans les réparations urgentes et détection de fuites. Intervention sous 1h garantie.',
    lat: 33.5892, lng: -7.6033, phone: '+212 6 12 34 56 78', completedJobs: 843, activeJobs: 1,
    responseTime: '< 15 min', verified: true,
    portfolio: [{ id: 1, emoji: '🚿', label: 'Salle de bain' }, { id: 2, emoji: '🔧', label: 'Robinetterie' }, { id: 3, emoji: '🪠', label: 'Débouchage' }],
    reviewsList: [
      { id: 1, author: 'Karim B.', rating: 5, comment: 'Intervention rapide et propre !', date: '20 Fév 2026', avatar: 'KB' },
      { id: 2, author: 'Sara M.', rating: 5, comment: 'Fuite réparée en 30 min.', date: '15 Fév 2026', avatar: 'SM' },
    ],
  },
  {
    id: 9, name: 'Noureddine Filali', specialty: 'Plombier sanitaire', category: 'Plomberie',
    rating: 4.7, reviews: 98, location: 'Hay Mohammadi, Casablanca', distance: 2.3, price: 140,
    available: true, avatar: 'NF', avatarColor: 'from-blue-400 to-cyan-600',
    tags: ['Installation sanitaire', 'Salle de bain', 'WC'],
    bio: 'Spécialiste en installation sanitaire complète. Pose de WC, douches, baignoires et vasques. Travail soigné et garanti.',
    lat: 33.5750, lng: -7.5900, phone: '+212 6 21 43 65 87', completedJobs: 312, activeJobs: 0,
    responseTime: '< 1h', verified: true,
    portfolio: [{ id: 1, emoji: '🚿', label: 'Douche' }, { id: 2, emoji: '🛁', label: 'Baignoire' }, { id: 3, emoji: '🚽', label: 'WC' }],
    reviewsList: [
      { id: 1, author: 'Bilal K.', rating: 5, comment: 'Salle de bain refaite à neuf, parfait !', date: '18 Fév 2026', avatar: 'BK' },
    ],
  },
  {
    id: 10, name: 'Mourad Senhaji', specialty: 'Plombier débouchage', category: 'Plomberie',
    rating: 4.6, reviews: 74, location: 'Sidi Bernoussi, Casablanca', distance: 3.8, price: 120,
    available: true, avatar: 'MS', avatarColor: 'from-teal-500 to-blue-600',
    tags: ['Débouchage', 'Canalisation', 'Évier'],
    bio: 'Expert en débouchage de canalisations. Intervention rapide pour évier, baignoire, WC et colonnes montantes.',
    lat: 33.6050, lng: -7.5450, phone: '+212 6 34 56 78 90', completedJobs: 445, activeJobs: 2,
    responseTime: '< 45 min', verified: false,
    portfolio: [{ id: 1, emoji: '🪠', label: 'Débouchage' }, { id: 2, emoji: '🔩', label: 'Canalisation' }],
    reviewsList: [
      { id: 1, author: 'Fateh O.', rating: 4, comment: 'Efficace et rapide.', date: '10 Fév 2026', avatar: 'FO' },
    ],
  },
  {
    id: 11, name: 'Issam Berrada', specialty: 'Technicien chauffe-eau', category: 'Plomberie',
    rating: 4.8, reviews: 56, location: 'Ain Chock, Casablanca', distance: 2.9, price: 160,
    available: true, avatar: 'IB', avatarColor: 'from-orange-400 to-red-500',
    tags: ['Chauffe-eau', 'Ballon eau chaude', 'Thermique'],
    bio: 'Technicien spécialisé en chauffe-eau solaire, électrique et gaz. Installation, entretien et dépannage toutes marques.',
    lat: 33.5650, lng: -7.5800, phone: '+212 6 45 67 89 01', completedJobs: 189, activeJobs: 0,
    responseTime: '< 2h', verified: true,
    portfolio: [{ id: 1, emoji: '🔥', label: 'Chauffe-eau' }, { id: 2, emoji: '☀️', label: 'Solaire' }],
    reviewsList: [
      { id: 1, author: 'Zineb A.', rating: 5, comment: 'Chauffe-eau installé en 2h, nickel.', date: '14 Fév 2026', avatar: 'ZA' },
    ],
  },
  {
    id: 12, name: 'Amine Tahiri', specialty: 'Plombier robinetterie', category: 'Plomberie',
    rating: 4.5, reviews: 43, location: 'Ben M\'Sick, Casablanca', distance: 4.1, price: 110,
    available: false, avatar: 'AT', avatarColor: 'from-sky-500 to-blue-700',
    tags: ['Robinetterie', 'Mitigeur', 'Remplacement'],
    bio: 'Spécialiste remplacement et réparation de robinetterie. Mitigeurs, robinets thermostatiques, tous modèles.',
    lat: 33.5580, lng: -7.5700, phone: '+212 6 56 78 90 12', completedJobs: 134, activeJobs: 1,
    responseTime: '< 3h', verified: false,
    portfolio: [{ id: 1, emoji: '🔧', label: 'Robinets' }, { id: 2, emoji: '🚰', label: 'Mitigeur' }],
    reviewsList: [
      { id: 1, author: 'Hassan M.', rating: 4, comment: 'Bon travail, prix correct.', date: '8 Fév 2026', avatar: 'HM' },
    ],
  },

  // ── ÉLECTRICITÉ ────────────────────────────────────────────────────────────
  {
    id: 2, name: 'Fatima Zouai', specialty: 'Électricienne diplômée', category: 'Électricité',
    rating: 4.8, reviews: 89, location: 'Hay Hassani, Casablanca', distance: 2.1, price: 130,
    available: true, avatar: 'FZ', avatarColor: 'from-yellow-500 to-orange-500',
    tags: ['Tableau électrique', 'Domotique', 'Rénovation'],
    bio: 'Électricienne diplômée. Rénovations complètes, dépannages et installation de systèmes domotiques.',
    lat: 33.5720, lng: -7.6410, phone: '+212 6 98 76 54 32', completedJobs: 412, activeJobs: 0,
    responseTime: '< 30 min', verified: true,
    portfolio: [{ id: 1, emoji: '💡', label: 'Éclairage' }, { id: 2, emoji: '🔌', label: 'Prises' }, { id: 3, emoji: '⚡', label: 'Tableau' }],
    reviewsList: [
      { id: 1, author: 'Nadia L.', rating: 5, comment: 'Très compétente.', date: '18 Fév 2026', avatar: 'NL' },
    ],
  },
  {
    id: 13, name: 'Kamal Benjelloun', specialty: 'Électricien dépannage urgence', category: 'Électricité',
    rating: 4.9, reviews: 112, location: 'Bourgogne, Casablanca', distance: 1.8, price: 120,
    available: true, avatar: 'KB', avatarColor: 'from-yellow-400 to-amber-600',
    tags: ['Panne électrique', 'Urgence', 'Disjoncteur'],
    bio: 'Électricien disponible 24h/7j pour toutes pannes électriques. Diagnostic rapide et réparation immédiate.',
    lat: 33.5940, lng: -7.6120, phone: '+212 6 13 24 35 46', completedJobs: 678, activeJobs: 1,
    responseTime: '< 20 min', verified: true,
    portfolio: [{ id: 1, emoji: '⚡', label: 'Panne' }, { id: 2, emoji: '🔌', label: 'Disjoncteur' }],
    reviewsList: [
      { id: 1, author: 'Omar B.', rating: 5, comment: 'Arrivé en 20 min, panne résolue !', date: '19 Fév 2026', avatar: 'OB' },
    ],
  },
  {
    id: 14, name: 'Samira Ouazzani', specialty: 'Technicienne éclairage LED', category: 'Électricité',
    rating: 4.7, reviews: 67, location: 'Racine, Casablanca', distance: 2.6, price: 115,
    available: true, avatar: 'SO', avatarColor: 'from-amber-400 to-yellow-600',
    tags: ['Éclairage', 'LED', 'Spots'],
    bio: 'Spécialiste en installation d\'éclairage intérieur et extérieur. LED, spots encastrés, luminaires design.',
    lat: 33.5880, lng: -7.6380, phone: '+212 6 24 35 46 57', completedJobs: 234, activeJobs: 0,
    responseTime: '< 1h', verified: true,
    portfolio: [{ id: 1, emoji: '💡', label: 'LED' }, { id: 2, emoji: '🔦', label: 'Spots' }],
    reviewsList: [
      { id: 1, author: 'Rim C.', rating: 5, comment: 'Éclairage magnifique dans notre salon !', date: '16 Fév 2026', avatar: 'RC' },
    ],
  },
  {
    id: 15, name: 'Driss Lahlou', specialty: 'Électricien tableaux & câblage', category: 'Électricité',
    rating: 4.6, reviews: 45, location: 'Ain Sebaa, Casablanca', distance: 4.3, price: 140,
    available: false, avatar: 'DL', avatarColor: 'from-orange-500 to-red-600',
    tags: ['Installation tableau', 'Câblage', 'Mise aux normes'],
    bio: 'Électricien spécialisé installation et mise aux normes de tableaux électriques.',
    lat: 33.6020, lng: -7.5600, phone: '+212 6 35 46 57 68', completedJobs: 156, activeJobs: 2,
    responseTime: '< 2h', verified: false,
    portfolio: [{ id: 1, emoji: '🔌', label: 'Tableau' }, { id: 2, emoji: '🔧', label: 'Câblage' }],
    reviewsList: [
      { id: 1, author: 'Said H.', rating: 4, comment: 'Travail propre et conforme.', date: '11 Fév 2026', avatar: 'SH' },
    ],
  },
  {
    id: 16, name: 'Hind Chakir', specialty: 'Ingénieure domotique', category: 'Électricité',
    rating: 4.9, reviews: 38, location: 'Anfa Supérieur, Casablanca', distance: 3.1, price: 200,
    available: true, avatar: 'HC2', avatarColor: 'from-lime-500 to-green-600',
    tags: ['Domotique', 'Smart home', 'Automatisation'],
    bio: 'Ingénieure en systèmes domotiques. Installation de maisons connectées, volets automatiques et alarmes intelligentes.',
    lat: 33.5990, lng: -7.6300, phone: '+212 6 46 57 68 79', completedJobs: 89, activeJobs: 0,
    responseTime: '< 3h', verified: true,
    portfolio: [{ id: 1, emoji: '🏠', label: 'Smart home' }, { id: 2, emoji: '📱', label: 'Automatisation' }],
    reviewsList: [
      { id: 1, author: 'Mehdi F.', rating: 5, comment: 'Villa entièrement connectée, impressionnant !', date: '20 Fév 2026', avatar: 'MF' },
    ],
  },
  {
    id: 36, name: 'Youssef Benkirane', specialty: 'Technicien climatisation élec.', category: 'Électricité',
    rating: 4.7, reviews: 52, location: 'Maarif, Casablanca', distance: 1.6, price: 145,
    available: true, avatar: 'YBK', avatarColor: 'from-cyan-500 to-blue-600',
    tags: ['Climatisation', 'Installation électrique', 'Câblage clim'],
    bio: 'Électricien spécialisé dans l\'installation électrique des systèmes de climatisation split.',
    lat: 33.5860, lng: -7.6260, phone: '+212 6 57 68 79 80', completedJobs: 167, activeJobs: 1,
    responseTime: '< 2h', verified: true,
    portfolio: [{ id: 1, emoji: '❄️', label: 'Clim élec' }, { id: 2, emoji: '🔌', label: 'Câblage' }],
    reviewsList: [
      { id: 1, author: 'Wafa B.', rating: 5, comment: 'Installation soignée et rapide.', date: '14 Fév 2026', avatar: 'WB' },
    ],
  },

  // ── PEINTURE ───────────────────────────────────────────────────────────────
  {
    id: 3, name: 'Youssef Ben Ali', specialty: 'Peintre décorateur', category: 'Peinture',
    rating: 4.7, reviews: 204, location: 'Anfa, Casablanca', distance: 0.8, price: 120,
    available: false, avatar: 'YB', avatarColor: 'from-pink-500 to-rose-500',
    tags: ['Décoration', 'Enduit & crépi', 'Ravalement'],
    bio: 'Artisan peintre avec 8 ans d\'expérience. Finitions impeccables, devis gratuit sous 24h.',
    lat: 33.5970, lng: -7.6320, phone: '+212 6 55 44 33 22', completedJobs: 631, activeJobs: 3,
    responseTime: '< 1h', verified: true,
    portfolio: [{ id: 1, emoji: '🎨', label: 'Décoration' }, { id: 2, emoji: '🖌️', label: 'Finitions' }],
    reviewsList: [
      { id: 1, author: 'Amina K.', rating: 5, comment: 'Le salon est magnifique !', date: '19 Fév 2026', avatar: 'AK' },
    ],
  },
  {
    id: 17, name: 'Tarik Amrani', specialty: 'Peintre intérieur', category: 'Peinture',
    rating: 4.8, reviews: 156, location: 'Maarif, Casablanca', distance: 1.4, price: 110,
    available: true, avatar: 'TA', avatarColor: 'from-rose-400 to-pink-600',
    tags: ['Peinture intérieure', 'Chambre', 'Salon'],
    bio: 'Peintre intérieur professionnel. Préparation des murs, application multicouche, finitions parfaites.',
    lat: 33.5860, lng: -7.6250, phone: '+212 6 57 68 79 80', completedJobs: 423, activeJobs: 1,
    responseTime: '< 2h', verified: true,
    portfolio: [{ id: 1, emoji: '🖌️', label: 'Intérieur' }, { id: 2, emoji: '🏠', label: 'Salon' }],
    reviewsList: [
      { id: 1, author: 'Leila B.', rating: 5, comment: 'Appartement repeint en 2 jours, superbe !', date: '17 Fév 2026', avatar: 'LB' },
    ],
  },
  {
    id: 18, name: 'Soufiane Idrissi', specialty: 'Peintre façadier', category: 'Peinture',
    rating: 4.6, reviews: 87, location: 'Sidi Maarouf, Casablanca', distance: 3.7, price: 130,
    available: true, avatar: 'SI', avatarColor: 'from-fuchsia-500 to-purple-600',
    tags: ['Peinture extérieure', 'Ravalement', 'Façade'],
    bio: 'Spécialiste ravalement et peinture de façades. Traitement anti-humidité, imperméabilisation.',
    lat: 33.5550, lng: -7.6500, phone: '+212 6 68 79 80 91', completedJobs: 245, activeJobs: 0,
    responseTime: '< 3h', verified: true,
    portfolio: [{ id: 1, emoji: '🏗️', label: 'Ravalement' }, { id: 2, emoji: '🏢', label: 'Façade' }],
    reviewsList: [
      { id: 1, author: 'Anas T.', rating: 5, comment: 'Immeuble refait à neuf !', date: '13 Fév 2026', avatar: 'AT' },
    ],
  },
  {
    id: 19, name: 'Meriem Cherkaoui', specialty: 'Enduits décoratifs', category: 'Peinture',
    rating: 4.9, reviews: 72, location: 'Gauthier, Casablanca', distance: 1.9, price: 150,
    available: true, avatar: 'MC', avatarColor: 'from-pink-400 to-red-500',
    tags: ['Enduit & crépi', 'Stucco', 'Béton ciré'],
    bio: 'Artiste spécialisée en enduits décoratifs. Stucco vénitien, béton ciré, tadelakt marocain.',
    lat: 33.5920, lng: -7.6430, phone: '+212 6 79 80 91 02', completedJobs: 178, activeJobs: 0,
    responseTime: '< 4h', verified: true,
    portfolio: [{ id: 1, emoji: '🪨', label: 'Béton ciré' }, { id: 2, emoji: '✨', label: 'Stucco' }],
    reviewsList: [
      { id: 1, author: 'Dalila R.', rating: 5, comment: 'Résultat époustouflant, un vrai art !', date: '21 Fév 2026', avatar: 'DR' },
    ],
  },
  {
    id: 20, name: 'Rachid Sqalli', specialty: 'Poseur papier peint', category: 'Peinture',
    rating: 4.5, reviews: 49, location: 'Ain Diab, Casablanca', distance: 4.8, price: 100,
    available: true, avatar: 'RS', avatarColor: 'from-violet-500 to-purple-700',
    tags: ['Papier peint', 'Revêtement mural', 'Décoration'],
    bio: 'Expert pose papier peint et revêtements muraux. Toutes matières : vinyle, tissu, panoramique.',
    lat: 33.5780, lng: -7.6650, phone: '+212 6 80 91 02 13', completedJobs: 132, activeJobs: 1,
    responseTime: '< 2h', verified: false,
    portfolio: [{ id: 1, emoji: '📋', label: 'Papier peint' }, { id: 2, emoji: '🖼️', label: 'Panoramique' }],
    reviewsList: [
      { id: 1, author: 'Kenza M.', rating: 4, comment: 'Bien posé, bon résultat.', date: '9 Fév 2026', avatar: 'KM' },
    ],
  },

  // ── JARDINAGE ──────────────────────────────────────────────────────────────
  {
    id: 4, name: 'Laila Mansouri', specialty: 'Jardinière paysagiste', category: 'Jardinage',
    rating: 4.9, reviews: 63, location: 'Californie, Casablanca', distance: 3.4, price: 100,
    available: true, avatar: 'LM', avatarColor: 'from-green-500 to-emerald-600',
    tags: ['Taille haies', 'Gazon', 'Plantation'],
    bio: 'Paysagiste diplômée, transforme votre jardin en oasis. Entretien régulier ou ponctuel.',
    lat: 33.6040, lng: -7.5980, phone: '+212 6 77 88 99 00', completedJobs: 198, activeJobs: 0,
    responseTime: '< 2h', verified: false,
    portfolio: [{ id: 1, emoji: '🌿', label: 'Jardin' }, { id: 2, emoji: '✂️', label: 'Taille' }],
    reviewsList: [
      { id: 1, author: 'Dounia F.', rating: 5, comment: 'Mon jardin n\'a jamais été aussi beau !', date: '17 Fév 2026', avatar: 'DF' },
    ],
  },
  {
    id: 21, name: 'Mustapha Bennis', specialty: 'Jardinier tonte pelouse', category: 'Jardinage',
    rating: 4.7, reviews: 88, location: 'Hay Hassani, Casablanca', distance: 2.2, price: 90,
    available: true, avatar: 'MB', avatarColor: 'from-emerald-400 to-green-700',
    tags: ['Tonte pelouse', 'Entretien gazon', 'Soins pelouse'],
    bio: 'Jardinier professionnel pour entretien régulier de pelouses. Tonte, aération, engrais.',
    lat: 33.5700, lng: -7.6380, phone: '+212 6 91 02 13 24', completedJobs: 356, activeJobs: 1,
    responseTime: '< 3h', verified: true,
    portfolio: [{ id: 1, emoji: '🌱', label: 'Pelouse' }, { id: 2, emoji: '🌺', label: 'Massifs' }],
    reviewsList: [
      { id: 1, author: 'Said L.', rating: 5, comment: 'Jardin toujours impeccable.', date: '15 Fév 2026', avatar: 'SL' },
    ],
  },
  {
    id: 22, name: 'Houda El Fassi', specialty: 'Arrosage automatique', category: 'Jardinage',
    rating: 4.8, reviews: 41, location: 'Ain Chock, Casablanca', distance: 3.9, price: 120,
    available: true, avatar: 'HF', avatarColor: 'from-teal-400 to-emerald-600',
    tags: ['Arrosage', 'Système automatique', 'Irrigation'],
    bio: 'Technicienne en systèmes d\'arrosage automatique et irrigation. Programmation et entretien.',
    lat: 33.5640, lng: -7.5780, phone: '+212 6 02 13 24 35', completedJobs: 112, activeJobs: 0,
    responseTime: '< 4h', verified: true,
    portfolio: [{ id: 1, emoji: '💦', label: 'Arrosage auto' }, { id: 2, emoji: '🔧', label: 'Programmation' }],
    reviewsList: [
      { id: 1, author: 'Widad A.', rating: 5, comment: 'Système parfaitement installé.', date: '12 Fév 2026', avatar: 'WA' },
    ],
  },
  {
    id: 23, name: 'Omar Benhaddou', specialty: 'Paysagiste plantation', category: 'Jardinage',
    rating: 4.6, reviews: 55, location: 'Bernoussi, Casablanca', distance: 5.1, price: 110,
    available: false, avatar: 'OB', avatarColor: 'from-green-600 to-lime-700',
    tags: ['Plantation', 'Arbres', 'Fleurs'],
    bio: 'Expert en plantation d\'arbres, arbustes et fleurs. Conseil en aménagement paysager.',
    lat: 33.6090, lng: -7.5420, phone: '+212 6 13 24 35 46', completedJobs: 167, activeJobs: 2,
    responseTime: '< 5h', verified: false,
    portfolio: [{ id: 1, emoji: '🌳', label: 'Arbres' }, { id: 2, emoji: '🌸', label: 'Fleurs' }],
    reviewsList: [
      { id: 1, author: 'Najat B.', rating: 4, comment: 'Beau travail de plantation.', date: '10 Fév 2026', avatar: 'NB' },
    ],
  },
  {
    id: 24, name: 'Adil Rhazali', specialty: 'Technicien piscine', category: 'Jardinage',
    rating: 4.9, reviews: 33, location: 'Californie, Casablanca', distance: 4.2, price: 200,
    available: true, avatar: 'AR', avatarColor: 'from-cyan-400 to-blue-500',
    tags: ['Entretien piscine', 'Traitement eau', 'Nettoyage piscine'],
    bio: 'Technicien spécialisé entretien et traitement de piscines privées. Analyse eau, nettoyage fond, hivernage.',
    lat: 33.6030, lng: -7.5970, phone: '+212 6 24 35 46 57', completedJobs: 89, activeJobs: 0,
    responseTime: '< 3h', verified: true,
    portfolio: [{ id: 1, emoji: '🏊', label: 'Piscine' }, { id: 2, emoji: '💧', label: 'Traitement' }],
    reviewsList: [
      { id: 1, author: 'Karim O.', rating: 5, comment: 'Piscine cristalline depuis qu\'il s\'en occupe.', date: '20 Fév 2026', avatar: 'KO' },
    ],
  },

  // ── MÉNAGE ─────────────────────────────────────────────────────────────────
  {
    id: 6, name: 'Zineb Alaoui', specialty: 'Aide ménagère', category: 'Ménage',
    rating: 4.8, reviews: 312, location: 'CIL, Casablanca', distance: 1.5, price: 80,
    available: true, avatar: 'ZA', avatarColor: 'from-purple-500 to-violet-600',
    tags: ['Nettoyage régulier', 'Repassage', 'Entretien courant'],
    bio: 'Service de ménage professionnel et de confiance. Nettoyage complet, repassage avec produits fournis.',
    lat: 33.5810, lng: -7.6200, phone: '+212 6 44 55 66 77', completedJobs: 1204, activeJobs: 1,
    responseTime: '< 1h', verified: true,
    portfolio: [{ id: 1, emoji: '🧹', label: 'Ménage' }, { id: 2, emoji: '👕', label: 'Repassage' }],
    reviewsList: [
      { id: 1, author: 'Leila S.', rating: 5, comment: 'Maison comme un sou neuf.', date: '21 Fév 2026', avatar: 'LS' },
    ],
  },
  {
    id: 25, name: 'Naima Kettani', specialty: 'Grand ménage & désinfection', category: 'Ménage',
    rating: 4.9, reviews: 145, location: 'Maarif, Casablanca', distance: 1.1, price: 95,
    available: true, avatar: 'NK', avatarColor: 'from-violet-400 to-purple-700',
    tags: ['Grand ménage', 'Nettoyage complet', 'Désinfection'],
    bio: 'Spécialiste grand ménage et nettoyage en profondeur. Désinfection complète, nettoyage après emménagement.',
    lat: 33.5870, lng: -7.6240, phone: '+212 6 35 46 57 68', completedJobs: 389, activeJobs: 0,
    responseTime: '< 2h', verified: true,
    portfolio: [{ id: 1, emoji: '✨', label: 'Grand ménage' }, { id: 2, emoji: '🧽', label: 'Désinfection' }],
    reviewsList: [
      { id: 1, author: 'Imane B.', rating: 5, comment: 'Appartement rutilant après le grand ménage !', date: '19 Fév 2026', avatar: 'IB' },
    ],
  },
  {
    id: 26, name: 'Souad Berrada', specialty: 'Nettoyage vitres professionnelle', category: 'Ménage',
    rating: 4.7, reviews: 98, location: 'Racine, Casablanca', distance: 2.4, price: 85,
    available: true, avatar: 'SB', avatarColor: 'from-indigo-400 to-violet-600',
    tags: ['Vitres & fenêtres', 'Nettoyage vitres', 'Façade vitrée'],
    bio: 'Spécialiste nettoyage de vitres et baies vitrées. Matériel professionnel, résultat impeccable sans traces.',
    lat: 33.5900, lng: -7.6350, phone: '+212 6 46 57 68 79', completedJobs: 276, activeJobs: 0,
    responseTime: '< 3h', verified: false,
    portfolio: [{ id: 1, emoji: '🪟', label: 'Vitres' }, { id: 2, emoji: '🏢', label: 'Façade vitrée' }],
    reviewsList: [
      { id: 1, author: 'Yassir C.', rating: 5, comment: 'Vitres parfaitement propres !', date: '16 Fév 2026', avatar: 'YC' },
    ],
  },
  {
    id: 27, name: 'Bouchra Tazi', specialty: 'Nettoyage après travaux', category: 'Ménage',
    rating: 4.8, reviews: 67, location: 'Sidi Maarouf, Casablanca', distance: 3.6, price: 105,
    available: true, avatar: 'BT', avatarColor: 'from-purple-600 to-indigo-700',
    tags: ['Après travaux', 'Fin de chantier', 'Nettoyage profond'],
    bio: 'Équipe spécialisée nettoyage fin de chantier et après travaux. Évacuation gravats légers, nettoyage complet.',
    lat: 33.5560, lng: -7.6480, phone: '+212 6 57 68 79 80', completedJobs: 198, activeJobs: 1,
    responseTime: '< 4h', verified: true,
    portfolio: [{ id: 1, emoji: '🏗️', label: 'Post chantier' }, { id: 2, emoji: '🧹', label: 'Nettoyage' }],
    reviewsList: [
      { id: 1, author: 'Nabil O.', rating: 5, comment: 'Appartement livré après rénovation, nettoyage parfait.', date: '14 Fév 2026', avatar: 'NO' },
    ],
  },
  {
    id: 28, name: 'Hafida Moussaoui', specialty: 'Nettoyage bureaux & commerces', category: 'Ménage',
    rating: 4.6, reviews: 234, location: 'Ain Sebaa, Casablanca', distance: 4.5, price: 75,
    available: false, avatar: 'HMO', avatarColor: 'from-blue-500 to-indigo-600',
    tags: ['Bureaux & commerces', 'Entreprise', 'Contrat régulier'],
    bio: 'Service de nettoyage pour bureaux, commerces et espaces professionnels. Contrats journaliers ou hebdomadaires.',
    lat: 33.6010, lng: -7.5550, phone: '+212 6 68 79 80 91', completedJobs: 892, activeJobs: 3,
    responseTime: '< 24h', verified: true,
    portfolio: [{ id: 1, emoji: '🏢', label: 'Bureaux' }, { id: 2, emoji: '🏪', label: 'Commerces' }],
    reviewsList: [
      { id: 1, author: 'Ismail F.', rating: 4, comment: 'Service régulier et fiable.', date: '11 Fév 2026', avatar: 'IF' },
    ],
  },

  // ── MENUISERIE ─────────────────────────────────────────────────────────────
  {
    id: 5, name: 'Khalid Ouali', specialty: 'Menuisier ébéniste', category: 'Menuiserie',
    rating: 4.6, reviews: 145, location: 'Bernoussi, Casablanca', distance: 4.7, price: 140,
    available: true, avatar: 'KO', avatarColor: 'from-amber-600 to-yellow-700',
    tags: ['Meubles sur mesure', 'Parquet', 'Portes'],
    bio: 'Menuisier ébéniste avec 15 ans d\'expérience. Meubles sur mesure, parquet, portes et fenêtres.',
    lat: 33.6100, lng: -7.5500, phone: '+212 6 33 22 11 00', completedJobs: 509, activeJobs: 2,
    responseTime: '< 3h', verified: true,
    portfolio: [{ id: 1, emoji: '🪵', label: 'Bois' }, { id: 2, emoji: '🚪', label: 'Portes' }, { id: 3, emoji: '🪑', label: 'Meubles' }],
    reviewsList: [
      { id: 1, author: 'Samira A.', rating: 5, comment: 'Cuisine sur mesure parfaite.', date: '16 Fév 2026', avatar: 'SA' },
    ],
  },

  // ── SERRURERIE ─────────────────────────────────────────────────────────────
  {
    id: 7, name: 'Hamid Chraibi', specialty: 'Serrurier urgence 24h', category: 'Serrurerie',
    rating: 4.7, reviews: 78, location: 'Bourgogne, Casablanca', distance: 2.8, price: 160,
    available: true, avatar: 'HC', avatarColor: 'from-slate-500 to-gray-700',
    tags: ['Urgence', 'Ouverture de porte', 'Dépannage'],
    bio: 'Serrurier disponible 24h/24. Ouverture de porte sans dégât, installation de serrures haute sécurité.',
    lat: 33.5950, lng: -7.6150, phone: '+212 6 11 22 33 44', completedJobs: 367, activeJobs: 0,
    responseTime: '< 20 min', verified: true,
    portfolio: [{ id: 1, emoji: '🔑', label: 'Serrures' }, { id: 2, emoji: '🚪', label: 'Ouverture' }],
    reviewsList: [
      { id: 1, author: 'Younes B.', rating: 5, comment: 'Arrivé en 15 min, ouverture sans dégât !', date: '20 Fév 2026', avatar: 'YB' },
    ],
  },
  {
    id: 37, name: 'Tariq Bennasser', specialty: 'Serrurier blindage', category: 'Serrurerie',
    rating: 4.8, reviews: 54, location: 'Maarif, Casablanca', distance: 1.7, price: 180,
    available: true, avatar: 'TBN', avatarColor: 'from-gray-600 to-zinc-800',
    tags: ['Blindage', 'Porte blindée', 'Sécurité renforcée'],
    bio: 'Spécialiste installation portes blindées et renforcement de serrures. Toutes marques agréées.',
    lat: 33.5870, lng: -7.6220, phone: '+212 6 46 57 68 79', completedJobs: 145, activeJobs: 1,
    responseTime: '< 4h', verified: true,
    portfolio: [{ id: 1, emoji: '🚪', label: 'Blindage' }, { id: 2, emoji: '🔐', label: 'Sécurité' }],
    reviewsList: [
      { id: 1, author: 'Aziz B.', rating: 5, comment: 'Porte blindée posée proprement.', date: '15 Fév 2026', avatar: 'AB' },
    ],
  },
  {
    id: 38, name: 'Khalil Essadki', specialty: 'Technicien coffre-fort', category: 'Serrurerie',
    rating: 4.7, reviews: 31, location: 'Gauthier, Casablanca', distance: 2.5, price: 200,
    available: true, avatar: 'KE', avatarColor: 'from-zinc-500 to-slate-700',
    tags: ['Coffre-fort', 'Ouverture coffre', 'Installation'],
    bio: 'Expert coffres-forts. Ouverture, installation et réparation de coffres-forts toutes marques.',
    lat: 33.5910, lng: -7.6440, phone: '+212 6 57 68 79 80', completedJobs: 78, activeJobs: 0,
    responseTime: '< 3h', verified: true,
    portfolio: [{ id: 1, emoji: '🔒', label: 'Coffre-fort' }, { id: 2, emoji: '🔑', label: 'Ouverture' }],
    reviewsList: [
      { id: 1, author: 'Samir F.', rating: 5, comment: 'Coffre ouvert sans aucun dégât, merci !', date: '18 Fév 2026', avatar: 'SF' },
    ],
  },

  // ── CLIMATISATION ──────────────────────────────────────────────────────────
  {
    id: 8, name: 'Rachida Tazi', specialty: 'Technicienne climatisation', category: 'Climatisation',
    rating: 4.6, reviews: 91, location: 'Ain Diab, Casablanca', distance: 5.2, price: 180,
    available: false, avatar: 'RT', avatarColor: 'from-cyan-500 to-sky-600',
    tags: ['Installation', 'Entretien annuel', 'Réparation'],
    bio: 'Technicienne spécialisée en climatisation. Installation, entretien annuel et réparation de tous types.',
    lat: 33.5800, lng: -7.6700, phone: '+212 6 66 55 44 33', completedJobs: 284, activeJobs: 2,
    responseTime: '< 2h', verified: true,
    portfolio: [{ id: 1, emoji: '❄️', label: 'Clim' }, { id: 2, emoji: '🔧', label: 'Réparation' }],
    reviewsList: [
      { id: 1, author: 'Mostafa K.', rating: 5, comment: 'Installation parfaite.', date: '13 Fév 2026', avatar: 'MK' },
    ],
  },
  {
    id: 39, name: 'Saad El Mansouri', specialty: 'Technicien clim installation', category: 'Climatisation',
    rating: 4.9, reviews: 67, location: 'Maarif, Casablanca', distance: 1.9, price: 170,
    available: true, avatar: 'SEM', avatarColor: 'from-sky-400 to-cyan-700',
    tags: ['Installation', 'Split system', 'Multi-split'],
    bio: 'Spécialiste installation de climatiseurs split et multi-split. Toutes marques, travail propre et rapide.',
    lat: 33.5850, lng: -7.6230, phone: '+212 6 68 79 80 91', completedJobs: 234, activeJobs: 0,
    responseTime: '< 3h', verified: true,
    portfolio: [{ id: 1, emoji: '❄️', label: 'Split' }, { id: 2, emoji: '🔧', label: 'Installation' }],
    reviewsList: [
      { id: 1, author: 'Nadia T.', rating: 5, comment: 'Clim installée proprement, très satisfait.', date: '17 Fév 2026', avatar: 'NT' },
    ],
  },
  {
    id: 40, name: 'Ilham Benali', specialty: 'Maintenance climatisation', category: 'Climatisation',
    rating: 4.7, reviews: 48, location: 'CIL, Casablanca', distance: 2.3, price: 150,
    available: true, avatar: 'ILB', avatarColor: 'from-blue-400 to-sky-600',
    tags: ['Entretien annuel', 'Maintenance', 'Nettoyage filtres'],
    bio: 'Technicienne maintenance et entretien annuel de climatiseurs. Nettoyage filtres, recharge gaz, diagnostic.',
    lat: 33.5820, lng: -7.6190, phone: '+212 6 79 80 91 02', completedJobs: 145, activeJobs: 1,
    responseTime: '< 2h', verified: false,
    portfolio: [{ id: 1, emoji: '🌡️', label: 'Entretien' }, { id: 2, emoji: '🔬', label: 'Diagnostic' }],
    reviewsList: [
      { id: 1, author: 'Karim S.', rating: 5, comment: 'Clim comme neuve après l\'entretien.', date: '14 Fév 2026', avatar: 'KS' },
    ],
  },

  // ── DÉMÉNAGEMENT ───────────────────────────────────────────────────────────
  {
    id: 29, name: 'Yassine Alami', specialty: 'Déménageur professionnel', category: 'Déménagement',
    rating: 4.8, reviews: 167, location: 'Hay Hassani, Casablanca', distance: 2.6, price: 200,
    available: true, avatar: 'YA', avatarColor: 'from-orange-500 to-amber-600',
    tags: ['Déménagement complet', 'Camion 20m³', 'Emballage inclus'],
    bio: 'Déménageur professionnel avec camion équipé 20m³. Emballage, transport et installation.',
    lat: 33.5710, lng: -7.6420, phone: '+212 6 79 80 91 02', completedJobs: 445, activeJobs: 1,
    responseTime: '< 24h', verified: true,
    portfolio: [{ id: 1, emoji: '🚚', label: 'Camion' }, { id: 2, emoji: '📦', label: 'Emballage' }],
    reviewsList: [
      { id: 1, author: 'Rachid M.', rating: 5, comment: 'Déménagement sans stress, très efficace !', date: '18 Fév 2026', avatar: 'RM' },
    ],
  },
  {
    id: 30, name: 'Khalil Bensouda', specialty: 'Petit déménagement express', category: 'Déménagement',
    rating: 4.7, reviews: 89, location: 'CIL, Casablanca', distance: 1.8, price: 150,
    available: true, avatar: 'KLB', avatarColor: 'from-amber-500 to-orange-700',
    tags: ['Petit déménagement', 'Studio', 'Camionnette'],
    bio: 'Spécialiste petits déménagements et transport de meubles. Camionnette disponible.',
    lat: 33.5820, lng: -7.6180, phone: '+212 6 80 91 02 13', completedJobs: 234, activeJobs: 0,
    responseTime: '< 4h', verified: false,
    portfolio: [{ id: 1, emoji: '🚐', label: 'Camionnette' }, { id: 2, emoji: '🏠', label: 'Studio' }],
    reviewsList: [
      { id: 1, author: 'Sanae B.', rating: 5, comment: 'Déménagement studio fait en 3h, super !', date: '15 Fév 2026', avatar: 'SBD' },
    ],
  },
  {
    id: 31, name: 'Reda Fassi', specialty: 'Monteur meubles expert', category: 'Déménagement',
    rating: 4.9, reviews: 112, location: 'Maarif, Casablanca', distance: 1.3, price: 100,
    available: true, avatar: 'RF', avatarColor: 'from-yellow-600 to-amber-700',
    tags: ['Montage meubles', 'IKEA', 'Assemblage rapide'],
    bio: 'Expert montage de meubles toutes marques. IKEA, But, Kitea... Rapide, précis, sans erreur.',
    lat: 33.5880, lng: -7.6230, phone: '+212 6 91 02 13 24', completedJobs: 678, activeJobs: 2,
    responseTime: '< 2h', verified: true,
    portfolio: [{ id: 1, emoji: '🪑', label: 'Meubles' }, { id: 2, emoji: '🔧', label: 'Assemblage' }],
    reviewsList: [
      { id: 1, author: 'Loubna K.', rating: 5, comment: '6 meubles montés en une matinée !', date: '20 Fév 2026', avatar: 'LK' },
    ],
  },
  {
    id: 32, name: 'Samir Ghazali', specialty: 'Transport express volumineux', category: 'Déménagement',
    rating: 4.6, reviews: 78, location: 'Ain Sebaa, Casablanca', distance: 4.4, price: 120,
    available: true, avatar: 'SG', avatarColor: 'from-red-500 to-orange-600',
    tags: ['Transport express', 'Livraison urgente', 'Disponible 7j/7'],
    bio: 'Transport express de meubles et objets volumineux. Disponible 7j/7, camion propre et équipé.',
    lat: 33.6020, lng: -7.5560, phone: '+212 6 02 13 24 35', completedJobs: 345, activeJobs: 1,
    responseTime: '< 1h', verified: false,
    portfolio: [{ id: 1, emoji: '⚡', label: 'Express' }, { id: 2, emoji: '🚛', label: 'Transport' }],
    reviewsList: [
      { id: 1, author: 'Karima T.', rating: 4, comment: 'Livraison rapide et sans dommage.', date: '12 Fév 2026', avatar: 'KT' },
    ],
  },
  {
    id: 33, name: 'Aicha Lakhdar', specialty: 'Garde-meuble & stockage', category: 'Déménagement',
    rating: 4.7, reviews: 34, location: 'Sidi Bernoussi, Casablanca', distance: 5.8, price: 80,
    available: true, avatar: 'AL', avatarColor: 'from-orange-400 to-red-500',
    tags: ['Stockage', 'Garde-meuble', 'Box sécurisé'],
    bio: 'Service de stockage sécurisé. Box de toutes tailles, accès 24h, surveillance vidéo.',
    lat: 33.6070, lng: -7.5400, phone: '+212 6 13 24 35 46', completedJobs: 89, activeJobs: 0,
    responseTime: '< 24h', verified: true,
    portfolio: [{ id: 1, emoji: '🏭', label: 'Stockage' }, { id: 2, emoji: '📦', label: 'Box' }],
    reviewsList: [
      { id: 1, author: 'Omar S.', rating: 5, comment: 'Box propre et sécurisé, parfait.', date: '8 Fév 2026', avatar: 'OS' },
    ],
  },

  // ── SÉCURITÉ ───────────────────────────────────────────────────────────────
  {
    id: 34, name: 'Nabil Fassi Fihri', specialty: 'Technicien alarme intrusion', category: 'Sécurité',
    rating: 4.8, reviews: 56, location: 'Anfa Supérieur, Casablanca', distance: 3.2, price: 220,
    available: true, avatar: 'NFH', avatarColor: 'from-red-600 to-rose-700',
    tags: ['Alarme', 'Détecteur', 'Anti-intrusion'],
    bio: 'Technicien certifié en systèmes d\'alarme anti-intrusion. Installation et maintenance.',
    lat: 33.5990, lng: -7.6310, phone: '+212 6 24 35 46 57', completedJobs: 145, activeJobs: 0,
    responseTime: '< 3h', verified: true,
    portfolio: [{ id: 1, emoji: '🚨', label: 'Alarme' }, { id: 2, emoji: '🔔', label: 'Détecteur' }],
    reviewsList: [
      { id: 1, author: 'Hicham K.', rating: 5, comment: 'Installation alarme professionnelle.', date: '17 Fév 2026', avatar: 'HK' },
    ],
  },
  {
    id: 35, name: 'Charaf Bennani', specialty: 'Expert vidéosurveillance', category: 'Sécurité',
    rating: 4.9, reviews: 78, location: 'Gauthier, Casablanca', distance: 2.1, price: 250,
    available: true, avatar: 'CB', avatarColor: 'from-gray-600 to-slate-800',
    tags: ['Caméra', 'Vidéosurveillance', 'CCTV'],
    bio: 'Expert vidéosurveillance. Installation de caméras IP, CCTV et systèmes de surveillance à distance.',
    lat: 33.5920, lng: -7.6440, phone: '+212 6 35 46 57 68', completedJobs: 234, activeJobs: 1,
    responseTime: '< 4h', verified: true,
    portfolio: [{ id: 1, emoji: '📷', label: 'Caméras' }, { id: 2, emoji: '💻', label: 'Surveillance' }],
    reviewsList: [
      { id: 1, author: 'Tarik B.', rating: 5, comment: '8 caméras installées, parfait !', date: '19 Fév 2026', avatar: 'TB' },
    ],
  },
];

// ─── Conversations ────────────────────────────────────────────────────────────
export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    proId: 1,
    messages: [
      { id: 1, senderId: 1, text: 'Bonjour ! Je suis disponible pour votre fuite. Pouvez-vous me décrire le problème ?', time: '10:02', read: true },
      { id: 2, senderId: 'client', text: 'Bonjour ! C\'est une fuite sous l\'évier de la cuisine, ça goutte depuis hier soir.', time: '10:05', read: true },
      { id: 3, senderId: 1, text: 'D\'accord, je peux passer dans 30 minutes. C\'est un siphon ou le flexible ?', time: '10:07', read: true },
      { id: 4, senderId: 'client', text: 'Je pense que c\'est le siphon.', time: '10:09', read: false },
    ],
  },
  {
    proId: 6,
    messages: [
      { id: 1, senderId: 6, text: 'Bonjour ! Je suis disponible pour le ménage. Quelle surface à nettoyer ?', time: '09:30', read: true },
      { id: 2, senderId: 'client', text: 'Appartement de 80m², salon + 2 chambres + cuisine + salle de bain.', time: '09:35', read: true },
    ],
  },
];

// ─── FAQ ─────────────────────────────────────────────────────────────────────
export const FAQ_ITEMS: FaqItem[] = [
  { id: 1, category: 'utilisation', question: 'Comment trouver un prestataire proche de chez moi ?', answer: 'Utilisez la vue "Carte" pour voir tous les prestataires disponibles autour de vous. Vous pouvez ajuster le rayon de recherche de 1 à 50 km dans les filtres.' },
  { id: 2, category: 'utilisation', question: 'Comment fonctionne le système de swipe ?', answer: 'Dans la vue "Swipe", faites glisser la carte vers la droite pour aimer un prestataire et vers la gauche pour passer au suivant.' },
  { id: 3, category: 'utilisation', question: 'Comment suivre mon prestataire en temps réel ?', answer: 'Après confirmation de votre réservation, vous aurez accès à la vue "Suivi" qui affiche la position en temps réel de votre prestataire.' },
  { id: 4, category: 'paiement', question: 'Quels modes de paiement sont acceptés ?', answer: 'Nous acceptons les paiements par carte bancaire (Visa, Mastercard, CMI) et en espèces.' },
  { id: 5, category: 'paiement', question: 'Y a-t-il des frais cachés ?', answer: 'Non. Le prix affiché est le tarif horaire. Une commission de 5% est ajoutée uniquement lors du paiement en ligne.' },
  { id: 6, category: 'paiement', question: 'Puis-je annuler ma réservation ?', answer: 'Oui, vous pouvez annuler jusqu\'à 2h avant l\'intervention sans frais.' },
  { id: 7, category: 'technique', question: 'L\'application ne charge pas la carte, que faire ?', answer: 'Vérifiez votre connexion internet et que le navigateur a bien accès à votre géolocalisation.' },
  { id: 8, category: 'technique', question: 'Je n\'arrive pas à envoyer de messages, comment résoudre ?', answer: 'Vérifiez que vous êtes bien connecté et effacez le cache de votre navigateur.' },
  { id: 9, category: 'securite', question: 'Les prestataires sont-ils vérifiés ?', answer: 'Oui, tous les prestataires avec le badge ✓ ont passé notre vérification : CIN, antécédents et certifications.' },
  { id: 10, category: 'securite', question: 'Mes données personnelles sont-elles protégées ?', answer: 'Absolument. Vos données sont chiffrées et nous ne les partageons jamais sans votre consentement.' },
];

// ─── Service Categories ───────────────────────────────────────────────────────
export const SERVICE_CATEGORIES = [
  { label: 'Tous',          emoji: '🔍' },
  { label: 'Plomberie',     emoji: '🔧' },
  { label: 'Électricité',   emoji: '⚡' },
  { label: 'Peinture',      emoji: '🎨' },
  { label: 'Jardinage',     emoji: '🌿' },
  { label: 'Ménage',        emoji: '🧹' },
  { label: 'Menuiserie',    emoji: '🪵' },
  { label: 'Serrurerie',    emoji: '🔑' },
  { label: 'Climatisation', emoji: '❄️' },
  { label: 'Déménagement',  emoji: '📦' },
  { label: 'Sécurité',      emoji: '🔒' },
] as const;