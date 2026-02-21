import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import { FaFacebook } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [pendingFbUser, setPendingFbUser] = useState<any>(null);

  const { login, loginWithGoogle, loginWithFacebook, loginWithApple, setUserFromOAuth, isLoading } = useAuth();
  const navigate = useNavigate();

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      navigate('/');
    }, 2000);
  };

  // Pick up Facebook OAuth result after redirect — ONLY autofill, user must still click submit
  useEffect(() => {
    const pending = localStorage.getItem('fb_oauth_pending');
    if (pending) {
      try {
        const fbUser = JSON.parse(pending);
        localStorage.removeItem('fb_oauth_pending');
        // Only autofill the fields — do NOT log in or navigate
        setEmail(fbUser.email);
        setPassword('facebook_oauth_token'); // internal marker, not shown as real password
        // Store the pending profile so handleSubmit can use it
        setPendingFbUser(fbUser);
      } catch {
        localStorage.removeItem('fb_oauth_pending');
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (pendingFbUser) {
        // Facebook OAuth was used — log in with the stored profile
        setUserFromOAuth(pendingFbUser);
        triggerToast('Connexion Facebook réussie ! Bienvenue ' + pendingFbUser.name + ' 👋');
      } else {
        await login(email, password);
        triggerToast('Connexion réussie ! Bienvenue 👋');
      }
    } catch {
      setError('Email ou mot de passe incorrect');
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
      });
      const profile = await res.json();
      loginWithGoogle(profile);
      // Auto-fill fields
      setEmail(profile.email);
      setPassword('••••••••');
      triggerToast('Connexion Google réussie ! Bienvenue ' + profile.name + ' 👋');
    },
    onError: () => setError('Erreur lors de la connexion avec Google'),
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 via-slate-200 to-orange-400 flex items-center justify-center px-4 py-12">

      {/* Success Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -60, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -60, scale: 0.9 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-white border border-green-200 shadow-2xl rounded-2xl px-6 py-4 min-w-[300px]"
          >
            <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center shrink-0">
              <CheckCircle size={20} className="text-green-600" />
            </div>
            <p className="text-gray-800 font-semibold text-sm">{toastMsg}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-md w-full">

        {/* ── Logo + Name horizontal ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <img src="/logos/nobg_logo.png" alt="RilyBricoule" className="h-14 w-14 object-contain flex-shrink-0" />
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-orange-500 to-cyan-500 bg-clip-text text-transparent leading-tight">
              RilyBricoule
            </h1>
            <p className="text-gray-600 text-sm mt-0.5">Connectez-vous à votre compte</p>
          </div>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
        >
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>
          )}

          {pendingFbUser && (
            <div className="mb-4 flex items-center gap-2.5 p-3 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-700">
              <span className="text-blue-500">✔</span>
              <span>Connecté en tant que <strong>{pendingFbUser.name}</strong> via Facebook. Cliquez sur <strong>Se connecter</strong> pour continuer.</span>
            </div>
          )}

          {/* Social Buttons — Google, Facebook, Apple ONLY */}
          <div className="space-y-3 mb-6">
            <button onClick={() => handleGoogleLogin()} disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all font-medium text-gray-700 disabled:opacity-50">
              <GoogleIcon /> Continuer avec Google
            </button>

            <button onClick={() => loginWithFacebook('/login')} disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all font-medium text-gray-700 disabled:opacity-50">
              <FaFacebook size={22} className="text-[#1877F2]" /> Continuer avec Facebook
            </button>

            <button onClick={loginWithApple} disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-black hover:bg-gray-900 rounded-xl transition-all font-medium text-white disabled:opacity-50">
              <AppleIcon className="text-white" /> Continuer avec Apple
            </button>
          </div>

          <Divider />

          {/* Email/Password */}
          <form onSubmit={handleSubmit} className="space-y-4 mt-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input type={showPassword ? 'text' : 'password'} required value={password}
                  onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                <span className="text-sm text-gray-600">Se souvenir de moi</span>
              </label>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">Mot de passe oublié?</a>
            </div>

            <motion.button type="submit" disabled={isLoading}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-blue-600 via-orange-500 to-blue-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoading
                ? <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" /> Connexion...</>
                : <>Se connecter <ArrowRight size={20} /></>}
            </motion.button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Pas encore de compte?{' '}
            <a href="/register" className="text-blue-600 hover:text-blue-700 font-semibold">Créer un compte</a>
          </p>
        </motion.div>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="text-center text-sm text-gray-500 mt-8">
          En vous connectant, vous acceptez nos{' '}
          <a href="#" className="text-blue-600 hover:underline">Conditions d'utilisation</a>
          {' '}et notre{' '}
          <a href="#" className="text-blue-600 hover:underline">Politique de confidentialité</a>
        </motion.p>
      </div>
    </div>
  );
}

function Divider() {
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
      <div className="relative flex justify-center text-sm"><span className="px-4 bg-white text-gray-500">Ou avec votre email</span></div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48">
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.2l6.8-6.8C35.8 2.2 30.2 0 24 0 14.8 0 6.9 5.4 3 13.3l7.9 6.1C12.8 13.2 17.9 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17z"/>
      <path fill="#FBBC05" d="M10.9 28.6A14.8 14.8 0 019.5 24c0-1.6.3-3.2.8-4.6L2.4 13.3A23.9 23.9 0 000 24c0 3.8.9 7.4 2.5 10.6l8.4-6z"/>
      <path fill="#34A853" d="M24 48c6.2 0 11.4-2 15.2-5.5l-7.5-5.8c-2 1.4-4.6 2.2-7.7 2.2-6.1 0-11.2-3.7-13.1-9l-7.9 6.1C6.9 42.6 14.8 48 24 48z"/>
    </svg>
  );
}

function AppleIcon({ className = '' }: { className?: string }) {
  return (
    <svg width="18" height="22" viewBox="0 0 814 1000" fill="currentColor" className={className}>
      <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-37.5-150.3-88.1C27.8 768.4 1 583.7 1 406.7c0-290.2 184.5-443.9 366-443.9 96.2 0 176.2 63.5 235.8 63.5 54.4 0 140.1-67.5 250.8-67.5 40.3 0 108.2 3.7 171.2 55.8zm-178.2-102.4c-54.4 0-130.3-51.8-213.1-51.8-20.5 0-41.1 2.4-61.1 7.4 35.9-91.4 107.2-143.1 172.2-143.1 53.3 0 122.1 38.4 122.1 118.5 0 23.7-7.9 55.5-20.1 69z"/>
    </svg>
  );
}