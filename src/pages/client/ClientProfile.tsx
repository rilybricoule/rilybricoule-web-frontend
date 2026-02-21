import React, { useState } from 'react';
import { ClientLayout } from '../../components/layouts/ClientLayout';
import { User, Mail, Phone, MapPin, Heart } from 'lucide-react';

export function ClientProfile() {
  const [isEditing, setIsEditing] = useState(false);
  
  const [profile, setProfile] = useState({
    name: 'Jean Lemoine',
    email: 'jean@example.com',
    phone: '+33 6 12 34 56 78',
    address: '45 Rue de Paris, 75012 Paris',
    city: 'Paris',
    postalCode: '75012'
  });

  const [favorites, setFavorites] = useState([
    { id: 1, name: 'Jean Dupont', specialty: 'Plomberie' },
    { id: 2, name: 'Marie Martin', specialty: 'Électricité' }
  ]);

  const handleSave = () => {
    setIsEditing(false);
    // API call would go here
  };

  return (
    <ClientLayout>
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-800">Mon Profil</h2>

        {/* Profile Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">Informations Personnelles</h3>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors"
            >
              {isEditing ? 'Annuler' : 'Modifier'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nom Complet</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-800">{profile.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Mail size={16} /> Email
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-800">{profile.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Phone size={16} /> Téléphone
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({...profile, phone: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-800">{profile.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <MapPin size={16} /> Code Postal
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.postalCode}
                  onChange={(e) => setProfile({...profile, postalCode: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-800">{profile.postalCode}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.address}
                  onChange={(e) => setProfile({...profile, address: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-800">{profile.address}</p>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="mt-6 flex gap-4">
              <button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-lg font-semibold transition-colors"
              >
                Enregistrer
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-6 rounded-lg font-semibold transition-colors"
              >
                Annuler
              </button>
            </div>
          )}
        </div>

        {/* Favorites Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Heart className="text-red-600" />
            Artisans Favoris
          </h3>
          
          {favorites.length > 0 ? (
            <div className="space-y-3">
              {favorites.map((fav) => (
                <div key={fav.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-800">{fav.name}</p>
                    <p className="text-sm text-gray-600">{fav.specialty}</p>
                  </div>
                  <button className="text-red-600 hover:text-red-800 font-semibold">
                    Supprimer
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">Aucun artisan favori pour le moment</p>
          )}
        </div>
      </div>
    </ClientLayout>
  );
}
