import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

export function Testimonials() {
  const testimonials = [
    { 
      name: 'Jessica Miller', 
      text: 'J\'adore absolument cette plateforme ! La réservation est si facile et les professionnels sont de premier ordre.', 
      rating: 5,
      role: 'Cliente régulière'
    },
    { 
      name: 'David Brown', 
      text: 'Un véritable changement pour gérer mes rendez-vous. Les rappels SMS sont super utiles !', 
      rating: 5,
      role: 'Utilisateur depuis 2 ans'
    },
    { 
      name: 'Lisa Anderson', 
      text: 'J\'ai trouvé mon salon préféré grâce à cette application. L\'interface est claire et intuitive.', 
      rating: 5,
      role: 'Nouvelle utilisatrice'
    }
  ];

  return (
    <section className="py-20 px-6 bg-gradient-to-br from-[#F2F3F5] via-[#E5E7EB] to-[#1E5BB8]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 reveal">
          <motion.h2 
            className="text-4xl font-bold mb-4 text-[#243B82]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Ce que disent nos clients
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Expériences réelles de vraies personnes
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((test, i) => (
            <motion.div
              key={i}
              className="card-hover bg-white rounded-2xl p-8 shadow-lg relative border border-[#E5E7EB]"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <motion.div 
                className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-[#1E5BB8] via-[#E30613] to-[#243B82] rounded-full flex items-center justify-center shadow-lg"
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 + 0.2, type: 'spring', stiffness: 200 }}
              >
                <Quote className="text-white" size={20} />
              </motion.div>
              
              <div className="flex mb-4 mt-4">
                {[...Array(test.rating)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 + 0.3 }}
                  >
                    <Star className="text-[#FACC15] fill-[#FACC15]" size={20} />
                  </motion.div>
                ))}
              </div>
              
              <p className="text-gray-700 mb-6 leading-relaxed italic">"{test.text}"</p>
              
              <div className="border-t pt-4">
                <p className="font-semibold text-lg text-[#243B82]">{test.name}</p>
                <p className="text-sm text-gray-500">{test.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}