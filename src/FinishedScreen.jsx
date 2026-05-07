import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { TEAM_COLORS, avgRating } from './data.js';
import { RoleBadge } from './Components.jsx';

export default function FinishedScreen({ room }) {
  const [expanded, setExpanded] = useState(null);

  const sorted = [...room.users]
    .map(u => ({ ...u, score: parseFloat(avgRating(u.squad)) }))
    .sort((a, b) => b.score - a.score);

  const winner = sorted[0];

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div style={{ minHeight: '100vh', position: 'relative', padding: '40px 24px', overflowY: 'auto' }}>
      <div className="stadium-bg" />

      {/* Winner hero */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        style={{ maxWidth: 700, margin: '0 auto 48px', textAlign: 'center', position: 'relative', zIndex: 1 }}>

        {/* Trophy */}
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{ fontSize: 80, marginBottom: 16, filter: 'drop-shadow(0 0 30px rgba(251,191,36,0.5))' }}>🏆</motion.div>

        <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#fbbf24', marginBottom: 10 }}>Auction Champions</div>
        <h1 style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: 64, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 8, lineHeight: 1, background: 'linear-gradient(135deg,#fff,#cbd5e1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          {winner?.teamName}
        </h1>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginTop: 24, flexWrap: 'wrap' }}>
          {[
            { label: 'Squad Rating', value: winner?.score?.toFixed(1), color: '#fbbf24' },
            { label: 'Players Signed', value: `${winner?.squad?.length}/11`, color: '#16c784' },
            { label: 'Budget Left', value: `₹${winner?.budget}Cr`, color: '#818cf8' },
          ].map(s => (
            <div key={s.label} className="glass" style={{ padding: '16px 28px', borderRadius: 16, textAlign: 'center', minWidth: 120 }}>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#8892a4', marginBottom: 6 }}>{s.label}</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Full leaderboard */}
      <div style={{ maxWidth: 780, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#8892a4', marginBottom: 20 }}>Final Standings</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {sorted.map((u, i) => {
            const color = TEAM_COLORS[room.users.findIndex(r => r.id === u.id) % TEAM_COLORS.length];
            const isOpen = expanded === u.id;
            return (
              <motion.div key={u.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                className={i === 0 ? 'podium-card gold-card' : 'podium-card'}
                style={{ textAlign: 'left', cursor: 'pointer', borderRadius: 20, padding: '20px 24px' }}
                onClick={() => setExpanded(isOpen ? null : u.id)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ fontSize: 28 }}>{medals[i] || `#${i + 1}`}</div>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: `linear-gradient(135deg,${color[0]},${color[1]})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, flexShrink: 0 }}>
                    {u.teamName.slice(0,2).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.01em' }}>{u.teamName}</div>
                    <div style={{ fontSize: 12, color: '#8892a4' }}>{u.name}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexShrink: 0 }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8892a4', marginBottom: 2 }}>Rating</div>
                      <div style={{ fontSize: 24, fontWeight: 800, color: '#fbbf24' }}>{u.score.toFixed(1)}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8892a4', marginBottom: 2 }}>Budget Left</div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: '#16c784' }}>₹{u.budget}Cr</div>
                    </div>
                    <div style={{ color: '#8892a4' }}>{isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}</div>
                  </div>
                </div>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                      <div style={{ paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
                        {u.squad.length === 0 ? (
                          <span style={{ color: '#4a5568', fontSize: 13 }}>No players signed</span>
                        ) : u.squad.map((p, j) => (
                          <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ width: 28, height: 28, borderRadius: '50%', background: `linear-gradient(135deg,${color[0]},${color[1]})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800 }}>
                              {p.name[0]}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                              <div style={{ fontSize: 10, color: '#16c784' }}>₹{p.soldPrice}Cr · {p.rating}★</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <button className="btn btn-primary btn-lg" style={{ gap: 10 }} onClick={() => window.location.reload()}>
            <RotateCcw size={18} /> Play New Season
          </button>
        </div>
      </div>
    </div>
  );
}
