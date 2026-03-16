import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Wrench } from 'lucide-react';

export function CTASection() {
  return (
    <section className="py-20 px-6 bg-gradient-to-br from-[#F2F3F5] via-[#E5E7EB] to-[#1E5BB8] overflow-hidden">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-[#E30613]/10 text-[#E30613] px-5 py-2.5 rounded-full mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Wrench size={16} />
            <span className="text-sm font-semibold">Rejoignez des milliers d'utilisateurs satisfaits</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#243B82]">
            Prêt à trouver votre
            <span className="block gradient-text mt-2 bg-gradient-to-r from-[#1E5BB8] via-[#E30613] to-[#243B82] bg-clip-text text-transparent">
              professionnel idéal ?
            </span>
          </h2>

          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Découvrez la manière la plus simple et la plus rapide de réserver vos 
            services de bricolage à domicile
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <motion.button
              className="bg-gradient-to-r from-[#1E5BB8] via-[#E30613] to-[#243B82] bg-size-200 bg-pos-0 hover:bg-pos-100 text-white px-12 py-5 rounded-full text-lg font-semibold shadow-xl flex items-center gap-2 transition-all duration-300"
              whileHover={{ 
                scale: 1.05, 
                boxShadow: '0 25px 50px rgba(227, 6, 19, 0.4)' 
              }}
              whileTap={{ scale: 0.95 }}
            >
              Commencer maintenant
              <ArrowRight size={20} />
            </motion.button>

            <motion.button
              className="border-2 border-[#E30613] text-[#E30613] px-12 py-5 rounded-full text-lg font-semibold hover:bg-[#E30613]/10 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Devenir prestataire
            </motion.button>
          </div>

          <motion.p
            className="text-sm text-gray-500 mt-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            • Inscription rapide • Annulation gratuite
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}