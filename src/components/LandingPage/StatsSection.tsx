import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Calendar, Clock, Star } from 'lucide-react';

export function StatsSection() {
  const stats = [
    { icon: Building2, value: '50 000+', label: 'Salons & Instituts' },
    { icon: Calendar, value: '5M+', label: 'Réservations effectuées' },
    { icon: Clock, value: '50%', label: 'Réservations hors horaires' },
    { icon: Star, value: '4.8', label: 'Note moyenne' }
  ];

  return (
    <section className="py-20 px-6 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 stagger-children">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              className="text-center"
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, type: 'spring', stiffness: 100 }}
            >
              <motion.div
                className="mb-4 flex justify-center"
                whileHover={{ scale: 1.2, rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <stat.icon size={40} />
              </motion.div>
              <motion.div 
                className="text-5xl font-bold mb-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 + 0.2 }}
              >
                {stat.value}
              </motion.div>
              <motion.div 
                className="text-purple-100"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 + 0.3 }}
              >
                {stat.label}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
