import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, Lock, Eye, EyeOff, ArrowRight, User, MapPin,
  FileText, Plus, X, Briefcase, DollarSign,
  Upload, HardDrive, CheckCircle, Image as ImageIcon,
} from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import { FaFacebook } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

type Role = 'client' | 'prestataire';

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  previewUrl?: string;
  source: 'local' | 'drive';
}

type OAuthUser = {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  provider: 'google' | 'facebook' | 'apple';
};

// ── File Upload Zone ──────────────────────────────────────────────────────────
interface FileUploadZoneProps {
  files: UploadedFile[];
  onFiles: (f: UploadedFile[]) => void;
  accept?: string;
  label: string;
  hint?: string;
  required?: boolean;
  imageOnly?: boolean;
}

function FileUploadZone({ files, onFiles, accept, label, hint, required = false, imageOnly = false }: FileUploadZoneProps) {
  const [isDrag, setIsDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFiles = useCallback((fileList: FileList | File[]) => {
    const newFiles: UploadedFile[] = Array.from(fileList).map(f => ({
      name: f.name, size: f.size, type: f.type,
      previewUrl: f.type.startsWith('image/') ? URL.createObjectURL(f) : undefined,
      source: 'local' as const,
    }));
    onFiles([...files, ...newFiles]);
  }, [files, onFiles]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDrag(false);
    if (e.dataTransfer.files.length) processFiles(e.dataTransfer.files);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) processFiles(e.target.files);
    e.target.value = '';
  };
  const removeFile = (idx: number) => {
    const updated = [...files];
    if (updated[idx].previewUrl) URL.revokeObjectURL(updated[idx].previewUrl!);
    updated.splice(idx, 1);
    onFiles(updated);
  };
  const fmt = (b: number) =>
    b < 1024 ? `${b}B` : b < 1048576 ? `${(b / 1024).toFixed(1)}KB` : `${(b / 1048576).toFixed(1)}MB`;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}{required && ' *'}
        {hint && <span className="text-gray-400 font-normal ml-1">{hint}</span>}
      </label>
      <div
        onDrop={handleDrop}
        onDragOver={e => { e.preventDefault(); setIsDrag(true); }}
        onDragLeave={() => setIsDrag(false)}
        className={`border-2 border-dashed rounded-xl p-4 transition-all duration-200 ${
          isDrag ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
        }`}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          {imageOnly
            ? <ImageIcon size={26} className={isDrag ? 'text-blue-500' : 'text-gray-300'} />
            : <Upload size={26} className={isDrag ? 'text-blue-500' : 'text-gray-300'} />}
          <p className="text-sm text-gray-500 font-medium">{isDrag ? 'Deposez ici' : 'Glissez votre fichier ici'}</p>
          <p className="text-xs text-gray-400">ou choisissez une source :</p>
          <div className="flex gap-2 mt-1 flex-wrap justify-center">
            <button type="button" onClick={() => inputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <HardDrive size={13} /> Depuis mon ordinateur
            </button>
            <button type="button"
              onClick={() => alert('Ajoutez https://apis.google.com/js/api.js et configurez votre cle .env pour activer Google Drive.')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-gray-300 text-gray-600 rounded-lg hover:border-blue-400 hover:text-blue-600 bg-white transition-colors">
              <DriveIcon /> Google Drive
            </button>
          </div>
        </div>
        <input ref={inputRef} type="file" multiple accept={accept} onChange={handleChange} className="hidden" />
      </div>
      {files.length > 0 && (
        <div className="mt-2 space-y-2">
          {files.map((f, i) => (
            <div key={i} className="flex items-center gap-3 p-2.5 bg-green-50 border border-green-200 rounded-xl">
              {f.previewUrl
                ? <img src={f.previewUrl} alt={f.name} className="w-10 h-10 rounded-lg object-cover shrink-0 border border-green-300" />
                : <CheckCircle size={16} className="text-green-500 shrink-0" />}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700 truncate">{f.name}</p>
                <p className="text-xs text-gray-400">{fmt(f.size)}</p>
              </div>
              <button type="button" onClick={() => removeFile(i)} className="text-gray-400 hover:text-red-500 shrink-0">
                <X size={15} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export function RegisterPage() {
  // ── ALL STATE DECLARATIONS FIRST ─────────────────────────────────────────
  const [role, setRole] = useState<Role>('client');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tarifs, setTarifs] = useState<{ service: string; prix: string }[]>([{ service: '', prix: '' }]);
  const [clientPhotos, setClientPhotos] = useState<UploadedFile[]>([]);
  const [prestLogo, setPrestLogo] = useState<UploadedFile[]>([]);
  const [uploadedDocs, setUploadedDocs] = useState<UploadedFile[]>([]);
  const [clientData, setClientData] = useState({ nom: '', email: '', password: '', ville: '', adresse: '' });
  const [prestData, setPrestData] = useState({ nom: '', email: '', password: '', description: '', adresse: '', cin: '' });
  const [pendingOAuth, setPendingOAuth] = useState<OAuthUser | null>(null);

  const { loginWithGoogle, loginWithFacebook, loginWithApple, setUserFromOAuth, isLoading } = useAuth();
  const navigate = useNavigate();

  // ── ALL useEffect / useCallback AFTER STATE ───────────────────────────────

  // Pick up Facebook result after redirect — ONLY autofill, never auto-submit
  useEffect(() => {
    const pending = localStorage.getItem('fb_oauth_pending');
    if (!pending) return;
    try {
      const fbUser: OAuthUser = JSON.parse(pending);
      localStorage.removeItem('fb_oauth_pending');
      if (role === 'client') {
        setClientData(d => ({ ...d, email: fbUser.email, nom: fbUser.name, password: '--------' }));
      } else {
        setPrestData(d => ({ ...d, email: fbUser.email, nom: fbUser.name, password: '--------' }));
      }
      setPendingOAuth(fbUser);
    } catch {
      localStorage.removeItem('fb_oauth_pending');
    }
  }, [role]);

  // ── HELPERS ───────────────────────────────────────────────────────────────

  const triggerToast = (msg: string, path: string) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => { setShowToast(false); navigate(path); }, 2200);
  };

  const applyOAuthAutofill = (email: string, name: string) => {
    if (role === 'client') setClientData(d => ({ ...d, email, nom: name, password: '--------' }));
    else setPrestData(d => ({ ...d, email, nom: name, password: '--------' }));
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
      });
      const profile = await res.json();
      const oauthUser: OAuthUser = {
        id: profile.sub, email: profile.email, name: profile.name,
        avatar: profile.picture, provider: 'google',
      };
      loginWithGoogle(profile);
      applyOAuthAutofill(profile.email, profile.name);
      setPendingOAuth(oauthUser);
      setError('');
    },
    onError: () => setError('Erreur Google'),
  });

  const addTag = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };
  const removeTag = (t: string) => setTags(tags.filter(x => x !== t));
  const addTarif = () => setTarifs([...tarifs, { service: '', prix: '' }]);
  const updateTarif = (i: number, f: 'service' | 'prix', v: string) => {
    const u = [...tarifs]; u[i][f] = v; setTarifs(u);
  };
  const removeTarif = (i: number) => setTarifs(tarifs.filter((_, idx) => idx !== i));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (role === 'client') {
      if (!clientData.nom || !clientData.email) {
        setError('Veuillez remplir tous les champs obligatoires'); return;
      }
      if (!pendingOAuth && !clientData.password) {
        setError('Veuillez entrer un mot de passe'); return;
      }
      const finalUser = pendingOAuth
        ? { ...pendingOAuth }
        : { id: Date.now().toString(), email: clientData.email, name: clientData.nom, provider: 'email' as const };
      setUserFromOAuth(finalUser);
      triggerToast('Compte cree avec succes ! Bienvenue', '/dashboard/client');
    } else {
      const missing: string[] = [];
      if (!prestData.nom) missing.push('nom');
      if (!prestData.email) missing.push('email');
      if (!pendingOAuth && !prestData.password) missing.push('mot de passe');
      if (!prestData.description) missing.push('description');
      if (!prestData.adresse) missing.push('adresse');
      if (!prestData.cin) missing.push('CIN');
      if (tags.length === 0) missing.push('categories de services');
      if (tarifs.some(t => !t.service || !t.prix)) missing.push('tarifs complets');
      if (uploadedDocs.length === 0) missing.push('documents justificatifs');

      if (missing.length > 0) {
        setError('Champs manquants : ' + missing.join(', ')); return;
      }
      const finalUser = pendingOAuth
        ? { ...pendingOAuth }
        : { id: Date.now().toString(), email: prestData.email, name: prestData.nom, provider: 'email' as const };
      setUserFromOAuth(finalUser);
      triggerToast('Compte prestataire cree ! Bienvenue', '/dashboard/prestataire');
    }
  };

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 via-slate-200 to-orange-400 flex items-center justify-center px-4 py-12">

      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -60, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -60, scale: 0.9 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-white border border-green-200 shadow-2xl rounded-2xl px-6 py-4 min-w-[320px]"
          >
            <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center shrink-0">
              <CheckCircle size={20} className="text-green-600" />
            </div>
            <p className="text-gray-800 font-semibold text-sm">{toastMsg}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-lg w-full">

        {/* Logo + Name */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 mb-8">
          <img src="/logos/nobg_logo.png" alt="RilyBricoule" className="h-14 w-14 object-contain flex-shrink-0" />
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-orange-500 to-cyan-500 bg-clip-text text-transparent leading-tight">
              RilyBricoule
            </h1>
            <p className="text-gray-600 text-sm mt-0.5">Creez votre compte</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">

          {/* Role Toggle */}
          <div className="flex rounded-xl border-2 border-gray-200 p-1 mb-6">
            {(['client', 'prestataire'] as Role[]).map(r => (
              <button key={r} type="button"
                onClick={() => { setRole(r); setError(''); setPendingOAuth(null); }}
                className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                  role === r ? 'bg-gradient-to-r from-blue-600 to-orange-500 text-white shadow-md' : 'text-gray-500 hover:text-gray-700'
                }`}>
                {r === 'client' ? <User size={16} /> : <Briefcase size={16} />}
                {r === 'client' ? 'Je suis Client' : 'Je suis Prestataire'}
              </button>
            ))}
          </div>

          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">

              {/* CLIENT */}
              {role === 'client' && (
                <motion.div key="client" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4">
                  <SocialButtons onGoogle={() => handleGoogleLogin()} onFacebook={() => loginWithFacebook('/register')} onApple={loginWithApple} isLoading={isLoading} />
                  {pendingOAuth && (
                    <div className="flex items-start gap-2.5 p-3 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-700">
                      <CheckCircle size={16} className="text-blue-500 shrink-0 mt-0.5" />
                      <span><strong>{pendingOAuth.name}</strong> connecte via {pendingOAuth.provider}. Verifiez vos informations et cliquez sur <strong>Creer mon compte</strong>.</span>
                    </div>
                  )}
                  <Divider />
                  <Field icon={<User size={18} />} label="Nom complet *" placeholder="Votre nom" value={clientData.nom} onChange={v => setClientData({ ...clientData, nom: v })} />
                  <Field icon={<Mail size={18} />} label="Email *" type="email" placeholder="votre@email.com" value={clientData.email} onChange={v => setClientData({ ...clientData, email: v })} />
                  {!pendingOAuth && (
                    <PasswordField label="Mot de passe *" show={showPassword} onToggle={() => setShowPassword(!showPassword)} value={clientData.password} onChange={v => setClientData({ ...clientData, password: v })} />
                  )}
                  <Field icon={<MapPin size={18} />} label="Ville" placeholder="Ex: Casablanca" value={clientData.ville} onChange={v => setClientData({ ...clientData, ville: v })} required={false} />
                  <Field icon={<MapPin size={18} />} label="Adresse" placeholder="Votre adresse" value={clientData.adresse} onChange={v => setClientData({ ...clientData, adresse: v })} required={false} />
                  <FileUploadZone files={clientPhotos} onFiles={setClientPhotos} accept="image/*" label="Photo de profil" hint="(optionnel)" imageOnly required={false} />
                </motion.div>
              )}

              {/* PRESTATAIRE */}
              {role === 'prestataire' && (
                <motion.div key="prestataire" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                  <SocialButtons onGoogle={() => handleGoogleLogin()} onFacebook={() => loginWithFacebook('/register')} onApple={loginWithApple} isLoading={isLoading} />
                  {pendingOAuth && (
                    <div className="flex items-start gap-2.5 p-3 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-700">
                      <CheckCircle size={16} className="text-blue-500 shrink-0 mt-0.5" />
                      <span><strong>{pendingOAuth.name}</strong> connecte via {pendingOAuth.provider}. Completez les champs ci-dessous pour finaliser votre inscription.</span>
                    </div>
                  )}
                  <Divider />
                  <Field icon={<Briefcase size={18} />} label="Nom ou raison sociale *" placeholder="Votre nom ou entreprise" value={prestData.nom} onChange={v => setPrestData({ ...prestData, nom: v })} />
                  <Field icon={<Mail size={18} />} label="Email *" type="email" placeholder="votre@email.com" value={prestData.email} onChange={v => setPrestData({ ...prestData, email: v })} />
                  {!pendingOAuth && (
                    <PasswordField label="Mot de passe *" show={showPassword} onToggle={() => setShowPassword(!showPassword)} value={prestData.password} onChange={v => setPrestData({ ...prestData, password: v })} />
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                    <textarea required rows={3} placeholder="Decrivez vos services et votre experience..."
                      value={prestData.description} onChange={e => setPrestData({ ...prestData, description: e.target.value })}
                      className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-sm" />
                  </div>
                  <Field icon={<MapPin size={18} />} label="Adresse *" placeholder="Votre adresse professionnelle" value={prestData.adresse} onChange={v => setPrestData({ ...prestData, adresse: v })} />
                  <Field icon={<FileText size={18} />} label="CIN ou piece d'identite *" placeholder="Numero de CIN" value={prestData.cin} onChange={v => setPrestData({ ...prestData, cin: v })} />
                  <FileUploadZone files={prestLogo} onFiles={setPrestLogo} accept="image/*" label="Photo / Logo" hint="(optionnel)" imageOnly required={false} />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categories de services * <span className="text-gray-400 font-normal">(Entree pour ajouter)</span>
                    </label>
                    <div className="border border-gray-300 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500 min-h-[48px]">
                      <div className="flex flex-wrap gap-2 mb-2">
                        {tags.map(tag => (
                          <span key={tag} className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                            {tag}
                            <button type="button" onClick={() => removeTag(tag)}><X size={12} /></button>
                          </span>
                        ))}
                      </div>
                      <input type="text" placeholder="Ex: Plomberie, Electricite..." value={tagInput}
                        onChange={e => setTagInput(e.target.value)} onKeyDown={addTag}
                        className="w-full outline-none text-sm text-gray-700 placeholder-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tarifs par service *</label>
                    <div className="space-y-2">
                      {tarifs.map((t, i) => (
                        <div key={i} className="flex gap-2 items-center">
                          <input type="text" placeholder="Service (ex: Plomberie)" value={t.service}
                            onChange={e => updateTarif(i, 'service', e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                          <div className="relative w-32">
                            <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input type="text" placeholder="Prix/h" value={t.prix}
                              onChange={e => updateTarif(i, 'prix', e.target.value)}
                              className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                          </div>
                          {tarifs.length > 1 && (
                            <button type="button" onClick={() => removeTarif(i)} className="text-red-400 hover:text-red-600"><X size={18} /></button>
                          )}
                        </div>
                      ))}
                      <button type="button" onClick={addTarif} className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium">
                        <Plus size={16} /> Ajouter un tarif
                      </button>
                    </div>
                  </div>

                  <FileUploadZone
                    files={uploadedDocs} onFiles={setUploadedDocs}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    label="Documents justificatifs"
                    hint="(obligatoire)"
                    required
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button type="submit" disabled={isLoading}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-blue-600 via-orange-500 to-blue-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2">
              {isLoading
                ? <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" /> Creation...</>
                : <>Creer mon compte <ArrowRight size={20} /></>}
            </motion.button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Deja un compte?{' '}
            <a href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">Se connecter</a>
          </p>
        </motion.div>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="text-center text-sm text-gray-500 mt-8">
          En creant un compte, vous acceptez nos{' '}
          <a href="#" className="text-blue-600 hover:underline">Conditions d'utilisation</a>
          {' '}et notre{' '}
          <a href="#" className="text-blue-600 hover:underline">Politique de confidentialite</a>
        </motion.p>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SocialButtons({ onGoogle, onFacebook, onApple, isLoading }: {
  onGoogle: () => void; onFacebook: () => void; onApple: () => void; isLoading: boolean;
}) {
  return (
    <div className="space-y-3">
      <button type="button" onClick={onGoogle} disabled={isLoading}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all font-medium text-gray-700 disabled:opacity-50">
        <GoogleIcon /> Continuer avec Google
      </button>
      <button type="button" onClick={onFacebook} disabled={isLoading}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all font-medium text-gray-700 disabled:opacity-50">
        <FaFacebook size={22} className="text-[#1877F2]" /> Continuer avec Facebook
      </button>
      <button type="button" onClick={onApple} disabled={isLoading}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-black hover:bg-gray-900 rounded-xl transition-all font-medium text-white disabled:opacity-50">
        <AppleIcon /> Continuer avec Apple
      </button>
    </div>
  );
}

function Divider() {
  return (
    <div className="relative my-1">
      <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
      <div className="relative flex justify-center text-sm"><span className="px-4 bg-white text-gray-500">Ou avec votre email</span></div>
    </div>
  );
}

interface FieldProps { icon: React.ReactNode; label: string; placeholder: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean; }
function Field({ icon, label, placeholder, value, onChange, type = 'text', required = true }: FieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">{icon}</div>
        <input type={type} required={required} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)}
          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm" />
      </div>
    </div>
  );
}

interface PasswordFieldProps { label: string; value: string; onChange: (v: string) => void; show: boolean; onToggle: () => void; }
function PasswordField({ label, value, onChange, show, onToggle }: PasswordFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><Lock size={18} /></div>
        <input type={show ? 'text' : 'password'} required placeholder="........" value={value} onChange={e => onChange(e.target.value)}
          className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm" />
        <button type="button" onClick={onToggle} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
          {show ? <Eye size={18} /> : <EyeOff size={18} />}
        </button>
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
function AppleIcon() {
  return (
    <svg width="18" height="22" viewBox="0 0 814 1000" fill="white">
      <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-37.5-150.3-88.1C27.8 768.4 1 583.7 1 406.7c0-290.2 184.5-443.9 366-443.9 96.2 0 176.2 63.5 235.8 63.5 54.4 0 140.1-67.5 250.8-67.5 40.3 0 108.2 3.7 171.2 55.8zm-178.2-102.4c-54.4 0-130.3-51.8-213.1-51.8-20.5 0-41.1 2.4-61.1 7.4 35.9-91.4 107.2-143.1 172.2-143.1 53.3 0 122.1 38.4 122.1 118.5 0 23.7-7.9 55.5-20.1 69z"/>
    </svg>
  );
}
function DriveIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 87.3 78">
      <path fill="#0066da" d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8H0c0 1.55.4 3.1 1.2 4.5z"/>
      <path fill="#00ac47" d="M43.65 25 29.9 1.2C28.55 2 27.4 3.1 26.6 4.5L1.2 48.5c-.8 1.4-1.2 2.95-1.2 4.5h27.5z"/>
      <path fill="#ea4335" d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5H59.8l5.85 11.5z"/>
      <path fill="#00832d" d="M43.65 25 57.4 1.2C56.05.4 54.5 0 52.9 0H34.4c-1.6 0-3.15.45-4.5 1.2z"/>
      <path fill="#2684fc" d="M59.8 53H27.5L13.75 76.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z"/>
      <path fill="#ffba00" d="M73.4 26.5l-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3L43.65 25l16.15 28H87.3c0-1.55-.4-3.1-1.2-4.5z"/>
    </svg>
  );
}