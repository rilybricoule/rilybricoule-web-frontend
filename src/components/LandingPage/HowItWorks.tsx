import React from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar, Bell, MessageSquare } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    { 
      icon: Search, 
      title: 'Rechercher', 
      desc: 'Trouvez des professionnels dans votre région', 
      color: 'from-[#1E5BB8] to-[#243B82]' // primary blue → dark blue
    },
    { 
      icon: MessageSquare, 
      title: 'Contacter', 
      desc: 'Contacter facilement le professionnel souhaité pour discuter en détail', 
      color: 'from-[#E30613] to-[#1E5BB8]' // CTA red → primary blue
    },    
    { 
      icon: Calendar, 
      title: 'Réserver', 
      desc: 'Choisissez votre créneau préféré', 
      color: 'from-[#1E5BB8] to-[#E30613]' // primary blue → CTA red
    },
    { 
      icon: Bell, 
      title: 'Confirmer', 
      desc: 'Recevez une confirmation instantanée par SMS', 
      color: 'from-[#243B82] to-[#1E5BB8]' // dark blue → primary blue
    }
  ];

  return (
    <section id="comment-ca-marche" className="py-20 px-6 bg-[#F2F3F5]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 reveal">
          <motion.h2 
            className="text-4xl font-bold mb-4 text-[#243B82]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Comment ça marche
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Réservez en 4 étapes simples
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              className="text-center relative"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <div className="relative mb-6">
                <motion.div 
                  className={`w-20 h-20 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center mx-auto card-hover shadow-xl`}
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <step.icon className="text-white" size={32} />
                </motion.div>

                {i < steps.length - 1 && (
                  <motion.div 
                    className="hidden md:block absolute top-10 left-1/2 w-full h-0.5 bg-gradient-to-r from-[#1E5BB8] via-[#E30613] to-[#243B82]"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 + 0.3, duration: 0.5 }}
                  />
                )}

                <motion.div
                  className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#1E5BB8] font-bold text-sm shadow-md border-2 border-[#E5E7EB]"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 + 0.2, type: 'spring', stiffness: 200 }}
                >
                  {i + 1}
                </motion.div>
              </div>

              <h3 className="text-xl font-semibold mb-2 text-[#243B82]">{step.title}</h3>
              <p className="text-gray-600">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}