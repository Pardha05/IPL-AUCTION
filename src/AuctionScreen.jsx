import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Wallet, Users, History, ChevronUp, Star, UserCheck, Pause, Play, FastForward, StopCircle, List, X } from 'lucide-react';
import { RoleBadge, PlayerAvatar, StarRating, CircularTimer, TeamRow, Toast } from './Components.jsx';
import { ROLE_META, TEAM_COLORS, avgRating } from './data.js';

export default function AuctionScreen({ room, myId, timer, onBid, onPause, onResume, onSkip, onEnd, onJump }) {
  const [toast, setToast] = useState(null);
  const [bidPulse, setBidPulse] = useState(false);
  const [showPlayers, setShowPlayers] = useState(false);
  const [playerFilter, setPlayerFilter] = useState('ALL');

  const player = room.players ? room.players[room.currentPlayerIndex] : null;
  const me = room.users.find(u => u.id === myId);
  const nextBid = +(room.currentBid + 0.5).toFixed(1);
  const iAmLeading = room.currentBidder?.id === myId;
  const canBid = !iAmLeading && me?.squad?.length < 11 && me?.budget >= nextBid && room.status === 'active';
  const isAdmin = room.admin === myId;

  const handleBid = () => {
    if (!canBid) {
      if (room.status === 'paused') return showErr('Auction is paused.');
      if (me?.squad?.length >= 11) return showErr('Squad is full (11/11)');
      if (me?.budget < nextBid) return showErr(`Insufficient funds. Need ₹${nextBid}Cr`);
      return;
    }
    setBidPulse(true);
    setTimeout(() => setBidPulse(false), 500);
    onBid(nextBid);
  };

  const showErr = (msg) => { setToast({ msg, type:'error' }); setTimeout(() => setToast(null), 4000); };

  const sorted = [...room.users].sort((a,b) => parseFloat(avgRating(b.squad)) - parseFloat(avgRating(a.squad)));
  const roleColor = { BAT:'#60a5fa', BOWL:'#f87171', AR:'#a78bfa', WK:'#fbbf24' };
  const myColor = TEAM_COLORS[room.users.findIndex(u => u.id === myId) % TEAM_COLORS.length];

  if (!player) return null;

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', color: 'white' }}>
      <div className="stadium-bg" />

      {/* ── TOP NAV ── */}
      <header className="glass mobile-stack" style={{ borderRadius: 0, border: 'none', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 32px', display: 'flex', alignItems: 'center', gap: 24, height: 'auto', minHeight: 72, position: 'relative', zIndex: 100 }}>
        <div style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 800, fontSize: 24, letterSpacing: '-0.02em' }}>
          IPL <span className="text-gradient-primary">AUCTION</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 16px', background: 'rgba(255,255,255,0.05)', borderRadius: 14, border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg,${myColor[0]},${myColor[1]})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900 }}>
            {me?.teamName?.slice(0,2).toUpperCase()}
          </div>
          <span style={{ fontWeight: 700, fontSize: 15 }}>{me?.teamName}</span>
        </div>

        <div style={{ flex: 1 }} />

        {isAdmin && (
          <div style={{ display: 'flex', gap: 8 }}>
            <button 
              onClick={() => room.status === 'paused' ? onResume() : onPause()}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: room.status === 'paused' ? 'rgba(22,199,132,0.1)' : 'rgba(239,68,68,0.1)', color: room.status === 'paused' ? '#16c784' : '#ef4444', fontWeight: 700, cursor: 'pointer' }}
            >
              {room.status === 'paused' ? <><Play size={16} /> Resume</> : <><Pause size={16} /> Pause</>}
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
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(99,102,241,0.1)', color: '#818cf8', fontWeight: 700, cursor: 'pointer' }}
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

        <div style={{ display: 'flex', gap: 1, background: 'rgba(255,255,255,0.06)', borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
          {[
            { label: 'Purse', value: `₹${me?.budget}Cr`, color: '#16c784' },
            { label: 'Squad', value: `${me?.squad?.length}/11`, color: 'white' },
            { label: 'Rating', value: avgRating(me?.squad), color: '#fbbf24' },
          ].map(s => (
            <div key={s.label} style={{ background: '#080c18', padding: '10px 24px', textAlign: 'center', minWidth: 100 }}>
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
      <div className="responsive-grid" style={{ flex: 1, display: 'grid', gridTemplateColumns: '340px 1fr 320px', gap: 0, overflowY: 'auto', overflowX: 'hidden', position: 'relative', zIndex: 10 }}>
        
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
              <UserCheck size={16} color="#6366f1" />
              <h3 style={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#8892a4' }}>My Squad ({me?.squad?.length}/11)</h3>
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
        <main className="responsive-padding" style={{ padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 32, overflowY: 'auto' }}>
          <div style={{ textAlign: 'center' }}>
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

          <motion.div animate={bidPulse ? { scale: [1, 1.05, 1] } : {}} className="bid-display" style={{ width: '100%', maxWidth: 540, background: 'rgba(13,18,36,0.6)', padding: '40px', borderRadius: 32 }}>
            <div style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#8892a4', marginBottom: 12 }}>Current Bid</div>
            <div className="bid-amount" style={{ fontSize: 84, fontWeight: 800, marginBottom: 16 }}>₹{room.currentBid}<span style={{ fontSize: 32, color: '#4a5568' }}>Cr</span></div>
            
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

          <div style={{ width: '100%', maxWidth: 540 }}>
            <button 
              className={`btn btn-lg ${canBid ? 'btn-gold' : 'btn-ghost'}`}
              onClick={handleBid}
              disabled={!canBid && !iAmLeading}
              style={{ width: '100%', height: 80, borderRadius: 20, fontSize: 22, fontWeight: 900, gap: 12, position: 'relative' }}
            >
              {iAmLeading ? (
                <><Crown size={24} fill="#16c784" /> Leading — Keep Waiting</>
              ) : canBid ? (
                <><ChevronUp size={24} /> RAISE TO ₹{nextBid}Cr</>
              ) : me?.squad?.length >= 11 ? (
                'MAX SQUAD REACHED'
              ) : (
                'INSUFFICIENT BUDGET'
              )}
            </button>
            <p style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: '#4a5568', fontWeight: 600 }}>
              {canBid ? `Raise by ₹0.5Cr · Remaining Budget: ₹${+(me?.budget - nextBid).toFixed(1)}Cr` : ''}
            </p>
          </div>
        </main>

        {/* ── RIGHT: Leaderboard & History ── */}
        <aside className="responsive-padding" style={{ borderLeft: '1px solid rgba(255,255,255,0.06)', padding: 24, overflowY: 'auto', background: 'rgba(8,12,24,0.3)', display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Users size={16} color="#6366f1" />
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
              <History size={16} color="#6366f1" />
              <h3 style={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#8892a4' }}>Recent Signings</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {room.history.length === 0 ? (
                <div style={{ fontSize: 12, color: '#4a5568', padding: '10px 0' }}>No players sold yet</div>
              ) : (
                [...room.history].reverse().slice(0, 5).map((h, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'white' }}>{h.player.name}</div>
                      <div style={{ fontSize: 10, color: h.soldTo === 'Unsold' ? '#ef4444' : '#8892a4' }}>{h.soldTo}</div>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: h.soldTo === 'Unsold' ? '#ef4444' : '#16c784' }}>
                      {h.soldTo === 'Unsold' ? 'UNSOLD' : `₹${h.price}Cr`}
                    </div>
                  </div>
                ))
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
                    style={{ padding: '6px 16px', borderRadius: 99, fontWeight: 700, fontSize: 13, border: '1px solid rgba(255,255,255,0.1)', background: playerFilter === f ? '#6366f1' : 'transparent', color: playerFilter === f ? 'white' : '#8892a4', cursor: 'pointer' }}>
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
    </div>
  );
}
