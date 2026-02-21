import React from 'react';
import { PrestataireLayout } from '../../components/layouts/PrestataireLayout';
import { Star, User, Calendar, MessageCircle } from 'lucide-react';

interface Review {
  id: string;
  client: string;
  rating: number;
  comment: string;
  date: string;
  service: string;
}

export function PrestataireReviews() {
  const reviews: Review[] = [
    {
      id: '1',
      client: 'Jean Lemoine',
      rating: 5,
      comment: 'Excellent travail! Très professionnel et rapide. Je recommande vivement!',
      date: '2024-02-15',
      service: 'Réparation Plomberie'
    },
    {
      id: '2',
      client: 'Marie Dupont',
      rating: 4,
      comment: 'Bon travail, légèrement en retard mais rien de grave. Très courtois.',
      date: '2024-02-10',
      service: 'Installation Radiateur'
    },
    {
      id: '3',
      client: 'Pierre Martin',
      rating: 5,
      comment: 'Service impeccable, on voit que c\'est un vrai professionnel. Merci!',
      date: '2024-02-05',
      service: 'Réparation Fenêtre'
    },
    {
      id: '4',
      client: 'Sophie Bernard',
      rating: 4,
      comment: 'Très satisfait du résultat. Prix un peu élevé mais justifié par la qualité.',
      date: '2024-01-28',
      service: 'Menuiserie'
    }
  ];

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const renderStars = (rating: number) => {
    return (
      <div className="flex text-yellow-400">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={18}
            fill={i < rating ? 'currentColor' : 'none'}
            className={i < rating ? 'text-yellow-400' : 'text-gray-300'}
          />
        ))}
      </div>
    );
  };

  return (
    <PrestataireLayout>
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-800">Avis Clients</h2>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-600 text-sm font-medium">Note Moyenne</p>
            <p className="text-4xl font-bold text-yellow-500 mt-2">{averageRating}</p>
            <div className="flex justify-center mt-2">
              {renderStars(Math.round(parseFloat(averageRating.toString())))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-600 text-sm font-medium">Total d'Avis</p>
            <p className="text-4xl font-bold text-blue-600 mt-2">{reviews.length}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-600 text-sm font-medium">Taux de Satisfaction</p>
            <p className="text-4xl font-bold text-green-600 mt-2">
              {reviews.length > 0 ? Math.round((reviews.filter(r => r.rating >= 4).length / reviews.length) * 100) : 0}%
            </p>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-400">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{review.client}</h3>
                  <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                    <MessageCircle size={14} />
                    {review.service}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex justify-end mb-1">
                    {renderStars(review.rating)}
                  </div>
                  <p className="text-xs text-gray-500 flex items-center justify-end gap-1">
                    <Calendar size={12} />
                    {new Date(review.date).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed">
                "{review.comment}"
              </p>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <button className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center gap-1">
                  <MessageCircle size={16} />
                  Répondre à cet avis
                </button>
              </div>
            </div>
          ))}
        </div>

        {reviews.length === 0 && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Star size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600 text-lg">Aucun avis pour le moment</p>
          </div>
        )}
      </div>
    </PrestataireLayout>
  );
}
