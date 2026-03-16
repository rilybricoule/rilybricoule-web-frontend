import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import { FaFacebook } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// ── RilyBricoule Brand Colors ──────────────────────────────────────────────
// #243B82  Bleu foncé  — Navbar / accents forts
// #1E5BB8  Bleu principal — Hero / header backgrounds
// #E30613  Rouge CTA — boutons d'action
// #F2F3F5  Fond général
// #FFFFFF  Cards
// #E5E7EB  Bordures légères
// ─────────────────────────────────────────────────────────────────────────

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [pendingFbUser, setPendingFbUser] = useState<any>(null);

  const { login, loginWithGoogle, loginWithFacebook, setUserFromOAuth, isLoading } = useAuth();
  const navigate = useNavigate();

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      navigate('/');
    }, 2000);
  };

  useEffect(() => {
    const pending = localStorage.getItem('fb_oauth_pending');
    if (pending) {
      try {
        const fbUser = JSON.parse(pending);
        localStorage.removeItem('fb_oauth_pending');
        setEmail(fbUser.email);
        setPassword('facebook_oauth_token');
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
      setEmail(profile.email);
      setPassword('••••••••');
      triggerToast('Connexion Google réussie ! Bienvenue ' + profile.name + ' 👋');
    },
    onError: () => setError('Erreur lors de la connexion avec Google'),
  });

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: 'linear-gradient(135deg, #243B82 0%, #1E5BB8 50%, #1a4a9a 100%)' }}
    >
      {/* Subtle geometric background pattern */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 30%, #ffffff 1px, transparent 1px),
                            radial-gradient(circle at 80% 70%, #ffffff 1px, transparent 1px),
                            radial-gradient(circle at 50% 50%, #ffffff 0.5px, transparent 0.5px)`,
          backgroundSize: '60px 60px, 80px 80px, 40px 40px',
        }}
      />

      {/* Success Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -60, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -60, scale: 0.9 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-white border shadow-2xl rounded-2xl px-6 py-4 min-w-[300px]"
            style={{ borderColor: '#E5E7EB' }}
          >
            <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: '#dcfce7' }}>
              <CheckCircle size={20} style={{ color: '#16a34a' }} />
            </div>
            <p className="text-gray-800 font-semibold text-sm">{toastMsg}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-md w-full relative z-10">

        {/* ── Logo + Name ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <div
            className="h-14 w-14 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg"
            style={{ backgroundColor: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)' }}
          >
            <img src="/logos/nobg_logo.png" alt="RilyBricoule" className="h-10 w-10 object-contain" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white leading-tight tracking-tight">
              RilyBricoule
            </h1>
            <p className="text-blue-200 text-sm mt-0.5">Connectez-vous à votre compte</p>
          </div>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-2xl p-8"
          style={{ border: '1px solid #E5E7EB' }}
        >
          {error && (
            <div
              className="mb-4 p-3 rounded-xl text-sm font-medium"
              style={{ backgroundColor: '#fff1f2', border: '1px solid #fecdd3', color: '#E30613' }}
            >
              {error}
            </div>
          )}

          {pendingFbUser && (
            <div
              className="mb-4 flex items-center gap-2.5 p-3 rounded-xl text-sm"
              style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', color: '#1E5BB8' }}
            >
              <span>✔</span>
              <span>Connecté en tant que <strong>{pendingFbUser.name}</strong> via Facebook. Cliquez sur <strong>Se connecter</strong> pour continuer.</span>
            </div>
          )}

          {/* Social Buttons */}
          <div className="space-y-3 mb-6">
            <button
              onClick={() => handleGoogleLogin()}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-gray-700 disabled:opacity-50"
              style={{ border: '2px solid #E5E7EB', backgroundColor: '#F2F3F5' }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = '#1E5BB8';
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#eff6ff';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = '#E5E7EB';
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#F2F3F5';
              }}
            >
              <GoogleIcon /> Continuer avec Google
            </button>

            <button
              onClick={() => loginWithFacebook('/login')}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-gray-700 disabled:opacity-50"
              style={{ border: '2px solid #E5E7EB', backgroundColor: '#F2F3F5' }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = '#1E5BB8';
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#eff6ff';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = '#E5E7EB';
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#F2F3F5';
              }}
            >
              <FaFacebook size={22} className="text-[#1877F2]" /> Continuer avec Facebook
            </button>
          </div>

          <Divider />

          {/* Email/Password */}
          <form onSubmit={handleSubmit} className="space-y-4 mt-5">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#243B82' }}>Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: '#1E5BB8' }} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className="block w-full pl-10 pr-3 py-3 rounded-xl text-sm transition-all outline-none"
                  style={{ border: '1.5px solid #E5E7EB', backgroundColor: '#F2F3F5' }}
                  onFocus={e => (e.currentTarget.style.borderColor = '#1E5BB8')}
                  onBlur={e => (e.currentTarget.style.borderColor = '#E5E7EB')}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#243B82' }}>Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: '#1E5BB8' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-10 py-3 rounded-xl text-sm transition-all outline-none"
                  style={{ border: '1.5px solid #E5E7EB', backgroundColor: '#F2F3F5' }}
                  onFocus={e => (e.currentTarget.style.borderColor = '#1E5BB8')}
                  onBlur={e => (e.currentTarget.style.borderColor = '#E5E7EB')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: '#9ca3af' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded"
                  style={{ accentColor: '#1E5BB8' }}
                />
                <span className="text-sm text-gray-600">Se souvenir de moi</span>
              </label>
              <a
                href="#"
                className="text-sm font-medium transition-colors"
                style={{ color: '#1E5BB8' }}
              >
                Mot de passe oublié?
              </a>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full text-white py-3 rounded-xl font-semibold shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: 'linear-gradient(135deg, #E30613 0%, #c0050f 100%)',
                boxShadow: '0 4px 20px rgba(227, 6, 19, 0.35)',
              }}
            >
              {isLoading
                ? <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" /> Connexion...</>
                : <>Se connecter <ArrowRight size={20} /></>}
            </motion.button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Pas encore de compte?{' '}
            <a
              href="/register"
              className="font-semibold transition-colors"
              style={{ color: '#E30613' }}
            >
              Créer un compte
            </a>
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-sm mt-8"
          style={{ color: 'rgba(255,255,255,0.65)' }}
        >
          En vous connectant, vous acceptez nos{' '}
          <a href="#" className="underline" style={{ color: 'rgba(255,255,255,0.9)' }}>Conditions d'utilisation</a>
          {' '}et notre{' '}
          <a href="#" className="underline" style={{ color: 'rgba(255,255,255,0.9)' }}>Politique de confidentialité</a>
        </motion.p>
      </div>
    </div>
  );
}

function Divider() {
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t" style={{ borderColor: '#E5E7EB' }} />
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="px-4 bg-white text-gray-500">Ou avec votre email</span>
      </div>
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