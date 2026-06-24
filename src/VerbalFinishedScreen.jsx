import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TEAM_COLORS, ROLE_META } from './data.js';

const G = '#F5B841', OR = '#FF6B35', EM = '#00C896', BG = '#0D0D0D', BURG = '#4A0E0E';
const RC = { BAT: '#60a5fa', BOWL: '#f87171', AR: '#a78bfa', WK: G };

// Custom scoring algorithm for Verbal Auction
function calcTeamScore(squad, totalBudget, remainingBudget) {
  if (!squad || squad.length === 0) return 0;
  
  // 1. Average Rating
  const avg = squad.reduce((sum, p) => sum + p.rating, 0) / squad.length;
  
  // 2. Star Players Bonus
  const stars = squad.filter(p => p.rating >= 90).length;
  const starBonus = stars * 1.2;
  
  // 3. Balanced Squad Bonus
  const roles = { BAT: 0, BOWL: 0, AR: 0, WK: 0 };
  squad.forEach(p => { if (roles[p.role] !== undefined) roles[p.role]++; });
  const hasBalance = roles.BAT >= 3 && roles.BOWL >= 3 && roles.AR >= 1 && roles.WK >= 1;
  const balanceBonus = hasBalance ? 4 : 0;
  
  // 4. Budget Efficiency
  // High rating for less money = better
  const spent = totalBudget - remainingBudget;
  const efficiency = spent > 0 ? (avg / spent) * 10 : 0;
  const effBonus = Math.min(5, efficiency);
  
  let score = avg + starBonus + balanceBonus + effBonus;
  return Math.min(99, Math.max(0, Math.round(score)));
}

