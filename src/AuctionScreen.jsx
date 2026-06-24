import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, History, Pause, Play, FastForward, Rewind, StopCircle, List, Copy, CheckCircle, Volume2, Shield } from 'lucide-react';
import { RoleBadge, Toast } from './Components.jsx';
import { TEAM_COLORS, avgRating } from './data.js';

const G = '#F5B841';
const EM = '#16c784';

export default function AuctionScreen({ room, myId, timer, onBid, onPause, onResume, onSkip, onPrevious, onEnd, onJump }) {
  const [toast, setToast] = useState(null);
  const [bidPulse, setBidPulse] = useState(false);
  const [showPlayers, setShowPlayers] = useState(false);
  const [playerFilter, setPlayerFilter] = useState('ALL');
  const [codeCopied, setCodeCopied] = useState(false);
  const [viewSquadId, setViewSquadId] = useState(null);

  const copyRoomCode = () => {
    navigator.clipboard.writeText(room.id);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  const player = room.players ? room.players[room.currentPlayerIndex] : null;
  const me = room.users.find(u => u.id === myId);
  const iAmLeading = room.currentBidder?.id === myId;
  const isAdmin = room.admin === myId;

  const getNextBid = (current) => current < 2 ? 0.2 : current < 5 ? 0.25 : 0.5;

  const canBidAmount = (amount) => {
    return !iAmLeading && me?.squad?.length < 15 && me?.budget >= amount && room.status === 'active';
  };

  const handleBid = (amount) => {
    if (!canBidAmount(amount)) {
      if (room.status === 'paused') return showErr('Auction is paused.');
      if (me?.squad?.length >= 15) return showErr('Squad is full (15/15)');
      if (me?.budget < amount) return showErr(`Insufficient funds. Need ₹${amount}Cr`);
      return;
    }
    setBidPulse(true);
    setTimeout(() => setBidPulse(false), 500);
    onBid(amount);
  };

  const showErr = (msg) => { setToast({ msg, type:'error' }); setTimeout(() => setToast(null), 4000); };

  const sortedUsers = [...room.users].sort((a,b) => b.budget - a.budget);
  const nextPlayer = room.players[room.currentPlayerIndex + 1];
  
  if (!player) return null;

  const playerImg = player.image || null;
  const age = player.age || 25;
  const country = player.country || 'India';
  const batStyle = player.battingStyle || 'RIGHT-HAND BAT';
  const jersey = player.jersey || 99;

  const myBuys = room.history.filter(h => h.soldTo === me?.teamName);
  const batCount = myBuys.filter(h=>h.player.role==='BAT').length;
  const bowlCount = myBuys.filter(h=>h.player.role==='BOWL').length;
  const arCount = myBuys.filter(h=>h.player.role==='AR').length;
  const wkCount = myBuys.filter(h=>h.player.role==='WK').length;

  const Panel = ({ title, children, style={} }) => (
    <div style={{ background: '#0a0e17', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)', padding: 20, display:'flex', flexDirection:'column', ...style }}>
      {title && <div style={{ fontSize: 10, fontWeight: 800, color: '#888', letterSpacing: '0.1em', marginBottom: 16 }}>{title}</div>}
      {children}
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#05070e', display: 'flex', flexDirection: 'column', color: 'white', fontFamily: 'Inter, sans-serif' }}>
      
      {/* HEADER */}
      <header style={{ height: 64, borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', padding: '0 24px', justifyContent: 'space-between', background: '#0a0e17' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{ color: G, fontSize: 24, fontWeight: 900, fontFamily: 'Rajdhani, sans-serif' }}>
             IPL <span style={{color:'white'}}>AUCTION</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#111', padding: '6px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)' }}>
            <span style={{ fontSize: 10, color: '#888', letterSpacing: '0.1em' }}>ROOM CODE</span>
            <span style={{ fontSize: 14, fontWeight: 800, fontFamily: 'monospace' }}>{room.id}</span>
            <button onClick={copyRoomCode} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', padding: 0 }}>
              {codeCopied ? <CheckCircle size={14} color={EM} /> : <Copy size={14} />}
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 10, color: '#888', letterSpacing: '0.1em' }}>AUCTION TYPE</span>
            <span style={{ fontSize: 12, fontWeight: 800, color: EM, background: `${EM}11`, padding: '4px 8px', borderRadius: 4 }}>NORMAL AUCTION</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: room.status === 'paused' ? '#ef4444' : '#ef4444', boxShadow: '0 0 8px #ef4444' }} />
          <span style={{ fontSize: 14, fontWeight: 800, letterSpacing: '0.1em' }}>{room.status === 'paused' ? 'PAUSED' : 'LIVE AUCTION'}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#111', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '8px 16px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
            <Volume2 size={14} /> Sound
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#111', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '8px 16px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
             🏆 Leaderboard
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#ef444411', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', padding: '8px 16px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
             Leave Room
          </button>
        </div>
      </header>

      {/* MAIN GRID */}
      <div style={{ flex: 1, padding: 24, display: 'flex', gap: 24, overflow: 'hidden' }}>
        
        {/* LEFT COLUMN */}
        <div style={{ width: 280, display: 'flex', flexDirection: 'column', gap: 24 }}>
          <Panel title="AUCTION PROGRESS">
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
               <div style={{ position:'relative', width: 64, height: 64, borderRadius:'50%', border:'4px solid #4f46e5', borderLeftColor:'#111' }} />
               <div>
                 <div style={{ fontSize: 24, fontWeight: 900 }}>{room.history.length} <span style={{ fontSize: 14, color: '#888' }}>/ {room.players.length}</span></div>
                 <div style={{ fontSize: 10, color: '#888', letterSpacing: '0.1em' }}>PLAYERS SOLD</div>
               </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#888', marginTop: 16 }}>
               <span>ROUND 1</span>
               <span>{room.history.length} / {room.players.length}</span>
            </div>
            <div style={{ height: 4, background: '#111', borderRadius: 2, marginTop: 8 }}>
               <div style={{ width: `${(room.history.length / room.players.length)*100}%`, height: '100%', background: '#4f46e5', borderRadius: 2 }} />
            </div>
          </Panel>

          <Panel title="UP NEXT">
            {nextPlayer ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {nextPlayer.image ? <img src={nextPlayer.image} style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover', background:'#111' }} /> : <div style={{ width: 48, height: 48, borderRadius: 8, background:'#111' }} />}
                <div>
                   <div style={{ fontSize: 10, color: '#888' }}>Player {room.currentPlayerIndex + 2}</div>
                   <div style={{ fontSize: 14, fontWeight: 800 }}>{nextPlayer.name}</div>
                   <div style={{ fontSize: 10, color: '#888' }}>{nextPlayer.role}</div>
                   <div style={{ fontSize: 10, color: '#888', marginTop: 4 }}>Base Price <span style={{ color: 'white', fontWeight: 800 }}>₹{nextPlayer.base} Cr</span></div>
                </div>
              </div>
            ) : (
              <div style={{ fontSize: 12, color: '#888' }}>No more players</div>
            )}
          </Panel>

          <Panel title="RECENT BUYS" style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto' }}>
              {[...room.history].reverse().slice(0, 5).map((h, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ fontSize: 12, color: '#888', width: 16 }}>{room.history.length - i}</div>
                      {h.player.image ? <img src={h.player.image} style={{ width: 32, height: 32, borderRadius: 16, objectFit: 'cover', background:'#111' }} /> : <div style={{ width: 32, height: 32, borderRadius: 16, background:'#111' }} />}
                      <div>
                         <div style={{ fontSize: 12, fontWeight: 800 }}>{h.player.name}</div>
                         <div style={{ fontSize: 10, color: '#3b82f6' }}>{h.soldTo}</div>
                      </div>
                   </div>
                   <div style={{ fontSize: 12, fontWeight: 800 }}>{h.soldTo === 'Unsold' ? <span style={{color:'#ef4444'}}>UNSOLD</span> : `₹${h.price} Cr`}</div>
                </div>
              ))}
            </div>
          </Panel>

          <div style={{ display: 'flex', gap: 12 }}>
            <Panel title="NEXT BID INCREMENT" style={{ flex: 1, padding: 16 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: EM }}>₹{getNextBid(room.currentBid)} Cr</div>
            </Panel>
            <Panel title="MINIMUM BID" style={{ flex: 1, padding: 16 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: EM }}>₹{player.base} Cr</div>
            </Panel>
          </div>
        </div>

        {/* CENTER COLUMN */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          {/* PLAYER BANNER */}
          <div style={{ background: 'linear-gradient(90deg, #1e0b3b 0%, #0a0a14 100%)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)', height: 280, position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
             <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'radial-gradient(circle at 0% 50%, #8b5cf6 0%, transparent 50%)' }} />
             
             <div style={{ position: 'absolute', left: 80, top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
               <div style={{ fontSize: 120, fontWeight: 900, fontFamily: 'Rajdhani, sans-serif', color: 'rgba(255,255,255,0.05)', lineHeight: 0.9 }}>#{jersey}</div>
               <div style={{ fontSize: 16, fontWeight: 800, color: G, letterSpacing: '0.4em', marginTop: 12 }}>JERSEY</div>
             </div>
             
             <div style={{ marginLeft: 340, padding: '32px 0', height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 10 }}>
               <div style={{ fontSize: 10, color: '#888', letterSpacing: '0.1em' }}>CURRENT PLAYER</div>
               <div style={{ fontSize: 48, fontWeight: 900, fontFamily: 'Rajdhani, sans-serif', textTransform: 'uppercase', lineHeight: 1.1, marginTop: 4 }}>{player.name}</div>
               <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
                 <div style={{ fontSize: 12, color: '#a78bfa', fontWeight: 800 }}>🏏 {player.role}</div>
                 <div style={{ width: 1, height: 12, background: 'rgba(255,255,255,0.2)' }} />
                 <div style={{ fontSize: 12, color: '#888', fontWeight: 600 }}>{batStyle}</div>
               </div>

               <div style={{ display: 'flex', gap: 64, marginTop: 'auto', marginBottom: 16 }}>
                 <div>
                   <div style={{ fontSize: 10, color: '#888', letterSpacing: '0.1em' }}>COUNTRY</div>
                   <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                     <span style={{ fontSize: 16 }}>{country==='India'?'🇮🇳':'🌍'}</span>
                     <span style={{ fontSize: 14, fontWeight: 800 }}>{country.toUpperCase()}</span>
                   </div>
                 </div>
                 <div>
                   <div style={{ fontSize: 10, color: '#888', letterSpacing: '0.1em' }}>AGE</div>
                   <div style={{ fontSize: 14, fontWeight: 800, marginTop: 4 }}>{age}</div>
                 </div>
                 <div>
                   <div style={{ fontSize: 10, color: '#888', letterSpacing: '0.1em' }}>BASE PRICE</div>
                   <div style={{ fontSize: 24, fontWeight: 900 }}>₹{player.base} Cr</div>
                 </div>
               </div>
             </div>

             <div style={{ position: 'absolute', top: 32, right: 32, textAlign: 'right' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                 <span style={{ fontSize: 24, color: G }}>⭐</span>
                 <span style={{ fontSize: 32, fontWeight: 900, fontFamily: 'Rajdhani, sans-serif', color: G }}>{player.rating.toFixed(1)}</span>
               </div>
               <div style={{ fontSize: 10, color: '#888', letterSpacing: '0.1em' }}>RATING</div>
             </div>
          </div>

          {/* BIDDING ARENA */}
          <div style={{ background: '#0a0e17', borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)', padding: '32px 40px', flex: 1, display: 'flex', flexDirection: 'column' }}>
             
             {/* Top row: Current Bid - Timer - Next Bid */}
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               
               {/* Current Bid */}
               <div style={{ width: 220 }}>
                 <div style={{ fontSize: 10, color: '#888', letterSpacing: '0.1em', textAlign: 'center', marginBottom: 4 }}>CURRENT BID</div>
                 <div style={{ fontSize: 56, fontWeight: 900, color: G, textAlign: 'center', lineHeight: 1 }}>₹{room.currentBid.toFixed(2)} <span style={{fontSize:24}}>Cr</span></div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center', marginTop: 12 }}>
                   <div style={{ width: 32, height: 32, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <Shield size={16} color={G} />
                   </div>
                   <div>
                     <div style={{ fontSize: 8, color: '#888', letterSpacing: '0.1em' }}>HIGHEST BIDDER</div>
                     <div style={{ fontSize: 14, fontWeight: 800 }}>{room.currentBidder ? room.currentBidder.teamName : 'None'}</div>
                   </div>
                 </div>
               </div>

               {/* Timer */}
               <div style={{ position: 'relative', width: 140, height: 140 }}>
                 <svg width="140" height="140" style={{ transform: 'rotate(-90deg)' }}>
                   <circle cx="70" cy="70" r="66" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                   <circle cx="70" cy="70" r="66" fill="none" stroke={timer < 6 ? '#ef4444' : G} strokeWidth="6" strokeDasharray="414" strokeDashoffset={414 - (timer/15)*414} style={{ transition: 'stroke-dashoffset 1s linear' }} />
                 </svg>
                 <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                   <div style={{ fontSize: 10, color: '#888', letterSpacing: '0.1em' }}>TIME LEFT</div>
                   <div style={{ fontSize: 48, fontWeight: 900, lineHeight: 1 }}>{timer}</div>
                   <div style={{ fontSize: 10, color: '#888', letterSpacing: '0.1em' }}>SEC</div>
                 </div>
               </div>

               {/* Next Bid */}
               <div style={{ width: 220 }}>
                 <div style={{ fontSize: 10, color: '#888', letterSpacing: '0.1em', textAlign: 'center', marginBottom: 4 }}>NEXT BID</div>
                 <div style={{ fontSize: 48, fontWeight: 900, color: '#ef4444', textAlign: 'center', lineHeight: 1 }}>₹{(room.currentBid + getNextBid(room.currentBid)).toFixed(2)} <span style={{fontSize:24}}>Cr</span></div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center', marginTop: 16 }}>
                   <div style={{ width: 32, height: 32, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <Shield size={16} color="#ef4444" />
                   </div>
                   <div>
                     <div style={{ fontSize: 8, color: '#888', letterSpacing: '0.1em' }}>BY</div>
                     <div style={{ fontSize: 14, fontWeight: 800 }}>{me?.teamName}</div>
                   </div>
                 </div>
               </div>
             </div>

             {/* Bid History Pills */}
             <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 32 }}>
               <div style={{ fontSize: 10, color: '#888', letterSpacing: '0.1em', marginBottom: 8 }}>BID HISTORY</div>
               <div style={{ display: 'flex', gap: 12 }}>
                 {[...room.bidLog].reverse().slice(0, 4).map((b, i) => (
                   <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '8px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 100 }}>
                     <div style={{ fontSize: 14, fontWeight: 800, color: 'white' }}>₹{b.amount.toFixed(2)} Cr</div>
                     <div style={{ fontSize: 10, color: '#888', marginTop: 2 }}>{b.teamName.slice(0, 15)}</div>
                   </div>
                 ))}
                 {room.bidLog.length === 0 && <div style={{ fontSize: 12, color: '#888' }}>Waiting for first bid...</div>}
               </div>
             </div>

             {/* Action Buttons */}
             <div style={{ display: 'flex', gap: 12, marginTop: 'auto' }}>
               <button onClick={() => handleBid(room.currentBid + 0.25)} disabled={!canBidAmount(room.currentBid + 0.25)} style={{ flex: 1, padding: '16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, cursor: canBidAmount(room.currentBid + 0.25) ? 'pointer' : 'not-allowed', opacity: canBidAmount(room.currentBid + 0.25) ? 1 : 0.5 }}>
                 <div style={{ fontSize: 12, color: '#888' }}>+ ₹0.25 Cr</div>
                 <div style={{ fontSize: 20, fontWeight: 800, color: '#ef4444', marginTop: 4 }}>₹{(room.currentBid + 0.25).toFixed(2)} Cr</div>
               </button>
               <button onClick={() => handleBid(room.currentBid + 0.50)} disabled={!canBidAmount(room.currentBid + 0.50)} style={{ flex: 1, padding: '16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, cursor: canBidAmount(room.currentBid + 0.50) ? 'pointer' : 'not-allowed', opacity: canBidAmount(room.currentBid + 0.50) ? 1 : 0.5 }}>
                 <div style={{ fontSize: 12, color: '#888' }}>+ ₹0.50 Cr</div>
                 <div style={{ fontSize: 20, fontWeight: 800, color: '#fb923c', marginTop: 4 }}>₹{(room.currentBid + 0.50).toFixed(2)} Cr</div>
               </button>
               
               <motion.button animate={bidPulse ? {scale:0.95} : {}} onClick={() => handleBid(room.currentBid + getNextBid(room.currentBid))} disabled={!canBidAmount(room.currentBid + getNextBid(room.currentBid))} style={{ flex: 2, background: G, border: 'none', borderRadius: 12, color: 'black', cursor: canBidAmount(room.currentBid + getNextBid(room.currentBid)) ? 'pointer' : 'not-allowed', opacity: canBidAmount(room.currentBid + getNextBid(room.currentBid)) ? 1 : 0.5, padding: 16 }}>
                 <div style={{ fontSize: 24, fontWeight: 900 }}>BID ₹{(room.currentBid + getNextBid(room.currentBid)).toFixed(2)} Cr</div>
                 <div style={{ fontSize: 12, fontWeight: 800, opacity: 0.8, marginTop: 4 }}>PLACE YOUR BID</div>
               </motion.button>

               <button onClick={() => handleBid(room.currentBid + 1.00)} disabled={!canBidAmount(room.currentBid + 1.00)} style={{ flex: 1, padding: '16px', background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.2)', borderRadius: 12, cursor: canBidAmount(room.currentBid + 1.00) ? 'pointer' : 'not-allowed', opacity: canBidAmount(room.currentBid + 1.00) ? 1 : 0.5 }}>
                 <div style={{ fontSize: 12, color: '#888' }}>+ ₹1.00 Cr</div>
                 <div style={{ fontSize: 20, fontWeight: 800, color: '#a78bfa', marginTop: 4 }}>₹{(room.currentBid + 1.00).toFixed(2)} Cr</div>
               </button>
               <button style={{ flex: 1, padding: '16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                 <div style={{ fontSize: 14, fontWeight: 800, color: 'white' }}>CUSTOM BID</div>
                 <div style={{ fontSize: 10, color: '#888', marginTop: 4 }}>ENTER AMOUNT</div>
               </button>
             </div>

             {/* Status Bottom Bar */}
             <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.05)', paddingLeft: 32, paddingRight: 32 }}>
               <div style={{ textAlign: 'center' }}>
                 <div style={{ fontSize: 10, color: '#888', letterSpacing: '0.1em' }}>YOUR PURSE</div>
                 <div style={{ fontSize: 20, fontWeight: 900, color: EM, marginTop: 4 }}>₹{me?.budget.toFixed(2)} Cr</div>
               </div>
               <div style={{ textAlign: 'center' }}>
                 <div style={{ fontSize: 10, color: '#888', letterSpacing: '0.1em' }}>PLAYERS BOUGHT</div>
                 <div style={{ fontSize: 20, fontWeight: 900, color: 'white', marginTop: 4 }}>{me?.squad?.length} / 15</div>
               </div>
               <div style={{ textAlign: 'center' }}>
                 <div style={{ fontSize: 10, color: '#888', letterSpacing: '0.1em' }}>STATUS</div>
                 <div style={{ fontSize: 18, fontWeight: 900, color: iAmLeading ? G : (me?.squad?.length >= 15 ? '#ef4444' : EM), marginTop: 4 }}>
                   {iAmLeading ? 'LEADING' : (me?.squad?.length >= 15 ? 'SQUAD FULL' : 'YOU CAN BID')}
                 </div>
               </div>
             </div>

          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div style={{ width: 320, display: 'flex', flexDirection: 'column', gap: 24 }}>
          <Panel title="TEAMS & PURSE" style={{ flex: 1, overflow: 'hidden', padding: '20px 0' }}>
            <div style={{ display: 'flex', padding: '0 20px', fontSize: 10, color: '#888', marginBottom: 12 }}>
              <div style={{ width: 24 }}></div>
              <div style={{ flex: 1 }}>TEAM</div>
              <div style={{ width: 80, textAlign: 'right' }}>PURSE (₹ Cr)</div>
              <div style={{ width: 60, textAlign: 'right' }}>PLAYERS</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, overflowY: 'auto', padding: '0 20px' }}>
              {sortedUsers.map((u, i) => (
                <div key={u.id} onClick={() => setViewSquadId(u.id)} style={{ display: 'flex', alignItems: 'center', fontSize: 12, cursor: 'pointer', background: 'rgba(255,255,255,0.02)', padding: '8px 12px', margin: '0 -12px', borderRadius: 8, border: '1px solid transparent', transition: '0.2s', ':hover': { borderColor: 'rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)' } }}>
                  <div style={{ width: 24, color: '#888' }}>{i + 1}</div>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 16, height: 16, borderRadius: '50%', background: `linear-gradient(135deg, ${TEAM_COLORS[i%TEAM_COLORS.length][0]}, ${TEAM_COLORS[i%TEAM_COLORS.length][1]})` }} />
                    <span style={{ fontWeight: 600, color: u.id === myId ? 'white' : '#ccc' }}>{u.teamName}</span>
                  </div>
                  <div style={{ width: 80, textAlign: 'right', fontWeight: 800 }}>₹{u.budget.toFixed(2)}</div>
                  <div style={{ width: 60, textAlign: 'right', fontWeight: 800 }}>{u.squad.length}</div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="SQUAD OVERVIEW (YOUR TEAM)">
             <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Shield size={16} />
                </div>
                <div style={{ fontSize: 14, fontWeight: 800 }}>{me?.teamName}</div>
                <div style={{ marginLeft: 'auto', fontSize: 14, fontWeight: 800, color: EM }}>{me?.squad?.length} <span style={{color:'#888', fontSize:12}}>/ 15 PLAYERS</span></div>
             </div>
             
             <div style={{ marginTop: 12 }}>
                <button onClick={() => setViewSquadId(myId)} style={{ width: '100%', padding: '10px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', fontWeight: 800, fontSize: 10, cursor: 'pointer', letterSpacing: '0.1em', transition: '0.2s', ':hover': {background:'rgba(255,255,255,0.1)'} }}>
                  👁️ VIEW MY SQUAD
                </button>
             </div>
             
             <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, fontSize: 10, fontWeight: 800, color: '#888' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399' }} /> BAT {batCount}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#f87171' }} /> BOWL {bowlCount}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#a78bfa' }} /> AR {arCount}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#fbbf24' }} /> WK {wkCount}
                </div>
             </div>

             <div style={{ height: 4, background: '#111', borderRadius: 2, marginTop: 12, display: 'flex', overflow: 'hidden' }}>
               <div style={{ width: `${(batCount/15)*100}%`, background: '#34d399' }} />
               <div style={{ width: `${(bowlCount/15)*100}%`, background: '#f87171' }} />
               <div style={{ width: `${(arCount/15)*100}%`, background: '#a78bfa' }} />
               <div style={{ width: `${(wkCount/15)*100}%`, background: '#fbbf24' }} />
             </div>
          </Panel>

          {isAdmin && (
            <Panel title="AUCTION CONTROLS (HOST)">
               <div style={{ display: 'flex', gap: 12 }}>
                 <button onClick={() => room.status === 'paused' ? onResume() : onPause()} style={{ flex: 1, padding: '12px', background: room.status === 'paused' ? 'rgba(22,199,132,0.1)' : 'rgba(239,68,68,0.1)', border: room.status === 'paused' ? '1px solid rgba(22,199,132,0.2)' : '1px solid rgba(239,68,68,0.2)', color: room.status === 'paused' ? '#16c784' : '#ef4444', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 12, fontWeight: 800, cursor: 'pointer' }}>
                   {room.status === 'paused' ? <><Play size={14} /> RESUME</> : <><Pause size={14} /> PAUSE AUCTION</>}
                 </button>
                 <button onClick={onSkip} style={{ flex: 1, padding: '12px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', color: '#3b82f6', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 12, fontWeight: 800, cursor: 'pointer' }}>
                   <FastForward size={14} /> NEXT PLAYER
                 </button>
               </div>
            </Panel>
          )}
        </div>
      </div>

      {/* BOTTOM LIVE TICKER */}
      <div style={{ height: 40, borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', padding: '0 24px', background: '#0a0e17' }}>
         <span style={{ background: G, color: 'black', fontSize: 10, fontWeight: 900, padding: '2px 6px', borderRadius: 4, letterSpacing: '0.1em' }}>LIVE</span>
         <marquee style={{ marginLeft: 16, fontSize: 12, fontWeight: 700, color: '#888' }}>
            {room.history.length > 0 ? 
              room.history.slice(0, 5).map(h => h.soldTo === 'Unsold' ? `${h.player.name} WENT UNSOLD | ` : `${h.soldTo.toUpperCase()} BUYS ${h.player.name.toUpperCase()} FOR ₹${h.price.toFixed(2)} Cr | `).join('') 
              : 'AUCTION HAS STARTED. GET READY TO BID!'}
         </marquee>
      </div>

      <AnimatePresence>{toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}</AnimatePresence>

      {/* SQUAD VIEWER MODAL */}
      <AnimatePresence>
        {viewSquadId && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} style={{position:'fixed',inset:0,zIndex:400,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(0,0,0,0.85)',backdropFilter:'blur(16px)'}} onClick={() => setViewSquadId(null)}>
            {(() => {
              const u = room.users.find(x => x.id === viewSquadId);
              if (!u) return null;
              const color = TEAM_COLORS[room.users.findIndex(x=>x.id===u.id)%TEAM_COLORS.length] || ['#fff'];
              return (
                <motion.div initial={{scale:0.9,opacity:0,y:20}} animate={{scale:1,opacity:1,y:0}} exit={{scale:0.95,opacity:0,y:20}} onClick={e=>e.stopPropagation()} style={{background:'#0a0e13',border:`1px solid ${color[0]}66`,borderRadius:24,padding:32,width:500,maxWidth:'90%',maxHeight:'85vh',display:'flex',flexDirection:'column',boxShadow:`0 40px 100px rgba(0,0,0,0.8), inset 0 0 80px ${color[0]}11`}}>
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:24}}>
                    <div style={{display:'flex',alignItems:'center',gap:16}}>
                      <div style={{width:48,height:48,borderRadius:'50%',background:`transparent`,border:`2px solid ${color[0]}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,fontWeight:900,color:color[0]}}>
                        {u.teamName.slice(0,2).toUpperCase()}
                      </div>
                      <div>
                        <div style={{fontSize:24,fontWeight:900,color:'white',fontFamily:'Rajdhani,sans-serif'}}>{u.teamName}</div>
                        <div style={{fontSize:12,color:'#888',fontWeight:700}}>{u.squad.length} / 15 PLAYERS BOUGHT</div>
                      </div>
                    </div>
                    <button onClick={() => setViewSquadId(null)} style={{background:'transparent',border:'none',color:'#888',fontSize:24,cursor:'pointer'}}>✕</button>
                  </div>

                  <div style={{flex:1,overflowY:'auto',display:'flex',flexDirection:'column',gap:8,paddingRight:8}}>
                    {u.squad.length === 0 ? (
                      <div style={{padding:32,textAlign:'center',color:'#555',fontWeight:600}}>No players bought yet.</div>
                    ) : (
                      [...u.squad].reverse().map((p, idx) => (
                        <div key={idx} style={{display:'flex',alignItems:'center',justifyContent:'space-between',background:'rgba(255,255,255,0.03)',padding:'12px 16px',borderRadius:12,border:'1px solid rgba(255,255,255,0.05)'}}>
                          <div style={{display:'flex',alignItems:'center',gap:12}}>
                            <div style={{width:8,height:8,borderRadius:'50%',background:color[0]}}/>
                            <div>
                              <div style={{fontSize:14,fontWeight:800,color:'white',fontFamily:'Rajdhani,sans-serif'}}>{p.name}</div>
                              <div style={{fontSize:10,color:'#888',fontWeight:700,marginTop:2}}>{p.role} • {p.country||'IND'}</div>
                            </div>
                          </div>
                          <div style={{fontSize:15,fontWeight:900,color:EM}}>₹{p.soldPrice ?? p.price} Cr</div>
                        </div>
                      ))
                    )}
                  </div>

                  <div style={{marginTop:24,paddingTop:24,borderTop:'1px solid rgba(255,255,255,0.05)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <div>
                      <div style={{fontSize:10,color:'#888',fontWeight:800,letterSpacing:'0.1em'}}>BUDGET LEFT</div>
                      <div style={{fontSize:24,fontWeight:900,color:EM}}>₹{u.budget.toFixed(2)} Cr</div>
                    </div>
                    <button onClick={() => setViewSquadId(null)} style={{padding:'12px 24px',borderRadius:8,background:'rgba(255,255,255,0.05)',color:'white',border:'1px solid rgba(255,255,255,0.1)',fontWeight:800,fontSize:12,cursor:'pointer'}}>CLOSE SQUAD</button>
                  </div>
                </motion.div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
