import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, User, Mail, Phone, MapPin, Edit2, Save, CheckCircle, Camera } from 'lucide-react';
import type { UserProfile } from '../types';

interface UserProfilePageProps {
  profile: UserProfile;
  onUpdate: (p: UserProfile) => void;
  onBack: () => void;
}

export function UserProfilePage({ profile, onUpdate, onBack }: UserProfilePageProps) {
  const [editing, setEditing] = useState(false);
  const [form, setForm]       = useState<UserProfile>({ ...profile });
  const [saved, setSaved]     = useState(false);

  const set = (k: keyof UserProfile, v: string) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSave = () => {
    onUpdate(form);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleCancel = () => { setForm({ ...profile }); setEditing(false); };

  const fields: { key: keyof UserProfile; label: string; icon: React.ReactNode; type?: string; placeholder: string }[] = [
    { key: 'firstName', label: 'Prénom',   icon: <User size={15} />,    placeholder: 'Votre prénom' },
    { key: 'lastName',  label: 'Nom',      icon: <User size={15} />,    placeholder: 'Votre nom' },
    { key: 'email',     label: 'Email',    icon: <Mail size={15} />,    type: 'email', placeholder: 'votre@email.com' },
    { key: 'phone',     label: 'Téléphone',icon: <Phone size={15} />,   type: 'tel',   placeholder: '6 xx xx xx xx' },
    { key: 'address',   label: 'Adresse',  icon: <MapPin size={15} />,  placeholder: 'Votre adresse' },
    { key: 'city',      label: 'Ville',    icon: <MapPin size={15} />,  placeholder: 'Votre ville' },
  ];

  return (
    <div className="flex flex-col h-full bg-[#F2F3F5]">
      <div className="bg-[#243B82] px-5 py-4 flex items-center gap-3">
        <button onClick={onBack} className="text-white/70 hover:text-white p-1"><ChevronLeft size={22} /></button>
        <p className="font-black text-white text-lg flex-1">Mon profil</p>
        {!editing ? (
          <button onClick={() => setEditing(true)}
            className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white text-sm font-bold px-4 py-2 rounded-xl transition-all border border-white/20">
            <Edit2 size={14} /> Modifier
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={handleCancel} className="text-white/60 hover:text-white text-sm font-semibold px-3 py-2 rounded-xl hover:bg-white/10 transition-all">Annuler</button>
            <button onClick={handleSave}
              className="flex items-center gap-1.5 bg-[#E30613] hover:bg-red-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition-all">
              <Save size={14} /> Enregistrer
            </button>
          </div>
        )}
      </div>

      {/* Avatar section */}
      <div className="bg-gradient-to-b from-[#243B82] to-[#1E5BB8] px-5 pb-8 flex flex-col items-center">
        <div className="relative mt-2">
          <div className="w-24 h-24 rounded-full bg-white/20 border-4 border-white/40 flex items-center justify-center text-3xl font-black text-white shadow-xl">
            {profile.firstName[0]}{profile.lastName[0]}
          </div>
          {editing && (
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-[#1E5BB8]">
              <Camera size={14} className="text-[#1E5BB8]" />
            </button>
          )}
        </div>
        <p className="text-white font-black text-xl mt-3">{profile.firstName} {profile.lastName}</p>
        <p className="text-white/60 text-sm">{profile.email}</p>
      </div>

      {saved && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="mx-4 mt-4 flex items-center gap-2.5 bg-green-50 border border-green-200 rounded-2xl px-4 py-3">
          <CheckCircle size={16} className="text-green-600" />
          <p className="text-sm text-green-700 font-semibold">Profil mis à jour avec succès !</p>
        </motion.div>
      )}

      <div className="flex-1 overflow-y-auto px-4 py-5">
        <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map(f => (
            <div key={f.key} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
              <label className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                <span className="text-[#1E5BB8]">{f.icon}</span> {f.label}
              </label>
              {editing ? (
                <input
                  type={f.type || 'text'}
                  value={form[f.key]}
                  onChange={e => set(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1E5BB8] focus:border-transparent transition-all font-medium"
                />
              ) : (
                <p className="text-sm font-semibold text-gray-800 py-1">{profile[f.key] || <span className="text-gray-300">Non renseigné</span>}</p>
              )}
            </div>
          ))}
        </div>

        <div className="max-w-2xl mx-auto mt-6">
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
            <p className="text-xs font-black text-[#1E5BB8] uppercase tracking-widest mb-2">Info pratique</p>
            <p className="text-sm text-blue-700 leading-relaxed">
              Vos informations sont automatiquement utilisées pour pré-remplir les formulaires de réservation.
              Gardez-les à jour pour réserver plus vite !
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}