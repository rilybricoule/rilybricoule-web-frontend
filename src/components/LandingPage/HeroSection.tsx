import React from 'react';
import { motion } from 'framer-motion';
import { Apple, PlayCircle, Search, MapPin, ChevronRight, Star } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative min-h-screen pt-32 pb-20 px-6 bg-[#1A2B5A] flex items-center overflow-hidden">
      {/* Overlay dégradé pour la profondeur */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#131E3D] via-transparent to-[#1E5BB8]/10"></div>

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* --- CÔTÉ GAUCHE : TEXTE MINIMALISTE --- */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-[1.1] text-white tracking-tight">
              L'application <br />
              <span className="text-white/90 font-light italic">tout-en-un</span> <br />
              pour vos travaux.
            </h1>

            <div className="flex flex-wrap gap-4 mb-10">
              <div className="flex flex-col gap-1">
                <div className="flex gap-3">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" className="h-10 cursor-pointer hover:opacity-80 transition" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" className="h-10 cursor-pointer hover:opacity-80 transition" />
                </div>
                <div className="mt-4 p-3 bg-white w-24 h-24 rounded-xl flex items-center justify-center shadow-2xl">
                   {/* Simu QR Code */}
                   <div className="w-full h-full bg-[url('https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=RilyBricoule')] bg-cover"></div>
                </div>
              </div>

            </div>
          </motion.div>

          {/* --- CÔTÉ DROIT : SMARTPHONE STYLE THUMBTACK --- */}
          <motion.div 
            className="relative flex justify-center lg:justify-end"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            {/* Le téléphone (Light Mode pour le contraste) */}
            <div className="relative w-[320px] h-[650px] bg-white rounded-[3rem] border-[10px] border-[#0F172A] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)] overflow-hidden">
              
              {/* Status Bar App */}
              <div className="p-6 pt-10">
                <div className="flex items-center gap-2 text-[#1A2B5A] mb-1">
                   <MapPin size={16} className="text-[#E30613]" />
                   <span className="font-bold text-lg">Maroc,Casablanca</span>
                   <ChevronRight size={16} />
                </div>
                <div className="flex gap-4 text-sm text-gray-500 font-medium mb-6">
                   <span className="text-[#1E5BB8] border-b-2 border-[#1E5BB8]">Projets</span>
                   <span>Entretien</span>
                   <span>Plus</span>
                </div>

                <h2 className="text-2xl font-bold text-slate-800 mb-4">Améliorez votre chez-vous</h2>

                {/* Card Service 1 */}
                <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100 mb-4 flex gap-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-xl overflow-hidden shrink-0">
                    <img src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=200" className="w-full h-full object-cover" alt="lavage" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">Nettoyage Vitres</h3>
                    <p className="text-xs text-gray-500 mb-1">150DH - 250Dh moy.</p>
                    <div className="flex items-center gap-1 text-[10px] bg-blue-100 text-blue-700 w-fit px-2 py-0.5 rounded-full font-bold">
                       <Star size={10} fill="currentColor" /> 4.9 (120 avis)
                    </div>
                  </div>
                </div>

                {/* Card Service 2 */}
                <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100 flex gap-4 opacity-90 scale-95 origin-left">
                  <div className="w-20 h-20 bg-gray-200 rounded-xl overflow-hidden shrink-0">
                    <img src="https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=200" className="w-full h-full object-cover" alt="elec" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">Électricité</h3>
                    <p className="text-xs text-gray-500 italic">Devis gratuit</p>
                  </div>
                </div>

                {/* Info Box */}
                <div className="mt-8 p-4 bg-blue-50 rounded-2xl">
                  <p className="text-xs text-blue-900 font-medium">
                    <span className="font-bold block mb-1">Le saviez-vous ?</span>
                    Un entretien régulier de votre plomberie peut vous faire économiser 200€/an.
                  </p>
                </div>
              </div>

              {/* Dynamic Island */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-[#0F172A] rounded-b-3xl z-30"></div>
            </div>

            {/* Décoration "Cercle" derrière le téléphone */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/5 rounded-full -z-10 border border-white/10"></div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}