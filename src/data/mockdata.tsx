import type { Pro, Conversation, FaqItem } from '../types';

// ─── Prestataires ─────────────────────────────────────────────────────────────
export const PROS: Pro[] = [
  {
    id: 1, name: 'Ahmed Karimi', specialty: 'Plombier certifié', category: 'Plomberie',
    rating: 4.9, reviews: 127, location: 'Maarif, Casablanca', distance: 1.2, price: 150,
    available: true, avatar: 'AK', avatarColor: 'from-blue-500 to-blue-700',
    tags: ['Urgence', 'Chauffe-eau', 'Fuite'],
    bio: 'Plombier avec 12 ans d\'expérience. Spécialisé dans les réparations urgentes, installation sanitaire et détection de fuites. Intervention sous 1h garantie.',
    lat: 33.5892, lng: -7.6033, phone: '+212 6 12 34 56 78', completedJobs: 843,
    responseTime: '< 15 min', verified: true,
    portfolio: [{ id: 1, emoji: '🚿', label: 'Salle de bain' }, { id: 2, emoji: '🔧', label: 'Robinetterie' }, { id: 3, emoji: '🪠', label: 'Débouchage' }],
    reviewsList: [
      { id: 1, author: 'Karim B.', rating: 5, comment: 'Intervention rapide et propre. Très professionnel !', date: '20 Fév 2026', avatar: 'KB' },
      { id: 2, author: 'Sara M.', rating: 5, comment: 'A réparé la fuite en 30 minutes. Je recommande vivement.', date: '15 Fév 2026', avatar: 'SM' },
      { id: 3, author: 'Omar T.', rating: 4, comment: 'Bon travail, ponctuel. Prix un peu élevé mais qualité au rendez-vous.', date: '10 Fév 2026', avatar: 'OT' },
    ],
  },
  {
    id: 2, name: 'Fatima Zouai', specialty: 'Électricienne diplômée', category: 'Électricité',
    rating: 4.8, reviews: 89, location: 'Hay Hassani, Casablanca', distance: 2.1, price: 130,
    available: true, avatar: 'FZ', avatarColor: 'from-yellow-500 to-orange-500',
    tags: ['Tableau électrique', 'Domotique', 'Rénovation'],
    bio: 'Électricienne diplômée passionnée par les solutions modernes. Rénovations complètes, dépannages rapides et installation de systèmes domotiques.',
    lat: 33.5720, lng: -7.6410, phone: '+212 6 98 76 54 32', completedJobs: 412,
    responseTime: '< 30 min', verified: true,
    portfolio: [{ id: 1, emoji: '💡', label: 'Éclairage' }, { id: 2, emoji: '🔌', label: 'Prises' }, { id: 3, emoji: '⚡', label: 'Tableau' }],
    reviewsList: [
      { id: 1, author: 'Nadia L.', rating: 5, comment: 'Excellente professionnelle, très compétente.', date: '18 Fév 2026', avatar: 'NL' },
      { id: 2, author: 'Hicham R.', rating: 5, comment: 'Travail soigné, je referai appel à ses services.', date: '12 Fév 2026', avatar: 'HR' },
    ],
  },
  {
    id: 3, name: 'Youssef Ben Ali', specialty: 'Peintre décorateur', category: 'Peinture',
    rating: 4.7, reviews: 204, location: 'Anfa, Casablanca', distance: 0.8, price: 120,
    available: false, avatar: 'YB', avatarColor: 'from-pink-500 to-rose-500',
    tags: ['Décoration', 'Enduit', 'Ravalement'],
    bio: 'Artisan peintre avec 8 ans d\'expérience. Finitions impeccables, respect des délais et des couleurs. Devis gratuit sous 24h.',
    lat: 33.5970, lng: -7.6320, phone: '+212 6 55 44 33 22', completedJobs: 631,
    responseTime: '< 1h', verified: true,
    portfolio: [{ id: 1, emoji: '🎨', label: 'Décoration' }, { id: 2, emoji: '🖌️', label: 'Finitions' }, { id: 3, emoji: '🏠', label: 'Façade' }],
    reviewsList: [
      { id: 1, author: 'Amina K.', rating: 5, comment: 'Le salon est magnifique ! Un vrai artiste.', date: '19 Fév 2026', avatar: 'AK' },
      { id: 2, author: 'Rachid O.', rating: 4, comment: 'Beau travail, quelques petites retouches à faire.', date: '11 Fév 2026', avatar: 'RO' },
    ],
  },
  {
    id: 4, name: 'Laila Mansouri', specialty: 'Jardinière paysagiste', category: 'Jardinage',
    rating: 4.9, reviews: 63, location: 'Californie, Casablanca', distance: 3.4, price: 100,
    available: true, avatar: 'LM', avatarColor: 'from-green-500 to-emerald-600',
    tags: ['Taille', 'Gazon', 'Plantation'],
    bio: 'Paysagiste diplômée, transforme votre jardin en oasis. Entretien régulier ou intervention ponctuelle, plantes d\'intérieur et extérieur.',
    lat: 33.6040, lng: -7.5980, phone: '+212 6 77 88 99 00', completedJobs: 198,
    responseTime: '< 2h', verified: false,
    portfolio: [{ id: 1, emoji: '🌿', label: 'Jardin' }, { id: 2, emoji: '✂️', label: 'Taille' }, { id: 3, emoji: '🌸', label: 'Plantation' }],
    reviewsList: [
      { id: 1, author: 'Dounia F.', rating: 5, comment: 'Mon jardin n\'a jamais été aussi beau !', date: '17 Fév 2026', avatar: 'DF' },
    ],
  },
  {
    id: 5, name: 'Khalid Ouali', specialty: 'Menuisier ébéniste', category: 'Menuiserie',
    rating: 4.6, reviews: 145, location: 'Bernoussi, Casablanca', distance: 4.7, price: 140,
    available: true, avatar: 'KO', avatarColor: 'from-amber-600 to-yellow-700',
    tags: ['Portes', 'Meubles sur mesure', 'Parquet'],
    bio: 'Menuisier ébéniste avec 15 ans d\'expérience. Création de meubles sur mesure, installation de parquet et rénovation de portes et fenêtres.',
    lat: 33.6100, lng: -7.5500, phone: '+212 6 33 22 11 00', completedJobs: 509,
    responseTime: '< 3h', verified: true,
    portfolio: [{ id: 1, emoji: '🪵', label: 'Bois' }, { id: 2, emoji: '🚪', label: 'Portes' }, { id: 3, emoji: '🪑', label: 'Meubles' }],
    reviewsList: [
      { id: 1, author: 'Samira A.', rating: 5, comment: 'Cuisine sur mesure parfaite, très satisfaite.', date: '16 Fév 2026', avatar: 'SA' },
      { id: 2, author: 'Mehdi Z.', rating: 4, comment: 'Beau travail artisanal, délai respecté.', date: '8 Fév 2026', avatar: 'MZ' },
    ],
  },
  {
    id: 6, name: 'Zineb Alaoui', specialty: 'Aide ménagère', category: 'Ménage',
    rating: 4.8, reviews: 312, location: 'CIL, Casablanca', distance: 1.5, price: 80,
    available: true, avatar: 'ZA', avatarColor: 'from-purple-500 to-violet-600',
    tags: ['Nettoyage', 'Repassage', 'Vitres'],
    bio: 'Service de ménage professionnel et de confiance. Nettoyage complet, repassage, ménage régulier ou ponctuel avec produits fournis.',
    lat: 33.5810, lng: -7.6200, phone: '+212 6 44 55 66 77', completedJobs: 1204,
    responseTime: '< 1h', verified: true,
    portfolio: [{ id: 1, emoji: '🧹', label: 'Ménage' }, { id: 2, emoji: '👕', label: 'Repassage' }, { id: 3, emoji: '✨', label: 'Vitres' }],
    reviewsList: [
      { id: 1, author: 'Leila S.', rating: 5, comment: 'Impeccable ! Maison comme un sou neuf.', date: '21 Fév 2026', avatar: 'LS' },
      { id: 2, author: 'Anas M.', rating: 5, comment: 'Sérieuse, ponctuelle, parfaite.', date: '14 Fév 2026', avatar: 'AM' },
    ],
  },
  {
    id: 7, name: 'Hamid Chraibi', specialty: 'Serrurier', category: 'Serrurerie',
    rating: 4.7, reviews: 78, location: 'Bourgogne, Casablanca', distance: 2.8, price: 160,
    available: true, avatar: 'HC', avatarColor: 'from-slate-500 to-gray-700',
    tags: ['Urgence', 'Blindage', 'Coffre-fort'],
    bio: 'Serrurier disponible 24h/24 et 7j/7. Ouverture de porte sans dégât, installation de serrures haute sécurité et blindage de porte.',
    lat: 33.5950, lng: -7.6150, phone: '+212 6 11 22 33 44', completedJobs: 367,
    responseTime: '< 20 min', verified: true,
    portfolio: [{ id: 1, emoji: '🔑', label: 'Serrures' }, { id: 2, emoji: '🚪', label: 'Blindage' }, { id: 3, emoji: '🔐', label: 'Sécurité' }],
    reviewsList: [
      { id: 1, author: 'Younes B.', rating: 5, comment: 'Arrivé en 15 minutes, ouverture sans aucun dégât !', date: '20 Fév 2026', avatar: 'YB' },
    ],
  },
  {
    id: 8, name: 'Rachida Tazi', specialty: 'Technicienne climatisation', category: 'Climatisation',
    rating: 4.6, reviews: 91, location: 'Ain Diab, Casablanca', distance: 5.2, price: 180,
    available: false, avatar: 'RT', avatarColor: 'from-cyan-500 to-sky-600',
    tags: ['Installation', 'Entretien', 'Réparation'],
    bio: 'Technicienne spécialisée en climatisation. Installation, entretien annuel et réparation de tous types de climatiseurs.',
    lat: 33.5800, lng: -7.6700, phone: '+212 6 66 55 44 33', completedJobs: 284,
    responseTime: '< 2h', verified: true,
    portfolio: [{ id: 1, emoji: '❄️', label: 'Clim' }, { id: 2, emoji: '🌡️', label: 'Entretien' }, { id: 3, emoji: '🔧', label: 'Réparation' }],
    reviewsList: [
      { id: 1, author: 'Mostafa K.', rating: 5, comment: 'Très compétente, installation parfaite.', date: '13 Fév 2026', avatar: 'MK' },
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
  { id: 1, category: 'utilisation', question: 'Comment trouver un prestataire proche de chez moi ?', answer: 'Utilisez la vue "Carte" pour voir tous les prestataires disponibles autour de vous. Vous pouvez ajuster le rayon de recherche de 1 à 50 km dans les filtres. Cliquez sur un marqueur pour voir le profil complet du prestataire.' },
  { id: 2, category: 'utilisation', question: 'Comment fonctionne le système de swipe ?', answer: 'Dans la vue "Swipe", faites glisser la carte vers la droite pour aimer un prestataire et vers la gauche pour passer au suivant. Les prestataires que vous aimez apparaissent dans vos favoris.' },
  { id: 3, category: 'utilisation', question: 'Comment suivre mon prestataire en temps réel ?', answer: 'Après confirmation de votre réservation, vous aurez accès à la vue "Suivi" qui affiche la position en temps réel de votre prestataire, son temps d\'arrivée estimé et l\'itinéraire complet.' },
  { id: 4, category: 'paiement', question: 'Quels modes de paiement sont acceptés ?', answer: 'Nous acceptons les paiements par carte bancaire (Visa, Mastercard, CMI) et en espèces. Le paiement par carte est sécurisé et crypté. Vous pouvez aussi payer en espèces directement au prestataire.' },
  { id: 5, category: 'paiement', question: 'Y a-t-il des frais cachés ?', answer: 'Non. Le prix affiché est le tarif horaire du prestataire. Une commission de service de 5% est ajoutée uniquement lors du paiement en ligne. Aucun abonnement, aucun frais d\'inscription.' },
  { id: 6, category: 'paiement', question: 'Puis-je annuler ma réservation ?', answer: 'Oui, vous pouvez annuler jusqu\'à 2h avant l\'intervention sans frais. Au-delà, des frais d\'annulation de 20% du devis peuvent s\'appliquer.' },
  { id: 7, category: 'technique', question: 'L\'application ne charge pas la carte, que faire ?', answer: 'Vérifiez votre connexion internet. Si le problème persiste, actualisez la page. La carte utilise votre géolocalisation — assurez-vous que le navigateur a bien accès à votre position dans les paramètres.' },
  { id: 8, category: 'technique', question: 'Je n\'arrive pas à envoyer de messages, comment résoudre ?', answer: 'Vérifiez que vous êtes bien connecté à votre compte. Si le problème persiste, effacez le cache de votre navigateur et reconnectez-vous. Contactez notre support si l\'issue continue.' },
  { id: 9, category: 'securite', question: 'Les prestataires sont-ils vérifiés ?', answer: 'Oui, tous les prestataires avec le badge ✓ ont passé notre vérification : CIN vérifiée, antécédents vérifiés, diplômes ou certifications confirmés. Nous effectuons aussi des vérifications périodiques.' },
  { id: 10, category: 'securite', question: 'Mes données personnelles sont-elles protégées ?', answer: 'Absolument. Vos données sont chiffrées et stockées de manière sécurisée. Nous ne partageons jamais vos informations avec des tiers sans votre consentement, conformément au RGPD.' },
];

// ─── Service Categories ───────────────────────────────────────────────────────
export const SERVICE_CATEGORIES = [
  { label: 'Tous', emoji: '🔍' },
  { label: 'Plomberie', emoji: '🔧' },
  { label: 'Électricité', emoji: '⚡' },
  { label: 'Peinture', emoji: '🎨' },
  { label: 'Jardinage', emoji: '🌿' },
  { label: 'Ménage', emoji: '🧹' },
  { label: 'Menuiserie', emoji: '🪵' },
  { label: 'Serrurerie', emoji: '🔑' },
  { label: 'Climatisation', emoji: '❄️' },
  { label: 'Déménagement', emoji: '📦' },
] as const;