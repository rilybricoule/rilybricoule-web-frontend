import React from 'react';
import { motion } from 'framer-motion';
import { Hammer, Wrench, Paintbrush, Zap, Droplet, Home } from 'lucide-react';

export function ServiceCategories() {
  const services = [
    { 
      icon: Hammer, 
      title: 'Réparations', 
      desc: 'Petits travaux de réparation', 
      color: 'from-[#1E5BB8] to-[#243B82]', // Bleu principal → Bleu foncé
      iconColor: 'text-[#1E5BB8]'
    },
    { 
      icon: Paintbrush, 
      title: 'Peinture', 
      desc: 'Travaux de peinture intérieure', 
      color: 'from-[#E30613] to-[#1E5BB8]', // Rouge CTA → Bleu principal
      iconColor: 'text-[#E30613]'
    },
    { 
      icon: Zap, 
      title: 'Électricité', 
      desc: 'Installations électriques', 
      color: 'from-[#1E5BB8] to-[#E30613]', // Bleu principal → Rouge CTA
      iconColor: 'text-[#243B82]'
    },
    { 
      icon: Droplet, 
      title: 'Plomberie', 
      desc: 'Réparations et installations', 
      color: 'from-[#243B82] to-[#1E5BB8]', // Bleu foncé → Bleu principal
      iconColor: 'text-[#1E5BB8]'
    },
    { 
      icon: Wrench, 
      title: 'Montage', 
      desc: 'Assemblage de meubles', 
      color: 'from-[#D1D5DB] to-[#6B7280]', // Neutre → Blanc pour douceur
      iconColor: 'text-[#243B82]'
    },
    { 
      icon: Home, 
      title: 'Encore plus', 
      desc: 'Découvrez plus de services', 
      color: 'from-[#E30613] to-[#1E5BB8]', // Rouge CTA → Bleu principal
      iconColor: 'text-[#E30613]'
    }
  ];

  return (
    <section id="services" className="py-20 px-6 bg-[#F2F3F5]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 reveal">
          <motion.h2 
            className="text-4xl font-bold mb-4 text-[#243B82]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Nos services de bricolage
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Des professionnels qualifiés pour tous vos travaux
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <motion.div
              key={i}
              className="card-hover bg-white rounded-2xl p-8 shadow-lg border-2 border-[#E5E7EB] hover:border-[#1E5BB8] cursor-pointer group transition-all duration-300"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.03, y: -5 }}
            >
              <motion.div 
                className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center mb-6 shadow-md`}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <service.icon className="text-white" size={32} />
              </motion.div>
              <h3 className="text-2xl font-semibold mb-3 text-[#243B82]">{service.title}</h3>
              <p className="text-gray-600 mb-4">{service.desc}</p>
              <motion.button 
                className={`${service.iconColor} font-semibold hover:underline transition-all flex items-center gap-1`}
                whileHover={{ x: 5 }}
              >
                Explorer 
                <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}