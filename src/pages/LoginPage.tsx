import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, type UserRole } from '../context/AuthContext';
import { Wrench, Users } from 'lucide-react';
import { motion } from 'framer-motion';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password || !role) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password, role);
      // Redirection basée sur le rôle
      navigate(role === 'client' ? '/client' : '/prestataire');
    } catch (err) {
      setError('Erreur de connexion. Veuillez réessayer.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-white flex items-center justify-center px-4">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="bg-white rounded-lg shadow-2xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-orange-500 to-cyan-500 bg-clip-text text-transparent mb-2">
              RilyBricoule
            </div>
            <p className="text-gray-600">Connexion</p>
          </div>

          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <motion.button
              onClick={() => setRole('client')}
              className={`p-4 rounded-lg border-2 transition-all ${
                role === 'client'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-300 bg-white hover:border-blue-600'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Users className={`mx-auto mb-2 ${role === 'client' ? 'text-blue-600' : 'text-gray-400'}`} />
              <div className={`text-sm font-semibold ${role === 'client' ? 'text-blue-600' : 'text-gray-600'}`}>
                Client
              </div>
            </motion.button>

            <motion.button
              onClick={() => setRole('prestataire')}
              className={`p-4 rounded-lg border-2 transition-all ${
                role === 'prestataire'
                  ? 'border-orange-600 bg-orange-50'
                  : 'border-gray-300 bg-white hover:border-orange-600'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Wrench className={`mx-auto mb-2 ${role === 'prestataire' ? 'text-orange-600' : 'text-gray-400'}`} />
              <div className={`text-sm font-semibold ${role === 'prestataire' ? 'text-orange-600' : 'text-gray-600'}`}>
                Prestataire
              </div>
            </motion.button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="votre@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
              />
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2 px-4 rounded-lg font-semibold text-white transition-all ${
                role === 'client'
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-orange-600 hover:bg-orange-700'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? 'Connexion en cours...' : 'Se connecter'}
            </motion.button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <p className="text-xs text-gray-600 mb-2 font-semibold">Identifiants de démo:</p>
            <p className="text-xs text-gray-600">Email: demo@test.com</p>
            <p className="text-xs text-gray-600">Mot de passe: demo123</p>
          </div>

          {/* Back to home */}
          <div className="mt-4 text-center">
            <a href="/" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Retour à l'accueil
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
