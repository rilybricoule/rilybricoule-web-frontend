import { useState, useMemo, useCallback } from 'react';
import type { Filters, Pro, Conversation, Message, BookingDetails, UserProfile } from '../types';
import { PROS, INITIAL_CONVERSATIONS } from '../data/mockdata';

export function useFilters() {
  const [filters, setFilters] = useState<Filters>({
    category: 'Tous', maxDistance: 20, minRating: 0, maxPrice: 500,
    availableOnly: false, sortBy: 'distance',
  });
  const updateFilter = useCallback(<K extends keyof Filters>(key: K, value: Filters[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);
  const resetFilters = useCallback(() => {
    setFilters({ category: 'Tous', maxDistance: 20, minRating: 0, maxPrice: 500, availableOnly: false, sortBy: 'distance' });
  }, []);
  const filteredPros = useMemo(() => {
    let r = [...PROS];
    if (filters.category !== 'Tous') r = r.filter(p => p.category === filters.category);
    r = r.filter(p => p.distance <= filters.maxDistance && p.rating >= filters.minRating && p.price <= filters.maxPrice);
    if (filters.availableOnly) r = r.filter(p => p.available);
    switch (filters.sortBy) {
      case 'distance':   r.sort((a,b)=>a.distance-b.distance); break;
      case 'rating':     r.sort((a,b)=>b.rating-a.rating);     break;
      case 'price_asc':  r.sort((a,b)=>a.price-b.price);       break;
      case 'price_desc': r.sort((a,b)=>b.price-a.price);       break;
      case 'reviews':    r.sort((a,b)=>b.reviews-a.reviews);   break;
    }
    return r;
  }, [filters]);
  return { filters, updateFilter, resetFilters, filteredPros };
}

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const getConversation = useCallback((proId: number) =>
    conversations.find(c => c.proId === proId) || { proId, messages: [] }
  , [conversations]);
  const sendMessage = useCallback((proId: number, text: string) => {
    const now  = new Date();
    const time = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;
    const msg: Message = { id: Date.now(), senderId: 'client', text, time, read: false };
    setConversations(prev => {
      const e = prev.find(c => c.proId === proId);
      if (e) return prev.map(c => c.proId === proId ? { ...c, messages: [...c.messages, msg] } : c);
      return [...prev, { proId, messages: [msg] }];
    });
    const replies = ['Bien reçu, je confirme.','D\'accord, je note.','Je serai là à l\'heure convenue.','Merci, je vous rappelle dès que possible.'];
    setTimeout(() => {
      const reply: Message = { id: Date.now()+1, senderId: proId,
        text: replies[Math.floor(Math.random()*replies.length)],
        time: `${now.getHours().toString().padStart(2,'0')}:${(now.getMinutes()+1).toString().padStart(2,'0')}`, read: false };
      setConversations(prev => prev.map(c => c.proId === proId ? { ...c, messages: [...c.messages, reply] } : c));
    }, 1500);
  }, []);
  const totalUnread = useMemo(() =>
    conversations.reduce((acc,c) => acc + c.messages.filter(m => m.senderId !== 'client' && !m.read).length, 0)
  , [conversations]);
  return { conversations, getConversation, sendMessage, totalUnread };
}

export function useBooking() {
  const [booking, setBooking] = useState<Partial<BookingDetails>>({
    paymentMethod: 'card', date: '', time: '', address: '', phone: '', notes: '',
    cardNumber: '', cardName: '', cardExpiry: '', cardCVV: '',
  });
  const updateBooking = useCallback(<K extends keyof BookingDetails>(key: K, value: BookingDetails[K]) => {
    setBooking(prev => ({ ...prev, [key]: value }));
  }, []);
  const resetBooking = useCallback(() => {
    setBooking({ paymentMethod: 'card', date: '', time: '', address: '', phone: '', notes: '' });
  }, []);
  const isBookingValid = useMemo(() =>
    !!(booking.date && booking.time && booking.address && booking.phone)
  , [booking]);
  return { booking, updateBooking, resetBooking, isBookingValid };
}