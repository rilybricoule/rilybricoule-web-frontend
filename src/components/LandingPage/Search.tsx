import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin } from 'lucide-react';

export function HeroSearch() {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: wire up to your search/routing logic
    console.log('Search:', query, 'Location:', location);
  };

  return (
    <section className="relative w-full h-[520px] overflow-hidden flex items-center justify-center">

      {/* ════════════════════════════════════════════════════
          ① BACKGROUND IMAGE
          Change the `src` to swap the photo.
          Options:
            - Drop your own image in /public/images/ and use src="/images/hero.jpg"
            - Or replace with another Unsplash URL (keep the ?w=1600&q=80 params)
          Current image: carpenter/workshop — bricolage theme
          ════════════════════════════════════════════════════ */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1600&q=80&auto=format&fit=crop"
            className="w-full h-full object-cover object-center"
          />
        
          

        {/* ════════════════════════════════════════════════════
            ② OVERLAY DARKNESS
            Change `bg-black/50` to adjust how dark the overlay is.
            /30 = light, /50 = medium (current), /70 = very dark
            ════════════════════════════════════════════════════ */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Optional warm tint to reinforce the "workshop" feel */}
        <div className="absolute inset-0 bg-orange-900/10" />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 w-full max-w-3xl mx-auto px-4 flex flex-col items-center gap-8">

        {/* ════════════════════════════════════════════════════
            ③ TITLE & SUBTITLE
            Change the h1 text and the <p> tagline here.
            ════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight drop-shadow-lg">
            Un bricoleur de confiance, partout au Maroc.
          </h1>
          <p className="mt-3 text-white/80 text-lg tracking-widest font-light">
            Plomberie&nbsp;•&nbsp;Électricité&nbsp;•&nbsp;Peinture&nbsp;•&nbsp;Et plus
          </p>
        </motion.div>

        {/* ── Search bar ── */}
        <motion.form
          onSubmit={handleSearch}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
          className="w-full bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden"
        >
          {/* ════════════════════════════════════════════════════
              ④ SEARCH FIELD — label & placeholder
              ════════════════════════════════════════════════════ */}
          <div className="flex-1 flex flex-col px-5 py-4 border-b md:border-b-0 md:border-r border-gray-100">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
              Que cherchez-vous ?
            </span>
            <div className="flex items-center gap-2">
              <Search size={16} className="text-gray-400 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Plombier, électricien, peintre..."
                className="w-full outline-none text-gray-800 text-sm placeholder-gray-400 bg-transparent"
              />
            </div>
          </div>

          {/* ════════════════════════════════════════════════════
              ⑤ LOCATION FIELD — label & placeholder
              ════════════════════════════════════════════════════ */}
          <div className="flex-1 flex flex-col px-5 py-4">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Où</span>
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-gray-400 shrink-0" />
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="Adresse, ville..."
                className="w-full outline-none text-gray-800 text-sm placeholder-gray-400 bg-transparent"
              />
            </div>
          </div>

          {/* ════════════════════════════════════════════════════
              ⑥ BUTTON COLOR & TEXT
              Current: bg-orange-500 to match bricolage/RilyBricoule palette.
              Change `bg-orange-500 hover:bg-orange-600` to use any color,
              or swap back to `bg-black hover:bg-gray-900` for neutral style.
              ════════════════════════════════════════════════════ */}
          <button
            type="submit"
            className="m-2 px-8 py-3 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-semibold rounded-xl transition-all duration-200 shrink-0 self-stretch md:self-auto flex items-center justify-center"
          >
            Rechercher
          </button>
        </motion.form>
      </div>
    </section>
  );
}