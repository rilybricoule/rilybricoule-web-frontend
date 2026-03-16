import React from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin } from 'lucide-react';

export function FeaturedProfessionals() {
  const professionals = [
    { 
      name: 'Sarah Johnson', 
      role: 'Styliste Maître', 
      rating: 4.9, 
      reviews: 234, 
      location: 'Paris 8ème',
      img: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=300&h=300&fit=crop' 
    },
    { 
      name: 'Michael Chen', 
      role: 'Spécialiste Spa', 
      rating: 5.0, 
      reviews: 189, 
      location: 'Lyon 2ème',
      img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop' 
    },
    { 
      name: 'Emma Davis', 
      role: 'Artiste Ongles', 
      rating: 4.8, 
      reviews: 312, 
      location: 'Bordeaux',
      img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop' 
    },
    { 
      name: 'James Wilson', 
      role: 'Massothérapeute', 
      rating: 4.9, 
      reviews: 156, 
      location: 'Marseille',
      img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop' 
    }
  ];

  return (
    <section id="artisans" className="py-20 px-6 bg-[#F2F3F5]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 reveal">
          <motion.h2 
            className="text-4xl font-bold mb-4 text-[#243B82]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Professionnels en vedette
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Rencontrez nos experts les mieux notés
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {professionals.map((pro, i) => (
            <motion.div
              key={i}
              className="card-hover bg-white rounded-2xl overflow-hidden shadow-lg border border-[#E5E7EB]"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <motion.div 
                className="parallax-container h-64 overflow-hidden relative"
                whileHover={{ scale: 1.05 }}
              >
                <img 
                  src={pro.img} 
                  alt={pro.name} 
                  className="parallax-img w-full h-full object-cover" 
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
                  <Star className="text-[#E30613] fill-[#E30613]" size={16} />
                  <span className="font-semibold text-sm text-[#243B82]">{pro.rating}</span>
                </div>
              </motion.div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-1 text-[#243B82]">{pro.name}</h3>
                <p className="text-[#1E5BB8] mb-2">{pro.role}</p>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <MapPin size={14} className="mr-1" />
                  {pro.location}
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    {pro.reviews} avis
                  </div>
                  <motion.button 
                    className="text-[#1E5BB8] font-semibold hover:text-[#E30613] transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Réserver →
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}