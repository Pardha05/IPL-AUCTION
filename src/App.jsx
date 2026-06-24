import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { AnimatePresence, motion } from 'framer-motion';
import confetti from 'canvas-confetti';

import HomePage            from './HomePage.jsx';
import LandingScreen       from './LandingScreen.jsx';
import LobbyScreen         from './LobbyScreen.jsx';
import AuctionScreen       from './AuctionScreen.jsx';
import FinishedScreen      from './FinishedScreen.jsx';
import VerbalLandingScreen from './VerbalLandingScreen.jsx';
import VerbalLobbyScreen   from './VerbalLobbyScreen.jsx';
import VerbalAuctionScreen from './VerbalAuctionScreen.jsx';
import VerbalFinishedScreen from './VerbalFinishedScreen.jsx';

const socketUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/';
const socket    = io(socketUrl, {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
});

function fade(key, children) {
  return (
    <motion.div key={key} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
      {children}
    </motion.div>
  );
}

export default function App() {
  // ── shared state ──
  const [view,  setView]  = useState('home');   // home | normal-landing | verbal-landing | lobby | auction | finished | v-lobby | v-auction | v-finished
  const [room,  setRoom]  = useState(null);
  const [timer, setTimer] = useState(15);

  useEffect(() => {
    // Ensure socket is connected
    if (!socket.connected) socket.connect();

    socket.on('connect', () => console.log('Socket connected:', socket.id));
    socket.on('connect_error', (e) => console.warn('Socket error:', e.message));

    // ── Normal auction events ──
    socket.on('room_created',   (d) => { setRoom(d); setView('lobby'); });
    socket.on('room_updated',   (d) => {
      setRoom(d);
      setView((prev) => {
        if (prev === 'normal-landing' || prev === 'lobby')
          return d.status === 'active' ? 'auction' : 'lobby';
        return prev;
      });
    });
    socket.on('auction_started', (d) => { setRoom(d); setView('auction'); });
    socket.on('timer_tick',      (t) => { setTimer(t); });
    socket.on('bid_updated',     (d) => { setRoom({ ...d }); });
    socket.on('player_sold',     (d) => { setRoom({ ...d }); setTimer(15); confetti({ particleCount: 60, spread: 55, origin: { y: 0.65 }, colors: ['#fbbf24','#16c784','#f87171'] }); });
    socket.on('auction_paused',  (d) => { setRoom({ ...d }); });
    socket.on('auction_resumed', (d) => { setRoom({ ...d }); });
    socket.on('auction_finished',(d) => { setRoom({ ...d }); setView('finished'); confetti({ particleCount: 220, spread: 100, origin: { y: 0.55 } }); });

    // ── Verbal auction events ──
    socket.on('v_room_created',   (d) => { setRoom(d); setView('v-lobby'); });
    socket.on('v_room_updated',   (d) => {
      setRoom(d);
      setView((prev) => {
        if (prev === 'verbal-landing' || prev === 'v-lobby')
          return d.status === 'active' ? 'v-auction' : 'v-lobby';
        return prev;
      });
    });
    socket.on('v_auction_started', (d) => { setRoom(d); setView('v-auction'); });
    socket.on('v_player_sold',     (d) => { setRoom({ ...d }); confetti({ particleCount: 60, spread: 55, origin: { y: 0.65 }, colors: ['#818cf8','#16c784','#fbbf24'] }); });
    socket.on('v_auction_finished',(d) => { setRoom({ ...d }); setView('v-finished'); confetti({ particleCount: 220, spread: 100, origin: { y: 0.55 } }); });

    return () => {
      ['connect','connect_error',
       'room_created','room_updated','auction_started','timer_tick','bid_updated','player_sold','auction_paused','auction_resumed','auction_finished',
       'v_room_created','v_room_updated','v_auction_started','v_player_sold','v_auction_finished'].forEach(e => socket.off(e));
    };
  }, []);

  // ── Normal auction handlers ──
  const handleCreate  = (playerName, teamName) => socket.emit('create_room', { playerName, teamName });
  const handleJoin    = (playerName, teamName, roomId) => {
    socket.emit('join_room', { roomId, playerName, teamName });
    setRoom((prev) => prev || { id: roomId, users: [], admin: null, history: [] });
    setView('lobby');
  };
  const handleStart   = (order) => socket.emit('start_auction', { roomId: room.id, order });
  const handleBid     = (amount) => socket.emit('place_bid', { roomId: room.id, bidAmount: amount });
  const handlePause   = () => socket.emit('pause_auction', room.id);
  const handleResume  = () => socket.emit('resume_auction', room.id);
  const handleSkip    = () => socket.emit('skip_player', room.id);
  const handlePrev    = () => socket.emit('previous_player', room.id);
  const handleEnd     = () => socket.emit('end_auction', room.id);
  const handleJump    = (idx) => socket.emit('jump_to_player', { roomId: room.id, playerIndex: idx });

  // ── Verbal auction handlers ──
  const vHandleCreate = (playerName, auctionName, budget, squadSize, maxTeams) =>
    socket.emit('v_create_room', { playerName, teamName: playerName, auctionName, budget, squadSize, maxTeams });
  const vHandleJoin   = (playerName, teamName, roomId) => {
    socket.emit('v_join_room', { roomId, playerName, teamName });
    setRoom((prev) => prev || { id: roomId, users: [], admin: null, history: [] });
    setView('v-lobby');
  };
  const vHandleStart  = (order) => socket.emit('v_start_auction', { roomId: room.id, order });
  const vHandleSell   = (teamId, finalPrice) => socket.emit('v_sell_player', { roomId: room.id, teamId, finalPrice });
  const vHandleUnsold = () => socket.emit('v_unsold_player', room.id);
  const vHandlePrev   = () => socket.emit('v_previous_player', room.id);
  const vHandleSkip   = () => socket.emit('v_skip_player', room.id);
  const vHandleEnd    = () => socket.emit('v_end_auction', room.id);

  const goHome = () => { setView('home'); setRoom(null); };

  return (
    <AnimatePresence mode="wait">
      {view === 'home' && fade('home',
        <HomePage onSelectMode={(mode) => setView(mode === 'normal' ? 'normal-landing' : 'verbal-landing')} />
      )}

      {/* ── NORMAL AUCTION FLOW ── */}
      {view === 'normal-landing' && fade('normal-landing',
        <LandingScreen onCreate={handleCreate} onJoin={handleJoin} onBack={goHome} />
      )}
      {view === 'lobby' && room && fade('lobby',
        <LobbyScreen room={room} myId={socket.id} onStart={handleStart} />
      )}
      {view === 'auction' && room && fade('auction',
        <AuctionScreen room={room} myId={socket.id} timer={timer} onBid={handleBid} onPause={handlePause} onResume={handleResume} onSkip={handleSkip} onPrevious={handlePrev} onEnd={handleEnd} onJump={handleJump} />
      )}
      {view === 'finished' && room && fade('finished',
        <FinishedScreen room={room} onRestart={goHome} />
      )}

      {/* ── VERBAL AUCTION FLOW ── */}
      {view === 'verbal-landing' && fade('verbal-landing',
        <VerbalLandingScreen onCreate={vHandleCreate} onJoin={vHandleJoin} onBack={goHome} />
      )}
      {view === 'v-lobby' && room && fade('v-lobby',
        <VerbalLobbyScreen room={room} myId={socket.id} onStart={vHandleStart} onBack={goHome} />
      )}
      {view === 'v-auction' && room && fade('v-auction',
        <VerbalAuctionScreen room={room} myId={socket.id} onSell={vHandleSell} onUnsold={vHandleUnsold} onPrev={vHandlePrev} onSkip={vHandleSkip} onEnd={vHandleEnd} />
      )}
      {view === 'v-finished' && room && fade('v-finished',
        <VerbalFinishedScreen room={room} onRestart={goHome} />
      )}
    </AnimatePresence>
  );
}
