import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, ChevronLeft, Phone, MoreVertical, CheckCheck,
  Search, Pin, Trash2, Flag, X, Volume2, VolumeX,
  Calendar, MessageSquare, Circle,
} from 'lucide-react';
import type { Pro, Conversation } from '../types';
import { PROS } from '../data/mockdata';

interface MessagesPageProps {
  conversations: Conversation[];
  onSendMessage: (proId: number, text: string) => void;
  onSelectPro: (pro: Pro) => void;
  onBook: (pro: Pro) => void;
}

const QUICK_REPLIES = [
  'Bonjour, êtes-vous disponible aujourd\'hui ?',
  'Quel est votre délai d\'intervention ?',
  'Pouvez-vous me donner un devis ?',
  'À quelle heure pouvez-vous venir ?',
];

/* ── Context menu ─────────────────────────────────────────────────────────── */
function ContextMenu({ x, y, onClose, onPin, onDelete, onClear, onReport, isPinned }:
  { x: number; y: number; onClose: () => void; onPin: () => void; onDelete: () => void; onClear: () => void; onReport: () => void; isPinned: boolean }
) {
  useEffect(() => {
    const h = () => onClose();
    document.addEventListener('click', h);
    return () => document.removeEventListener('click', h);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{ position: 'fixed', left: x, top: y, zIndex: 9999 }}
      className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden w-52 py-1"
      onClick={e => e.stopPropagation()}
    >
      {[
        { icon: <Pin size={14} />, label: isPinned ? 'Désépingler' : 'Épingler', action: onPin, color: 'text-[#1E5BB8]' },
        { icon: <Trash2 size={14} />, label: 'Supprimer', action: onDelete, color: 'text-red-500' },
        { icon: <X size={14} />, label: 'Vider le chat', action: onClear, color: 'text-orange-500' },
        { icon: <Flag size={14} />, label: 'Signaler', action: onReport, color: 'text-gray-500' },
      ].map(item => (
        <button key={item.label}
          onClick={() => { item.action(); onClose(); }}
          className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${item.color}`}>
          {item.icon} {item.label}
        </button>
      ))}
    </motion.div>
  );
}

/* ── Contact list item ────────────────────────────────────────────────────── */
function ConvItem({ conv, pro, isActive, onClick, onContextMenu }:
  { conv: Conversation; pro: Pro; isActive: boolean; onClick: () => void; onContextMenu: (e: React.MouseEvent) => void }
) {
  const lastMsg = conv.messages[conv.messages.length - 1];
  const unread = conv.messages.filter(m => m.senderId !== 'client' && !m.read).length;
  return (
    <button
      onClick={onClick}
      onContextMenu={onContextMenu}
      className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50/40 transition-colors relative text-left ${isActive ? 'bg-blue-50 border-r-2 border-[#1E5BB8]' : ''}`}
    >
      {conv.pinned && <Pin size={10} className="absolute top-2 right-3 text-[#1E5BB8]" />}
      <div className="relative shrink-0">
        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${pro.avatarColor} flex items-center justify-center text-white font-bold text-sm shadow`}>
          {pro.avatar}
        </div>
        <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${pro.available ? 'bg-green-500' : 'bg-gray-300'}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className={`text-sm truncate ${unread > 0 ? 'font-black text-gray-900' : 'font-semibold text-gray-800'}`}>{pro.name}</p>
          <p className={`text-[11px] shrink-0 ml-2 ${unread > 0 ? 'text-[#1E5BB8] font-bold' : 'text-gray-400'}`}>{lastMsg?.time || ''}</p>
        </div>
        <div className="flex items-center justify-between mt-0.5">
          <p className={`text-xs truncate ${unread > 0 ? 'text-gray-700 font-medium' : 'text-gray-400'}`}>
            {lastMsg?.senderId === 'client' ? '✓ ' : ''}{lastMsg?.text || 'Démarrer la conversation'}
          </p>
          {unread > 0 && (
            <div className="w-5 h-5 bg-[#1E5BB8] rounded-full flex items-center justify-center shrink-0 ml-2">
              <span className="text-white text-[9px] font-black">{unread}</span>
            </div>
          )}
        </div>
      </div>
    </button>
  );
}

/* ── Chat view ─────────────────────────────────────────────────────────────── */
function ChatView({ pro, conversation, onSend, onBack, onBook }: {
  pro: Pro; conversation: Conversation; onSend: (t: string) => void; onBack: () => void; onBook: () => void;
}) {
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [muted, setMuted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [conversation.messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input.trim());
    setInput('');
    setTyping(true);
    setTimeout(() => setTyping(false), 1800);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 shadow-sm">
        <button onClick={onBack} className="lg:hidden text-gray-500 hover:text-gray-700 p-1"><ChevronLeft size={22} /></button>
        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${pro.avatarColor} flex items-center justify-center text-white font-bold text-sm shadow relative shrink-0`}>
          {pro.avatar}
          <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${pro.available ? 'bg-green-500' : 'bg-gray-300'}`} />
        </div>
        <div className="flex-1">
          <p className="font-bold text-gray-900 text-sm">{pro.name}</p>
          <p className="text-xs text-gray-400">{pro.available ? '● En ligne' : '○ Hors ligne'} · {pro.specialty}</p>
        </div>
        <button onClick={onBook}
          className="hidden sm:flex items-center gap-1.5 bg-[#E30613] hover:bg-red-700 text-white text-xs font-bold px-3 py-2 rounded-xl transition-colors shadow">
          <Calendar size={13} /> Réserver
        </button>
        <a href={`tel:${pro.phone}`} className="p-2 text-gray-400 hover:text-[#1E5BB8] hover:bg-blue-50 rounded-xl transition-colors">
          <Phone size={17} />
        </a>
        <button onClick={() => setMuted(!muted)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
          {muted ? <VolumeX size={17} /> : <Volume2 size={17} />}
        </button>
        <div className="relative">
          <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
            <MoreVertical size={17} />
          </button>
          <AnimatePresence>
            {menuOpen && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                className="absolute right-0 top-full mt-1 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 py-1">
                {[
                  { icon: <Calendar size={14} />, label: 'Réserver', action: onBook, color: 'text-[#E30613]' },
                  { icon: <Flag size={14} />, label: 'Signaler', action: () => {}, color: 'text-gray-500' },
                  { icon: <X size={14} />, label: 'Vider le chat', action: () => {}, color: 'text-orange-500' },
                ].map(item => (
                  <button key={item.label} onClick={() => { item.action(); setMenuOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 ${item.color}`}>
                    {item.icon} {item.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-[#f0f4fb]">
        <div className="flex justify-center mb-2">
          <span className="text-[11px] bg-white/80 border border-gray-200 text-gray-400 px-3 py-1 rounded-full font-medium">Aujourd'hui</span>
        </div>
        {conversation.messages.map(msg => {
          const isClient = msg.senderId === 'client';
          return (
            <motion.div key={msg.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              className={`flex ${isClient ? 'justify-end' : 'justify-start'} items-end gap-2`}>
              {!isClient && (
                <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${pro.avatarColor} flex items-center justify-center text-white text-xs font-bold shrink-0 mb-0.5 shadow`}>
                  {pro.avatar[0]}
                </div>
              )}
              <div className={`max-w-[72%] rounded-2xl px-3.5 py-2.5 shadow-sm ${
                isClient
                  ? 'bg-[#1E5BB8] text-white rounded-br-md'
                  : 'bg-white text-gray-800 border border-gray-100 rounded-bl-md'
              }`}>
                <p className="text-sm leading-relaxed">{msg.text}</p>
                <div className={`flex items-center gap-1 justify-end mt-1 ${isClient ? 'text-blue-200' : 'text-gray-400'}`}>
                  <span className="text-[10px]">{msg.time}</span>
                  {isClient && <CheckCheck size={11} />}
                </div>
              </div>
            </motion.div>
          );
        })}
        <AnimatePresence>
          {typing && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-end gap-2">
              <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${pro.avatarColor} flex items-center justify-center text-white text-xs font-bold shadow`}>{pro.avatar[0]}</div>
              <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                <div className="flex gap-1 items-center">
                  {[0, 1, 2].map(i => (
                    <motion.div key={i} animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, delay: i * 0.15, duration: 0.6 }}
                      className="w-2 h-2 bg-gray-400 rounded-full" />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Quick replies */}
      {conversation.messages.length <= 3 && (
        <div className="bg-white border-t border-gray-100 px-3 py-2">
          <div className="flex gap-2 overflow-x-auto">
            {QUICK_REPLIES.map(qr => (
              <button key={qr} onClick={() => onSend(qr)}
                className="flex-none text-xs bg-blue-50 border border-blue-200 text-[#1E5BB8] px-3 py-1.5 rounded-full whitespace-nowrap hover:bg-blue-100 transition-colors font-medium">
                {qr}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="bg-white border-t border-gray-100 px-3 py-3 flex items-center gap-2">
        {/* Mobile reserve button */}
        <button onClick={onBook} className="sm:hidden shrink-0 w-9 h-9 bg-[#E30613] hover:bg-red-700 text-white rounded-xl flex items-center justify-center transition-colors">
          <Calendar size={15} />
        </button>
        <div className="flex-1 flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-2xl px-3 py-2.5 focus-within:border-[#1E5BB8] focus-within:ring-2 focus-within:ring-blue-100 transition-all">
          <input value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder="Tapez un message..."
            className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400" />
        </div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={handleSend} disabled={!input.trim()}
          className="w-10 h-10 rounded-xl bg-[#1E5BB8] hover:bg-[#243B82] text-white flex items-center justify-center transition-colors disabled:opacity-40 shadow-md">
          <Send size={16} />
        </motion.button>
      </div>
    </div>
  );
}

/* ── Main ──────────────────────────────────────────────────────────────────── */
export function MessagesPage({ conversations, onSendMessage, onSelectPro, onBook }: MessagesPageProps) {
  const [activeProId, setActiveProId] = useState<number | null>(
    conversations.length > 0 ? conversations[0].proId : null
  );
  const [search, setSearch] = useState('');
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; proId: number } | null>(null);
  const [pinnedIds, setPinnedIds] = useState<number[]>([]);
  const [deletedIds, setDeletedIds] = useState<number[]>([]);
  const [mobileShowChat, setMobileShowChat] = useState(false);

  const activePro = PROS.find(p => p.id === activeProId);
  const activeConv = conversations.find(c => c.proId === activeProId) || (activePro ? { proId: activePro.id, messages: [] } : null);

  const convList = conversations
    .filter(c => !deletedIds.includes(c.proId))
    .map(c => ({ conv: { ...c, pinned: pinnedIds.includes(c.proId) }, pro: PROS.find(p => p.id === c.proId)! }))
    .filter(x => x.pro)
    .filter(x => !search || x.pro.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => (b.conv.pinned ? 1 : 0) - (a.conv.pinned ? 1 : 0));

  const handleSelectConv = (proId: number) => {
    setActiveProId(proId);
    setMobileShowChat(true);
  };

  const handleContextMenu = (e: React.MouseEvent, proId: number) => {
    e.preventDefault();
    setContextMenu({ x: Math.min(e.clientX, window.innerWidth - 220), y: Math.min(e.clientY, window.innerHeight - 180), proId });
  };

  return (
    <div className="flex h-full overflow-hidden bg-[#F2F3F5]">
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x} y={contextMenu.y}
          isPinned={pinnedIds.includes(contextMenu.proId)}
          onClose={() => setContextMenu(null)}
          onPin={() => setPinnedIds(prev => prev.includes(contextMenu.proId) ? prev.filter(id => id !== contextMenu.proId) : [...prev, contextMenu.proId])}
          onDelete={() => { setDeletedIds(prev => [...prev, contextMenu.proId]); if (activeProId === contextMenu.proId) setActiveProId(null); }}
          onClear={() => {}}
          onReport={() => {}}
        />
      )}

      {/* ── Left panel: contacts ─────────────────────── */}
      <div className={`${mobileShowChat ? 'hidden lg:flex' : 'flex'} flex-col w-full lg:w-80 xl:w-96 bg-white border-r border-gray-100 shrink-0`}>
        {/* Header */}
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-black text-gray-900 text-xl">Messages</h2>
            <div className="flex items-center gap-1">
              {conversations.length > 0 && (
                <span className="text-xs font-bold bg-[#1E5BB8] text-white px-2 py-0.5 rounded-full">{convList.length}</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-[#1E5BB8] focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <Search size={15} className="text-gray-400 shrink-0" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..."
              className="flex-1 bg-transparent outline-none text-sm placeholder-gray-400" />
          </div>
        </div>
        {/* List */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
          {convList.length === 0 ? (
            <div className="text-center py-16 px-6">
              <MessageSquare size={40} className="text-gray-200 mx-auto mb-3" />
              <p className="font-semibold text-gray-500 text-sm">Aucun message</p>
              <p className="text-xs text-gray-400 mt-1">Cliquez sur "Message" dans le profil d'un prestataire</p>
            </div>
          ) : (
            convList.map(({ conv, pro }) => (
              <ConvItem key={pro.id} conv={conv} pro={pro}
                isActive={activeProId === pro.id}
                onClick={() => handleSelectConv(pro.id)}
                onContextMenu={e => handleContextMenu(e, pro.id)} />
            ))
          )}
        </div>
      </div>

      {/* ── Right panel: chat ────────────────────────── */}
      <div className={`${mobileShowChat ? 'flex' : 'hidden lg:flex'} flex-col flex-1 overflow-hidden`}>
        {activePro && activeConv ? (
          <ChatView
            pro={activePro}
            conversation={activeConv}
            onSend={text => onSendMessage(activePro.id, text)}
            onBack={() => { setMobileShowChat(false); }}
            onBook={() => onBook(activePro)}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full bg-[#f0f4fb]">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <MessageSquare size={40} className="text-[#1E5BB8]" />
            </div>
            <p className="font-black text-gray-700 text-xl mb-2">Vos messages</p>
            <p className="text-gray-400 text-sm text-center max-w-xs">Sélectionnez une conversation ou envoyez un message depuis le profil d'un prestataire.</p>
          </div>
        )}
      </div>
    </div>
  );
}