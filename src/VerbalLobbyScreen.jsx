import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TEAM_COLORS } from './data.js';

const G = '#F5B841', OR = '#FF6B35', EM = '#00C896', BURG = '#4A0E0E';

export default function VerbalLobbyScreen({ room, myId, onStart }) {
  const [copied, setCopied] = useState(false);
  const [order, setOrder] = useState('mixed');
  const isAdmin = room?.admin === myId;

  const copy = () => {
    navigator.clipboard.writeText(room?.id || '');
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  if (!room?.id) return (
    <div style={{ minHeight: '100vh', background: '#0D0D0D', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', color: 'white' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>⏳</div>
        <div style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: 22, color: G }}>Connecting…</div>
      </div>
    </div>
  );

  const budget = room.budget || 150;
  const squadSize = room.squadSize || 15;

  return (
    <div style={{ minHeight: '100vh', background: '#0D0D0D', fontFamily: 'Inter,sans-serif', color: 'white', position: 'relative' }}>
      <div style={{ position: 'fixed', inset: 0, background: `radial-gradient(ellipse 70% 40% at 50% 0%, rgba(245,184,65,0.05), transparent)`, pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.01) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />

      {/* TOP BAR */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 36px', background: 'rgba(8,6,2,0.8)', backdropFilter: 'blur(20px)', borderBottom: `1px solid ${G}18`, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: `linear-gradient(135deg,${G},${OR})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, boxShadow: `0 0 16px ${G}44` }}>🏏</div>
          <div>
            <div style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 800, fontSize: 16, lineHeight: 1 }}>{room.auctionName || 'IPL AUCTION'}</div>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', color: G }}>VERBAL MODE · LOBBY</div>
          </div>
        </div>

        {/* Room code */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'rgba(245,184,65,0.05)', border: `1px solid ${G}22`, borderRadius: 14, padding: '10px 20px' }}>
          <div>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', color: '#444', marginBottom: 2 }}>ROOM CODE</div>
            <div style={{ fontFamily: 'monospace', fontSize: 22, fontWeight: 800, letterSpacing: '0.22em', color: G }}>{room.id}</div>
          </div>
          <button onClick={copy} style={{ fontSize: 11, fontWeight: 800, color: copied ? EM : '#555', background: 'none', border: `1px solid ${copied ? EM : '#333'}`, borderRadius: 8, padding: '6px 12px', cursor: 'pointer', letterSpacing: '0.05em' }}>
            {copied ? '✓ COPIED' : 'COPY'}
          </button>
        </div>

        {isAdmin && (
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <select value={order} onChange={e => setOrder(e.target.value)}
              style={{ padding: '10px 14px', borderRadius: 10, background: '#111', color: 'white', border: `1px solid #333`, outline: 'none', fontWeight: 600, fontSize: 13 }}>
              <option value="mixed">Mixed Order</option>
              <option value="BAT">Batsmen First</option>
              <option value="BOWL">Bowlers First</option>
              <option value="AR">All-Rounders First</option>
            </select>
            <motion.button whileHover={{ scale: 1.04, boxShadow: `0 12px 36px ${G}55` }} whileTap={{ scale: 0.97 }}
              onClick={() => onStart(order)}
              disabled={room.users.length < 2}
              style={{ padding: '12px 28px', borderRadius: 12, border: 'none', background: room.users.length < 2 ? '#222' : `linear-gradient(135deg,${G},${OR})`, color: room.users.length < 2 ? '#444' : '#1a0900', fontWeight: 900, fontSize: 14, cursor: room.users.length < 2 ? 'not-allowed' : 'pointer', letterSpacing: '0.06em', boxShadow: `0 6px 24px ${G}33` }}>
              ▶ START AUCTION {room.users.length < 2 && '(Need 2+ teams)'}
            </motion.button>
          </div>
        )}
      </div>

      {/* MAIN */}
      <div style={{ position: 'relative', zIndex: 5, display: 'grid', gridTemplateColumns: '1fr 300px', minHeight: 'calc(100vh - 76px)' }}>

        {/* Teams grid */}
        <div style={{ padding: '36px', borderRight: `1px solid rgba(255,255,255,0.04)` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
            <div style={{ width: 3, height: 28, background: `linear-gradient(${G},${OR})`, borderRadius: 99 }} />
            <h2 style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: 26, fontWeight: 700, color: 'white' }}>Franchise Owners</h2>
            <div style={{ marginLeft: 'auto', background: `rgba(245,184,65,0.08)`, border: `1px solid ${G}22`, color: G, borderRadius: 99, padding: '4px 14px', fontSize: 12, fontWeight: 800 }}>
              {room.users?.length || 0} / {room.maxTeams || 8} Joined
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
            {room.users?.map((u, i) => {
              const color = TEAM_COLORS[i % TEAM_COLORS.length];
              const isMe = u.id === myId;
              const isHost = u.id === room.admin;
              return (
                <motion.div key={u.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                  style={{ background: isMe ? 'rgba(245,184,65,0.04)' : 'rgba(255,255,255,0.02)', border: `1px solid ${isMe ? G + '33' : 'rgba(255,255,255,0.05)'}`, borderRadius: 18, padding: '18px 20px', position: 'relative', overflow: 'hidden' }}>
                  {isMe && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${G},transparent)` }} />}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 14, background: `linear-gradient(135deg,${color[0]},${color[1]})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Rajdhani,sans-serif', fontSize: 17, fontWeight: 800, flexShrink: 0 }}>
                      {u.teamName.slice(0, 2).toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                        <div style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 800, fontSize: 16, color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.teamName}</div>
                        {isMe && <span style={{ fontSize: 9, fontWeight: 800, color: G, background: `${G}15`, padding: '2px 7px', borderRadius: 99 }}>YOU</span>}
                        {isHost && <span style={{ fontSize: 9, fontWeight: 800, color: OR, background: `${OR}15`, padding: '2px 7px', borderRadius: 99 }}>HOST</span>}
                      </div>
                      <div style={{ fontSize: 12, color: '#444' }}>{u.name}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 10, color: '#333', fontWeight: 700 }}>BUDGET</div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: EM }}>₹{budget}Cr</div>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Empty slots */}
            {Array.from({ length: Math.max(0, (room.maxTeams || 8) - (room.users?.length || 0)) }).map((_, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.01)', border: '1px dashed rgba(255,255,255,0.05)', borderRadius: 18, padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 84 }}>
                <span style={{ fontSize: 12, color: '#333', fontWeight: 600 }}>Waiting for team…</span>
              </div>
            ))}
          </div>

          {!isAdmin && (
            <div style={{ marginTop: 28, padding: '18px 22px', background: 'rgba(245,184,65,0.04)', borderRadius: 14, border: `1px solid ${G}18`, textAlign: 'center' }}>
              <div style={{ fontSize: 20, marginBottom: 8 }}>🎙️</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: G, marginBottom: 4 }}>Verbal Auction Mode</div>
              <div style={{ fontSize: 13, color: '#555' }}>Waiting for the host to start… Get ready to bid!</div>
            </div>
          )}
        </div>

        {/* Sidebar: rules */}
        <div style={{ padding: '36px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
            <div style={{ width: 3, height: 24, background: `linear-gradient(${G},${OR})`, borderRadius: 99 }} />
            <h3 style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: 20, fontWeight: 700 }}>Auction Config</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 36 }}>
            {[
              ['💰', 'Budget', `₹${budget} Crore`],
              ['👥', 'Squad Size', `${squadSize} players`],
              ['🏟️', 'Max Teams', room.maxTeams || 8],
              ['🎙️', 'Mode', 'Verbal / Host-led'],
              ['⏱️', 'Timer', 'No timer — host decides'],
            ].map(([icon, label, val]) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 12 }}>
                <span style={{ fontSize: 18 }}>{icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, color: '#444', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>{val}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 24 }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: '#333', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 16 }}>How It Works</div>
            {['Teams bid verbally in person', 'Host picks winner + enters price', 'Player assigned, budget deducted', 'Best squad rating wins'].map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: `rgba(245,184,65,0.1)`, border: `1px solid ${G}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: G, flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
                <div style={{ fontSize: 13, color: '#666', lineHeight: 1.5 }}>{s}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`@media(max-width:768px){.lobby-grid{grid-template-columns:1fr!important}}`}</style>
    </div>
  );
}
