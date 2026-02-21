import React, { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-blue-400/95 backdrop-blur-md shadow-lg py-2' 
          : 'bg-blue-200 py-3'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <motion.div 
            className="flex items-center cursor-pointer gap-3"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <motion.img 
              src="/logos/nobg_logo.png" 
              alt="RilyBricoule Logo" 
              className={`transition-all duration-300 ${isScrolled ? 'h-12 w-12' : 'h-16 w-16'}`}
              whileHover={{ rotate: 5 }}
            />
            <div className={`font-bold bg-gradient-to-r from-blue-600 via-orange-300 to-cyan-700 bg-clip-text text-transparent transition-all duration-300 ${isScrolled ? 'text-xl' : 'text-2xl'}`}>
              RilyBricoule
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {['Accueil', 'Services', 'Comment ça marche', 'Professionnels'].map((item, index) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase().replace(/ /g, '-')}`}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors relative group"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {item}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-300 group-hover:w-full"></span>
              </motion.a>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <motion.a
              href="/login"
              className="text-blue-600 font-semibold hover:text-blue-800 transition-colors px-5 py-2.5 border-2 border-blue-600 rounded-full hover:bg-blue-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Connexion
            </motion.a>
            <motion.a
              href="/login"
              className="bg-gradient-to-r from-blue-600 via-orange-500 to-blue-600 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white px-6 py-2.5 rounded-full font-semibold shadow-md hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Inscription
            </motion.a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-blue-600 hover:text-blue-700 transition-colors p-2"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {['Accueil', 'Services', 'Comment ça marche', 'Artisans'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/ /g, '-')}`}
                  className="block py-3 text-gray-700 hover:text-blue-600 font-medium border-b border-gray-50 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              <div className="pt-4 flex flex-col space-y-3">
                <a
                  href="/login"
                  className="w-full text-center text-blue-600 font-semibold py-3 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-colors block"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Connexion
                </a>
                <a
                  href="/login"
                  className="w-full text-center bg-gradient-to-r from-blue-600 via-orange-500 to-blue-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-shadow block"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Inscription
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
