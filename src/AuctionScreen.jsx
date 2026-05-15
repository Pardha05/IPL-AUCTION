import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Users, History, ChevronUp, UserCheck, Pause, Play, FastForward, Rewind, StopCircle, List, X, Copy, CheckCircle } from 'lucide-react';
import { RoleBadge, PlayerAvatar, StarRating, CircularTimer, TeamRow, Toast } from './Components.jsx';
import { ROLE_META, TEAM_COLORS, avgRating } from './data.js';

export default function AuctionScreen({ room, myId, timer, onBid, onPause, onResume, onSkip, onPrevious, onEnd, onJump }) {
  const [toast, setToast] = useState(null);
  const [bidPulse, setBidPulse] = useState(false);
  const [showPlayers, setShowPlayers] = useState(false);
  const [playerFilter, setPlayerFilter] = useState('ALL');
  const [codeCopied, setCodeCopied] = useState(false);

  const copyRoomCode = () => {
    navigator.clipboard.writeText(room.id);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  const player = room.players ? room.players[room.currentPlayerIndex] : null;
  const me = room.users.find(u => u.id === myId);
  const iAmLeading = room.currentBidder?.id === myId;
  const isAdmin = room.admin === myId;
  const BID_RAISES = [0.5, 1.0, 2.0, 3.0];

  const canBidAmount = (raise) => {
    const amount = +(room.currentBid + raise).toFixed(1);
    return !iAmLeading && me?.squad?.length < 15 && me?.budget >= amount && room.status === 'active';
  };

  const handleBid = (raise) => {
    const amount = +(room.currentBid + raise).toFixed(1);
    if (!canBidAmount(raise)) {
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

  const sorted = [...room.users].sort((a,b) => parseFloat(avgRating(b.squad)) - parseFloat(avgRating(a.squad)));
  const roleColor = { BAT:'#34d399', BOWL:'#f87171', AR:'#a78bfa', WK:'#fbbf24' };
  const myColor = TEAM_COLORS[room.users.findIndex(u => u.id === myId) % TEAM_COLORS.length];

  if (!player) return null;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', color: 'white' }}>
      <div className="stadium-bg" />
      {/* z-index:2 wrapper ensures all content renders above fixed bg */}
      <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', flex: 1 }}>

      {/* ── TOP NAV ── */}
      <header className="glass mobile-stack" style={{ borderRadius: 0, border: 'none', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 32px', display: 'flex', alignItems: 'center', gap: 24, height: 'auto', minHeight: 72, position: 'relative', zIndex: 100 }}>
        <div style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 800, fontSize: 24, letterSpacing: '-0.02em' }}>
          IPL <span className="text-gradient-primary">AUCTION</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 16px', background: 'rgba(255,255,255,0.05)', borderRadius: 14, border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg,${myColor[0]},${myColor[1]})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900, flexShrink: 0 }}>
            {me?.teamName?.slice(0,2).toUpperCase()}
          </div>
          <span style={{ fontWeight: 700, fontSize: 15, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 100 }}>{me?.teamName}</span>
        </div>

        <div style={{ flex: 1 }} />

        {isAdmin && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
            {/* Room Code Badge — share with late joiners */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px', background: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.25)', borderRadius: 10 }}>
              <div style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#8892a4' }}>Room</div>
              <div style={{ fontFamily: 'monospace', fontSize: 16, fontWeight: 900, letterSpacing: '0.15em', color: '#fbbf24' }}>{room.id}</div>
              <button onClick={copyRoomCode} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', display: 'flex', color: codeCopied ? '#16c784' : '#8892a4' }}>
                {codeCopied ? <CheckCircle size={14} /> : <Copy size={14} />}
              </button>
            </div>
            <button 
              onClick={() => room.status === 'paused' ? onResume() : onPause()}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: room.status === 'paused' ? 'rgba(22,199,132,0.1)' : 'rgba(239,68,68,0.1)', color: room.status === 'paused' ? '#16c784' : '#ef4444', fontWeight: 700, cursor: 'pointer' }}
            >
              {room.status === 'paused' ? <><Play size={16} /> Resume</> : <><Pause size={16} /> Pause</>}
            </button>
            <button 
              onClick={onPrevious}
              disabled={room.status === 'paused' || room.currentPlayerIndex === 0}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.1)', color: 'white', fontWeight: 700, cursor: (room.status === 'paused' || room.currentPlayerIndex === 0) ? 'not-allowed' : 'pointer', opacity: (room.status === 'paused' || room.currentPlayerIndex === 0) ? 0.5 : 1 }}
            >
              <Rewind size={16} /> Prev
            </button>
            <button 
              onClick={onSkip}
              disabled={room.status === 'paused'}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.1)', color: 'white', fontWeight: 700, cursor: room.status === 'paused' ? 'not-allowed' : 'pointer', opacity: room.status === 'paused' ? 0.5 : 1 }}
            >
              <FastForward size={16} /> Skip
            </button>
            <button 
              onClick={() => setShowPlayers(true)}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 8, border: '1px solid rgba(245,166,35,0.2)', background: 'rgba(245,166,35,0.08)', color: '#fbbf24', fontWeight: 700, cursor: 'pointer' }}
            >
              <List size={16} /> Players
            </button>
            <button 
              onClick={onEnd}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(239,68,68,0.1)', color: '#ef4444', fontWeight: 700, cursor: 'pointer' }}
            >
              <StopCircle size={16} /> End
            </button>
          </div>
        )}

        <div style={{ display: 'flex', gap: 1, background: 'rgba(255,255,255,0.06)', borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)', width: '100%', maxWidth: '100%', flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { label: 'Purse', value: `₹${me?.budget}Cr`, color: '#16c784' },
            { label: 'Squad', value: `${me?.squad?.length}/15`, color: 'white' },
            { label: 'Rating', value: avgRating(me?.squad), color: '#fbbf24' },
          ].map(s => (
            <div key={s.label} style={{ background: '#080c18', padding: '10px 16px', textAlign: 'center', flex: '1 1 30%', minWidth: 80 }}>
              <div style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#8892a4', marginBottom: 2 }}>{s.label}</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        <div className="mobile-hidden" style={{ padding: '0 24px', textAlign: 'center' }}>
          <div style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#8892a4', marginBottom: 2 }}>Player</div>
          <div style={{ fontSize: 16, fontWeight: 800 }}>{room.currentPlayerIndex + 1}<span style={{ color: '#4a5568', fontSize: 12 }}>/{room.players.length}</span></div>
        </div>
      </header>

      {/* ── MAIN LAYOUT ── */}
      <div className="auction-layout-grid" style={{ flex: 1, position: 'relative', zIndex: 10 }}>
        
        {/* ── LEFT: Player & My Squad ── */}
        <aside className="responsive-padding" style={{ borderRight: '1px solid rgba(255,255,255,0.06)', padding: 24, overflowY: 'visible', background: 'rgba(8,12,24,0.3)', display: 'flex', flexDirection: 'column', gap: 24 }}>
          <AnimatePresence mode="wait">
            <motion.div key={player.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div style={{ textAlign: 'center', padding: '32px 20px', background: 'rgba(255,255,255,0.03)', borderRadius: 24, border: '1px solid rgba(255,255,255,0.06)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: -50, right: -50, width: 120, height: 120, background: roleColor[player.role], filter: 'blur(60px)', opacity: 0.15 }} />
                
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                  <PlayerAvatar name={player.name} size="large" color={[roleColor[player.role], '#4f46e5']} />
                </div>
                
                <RoleBadge role={player.role} />
                {player.tag && (
                  <span style={{ display: 'inline-block', marginLeft: 8, padding: '2px 10px', borderRadius: 99, fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em',
                    background: player.tag.includes('Veteran') ? 'rgba(245,166,35,0.15)' : 'rgba(99,102,241,0.15)',
                    color: player.tag.includes('Veteran') ? '#fbbf24' : '#a78bfa',
                    border: player.tag.includes('Veteran') ? '1px solid rgba(245,166,35,0.3)' : '1px solid rgba(99,102,241,0.3)' }}>
                    {player.tag.includes('Veteran') ? '⭐ ' : '🔓 '}{player.tag}
                  </span>
                )}
                {player.hiddenPotential && (
                  <span style={{ display: 'inline-block', marginLeft: 6, padding: '2px 10px', borderRadius: 99, fontSize: 10, fontWeight: 800,
                    background: 'rgba(239,68,68,0.12)', color: '#f87171', border: '1px solid rgba(239,68,68,0.25)' }}>🔥 Hidden Potential</span>
                )}
                <h2 style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: 32, fontWeight: 700, margin: '12px 0 4px', color: 'white' }}>{player.name}</h2>
                <div style={{ fontSize: 14, color: '#8892a4', fontWeight: 600, marginBottom: 20 }}>{player.team} · 2024 Season</div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="stat-pill" style={{ background: 'rgba(0,0,0,0.2)', padding: '12px' }}>
                    <span className="stat-label">Base Price</span>
                    <span style={{ fontSize: 20, fontWeight: 800, color: '#16c784' }}>₹{player.base}Cr</span>
                  </div>
                  <div className="stat-pill" style={{ background: 'rgba(0,0,0,0.2)', padding: '12px' }}>
                    <span className="stat-label">Rating</span>
                    <span style={{ fontSize: 20, fontWeight: 800, color: '#fbbf24' }}>{player.rating}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <UserCheck size={16} color="#fbbf24" />
              <h3 style={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#8892a4' }}>My Squad ({me?.squad?.length}/15)</h3>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {me?.squad?.length === 0 ? (
                <div style={{ padding: '32px 20px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: 16, border: '1px dashed rgba(255,255,255,0.1)', color: '#4a5568', fontSize: 13 }}>
                  No players signed yet. Start bidding!
                </div>
              ) : (
                me.squad.map((p, i) => (
                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} key={i} className="squad-item" style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 14px' }}>
                    <div className="squad-avatar" style={{ background: roleColor[p.role] }}>{p.name[0]}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'white' }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: '#8892a4' }}>{ROLE_META[p.role]?.label}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 13, fontWeight: 800, color: '#16c784' }}>₹{p.soldPrice}Cr</div>
                      <div style={{ fontSize: 11, color: '#fbbf24', fontWeight: 700 }}>{p.rating} ★</div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </aside>

        {/* ── CENTER: Bidding Arena ── */}
        <main className="responsive-padding mobile-center" style={{ padding: '32px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 40, width: '100%', overflowX: 'hidden' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            {room.status === 'paused' ? (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 20px', background: 'rgba(245,166,35,0.1)', border: '1px solid rgba(245,166,35,0.2)', borderRadius: 99, marginBottom: 24 }}>
                <Pause size={14} color="#fbbf24" />
                <span style={{ fontSize: 12, fontWeight: 900, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Auction Paused</span>
              </div>
            ) : (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 20px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 99, marginBottom: 24 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 10px #ef4444' }} />
                <span style={{ fontSize: 12, fontWeight: 900, color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Auction Live</span>
              </div>
            )}
            
            <CircularTimer value={timer} max={15} />
          </div>

          <motion.div animate={bidPulse ? { scale: [1, 1.05, 1] } : {}} className="bid-display" style={{ width: '100%', maxWidth: 540, background: 'rgba(13,18,36,0.6)', padding: '24px 20px', borderRadius: 32 }}>
            <div style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#8892a4', marginBottom: 8 }}>Current Bid</div>
            <div className="bid-amount" style={{ fontSize: 64, fontWeight: 800, marginBottom: 12 }}>₹{room.currentBid}<span style={{ fontSize: 24, color: '#4a5568' }}>Cr</span></div>
            
            <div style={{ minHeight: 32 }}>
              {room.currentBidder ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, color: iAmLeading ? '#16c784' : '#fbbf24', fontWeight: 800, fontSize: 18 }}>
                  <Crown size={20} fill={iAmLeading ? '#16c784' : '#fbbf24'} />
                  {iAmLeading ? 'YOU ARE LEADING' : `${room.currentBidder.teamName.toUpperCase()} LEADING`}
                </div>
              ) : (
                <div style={{ color: '#4a5568', fontWeight: 700, fontSize: 15 }}>WAITING FOR FIRST BID</div>
              )}
            </div>
          </motion.div>

          {/* ── BID ACTIVITY LOG ── */}
          {room.bidLog && room.bidLog.length > 0 && (
            <div style={{ width: '100%', maxWidth: 540, background: 'rgba(13,18,36,0.5)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.06)', padding: '16px 20px' }}>
              <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#8892a4', marginBottom: 12 }}>Live Bid Activity</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 120, overflowY: 'auto' }}>
                {[...room.bidLog].reverse().map((b, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 10px', borderRadius: 10, background: i === 0 ? 'rgba(245,166,35,0.08)' : 'rgba(255,255,255,0.02)', border: i === 0 ? '1px solid rgba(245,166,35,0.2)' : '1px solid transparent' }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: i === 0 ? '#fbbf24' : '#4a5568', flexShrink: 0 }} />
                    <span style={{ flex: 1, fontSize: 13, fontWeight: 700, color: i === 0 ? '#fbbf24' : '#8892a4' }}>{b.teamName}</span>
                    <span style={{ fontSize: 13, fontWeight: 900, color: i === 0 ? '#fbbf24' : '#6b7280', fontFamily: 'Rajdhani, sans-serif' }}>₹{b.amount}Cr</span>
                    {i === 0 && <span style={{ fontSize: 9, fontWeight: 800, color: '#16c784', background: 'rgba(22,199,132,0.1)', padding: '2px 7px', borderRadius: 99, border: '1px solid rgba(22,199,132,0.2)' }}>LEADING</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ width: '100%', maxWidth: 540 }}>
            {iAmLeading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '22px', borderRadius: 20, background: 'rgba(22,199,132,0.08)', border: '1px solid rgba(22,199,132,0.25)', color: '#16c784', fontWeight: 800, fontSize: 18 }}>
                <Crown size={24} fill="#16c784" /> You Are Leading — Keep Waiting
              </div>
            ) : me?.squad?.length >= 15 ? (
              <div style={{ textAlign: 'center', padding: '22px', borderRadius: 20, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#4a5568', fontWeight: 800, fontSize: 16 }}>MAX SQUAD REACHED (15/15)</div>
            ) : (
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#8892a4', marginBottom: 12, textAlign: 'center' }}>Select Raise Amount</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(70px, 1fr))', gap: 10 }}>
                  {BID_RAISES.map((raise) => {
                    const amount = +(room.currentBid + raise).toFixed(1);
                    const canDo = canBidAmount(raise);
                    return (
                      <button
                        key={raise}
                        onClick={() => handleBid(raise)}
                        disabled={!canDo}
                        style={{
                          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                          padding: '14px 8px', borderRadius: 16, border: canDo ? '1px solid rgba(245,166,35,0.4)' : '1px solid rgba(255,255,255,0.06)',
                          background: canDo ? 'linear-gradient(135deg, rgba(251,191,36,0.15), rgba(217,119,6,0.08))' : 'rgba(255,255,255,0.03)',
                          color: canDo ? '#fbbf24' : '#4a5568', cursor: canDo ? 'pointer' : 'not-allowed',
                          fontFamily: 'Rajdhani, sans-serif', fontWeight: 800, transition: 'all 0.2s',
                          boxShadow: canDo ? '0 0 20px rgba(245,166,35,0.1)' : 'none',
                        }}
                      >
                        <span style={{ fontSize: 11, color: canDo ? '#8892a4' : '#4a5568', fontFamily: 'Inter', fontWeight: 600, marginBottom: 2 }}>+{raise}Cr</span>
                        <span style={{ fontSize: 22 }}>₹{amount}</span>
                        <span style={{ fontSize: 10, color: canDo ? '#8892a4' : '#4a5568', fontFamily: 'Inter', fontWeight: 600, marginTop: 2 }}>Cr</span>
                      </button>
                    );
                  })}
                </div>
                <p style={{ textAlign: 'center', marginTop: 12, fontSize: 12, color: '#4a5568', fontWeight: 600 }}>
                  Budget remaining: ₹{me?.budget?.toFixed(1)}Cr
                </p>
              </div>
            )}
          </div>
        </main>

        {/* ── RIGHT: Leaderboard & History ── */}
        <aside className="responsive-padding" style={{ borderLeft: '1px solid rgba(255,255,255,0.06)', padding: 24, overflowY: 'auto', background: 'rgba(8,12,24,0.3)', display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Users size={16} color="#fbbf24" />
              <h3 style={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#8892a4' }}>Live Standings</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {sorted.map((u, i) => (
                <TeamRow key={u.id} user={u} rank={i} isLeading={i === 0 && u.squad.length > 0} isBidder={room.currentBidder?.id === u.id} myId={myId} />
              ))}
            </div>
          </div>

          <div style={{ marginTop: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <History size={16} color="#fbbf24" />
              <h3 style={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#8892a4' }}>Recent Signings</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {room.history.length === 0 ? (
                <div style={{ fontSize: 12, color: '#4a5568', padding: '10px 0' }}>No players sold yet</div>
              ) : (
                [...room.history].reverse().slice(0, 6).map((h, i) => {
                  const unsold = h.soldTo === 'Unsold' || h.soldTo === 'Skipped';
                  return (
                    <div key={i} style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: 12, border: `1px solid ${unsold ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.05)'}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 6 }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{h.player.name}</div>
                          <div style={{ fontSize: 10, color: '#4a5568', marginTop: 1 }}>{h.player.role} · {h.player.team}</div>
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 900, color: unsold ? '#ef4444' : '#fbbf24', fontFamily: 'Rajdhani, sans-serif' }}>
                            {unsold ? 'UNSOLD' : `₹${h.price}Cr`}
                          </div>
                        </div>
                      </div>
                      {!unsold && (
                        <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
                          <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#16c784' }} />
                          <span style={{ fontSize: 10, color: '#16c784', fontWeight: 700 }}>{h.soldTo}</span>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </aside>
      </div>

      <AnimatePresence>{toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}</AnimatePresence>

      <AnimatePresence>
        {showPlayers && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, backdropFilter: 'blur(8px)' }}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              style={{ background: '#080c18', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24, padding: 32, width: '100%', maxWidth: 800, maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2 style={{ fontSize: 24, fontWeight: 800 }}>Available Players</h2>
                <button onClick={() => setShowPlayers(false)} style={{ background: 'transparent', border: 'none', color: '#8892a4', cursor: 'pointer' }}>
                  <X size={24} />
                </button>
              </div>

              <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
                {['ALL', 'BAT', 'BOWL', 'AR', 'WK'].map(f => (
                  <button key={f} onClick={() => setPlayerFilter(f)}
                    style={{ padding: '6px 16px', borderRadius: 99, fontWeight: 700, fontSize: 13, border: `1px solid ${playerFilter === f ? 'rgba(245,166,35,0.4)' : 'rgba(255,255,255,0.1)'}`, background: playerFilter === f ? 'rgba(245,166,35,0.15)' : 'transparent', color: playerFilter === f ? '#fbbf24' : '#8892a4', cursor: 'pointer' }}>
                    {f}
                  </button>
                ))}
              </div>

              <div style={{ overflowY: 'auto', flex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12, paddingRight: 8 }}>
                {room.players.map((p, idx) => {
                  const isSoldOrSkipped = room.history.some(h => h.player.name === p.name);
                  const isCurrent = room.currentPlayerIndex === idx;
                  if (playerFilter !== 'ALL' && p.role !== playerFilter) return null;
                  return (
                    <div key={idx} 
                      onClick={() => {
                        if (isSoldOrSkipped || isCurrent) return;
                        onJump(idx);
                        setShowPlayers(false);
                      }}
                      style={{ padding: '12px 16px', background: isCurrent ? 'rgba(99,102,241,0.2)' : isSoldOrSkipped ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)', border: `1px solid ${isCurrent ? '#6366f1' : 'rgba(255,255,255,0.05)'}`, borderRadius: 12, opacity: isSoldOrSkipped ? 0.5 : 1, cursor: (isSoldOrSkipped || isCurrent) ? 'not-allowed' : 'pointer' }}>
                      <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{p.name}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <RoleBadge role={p.role} size="sm" />
                        <span style={{ fontSize: 12, color: '#16c784', fontWeight: 800 }}>₹{p.base}Cr</span>
                      </div>
                      {p.tag && (
                        <div style={{ display: 'flex', gap: 4, marginTop: 6, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 9, padding: '2px 7px', borderRadius: 99, fontWeight: 800,
                            background: p.tag.includes('Veteran') ? 'rgba(245,166,35,0.15)' : 'rgba(99,102,241,0.15)',
                            color: p.tag.includes('Veteran') ? '#fbbf24' : '#a78bfa' }}>
                            {p.tag.includes('Veteran') ? '⭐' : '🔓'} {p.tag}
                          </span>
                          {p.hiddenPotential && <span style={{ fontSize: 9, padding: '2px 7px', borderRadius: 99, fontWeight: 800, background: 'rgba(239,68,68,0.1)', color: '#f87171' }}>🔥 Potential</span>}
                        </div>
                      )}
                      {isSoldOrSkipped && (
                        <div style={{ fontSize: 10, color: '#ef4444', marginTop: 8, fontWeight: 800 }}>UNAVAILABLE</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>{/* end z-index:2 wrapper */}
    </div>
  );
}
