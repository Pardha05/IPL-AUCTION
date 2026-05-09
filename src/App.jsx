import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { AnimatePresence, motion } from 'framer-motion';
import confetti from 'canvas-confetti';

import LandingScreen  from './LandingScreen.jsx';
import LobbyScreen    from './LobbyScreen.jsx';
import AuctionScreen  from './AuctionScreen.jsx';
import FinishedScreen from './FinishedScreen.jsx';

// Connect to the same origin if in production, else localhost:5000
const socketUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/';
const socket = io(socketUrl);

export default function App() {
  const [view,  setView]  = useState('landing');
  const [room,  setRoom]  = useState(null);
  const [timer, setTimer] = useState(15);

  useEffect(() => {
    socket.on('room_created',   (d) => { setRoom(d); setView('lobby');   });
    socket.on('room_updated',   (d) => { setRoom(d); });
    socket.on('auction_started',(d) => { setRoom(d); setView('auction'); });
    socket.on('timer_tick',     (t) => { setTimer(t); });
    socket.on('bid_updated',    (d) => { setRoom({ ...d }); });
    socket.on('player_sold',    (d) => {
      setRoom({ ...d });
      setTimer(15);
      confetti({ particleCount: 60, spread: 55, origin: { y: 0.65 }, colors: ['#6366f1','#fbbf24','#16c784'] });
    });
    socket.on('auction_paused', (d) => { setRoom({ ...d }); });
    socket.on('auction_resumed',(d) => { setRoom({ ...d }); });
    socket.on('auction_finished', (d) => {
      setRoom({ ...d });
      setView('finished');
      confetti({ particleCount: 220, spread: 100, origin: { y: 0.55 } });
    });

    return () => {
      ['room_created','room_updated','auction_started','timer_tick',
       'bid_updated','player_sold','auction_paused','auction_resumed','auction_finished'].forEach(e => socket.off(e));
    };
  }, []);

  const handleCreate = (playerName, teamName) => {
    socket.emit('create_room', { playerName, teamName });
  };

  const handleJoin = (playerName, teamName, roomId) => {
    socket.emit('join_room', { roomId, playerName, teamName });
    // Show lobby immediately; room data will arrive via room_updated
    setRoom((prev) => prev || { id: roomId, users: [], admin: null, history: [] });
    setView('lobby');
  };

  const handleStart = (order) => {
    socket.emit('start_auction', { roomId: room.id, order });
  };

  const handleBid = (amount) => {
    socket.emit('place_bid', { roomId: room.id, bidAmount: amount });
  };

  const handlePause = () => {
    socket.emit('pause_auction', room.id);
  };

  const handleResume = () => {
    socket.emit('resume_auction', room.id);
  };

  const handleSkip = () => {
    socket.emit('skip_player', room.id);
  };

  const handleEnd = () => {
    socket.emit('end_auction', room.id);
  };

  const handleJump = (playerIndex) => {
    socket.emit('jump_to_player', { roomId: room.id, playerIndex });
  };

  return (
    <AnimatePresence mode="wait">
      {view === 'landing' && (
        <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
          <LandingScreen onCreate={handleCreate} onJoin={handleJoin} />
        </motion.div>
      )}
      {view === 'lobby' && room && (
        <motion.div key="lobby" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.3 }}>
          <LobbyScreen room={room} myId={socket.id} onStart={handleStart} />
        </motion.div>
      )}
      {view === 'auction' && room && (
        <motion.div key="auction" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
          <AuctionScreen room={room} myId={socket.id} timer={timer} onBid={handleBid} onPause={handlePause} onResume={handleResume} onSkip={handleSkip} onEnd={handleEnd} onJump={handleJump} />
        </motion.div>
      )}
      {view === 'finished' && room && (
        <motion.div key="finished" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
          <FinishedScreen room={room} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
