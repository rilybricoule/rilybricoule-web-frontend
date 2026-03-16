import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, Lock, Eye, EyeOff, ArrowRight, User, MapPin, FileText,
  Plus, X, Briefcase, DollarSign, Upload, HardDrive, CheckCircle,
  Image as ImageIcon, Building2, UserCheck, Wrench,
} from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import { FaFacebook } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// ── Hardcoded config (from .env) ──────────────────────────────────────────────
const GOOGLE_CLIENT_ID = '928030296798-931s851635rm1uq5aa8ig2db5a3lgk4j.apps.googleusercontent.com';
const FACEBOOK_APP_ID = '911883924660335';
const APP_URL = 'http://localhost:5173';

type Role = 'client' | 'prestataire';
type PrestataireType = 'entreprise' | 'auto-entrepreneur' | 'particulier';

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
  provider: 'google' | 'facebook';
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
      name: f.name,
      size: f.size,
      type: f.type,
      previewUrl: f.type.startsWith('image/') ? URL.createObjectURL(f) : undefined,
      source: 'local' as const,
    }));
    onFiles([...files, ...newFiles]);
  }, [files, onFiles]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDrag(false);
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

  const fmt = (b: number) => b < 1024 ? `${b}B` : b < 1048576 ? `${(b / 1024).toFixed(1)}KB` : `${(b / 1048576).toFixed(1)}MB`;

  return (
    <div>
      <input ref={inputRef} type="file" className="hidden" accept={accept} multiple onChange={handleChange} />
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}{required && ' *'} {hint && <span className="text-gray-400 font-normal">{hint}</span>}
      </label>
      <div
        onDrop={handleDrop}
        onDragOver={e => { e.preventDefault(); setIsDrag(true); }}
        onDragLeave={() => setIsDrag(false)}
        className={`border-2 border-dashed rounded-xl p-4 transition-all duration-200 ${
          isDrag ? 'border-orange-400 bg-orange-50' : 'border-gray-200 hover:border-orange-300 hover:bg-gray-50'
        }`}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-400">
            {imageOnly ? <ImageIcon size={20} /> : <Upload size={20} />}
          </div>
          <p className="text-sm text-gray-500 font-medium">{isDrag ? 'Deposez ici' : 'Glissez votre fichier ici'}</p>
          <p className="text-xs text-gray-400">ou choisissez une source :</p>
          <div className="flex gap-2 flex-wrap justify-center">
            <button type="button" onClick={() => inputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors">
              <Upload size={12} /> Depuis mon ordinateur
            </button>
            <button type="button" onClick={() => alert('Configurez Google Drive dans vos parametres.')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-gray-300 text-gray-600 rounded-lg hover:border-orange-400 hover:text-orange-600 bg-white transition-colors">
              <DriveIcon /> Google Drive
            </button>
          </div>
        </div>
        {files.length > 0 && (
          <div className="mt-3 space-y-2">
            {files.map((f, i) => (
              <div key={i} className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-3 py-2">
                <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center shrink-0">
                  {f.previewUrl ? <img src={f.previewUrl} alt="" className="w-8 h-8 rounded object-cover" /> : <FileText size={16} className="text-gray-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-700 truncate">{f.name}</p>
                  <p className="text-xs text-gray-400">{fmt(f.size)}</p>
                </div>
                <button type="button" onClick={() => removeFile(i)} className="text-gray-400 hover:text-red-500 shrink-0"><X size={14} /></button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export function RegisterPage() {
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
  const [prestataireType, setPrestataireType] = useState<PrestataireType>('particulier');
  const [clientData, setClientData] = useState({ nom: '', email: '', password: '', ville: '', adresse: '' });
  const [prestData, setPrestData] = useState({ nom: '', email: '', password: '', description: '', adresse: '', cin: '', ice: '' });
  const [pendingOAuth, setPendingOAuth] = useState<OAuthUser | null>(null);
  const { loginWithGoogle, loginWithFacebook, setUserFromOAuth, isLoading } = useAuth();
  const navigate = useNavigate();

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
    } catch { localStorage.removeItem('fb_oauth_pending'); }
  }, [role]);

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
      const oauthUser: OAuthUser = { id: profile.sub, email: profile.email, name: profile.name, avatar: profile.picture, provider: 'google' };
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
      if (!clientData.nom || !clientData.email) { setError('Veuillez remplir tous les champs obligatoires'); return; }
      if (!pendingOAuth && !clientData.password) { setError('Veuillez entrer un mot de passe'); return; }
      const finalUser = pendingOAuth ? { ...pendingOAuth } : { id: Date.now().toString(), email: clientData.email, name: clientData.nom, provider: 'email' as const };
      setUserFromOAuth(finalUser);
      triggerToast('Compte cree avec succes ! Bienvenue', '/dashboard/client');
    } else {
      const missing: string[] = [];
      if (!prestData.nom) missing.push('nom');
      if (!prestData.email) missing.push('email');
      if (!pendingOAuth && !prestData.password) missing.push('mot de passe');
      if (!prestData.description) missing.push('description');
      if (!prestData.adresse) missing.push('adresse');
      if (prestataireType === 'entreprise' && !prestData.ice) missing.push('numero ICE');
      if (prestataireType === 'particulier') {
        if (!prestData.cin) missing.push('CIN');
        if (!prestData.ice) missing.push('numero ICE');
      }
      if (tags.length === 0) missing.push('categories de services');
      if (tarifs.some(t => !t.service || !t.prix)) missing.push('tarifs complets');
      if (missing.length > 0) { setError('Champs manquants : ' + missing.join(', ')); return; }
      const finalUser = pendingOAuth ? { ...pendingOAuth } : { id: Date.now().toString(), email: prestData.email, name: prestData.nom, provider: 'email' as const };
      setUserFromOAuth(finalUser);
      triggerToast('Compte prestataire cree ! Bienvenue', '/dashboard/prestataire');
    }
  };

return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(135deg, #243B82 0%, #1E5BB8 50%, #1a4a9a 100%)' }}
    >
      {/* Subtle geometric background pattern */}
      <div
        className="fixed inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 20%, #ffffff 1px, transparent 1px),
                            radial-gradient(circle at 80% 80%, #ffffff 1px, transparent 1px),
                            radial-gradient(circle at 50% 50%, #ffffff 0.5px, transparent 0.5px)`,
          backgroundSize: '60px 60px, 80px 80px, 40px 40px',
        }}
      />

      <div className="w-full max-w-lg relative">
        {showToast && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-sm font-medium">
            <CheckCircle size={18} className="text-green-400" /> {toastMsg}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 overflow-hidden"
        >
          {/* Top accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-blue-400 to-orange-500 rounded-t-2xl" />

          {/* Logo */}
          <div className="flex items-center justify-center gap-2.5 mb-7">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md"
              style={{ backgroundColor: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)' }}
            >
              <img src="/logos/nobg_logo.png" alt="RilyBricoule" className="h-6 w-6 object-contain" />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">
              Rily<span className="text-orange-500">Bricoule</span>
            </span>
          </div>

          <h1 className="text-[1.6rem] font-bold text-gray-900 text-center mb-1 tracking-tight">Creez votre compte</h1>
          <p className="text-sm text-gray-400 text-center mb-6">Rejoignez la plateforme des artisans de confiance</p>

          {/* Role Toggle */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6 gap-1">
            {(['client', 'prestataire'] as Role[]).map(r => (
              <button key={r} type="button" onClick={() => { setRole(r); setError(''); setPendingOAuth(null); }}
                className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                  role === r
                    ? r === 'client'
                      ? 'bg-blue-700 text-white shadow-md'
                      : 'bg-orange-500 text-white shadow-md'
                    : 'text-gray-500 hover:text-gray-700'
                }`}>
                {r === 'client' ? <User size={15} /> : <Briefcase size={15} />}
                {r === 'client' ? 'Je suis Client' : 'Je suis Prestataire'}
              </button>
            ))}
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm flex items-start gap-2">
              <span className="text-red-400 mt-0.5">⚠</span> {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">

              {/* CLIENT */}
              {role === 'client' && (
                <motion.div key="client" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} transition={{ duration: 0.25 }} className="space-y-4">
                  <SocialButtons onGoogle={() => handleGoogleLogin()} onFacebook={() => loginWithFacebook('/register')} isLoading={isLoading} />
                  <Divider />
                  {pendingOAuth && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-700 flex items-start gap-2">
                      <span className="text-blue-400 mt-0.5">✓</span>
                      <span><strong>{pendingOAuth.name}</strong> connecte via {pendingOAuth.provider}. Verifiez et confirmez.</span>
                    </div>
                  )}
                  <Field icon={<User size={16} />} label="Nom complet *" placeholder="Votre nom" value={clientData.nom} onChange={v => setClientData({ ...clientData, nom: v })} />
                  <Field icon={<Mail size={16} />} label="Email *" type="email" placeholder="votre@email.com" value={clientData.email} onChange={v => setClientData({ ...clientData, email: v })} />
                  {!pendingOAuth && (
                    <PasswordField label="Mot de passe *" show={showPassword} onToggle={() => setShowPassword(!showPassword)} value={clientData.password} onChange={v => setClientData({ ...clientData, password: v })} />
                  )}
                  <Field icon={<MapPin size={16} />} label="Ville" placeholder="Ex: Casablanca" value={clientData.ville} onChange={v => setClientData({ ...clientData, ville: v })} required={false} />
                  <Field icon={<MapPin size={16} />} label="Adresse" placeholder="Votre adresse" value={clientData.adresse} onChange={v => setClientData({ ...clientData, adresse: v })} required={false} />
                </motion.div>
              )}

              {/* PRESTATAIRE */}
              {role === 'prestataire' && (
                <motion.div key="prest" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.25 }} className="space-y-4">
                  <SocialButtons onGoogle={() => handleGoogleLogin()} onFacebook={() => loginWithFacebook('/register')} isLoading={isLoading} />
                  <Divider />
                  {pendingOAuth && (
                    <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl text-sm text-orange-700 flex items-start gap-2">
                      <span className="text-orange-400 mt-0.5">✓</span>
                      <span><strong>{pendingOAuth.name}</strong> connecte via {pendingOAuth.provider}. Completez les champs ci-dessous.</span>
                    </div>
                  )}

                  {/* Type selector */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Type de prestataire *</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { value: 'entreprise', label: 'Entreprise', desc: 'Societe enregistree', icon: <Building2 size={18} /> },
                        { value: 'auto-entrepreneur', label: 'Auto-entrepreneur', desc: 'Statut independant', icon: <Briefcase size={18} /> },
                        { value: 'particulier', label: 'Particulier', desc: 'Personne physique', icon: <UserCheck size={18} /> },
                      ].map(opt => (
                        <button key={opt.value} type="button" onClick={() => setPrestataireType(opt.value as PrestataireType)}
                          className={`relative flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 text-center transition-all duration-200 ${
                            prestataireType === opt.value
                              ? 'border-orange-400 bg-orange-50 text-orange-700'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-500'
                          }`}>
                          <span className={prestataireType === opt.value ? 'text-orange-500' : 'text-gray-400'}>{opt.icon}</span>
                          <span className="text-xs font-semibold leading-tight">{opt.label}</span>
                          <span className="text-[10px] text-gray-400 leading-tight">{opt.desc}</span>
                          {prestataireType === opt.value && (
                            <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Field icon={<User size={16} />} label="Nom ou raison sociale *" placeholder="Votre nom ou entreprise" value={prestData.nom} onChange={v => setPrestData({ ...prestData, nom: v })} />
                  <Field icon={<Mail size={16} />} label="Email *" type="email" placeholder="votre@email.com" value={prestData.email} onChange={v => setPrestData({ ...prestData, email: v })} />
                  {!pendingOAuth && (
                    <PasswordField label="Mot de passe *" show={showPassword} onToggle={() => setShowPassword(!showPassword)} value={prestData.password} onChange={v => setPrestData({ ...prestData, password: v })} />
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                    <textarea rows={3} placeholder="Decrivez votre activite et votre experience..." value={prestData.description}
                      onChange={e => setPrestData({ ...prestData, description: e.target.value })}
                      className="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all resize-none text-sm bg-gray-50 placeholder-gray-400" />
                  </div>

                  <Field icon={<MapPin size={16} />} label="Adresse *" placeholder="Votre adresse professionnelle" value={prestData.adresse} onChange={v => setPrestData({ ...prestData, adresse: v })} />

                  <AnimatePresence mode="wait">
                    {prestataireType === 'entreprise' && (
                      <motion.div key="ice" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
                        <Field icon={<FileText size={16} />} label="Numero ICE *" placeholder="Identifiant Commun de l'Entreprise" value={prestData.ice} onChange={v => setPrestData({ ...prestData, ice: v })} />
                      </motion.div>
                    )}
                    {prestataireType === 'particulier' && (
                      <motion.div key="cin" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }} className="space-y-4">
                        <Field icon={<FileText size={16} />} label="CIN ou piece d'identite *" placeholder="Numero de CIN" value={prestData.cin} onChange={v => setPrestData({ ...prestData, cin: v })} />
                        <Field icon={<FileText size={16} />} label="Numero ICE *" placeholder="Identifiant Commun de l'Entreprise" value={prestData.ice} onChange={v => setPrestData({ ...prestData, ice: v })} />
                      </motion.div>
                    )}
                    {prestataireType === 'auto-entrepreneur' && (
                      <motion.div key="ae" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
                        <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-600 flex items-start gap-2">
                          <span className="text-gray-400 mt-0.5">ℹ️</span>
                          <span>En tant qu'auto-entrepreneur, aucun numero d'identification specifique n'est requis pour l'inscription.</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <FileUploadZone files={prestLogo} onFiles={setPrestLogo} accept="image/*" label="Photo / Logo" hint="(optionnel)" imageOnly required={false} />

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categories de services * <span className="text-gray-400 font-normal text-xs">(Entree pour ajouter)</span>
                    </label>
                    <div className="border border-gray-200 rounded-xl px-3 py-2 bg-gray-50 focus-within:ring-2 focus-within:ring-orange-400 focus-within:bg-white transition-all min-h-[48px]">
                      <div className="flex flex-wrap gap-2 mb-2">
                        {tags.map(tag => (
                          <span key={tag} className="flex items-center gap-1 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-semibold">
                            {tag}
                            <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500 transition-colors"><X size={10} /></button>
                          </span>
                        ))}
                      </div>
                      <input type="text" placeholder="Ex: Plomberie, Electricite..." value={tagInput}
                        onChange={e => setTagInput(e.target.value)} onKeyDown={addTag}
                        className="w-full outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent" />
                    </div>
                  </div>

                  {/* Tarifs */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tarifs par service</label>
                    <div className="space-y-2">
                      {tarifs.map((t, i) => (
                        <div key={i} className="flex gap-2 items-center">
                          <input type="text" placeholder="Service (ex: Plomberie)" value={t.service}
                            onChange={e => updateTarif(i, 'service', e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:ring-2 focus:ring-orange-400 focus:border-transparent focus:bg-white transition-all" />
                          <div className="relative w-32">
                            <DollarSign size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input type="text" placeholder="Prix/h" value={t.prix}
                              onChange={e => updateTarif(i, 'prix', e.target.value)}
                              className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:ring-2 focus:ring-orange-400 focus:border-transparent focus:bg-white transition-all" />
                          </div>
                          {tarifs.length > 1 && (
                            <button type="button" onClick={() => removeTarif(i)} className="text-gray-300 hover:text-red-500 transition-colors"><X size={16} /></button>
                          )}
                        </div>
                      ))}
                      <button type="button" onClick={addTarif} className="flex items-center gap-1 text-orange-500 hover:text-orange-600 text-sm font-semibold transition-colors">
                        <Plus size={15} /> Ajouter un tarif
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button type="submit" disabled={isLoading} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
              className={`w-full py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2 text-white ${
                role === 'client'
                  ? 'bg-blue-700 hover:bg-blue-800'
                  : 'bg-orange-500 hover:bg-orange-600'
              }`}>
              {isLoading
                ? <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> Creation...</>
                : <>Creer mon compte <ArrowRight size={18} /></>}
            </motion.button>
          </form>

          <p className="mt-5 text-center text-sm text-gray-500">
            Deja un compte?{' '}
            <a href="/login" className={`font-semibold hover:underline ${role === 'client' ? 'text-blue-700' : 'text-orange-500'}`}>Se connecter</a>
          </p>
        </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center text-xs text-gray-400 mt-5"
          >
            En creant un compte, vous acceptez nos{' '}
            <a href="#" className="text-gray-600 hover:underline">Conditions d'utilisation</a>
            {' '}et notre{' '}
            <a href="#" className="text-gray-600 hover:underline">Politique de confidentialite</a>
          </motion.p>
        </div>
      </div>
    );
  }

// ── Sub-components ────────────────────────────────────────────────────────────
function SocialButtons({ onGoogle, onFacebook, isLoading }: { onGoogle: () => void; onFacebook: () => void; isLoading: boolean }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <button type="button" onClick={onGoogle} disabled={isLoading}
        className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all font-medium text-gray-700 text-sm disabled:opacity-50">
        <GoogleIcon /> Google
      </button>
      <button type="button" onClick={onFacebook} disabled={isLoading}
        className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl hover:border-blue-200 hover:bg-blue-50 transition-all font-medium text-gray-700 text-sm disabled:opacity-50">
        <FaFacebook size={18} className="text-[#1877F2]" /> Facebook
      </button>
    </div>
  );
}

function Divider() {
  return (
    <div className="relative my-1">
      <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100" /></div>
      <div className="relative flex justify-center text-xs"><span className="px-4 bg-white text-gray-400 font-medium">Ou avec votre email</span></div>
    </div>
  );
}

interface FieldProps {
  icon: React.ReactNode;
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}

function Field({ icon, label, placeholder, value, onChange, type = 'text', required = true }: FieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">{icon}</div>
        <input type={type} required={required} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)}
          className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all text-sm placeholder-gray-400" />
      </div>
    </div>
  );
}

interface PasswordFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  onToggle: () => void;
}

function PasswordField({ label, value, onChange, show, onToggle }: PasswordFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400"><Lock size={16} /></div>
        <input type={show ? 'text' : 'password'} required placeholder="••••••••" value={value} onChange={e => onChange(e.target.value)}
          className="block w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all text-sm" />
        <button type="button" onClick={onToggle} className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors">
          {show ? <Eye size={16} /> : <EyeOff size={16} />}
        </button>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.2l6.8-6.8C35.8 2.2 30.2 0 24 0 14.8 0 6.9 5.4 3 13.3l7.9 6.1C12.8 13.2 17.9 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17z"/>
      <path fill="#FBBC05" d="M10.9 28.6A14.8 14.8 0 019.5 24c0-1.6.3-3.2.8-4.6L2.4 13.3A23.9 23.9 0 000 24c0 3.8.9 7.4 2.5 10.6l8.4-6z"/>
      <path fill="#34A853" d="M24 48c6.2 0 11.4-2 15.2-5.5l-7.5-5.8c-2 1.4-4.6 2.2-7.7 2.2-6.1 0-11.2-3.7-13.1-9l-7.9 6.1C6.9 42.6 14.8 48 24 48z"/>
    </svg>
  );
}

function DriveIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 87.3 78">
      <path fill="#0066da" d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8H0c0 1.55.4 3.1 1.2 4.5z"/>
      <path fill="#00ac47" d="M43.65 25 29.9 1.2C28.55 2 27.4 3.1 26.6 4.5L1.2 48.5c-.8 1.4-1.2 2.95-1.2 4.5h27.5z"/>
      <path fill="#ea4335" d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5H59.8l5.85 11.5z"/>
      <path fill="#00832d" d="M43.65 25 57.4 1.2C56.05.4 54.5 0 52.9 0H34.4c-1.6 0-3.15.45-4.5 1.2z"/>
      <path fill="#2684fc" d="M59.8 53H27.5L13.75 76.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z"/>
      <path fill="#ffba00" d="M73.4 26.5l-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3L43.65 25l16.15 28H87.3c0-1.55-.4-3.1-1.2-4.5z"/>
    </svg>
  );
}