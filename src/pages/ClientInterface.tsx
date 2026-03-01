import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { View, Pro, ServiceCategory, UserProfile } from '../types';
import { useFilters, useConversations, useBooking } from '../hooks';
import { TopNav } from '../components/navabar/NavbarClient';
import { ExplorePage } from './ExplorePage';
import { ServicesPage } from './ServicesPage';
import { MapPage } from './MapPage';
import { ProProfilePage } from './ProProfilePage';
import { TrackingPage } from './TrackingPage';
import { MessagesPage } from './MessagesPage';
import { BookingPage } from './BookingPage';
import { PaymentPage } from './PaymentPage';
import { ReviewPage } from './ReviewPage';
import { FaqPage } from './FaqPage';
import { UserProfilePage } from './UserProfile';
import { DemandesPage } from './DemandesPage';

const DEFAULT_PROFILE: UserProfile = {
  firstName: 'Youssef',
  lastName: 'El Idrissi',
  email: 'youssef.elidrissi@gmail.com',
  phone: '6 61 23 45 67',
  address: '12 Rue Abou Inane, Maarif',
  city: 'Casablanca',
};

const pageVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit:    { opacity: 0, x: -20 },
};

const MAIN_VIEWS: View[] = ['explore', 'services', 'map', 'messages', 'faq', 'demandes', 'profile-user'];

export function ClientInterface() {
  const [view, setView]               = useState<View>('explore');
  const [prevView, setPrevView]       = useState<View>('explore');
  const [selectedPro, setSelectedPro] = useState<Pro | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_PROFILE);

  const { filters, updateFilter, resetFilters, filteredPros } = useFilters();
  const { conversations, sendMessage, totalUnread }           = useConversations();
  const { booking, updateBooking, isBookingValid, resetBooking } = useBooking();

  const navigate = (nextView: View) => { setPrevView(view); setView(nextView); };

  const handleSelectPro      = (pro: Pro) => { setSelectedPro(pro); navigate('profile'); };
  const handleMessage        = (pro: Pro) => { setSelectedPro(pro); navigate('messages'); };
  const handleBook           = (pro: Pro) => { setSelectedPro(pro); navigate('booking'); };
  const handleTrack          = (pro: Pro) => { setSelectedPro(pro); navigate('tracking'); };
  const handleCategoryFilter = (cat: ServiceCategory) => { updateFilter('category', cat); navigate('services'); };

  const handleBack = () => {
    setView(MAIN_VIEWS.includes(prevView) ? prevView : 'explore');
    setSelectedPro(null);
  };

  const showTopNav = MAIN_VIEWS.includes(view);

  return (
    <div className="flex flex-col" style={{ height: '100dvh' }}>
      {showTopNav && (
        <TopNav
          activeView={view}
          onNavigate={navigate}
          unreadMessages={totalUnread}
          onCategoryFilter={handleCategoryFilter}
        />
      )}
      <div className={`flex-1 overflow-hidden flex flex-col ${showTopNav ? 'pt-14' : ''}`}>
        <AnimatePresence mode="wait">
          <motion.div key={view} variants={pageVariants}
            initial="initial" animate="animate" exit="exit"
            transition={{ duration: 0.18, ease: 'easeInOut' }}
            className="flex-1 overflow-hidden flex flex-col">

            {view === 'explore' && (
              <ExplorePage filteredPros={filteredPros} onSelectPro={handleSelectPro}
                onNavigate={navigate} onCategoryFilter={handleCategoryFilter} />
            )}
            {view === 'services' && (
              <ServicesPage filteredPros={filteredPros} filters={filters}
                updateFilter={updateFilter} resetFilters={resetFilters} onSelectPro={handleSelectPro} />
            )}
            {view === 'map' && (
              <MapPage filteredPros={filteredPros} filters={filters}
                updateFilter={updateFilter} onSelectPro={handleSelectPro} />
            )}
            {view === 'profile' && selectedPro && (
              <ProProfilePage pro={selectedPro} onBack={handleBack}
                onBook={handleBook} onMessage={handleMessage} onTrack={handleTrack} />
            )}
            {view === 'tracking' && selectedPro && (
              <TrackingPage pro={selectedPro} onBack={handleBack} onMessage={handleMessage} />
            )}
            {view === 'messages' && (
              <MessagesPage conversations={conversations} onSendMessage={sendMessage}
                onSelectPro={handleSelectPro} onBook={handleBook} />
            )}
            {view === 'booking' && selectedPro && (
              <BookingPage pro={selectedPro} booking={booking} updateBooking={updateBooking}
                isValid={isBookingValid} onBack={handleBack}
                onProceedToPayment={() => navigate('payment')}
                userProfile={userProfile} />
            )}
            {view === 'payment' && selectedPro && (
              <PaymentPage pro={selectedPro} booking={booking} updateBooking={updateBooking}
                onBack={() => navigate('booking')} onConfirm={() => handleTrack(selectedPro)}
                userProfile={{ cardName: `${userProfile.firstName} ${userProfile.lastName}` }} />
            )}
            {view === 'review' && selectedPro && (
              <ReviewPage pro={selectedPro} onBack={handleBack} onSubmit={() => navigate('explore')} />
            )}
            {view === 'faq' && <FaqPage />}
            {view === 'demandes' && (
              <DemandesPage
                onBack={handleBack}
                userAddress={`${userProfile.address}, ${userProfile.city}`}
                onViewPro={(proId) => {
                  const pro = filteredPros.find(p => p.id === proId);
                  if (pro) handleSelectPro(pro);
                }}
              />
            )}
            {view === 'profile-user' && (
              <UserProfilePage profile={userProfile} onUpdate={setUserProfile} onBack={handleBack} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}