export default function VerbalFinishedScreen({ room, onRestart }) {
  const [expanded, setExpanded] = useState(null);

  const initialBudget = room.budget || 150;
  
  // Rank teams by our new Overall Score out of 100
  const sortedUsers = [...room.users].map(u => ({
    ...u,
    overallScore: calcTeamScore(u.squad, initialBudget, u.budget),
    spent: initialBudget - u.budget
  })).sort((a, b) => b.overallScore - a.overallScore);

  const champion = sortedUsers[0];

  return (
    <div style={{ minHeight: '100vh', background: BG, fontFamily: 'Inter,sans-serif', color: 'white', padding: '40px 24px', overflowX: 'hidden', position: 'relative' }}>
      <div style={{ position: 'fixed', inset: 0, background: `radial-gradient(ellipse 80% 50% at 50% 10%, rgba(245,184,65,0.08) 0%, transparent 60%)`, pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.015) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 10 }}>
        
        {/* HEADER */}
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.2em', color: G, marginBottom: 12 }}>{room.auctionName || 'IPL AUCTION'} · VERBAL MODE</div>
          <h1 style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: 'clamp(48px, 8vw, 84px)', fontWeight: 700, lineHeight: 0.9, letterSpacing: '-0.02em', color: 'white' }}>
            SEASON <span style={{ background: `linear-gradient(135deg, ${G}, ${OR})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: `drop-shadow(0 0 30px ${G}44)` }}>CONCLUDED</span>
          </h1>
        </div>

        {/* CHAMPION PODIUM */}
        {champion && (
          <motion.div initial={{ opacity: 0, y: 40, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.2, type: 'spring', damping: 25 }}
            style={{ background: 'rgba(20,15,5,0.8)', border: `1px solid ${G}44`, borderRadius: 28, padding: '48px 32px', textAlign: 'center', position: 'relative', overflow: 'hidden', boxShadow: `0 24px 80px rgba(0,0,0,0.8), inset 0 0 0 1px ${G}22`, marginBottom: 64 }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg,transparent,${G},${OR},transparent)` }} />
            <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse 60% 60% at 50% 0%, rgba(245,184,65,0.08), transparent)` }} />
            
            <div style={{ fontSize: 80, lineHeight: 1, filter: `drop-shadow(0 0 40px ${G}88)`, marginBottom: 16, position: 'relative', zIndex: 2 }}>🏆</div>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.2em', color: G, marginBottom: 8, position: 'relative', zIndex: 2 }}>AUCTION CHAMPION</div>
            <h2 style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: 56, fontWeight: 700, color: 'white', marginBottom: 24, position: 'relative', zIndex: 2 }}>{champion.teamName}</h2>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap', position: 'relative', zIndex: 2 }}>
              <div style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid #333', borderRadius: 16, padding: '16px 24px', minWidth: 140 }}>
                <div style={{ fontSize: 10, color: '#666', fontWeight: 800, letterSpacing: '0.1em', marginBottom: 4 }}>OVERALL SCORE</div>
                <div style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: 36, fontWeight: 700, color: G }}>{champion.overallScore} <span style={{ fontSize: 18, color: '#555' }}>/100</span></div>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid #333', borderRadius: 16, padding: '16px 24px', minWidth: 140 }}>
                <div style={{ fontSize: 10, color: '#666', fontWeight: 800, letterSpacing: '0.1em', marginBottom: 4 }}>SQUAD SIZE</div>
                <div style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: 36, fontWeight: 700, color: 'white' }}>{champion.squad.length} <span style={{ fontSize: 18, color: '#555' }}>/{room.squadSize || 15}</span></div>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid #333', borderRadius: 16, padding: '16px 24px', minWidth: 140 }}>
                <div style={{ fontSize: 10, color: '#666', fontWeight: 800, letterSpacing: '0.1em', marginBottom: 4 }}>BUDGET SPENT</div>
                <div style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: 36, fontWeight: 700, color: EM }}>₹{champion.spent} <span style={{ fontSize: 18, color: '#555' }}>Cr</span></div>
              </div>
            </div>
            
            {/* Highlights for Champion */}
            {champion.squad.length > 0 && (() => {
              const bestPlayer = [...champion.squad].sort((a,b)=>b.rating-a.rating)[0];
              const bargain = [...champion.squad].sort((a,b)=>(b.rating/b.soldPrice) - (a.rating/a.soldPrice))[0];
              return (
                <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 32, flexWrap: 'wrap', position: 'relative', zIndex: 2 }}>
                  {bestPlayer && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.03)', border: `1px solid rgba(255,255,255,0.06)`, padding: '12px 20px', borderRadius: 14 }}>
                      <div style={{ fontSize: 20 }}>⭐</div>
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: 9, color: G, fontWeight: 800, letterSpacing: '0.1em' }}>STAR PLAYER</div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>{bestPlayer.name} ({bestPlayer.rating}★)</div>
                      </div>
                    </div>
                  )}
                  {bargain && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.03)', border: `1px solid rgba(255,255,255,0.06)`, padding: '12px 20px', borderRadius: 14 }}>
                      <div style={{ fontSize: 20 }}>💎</div>
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: 9, color: EM, fontWeight: 800, letterSpacing: '0.1em' }}>BEST BARGAIN</div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>{bargain.name} for ₹{bargain.soldPrice}Cr</div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </motion.div>
        )}

        {/* ALL TEAMS LEADERBOARD */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{ width: 4, height: 24, background: `linear-gradient(${G},${OR})`, borderRadius: 99 }} />
            <h2 style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: 28, fontWeight: 700, color: 'white' }}>Final Standings</h2>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {sortedUsers.map((u, i) => {
              const c = TEAM_COLORS[room.users.findIndex(x=>x.id===u.id) % TEAM_COLORS.length];
              const isExpanded = expanded === u.id;
              
              return (
                <motion.div key={u.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + (i*0.1) }}
                  style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid rgba(255,255,255,0.05)`, borderRadius: 20, overflow: 'hidden' }}>
                  
                  {/* Row Header */}
                  <div onClick={() => setExpanded(isExpanded ? null : u.id)}
                    style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 20, cursor: 'pointer', background: isExpanded ? 'rgba(255,255,255,0.02)' : 'transparent', transition: 'background 0.2s' }}>
                    <div style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: 24, fontWeight: 700, color: i===0 ? G : '#555', width: 30 }}>#{i+1}</div>
                    
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: `linear-gradient(135deg,${c[0]},${c[1]})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Rajdhani,sans-serif', fontSize: 16, fontWeight: 800, flexShrink: 0 }}>
                      {u.teamName.slice(0, 2).toUpperCase()}
                    </div>
                    
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: 22, fontWeight: 700, color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.teamName}</div>
                      <div style={{ fontSize: 12, color: '#666' }}>Manager: {u.name}</div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
                      <div style={{ textAlign: 'right', display: window.innerWidth < 768 ? 'none' : 'block' }}>
                        <div style={{ fontSize: 10, color: '#666', fontWeight: 800, letterSpacing: '0.05em' }}>PLAYERS</div>
                        <div style={{ fontSize: 18, fontWeight: 700, color: 'white' }}>{u.squad.length}</div>
                      </div>
                      <div style={{ textAlign: 'right', display: window.innerWidth < 768 ? 'none' : 'block' }}>
                        <div style={{ fontSize: 10, color: '#666', fontWeight: 800, letterSpacing: '0.05em' }}>SPENT</div>
                        <div style={{ fontSize: 18, fontWeight: 700, color: EM }}>₹{u.spent}Cr</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 10, color: G, fontWeight: 800, letterSpacing: '0.05em' }}>SCORE</div>
                        <div style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: 28, fontWeight: 700, color: G, lineHeight: 1 }}>{u.overallScore}</div>
                      </div>
                      <div style={{ fontSize: 18, color: '#444', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>▼</div>
                    </div>
                  </div>
                  
                  {/* Expanded Squad Details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                        <div style={{ padding: '0 24px 24px 24px', borderTop: '1px solid rgba(255,255,255,0.03)' }}>
                          <div style={{ marginTop: 24 }}>
                            <div style={{ fontSize: 11, fontWeight: 800, color: '#555', letterSpacing: '0.15em', marginBottom: 12, textTransform: 'uppercase' }}>Full Squad ({u.squad.length})</div>
                            
                            {u.squad.length === 0 ? (
                              <div style={{ padding: 24, textAlign: 'center', background: 'rgba(0,0,0,0.3)', borderRadius: 12, color: '#555', fontSize: 14 }}>No players purchased.</div>
                            ) : (
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
                                {[...u.squad].sort((a,b)=>b.rating - a.rating).map((p, idx) => (
                                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(0,0,0,0.4)', border: '1px solid #222', borderRadius: 12, padding: 12 }}>
                                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#111', border: `1px solid ${RC[p.role]||G}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>{p.name[0]}</div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                      <div style={{ fontSize: 14, fontWeight: 700, color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 3 }}>
                                        <span style={{ fontSize: 9, color: RC[p.role]||G, fontWeight: 800 }}>{p.role}</span>
                                        <span style={{ fontSize: 10, color: '#666' }}>{p.rating}★</span>
                                      </div>
                                    </div>
                                    <div style={{ fontSize: 13, fontWeight: 800, color: EM }}>₹{p.soldPrice}</div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* RESTART CTA */}
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <motion.button whileHover={{ scale: 1.05, boxShadow: `0 12px 40px ${G}44` }} whileTap={{ scale: 0.96 }}
            onClick={() => onRestart ? onRestart() : window.location.reload()}
            style={{ padding: '18px 48px', borderRadius: 16, border: 'none', background: `linear-gradient(135deg,${G},${OR})`, color: '#1a0900', fontWeight: 900, fontSize: 16, cursor: 'pointer', letterSpacing: '0.05em' }}>
            🔄 RETURN TO HOME
          </motion.button>
        </div>

      </div>
    </div>
  );
}
