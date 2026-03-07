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
import { BookingConfirmationPage } from './Bookingconfirmationpage';
import { PaymentPage } from './PaymentPage';
import { ReviewPage } from './ReviewPage';
import { FaqPage } from './FaqPage';
import { UserProfilePage } from './UserProfile';
import { DemandesPage } from './DemandesPage';
import { useNotifications, NotificationBell, NotificationsPanel } from './NotificationPannels';

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

  /**
   * BOOKING FLOW
   * ────────────────────────────────────────────────────────────
   * 1. Client fills BookingPage          → 'booking-confirm'
   * 2a. Pro accepts                      → notification → 'payment'
   * 2b. Pro declines                     → notification → 'explore'
   * 3. Client pays                       → activeBookingProIds (chat unlocked)
   * 4. Service done                      → completedBookingProIds (chat disabled)
   */
  const [activeBookingProIds, setActiveBookingProIds]       = useState<number[]>([]);
  const [completedBookingProIds, setCompletedBookingProIds] = useState<number[]>([]);

  const { filters, updateFilter, resetFilters, filteredPros } = useFilters();
  const { conversations, sendMessage, totalUnread }           = useConversations();
  const { booking, updateBooking, isBookingValid, resetBooking } = useBooking();
  const notifications = useNotifications();

  const navigate = (nextView: View) => { setPrevView(view); setView(nextView); };

  const handleSelectPro      = (pro: Pro) => { setSelectedPro(pro); navigate('profile'); };
  const handleTrack          = (pro: Pro) => { setSelectedPro(pro); navigate('tracking'); };
  const handleMessage        = (pro: Pro) => { setSelectedPro(pro); navigate('messages'); };
  const handleCategoryFilter = (cat: ServiceCategory) => { updateFilter('category', cat); navigate('services'); };

  // Step 1 — open booking form
  const handleBook = (pro: Pro) => {
    setSelectedPro(pro);
    navigate('booking');
  };

  // Step 1b — form complete → send request to pro, show waiting screen
  const handleProceedToConfirmation = () => navigate('booking-confirm');

  // Step 2a — pro accepted
  const handleProAccepted = () => {
    if (!selectedPro) return;
    notifications.add({ type: 'booking_accepted', proName: selectedPro.name, proId: selectedPro.id });
    navigate('payment');
  };

  // Step 2b — pro declined
  const handleProDeclined = () => {
    if (!selectedPro) return;
    notifications.add({ type: 'booking_denied', proName: selectedPro.name });
    resetBooking();
    setSelectedPro(null);
    navigate('explore');
  };

  // Step 3 — payment confirmed → unlock chat
  const handlePaymentConfirmed = (pro: Pro) => {
    setActiveBookingProIds(prev => [...new Set([...prev, pro.id])]);
    notifications.add({ type: 'payment_success', amount: 0 });
    handleTrack(pro);
  };

  // Step 4 — service completed → disable chat
  const handleServiceCompleted = (proId: number) => {
    setCompletedBookingProIds(prev => [...new Set([...prev, proId])]);
    setActiveBookingProIds(prev => prev.filter(id => id !== proId));
  };

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
          notificationBell={
            <NotificationBell
              count={notifications.unreadCount}
              onClick={notifications.togglePanel}
            />
          }
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
              <ProProfilePage
                pro={selectedPro}
                onBack={handleBack}
                onBook={handleBook}
                onTrack={handleTrack}
                hasActiveBooking={
                  activeBookingProIds.includes(selectedPro.id) ||
                  completedBookingProIds.includes(selectedPro.id)
                }
              />
            )}
            {view === 'tracking' && selectedPro && (
              <TrackingPage
                pro={selectedPro}
                onBack={handleBack}
                onMessage={handleMessage}
              />
            )}
            {view === 'messages' && (
              <MessagesPage
                conversations={conversations}
                onSendMessage={sendMessage}
                onSelectPro={handleSelectPro}
                onBook={handleBook}
                activeBookingProIds={activeBookingProIds}
                completedBookingProIds={completedBookingProIds}
              />
            )}

            {/* ── STEP 1: Client fills booking form ─────────────────── */}
            {view === 'booking' && selectedPro && (
              <BookingPage
                pro={selectedPro}
                booking={booking}
                updateBooking={updateBooking}
                isValid={isBookingValid}
                onBack={handleBack}
                onProceedToPayment={handleProceedToConfirmation}
                userProfile={userProfile}
              />
            )}

            {/* ── STEP 2: Waiting for pro to confirm/decline ────────── */}
            {view === 'booking-confirm' && selectedPro && (
              <BookingConfirmationPage
                pro={selectedPro}
                booking={booking}
                onBack={() => navigate('booking')}
                onProAccepted={handleProAccepted}
                onProDeclined={handleProDeclined}
              />
            )}

            {/* ── STEP 3: Client pays ───────────────────────────────── */}
            {view === 'payment' && selectedPro && (
              <PaymentPage
                pro={selectedPro}
                booking={booking}
                updateBooking={updateBooking}
                onBack={() => navigate('booking-confirm')}
                onConfirm={() => handlePaymentConfirmed(selectedPro)}
                userProfile={{ cardName: `${userProfile.firstName} ${userProfile.lastName}` }}
              />
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
                onBookPro={(proId) => {
                  const pro = filteredPros.find(p => p.id === proId);
                  if (pro) handleBook(pro);
                }}
              />
            )}
            {view === 'profile-user' && (
              <UserProfilePage profile={userProfile} onUpdate={setUserProfile} onBack={handleBack} />
            )}

          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {notifications.open && <NotificationsPanel {...notifications} />}
      </AnimatePresence>
    </div>
  );
}