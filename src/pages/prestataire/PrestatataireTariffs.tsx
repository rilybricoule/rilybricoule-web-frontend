import React, { useState } from 'react';
import { PrestataireLayout } from '../../components/layouts/PrestataireLayout';
import { DollarSign, Edit2, Plus, Trash2 } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
}

export function PrestatataireTariffs() {
  const [services, setServices] = useState<Service[]>([
    {
      id: '1',
      name: 'Consultation',
      description: 'Visite et diagnostic du problème',
      price: 50
    },
    {
      id: '2',
      name: 'Réparation Simple',
      description: 'Réparation basique (moins de 2h)',
      price: 75
    },
    {
      id: '3',
      name: 'Installation',
      description: 'Installation de nouveaux équipements',
      price: 100
    }
  ]);

  const [isAddingService, setIsAddingService] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newService, setNewService] = useState({ name: '', description: '', price: 0 });

  const handleAddService = () => {
    if (newService.name && newService.price > 0) {
      setServices([...services, {
        id: Date.now().toString(),
        ...newService
      }]);
      setNewService({ name: '', description: '', price: 0 });
      setIsAddingService(false);
    }
  };

  const handleDeleteService = (id: string) => {
    setServices(services.filter(s => s.id !== id));
  };

  return (
    <PrestataireLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-800">Tarifs & Services</h2>
          <button
            onClick={() => setIsAddingService(true)}
            className="bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors flex items-center gap-2"
          >
            <Plus size={20} /> Ajouter un Service
          </button>
        </div>

        {/* Add New Service Form */}
        {isAddingService && (
          <div className="bg-white rounded-lg shadow p-6 border-2 border-orange-300">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Nouveau Service</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom du Service</label>
                <input
                  type="text"
                  value={newService.name}
                  onChange={(e) => setNewService({...newService, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Ex: Réparation Plomberie"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newService.description}
                  onChange={(e) => setNewService({...newService, description: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Décrivez le service..."
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prix (€/heure)</label>
                <input
                  type="number"
                  value={newService.price}
                  onChange={(e) => setNewService({...newService, price: parseFloat(e.target.value)})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="75"
                />
              </div>
              <div className="flex gap-4">
                <button
                  onClick={handleAddService}
                  className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-lg font-semibold transition-colors"
                >
                  Ajouter
                </button>
                <button
                  onClick={() => {
                    setIsAddingService(false);
                    setNewService({ name: '', description: '', price: 0 });
                  }}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-6 rounded-lg font-semibold transition-colors"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service) => (
            <div key={service.id} className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-600">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{service.name}</h3>
                  <p className="text-gray-600 text-sm mt-1">{service.description}</p>
                </div>
                <div className="flex gap-2">
                  <button className="text-blue-600 hover:text-blue-700 p-2 hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteService(service.id)}
                    className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2 text-2xl font-bold text-orange-600">
                <DollarSign size={24} />
                {service.price}€<span className="text-sm text-gray-600">/heure</span>
              </div>
            </div>
          ))}
        </div>

        {services.length === 0 && !isAddingService && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <DollarSign size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600 text-lg">Aucun service pour le moment</p>
          </div>
        )}
      </div>
    </PrestataireLayout>
  );
}
