import React, { useState } from 'react';
import { PrestataireLayout } from '../../components/layouts/PrestataireLayout';
import { User, Mail, Phone, MapPin, Briefcase, FileText } from 'lucide-react';

export function PrestataireProfile() {
  const [isEditing, setIsEditing] = useState(false);
  
  const [profile, setProfile] = useState({
    name: 'Pierre Leclerc',
    email: 'pierre@example.com',
    phone: '+33 6 98 76 54 32',
    address: '10 Rue du Bricolage, 75011 Paris',
    city: 'Paris',
    postalCode: '75011',
    specialty: 'Menuiserie',
    experience: '15 ans',
    bio: 'Professionnel expérimenté en menuiserie et travaux divers.',
    certifications: ['CAP Menuiserie', 'Assurance Responsabilité']
  });

  const handleSave = () => {
    setIsEditing(false);
    // API call would go here
  };

  return (
    <PrestataireLayout>
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-800">Mon Profil</h2>

        {/* Profile Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">Informations Professionnelles</h3>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              ) : (
                <p className="text-gray-800">{profile.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Briefcase size={16} /> Spécialité
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.specialty}
                  onChange={(e) => setProfile({...profile, specialty: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              ) : (
                <p className="text-gray-800">{profile.specialty}</p>
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              ) : (
                <p className="text-gray-800">{profile.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Expérience</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.experience}
                  onChange={(e) => setProfile({...profile, experience: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              ) : (
                <p className="text-gray-800">{profile.experience}</p>
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              ) : (
                <p className="text-gray-800">{profile.address}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FileText size={16} /> Biographie
              </label>
              {isEditing ? (
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({...profile, bio: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 h-20"
                />
              ) : (
                <p className="text-gray-800">{profile.bio}</p>
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

        {/* Certifications */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Certifications & Documents</h3>
          <div className="space-y-2">
            {profile.certifications.map((cert, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-800">{cert}</span>
                <button className="text-orange-600 hover:text-orange-700 font-semibold">
                  Voir
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PrestataireLayout>
  );
}
