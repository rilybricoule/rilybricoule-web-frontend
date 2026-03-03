import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  provider?: 'email' | 'google' | 'facebook' | 'instagram';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => void;
  loginWithFacebook: () => void;
  loginWithInstagram: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 🔒 Variables d'environnement
const APP_URL = import.meta.env.VITE_APP_URL || 'http://localhost:5173';
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const FACEBOOK_APP_ID = import.meta.env.VITE_FACEBOOK_APP_ID;
const INSTAGRAM_CLIENT_ID = import.meta.env.VITE_INSTAGRAM_CLIENT_ID;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Vérifier si l'utilisateur est déjà connecté
  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem('user');
        
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // 📧 Login avec Email/Password (simulation)
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // ⏳ Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // ✅ Créer un utilisateur fictif
      const mockUser: User = {
        id: Date.now().toString(),
        email: email,
        name: email.split('@')[0],
        provider: 'email'
      };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  // 🔵 Login Google
  const loginWithGoogle = () => {
    if (!GOOGLE_CLIENT_ID) {
      alert('Google OAuth n\'est pas encore configuré.\n\nPour l\'activer:\n1. Créez un projet sur console.cloud.google.com\n2. Ajoutez le Client ID dans .env');
      return;
    }

    // TODO: Implémenter OAuth Google
    const redirectUri = `${APP_URL}/auth/google/callback`;
    const scope = 'email profile';
    
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${GOOGLE_CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent(scope)}`;
    
    window.location.href = authUrl;
  };

  // 🔵 Login Facebook
  const loginWithFacebook = () => {
    if (!FACEBOOK_APP_ID) {
      alert('Facebook OAuth n\'est pas encore configuré.\n\nPour l\'activer:\n1. Créez une app sur developers.facebook.com\n2. Ajoutez l\'App ID dans .env');
      return;
    }

    // TODO: Implémenter OAuth Facebook
    const redirectUri = `${APP_URL}/auth/facebook/callback`;
    const scope = 'email,public_profile';
    
    const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?` +
      `client_id=${FACEBOOK_APP_ID}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `scope=${encodeURIComponent(scope)}&` +
      `response_type=code`;
    
    window.location.href = authUrl;
  };

  // 📷 Login Instagram
  const loginWithInstagram = () => {
    if (!INSTAGRAM_CLIENT_ID) {
      alert('Instagram OAuth n\'est pas encore configuré.\n\nPour l\'activer:\n1. Créez une app sur developers.facebook.com\n2. Ajoutez Instagram Basic Display\n3. Ajoutez le Client ID dans .env');
      return;
    }

    // TODO: Implémenter OAuth Instagram
    const redirectUri = `${APP_URL}/auth/instagram/callback`;
    const scope = 'user_profile,user_media';
    
    const authUrl = `https://api.instagram.com/oauth/authorize?` +
      `client_id=${INSTAGRAM_CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `scope=${encodeURIComponent(scope)}&` +
      `response_type=code`;
    
    window.location.href = authUrl;
  };

  // 🚪 Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    loginWithGoogle,
    loginWithFacebook,
    loginWithInstagram,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}