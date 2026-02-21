import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Wrench, Hammer, ChevronLeft, ChevronRight } from 'lucide-react';

export function HeroSection() {
  const images = [
    'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1590959651373-a3db0f38a961?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1527689368864-3a821dbccc34?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1534237886190-ced735ca4b73?w=400&h=500&fit=crop'
  ];

  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', checkScroll);
      checkScroll();
      return () => scrollContainer.removeEventListener('scroll', checkScroll);
    }
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 280;
      const newScrollPosition = scrollRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      scrollRef.current.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-blue-100 via-blue-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="reveal">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-grey-900">
                Votre Bricoleur
                <span className="block gradient-text mt-2 bg-gradient-to-r from-blue-600 via-orange-500 to-cyan-500 bg-clip-text text-transparent">
                  À Domicile
                </span>
              </h1>
              
              <div className="flex items-center gap-3 text-xl text-gray-700 mb-8 flex-wrap">
                <span className="flex items-center gap-2">
                  <Wrench className="text-blue-600" size={22} />
                  <span className="font-medium">Rapide</span>
                </span>
                <span className="text-orange-400">•</span>
                <span className="flex items-center gap-2">
                  <Calendar className="text-orange-500" size={22} />
                  <span className="font-medium">Fiable</span>
                </span>
                <span className="text-orange-400">•</span>
                <span className="flex items-center gap-2">
                  <Hammer className="text-cyan-600" size={22} />
                  <span className="font-medium">Professionnel</span>
                </span>
              </div>

              <p className="text-gray-700 mb-8 leading-relaxed text-lg">
                Découvrez les Meilleurs Services à Domicile pour Simplifier Votre Vie : Dans un monde où le temps est précieux, découvrez les meilleurs services à domicile qui transformeront votre quotidien. Simplifiez votre vie dès aujourd'hui !
              </p>

              <div className="flex flex-wrap gap-4">
                <motion.button
                  className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-2xl transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Trouver un professionnel
                </motion.button>
                <motion.button
                  className="border-2 border-blue-500 text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-orange-50 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Devenir prestataire
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Right Content - Image Carousel */}
          <motion.div 
            className="reveal relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative">

              <div 
                ref={scrollRef}
                className="carousel-scroll flex gap-4 overflow-x-auto pb-4 snap-x "
              >
                {images.map((img, i) => (
                  <motion.div
                    key={i}
                    className="parallax-container flex-shrink-0 w-64 h-80 rounded-2xl overflow-hidden duration-300 snap-center"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 + 0.3, duration: 0.6 }}
                    whileHover={{ y: -10, scale: 1.02 }}
                  >
                    <img 
                      src={img} 
                      alt={`Service de bricolage ${i + 1}`} 
                      className="parallax-img w-full h-full object-cover" 
                    />

                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
