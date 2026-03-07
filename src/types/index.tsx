export type View =
  | 'explore'
  | 'services'
  | 'map'
  | 'profile'
  | 'tracking'
  | 'messages'
  | 'booking'
  | 'booking-confirm' 
  | 'payment'
  | 'review'
  | 'faq'
  | 'profile-user'
  | 'demandes';

export interface Pro {
  id: number;
  name: string;
  specialty: string;
  category: ServiceCategory;
  rating: number;
  reviews: number;
  location: string;
  distance: number;
  price: number;
  available: boolean;
  avatar: string;
  avatarColor: string;
  tags: string[];
  bio: string;
  lat: number;
  lng: number;
  activeJobs?: number;
  portfolio: PortfolioItem[];
  phone: string;
  completedJobs: number;
  responseTime: string;
  verified: boolean;
  reviewsList: Review[];
}

export interface PortfolioItem {
  id: number;
  emoji: string;
  label: string;
}

export type ServiceCategory =
  | 'Tous'
  | 'Plomberie'
  | 'Électricité'
  | 'Peinture'
  | 'Jardinage'
  | 'Ménage'
  | 'Menuiserie'
  | 'Serrurerie'
  | 'Climatisation'
  | 'Déménagement'
  | 'Sécurité';

export interface Filters {
  category: ServiceCategory;
  maxDistance: number;
  minRating: number;
  maxPrice: number;
  availableOnly: boolean;
  sortBy: 'distance' | 'rating' | 'price_asc' | 'price_desc' | 'reviews';
}

export interface Message {
  id: number;
  senderId: 'client' | number;
  text: string;
  time: string;
  read: boolean;
}

export interface Conversation {
  proId: number;
  messages: Message[];
  pinned?: boolean;
}

export interface Review {
  id: number;
  author: string;
  rating: number;
  comment: string;
  date: string;
  avatar: string;
}

export interface BookingDetails {
  proId: number;
  date: string;
  time: string;
  address: string;
  phone: string;
  notes: string;
  paymentMethod: 'card' | 'cash';
  cardNumber?: string;
  cardName?: string;
  cardExpiry?: string;
  cardCVV?: string;
}


export interface FaqItem {
  id: number;
  question: string;
  answer: string;
  category: 'utilisation' | 'paiement' | 'technique' | 'securite';
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
}