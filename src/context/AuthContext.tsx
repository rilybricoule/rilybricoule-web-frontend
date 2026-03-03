import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  provider?: 'email' | 'google' | 'facebook' | 'apple';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  successMessage: string;
  clearSuccess: () => void;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (profile: any) => void;
  loginWithFacebook: (origin?: string) => void;
  loginWithApple: () => void;
  setUserFromOAuth: (user: User, message?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const APP_URL = import.meta.env.VITE_APP_URL || 'http://localhost:5173';
const FACEBOOK_APP_ID = import.meta.env.VITE_FACEBOOK_APP_ID;
const APPLE_CLIENT_ID = import.meta.env.VITE_APPLE_CLIENT_ID;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) setUser(JSON.parse(storedUser));
    } catch {
      localStorage.removeItem('user');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearSuccess = () => setSuccessMessage('');

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await new Promise(r => setTimeout(r, 1000));
      const mockUser: User = { id: Date.now().toString(), email, name: email.split('@')[0], provider: 'email' };
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      setSuccessMessage('Connexion réussie ! Bienvenue 👋');
    } catch {
      throw new Error('Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = (profile: any) => {
    const googleUser: User = {
      id: profile.sub || Date.now().toString(),
      email: profile.email,
      name: profile.name,
      avatar: profile.picture,
      provider: 'google',
    };
    setUser(googleUser);
    localStorage.setItem('user', JSON.stringify(googleUser));
  };

  const loginWithFacebook = (origin?: string) => {
    if (!FACEBOOK_APP_ID) { alert('Facebook App ID manquant dans .env'); return; }
    // Save where the user came from so the callback can redirect back
    localStorage.setItem('fb_oauth_origin', origin || window.location.pathname);
    window.location.href =
      `https://www.facebook.com/v18.0/dialog/oauth` +
      `?client_id=${FACEBOOK_APP_ID}` +
      `&redirect_uri=${encodeURIComponent(`${APP_URL}/auth/facebook/callback`)}` +
      `&scope=public_profile&response_type=token`;
  };

  const loginWithApple = () => {
    if (!APPLE_CLIENT_ID) {
      alert('Apple Client ID manquant.\nAjoutez VITE_APPLE_CLIENT_ID dans .env\nConsultez le guide APPLE_OAUTH_GUIDE.md');
      return;
    }
    const state = crypto.randomUUID();
    const nonce = crypto.randomUUID();
    sessionStorage.setItem('apple_oauth_state', state);
    const params = new URLSearchParams({
      client_id: APPLE_CLIENT_ID,
      redirect_uri: `${APP_URL}/auth/apple/callback`,
      response_type: 'code id_token',
      scope: 'name email',
      response_mode: 'form_post',
      state,
      nonce,
    });
    window.location.href = `https://appleid.apple.com/auth/authorize?${params}`;
  };

  const setUserFromOAuth = (u: User, message?: string) => {
    setUser(u);
    localStorage.setItem('user', JSON.stringify(u));
    if (message) setSuccessMessage(message);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{
      user, isAuthenticated: !!user, isLoading, successMessage, clearSuccess,
      login, loginWithGoogle, loginWithFacebook, loginWithApple, setUserFromOAuth, logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}