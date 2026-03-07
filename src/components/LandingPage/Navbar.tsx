import React, { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const navItems: string[] = [
  'Accueil',
  'Services',
  'Comment ça marche',
  'Professionnels',
];

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect((): (() => void) => {
    const handleScroll = (): void => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return (): void => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#243B82] shadow-lg py-2'
          : 'bg-transparent py-3'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">

          {/* Logo */}
          <motion.div
            className="flex items-center cursor-pointer gap-3"
            whileHover={{ scale: 1.02 }}
          >
            <motion.img
              src="/logos/nobg_logo.png"
              alt="RilyBricoule Logo"
              className={`transition-all duration-300 ${
                isScrolled ? 'h-12 w-12' : 'h-16 w-16'
              }`}
              whileHover={{ rotate: 5 }}
            />
            <div className="font-bold text-white text-xl">
              RilyBricoule
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase().replace(/ /g, '-')}`}
                className="font-medium relative group text-white transition-colors"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {item}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#E30613] transition-all duration-300 group-hover:w-full" />
              </motion.a>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <motion.button
              type="button"
              onClick={() => navigate('/login')}
              className="font-semibold px-5 py-2.5 border-2 border-white text-white rounded-full hover:bg-white/10 transition-colors"
              whileHover={{ scale: 1.05 }}
            >
              Connexion
            </motion.button>

            <motion.button
              type="button"
              onClick={() => navigate('/register')}
              className="bg-[#E30613] text-white px-6 py-2.5 rounded-full font-semibold shadow-md hover:opacity-90 transition-all"
              whileHover={{ scale: 1.05 }}
            >
              Inscription
            </motion.button>
          </div>

          {/* Mobile Button */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(prev => !prev)}
              className="text-white p-2"
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
            className="md:hidden bg-[#243B82] border-t border-[#1E5BB8] overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navItems.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/ /g, '-')}`}
                  className="block py-3 text-white font-medium border-b border-[#1E5BB8]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};