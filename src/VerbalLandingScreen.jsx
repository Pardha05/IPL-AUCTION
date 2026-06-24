import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Users, Trophy, Zap } from 'lucide-react';

const G = '#F5B841', OR = '#FF6B35', EM = '#00C896', BG = '#050505';

const FLOAT_PLAYERS_LEFT = [
  { name: 'VIRAT KOHLI', role: 'BATTER', rat: 95, price: '₹22Cr', nat: 'IN', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2024/164.png', top: '15%', left: '4%' },
  { name: 'JASPRIT BUMRAH', role: 'BOWLER', rat: 96, price: '₹22Cr', nat: 'IN', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2024/1124.png', top: '42%', left: '2%' },
  { name: 'MS DHONI', role: 'WICKETKEEPER', rat: 94, price: '₹2Cr', nat: 'IN', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2024/1.png', bottom: '15%', left: '4%' },
];

const FLOAT_PLAYERS_RIGHT = [
  { name: 'RASHID KHAN', role: 'BOWLER', rat: 93, price: '₹22Cr', nat: 'AF', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2024/2885.png', top: '15%', right: '4%' },
  { name: 'AB DE VILLIERS', role: 'BATTER', rat: 93, price: '₹22Cr', nat: 'ZA', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2024/233.png', top: '42%', right: '2%' },
  { name: 'HARDIK PANDYA', role: 'ALL-ROUNDER', rat: 88, price: '₹15Cr', nat: 'IN', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2024/2740.png', bottom: '15%', right: '4%' },
];

const RC = { 'BATTER': '#3b82f6', 'BOWLER': '#ef4444', 'ALL-ROUNDER': '#a855f7', 'WICKETKEEPER': '#f5a623' };

function FloatCard({ p, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: p.left ? -50 : 50 }}
      animate={{ opacity: 1, x: 0, y: [0, -8, 0] }}
      transition={{ 
        opacity: { duration: 0.8, delay }, 
        x: { duration: 0.8, delay }, 
        y: { duration: 4, repeat: Infinity, ease: 'easeInOut', delay } 
      }}
      style={{ 
        position: 'absolute', top: p.top, left: p.left, right: p.right, bottom: p.bottom, 
        width: 280, height: 110, background: 'rgba(10,12,18,0.85)', border: `1px solid rgba(245,184,65,0.4)`, 
        borderRadius: 16, backdropFilter: 'blur(16px)', boxShadow: `0 20px 40px rgba(0,0,0,0.8), inset 0 0 20px rgba(245,184,65,0.05)`, 
        zIndex: 10, display: 'flex', overflow: 'hidden'
      }}
    >
      {/* Country Badge */}
      <div style={{ position: 'absolute', top: 12, left: 12, width: 28, height: 28, borderRadius: '50%', background: `linear-gradient(135deg,${G},${OR})`, color: '#111', fontSize: 11, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5, boxShadow: `0 4px 10px rgba(0,0,0,0.5)` }}>
        {p.nat}
      </div>

      {/* Player Image area */}
      <div style={{ width: 110, position: 'relative', background: 'radial-gradient(circle at 50% 100%, rgba(245,184,65,0.15), transparent)' }}>
        <img src={p.img} alt={p.name} style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', height: '110%', objectFit: 'contain', filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.8))' }} onError={e=>e.target.style.display='none'} />
      </div>

      {/* Player Info area */}
      <div style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 800, fontSize: 16, color: 'white', lineHeight: 1, marginBottom: 6 }}>{p.name}</div>
        <div style={{ display: 'inline-flex', fontSize: 9, fontWeight: 800, color: RC[p.role], background: `${RC[p.role]}15`, padding: '3px 8px', borderRadius: 6, border: `1px solid ${RC[p.role]}33`, marginBottom: 'auto', letterSpacing: '0.05em', alignSelf: 'flex-start' }}>
          {p.role}
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: 11, color: '#888', fontWeight: 700 }}>OVR</span>
            <span style={{ fontSize: 16, color: 'white', fontWeight: 900 }}>{p.rat}</span>
          </div>
          <div style={{ fontSize: 14, color: EM, fontWeight: 800 }}>{p.price}</div>
        </div>
      </div>
    </motion.div>
  );
}

export default function VerbalLandingScreen({ onCreate, onJoin, onBack }) {
  const [modal, setModal] = useState(null); // 'create' | 'join'
  const [form, setForm] = useState({ hostName: '', auctionName: '', budget: '150', squad: '15', maxTeams: '8', customBudget: '' });
  const [joinForm, setJoinForm] = useState({ code: '', managerName: '', franchiseName: '' });
  const [err, setErr] = useState('');

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const setJ = (k, v) => setJoinForm(p => ({ ...p, [k]: v }));

  const handleCreate = () => {
    if (!form.hostName.trim() || !form.auctionName.trim()) return setErr('Host name and auction name are required.');
    setErr('');
    const budget = form.budget === 'custom' ? parseFloat(form.customBudget) || 150 : parseFloat(form.budget);
    onCreate(form.hostName.trim(), form.auctionName.trim(), budget, parseInt(form.squad), parseInt(form.maxTeams));
  };

  const handleJoin = () => {
    if (!joinForm.code.trim() || !joinForm.managerName.trim() || !joinForm.franchiseName.trim()) return setErr('All fields required.');
    setErr('');
    onJoin(joinForm.managerName.trim(), joinForm.franchiseName.trim(), joinForm.code.trim().toUpperCase());
  };

  return (
    <div style={{ background: BG, minHeight: '100vh', overflow: 'hidden', position: 'relative', fontFamily: 'Inter,sans-serif', color: 'white' }}>

      {/* STADIUM BACKGROUND */}
      <div style={{ 
        position: 'absolute', inset: 0, 
        backgroundImage: `url('https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=2560&auto=format&fit=crop')`, 
        backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.35 
      }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 50%, transparent 10%, #050505 85%)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(5,5,5,0.7) 0%, transparent 40%, rgba(5,5,5,0.9) 80%, #050505 100%)' }} />

      {/* TOP NAV */}
      <nav style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '24px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: `linear-gradient(135deg,${G},${OR})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, boxShadow: `0 0 20px rgba(245,184,65,0.4)` }}>🔨</div>
          <div>
            <div style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 900, fontSize: 24, lineHeight: 1, letterSpacing: '0.05em' }}>IPL AUCTION</div>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.2em', color: G }}>VERBAL MODE</div>
          </div>
        </div>
        {onBack && (
          <button onClick={onBack} style={{ fontSize: 13, fontWeight: 700, color: '#aaa', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 20px', borderRadius: 8, cursor: 'pointer', transition: '0.2s', ':hover': {background: 'rgba(255,255,255,0.1)'} }}>← Back</button>
        )}
      </nav>

      {/* HERO */}
      <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: 60, zIndex: 10 }}>
        
        {/* PLAYER CARDS */}
        {FLOAT_PLAYERS_LEFT.map((p, i) => <FloatCard key={`l-${i}`} p={p} delay={i * 0.2} />)}
        {FLOAT_PLAYERS_RIGHT.map((p, i) => <FloatCard key={`r-${i}`} p={p} delay={0.1 + i * 0.2} />)}

        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
          style={{ textAlign: 'center', position: 'relative', zIndex: 5, maxWidth: 820, padding: '0 24px' }}>

          {/* BACKGROUND TROPHY SILHOUETTE */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: 400, color: 'rgba(245,184,65,0.05)', zIndex: -1, pointerEvents: 'none', filter: 'blur(8px)' }}>🏆</div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: `rgba(20,20,20,0.6)`, border: `1px solid rgba(245,184,65,0.3)`, borderRadius: 99, padding: '8px 24px', marginBottom: 28, backdropFilter: 'blur(8px)' }}>
            <Users size={14} color={G} />
            <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.15em', color: G }}>HOST-CONTROLLED · IN-PERSON AUCTION</span>
          </motion.div>

          <h1 style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: 110, fontWeight: 900, lineHeight: 0.85, letterSpacing: '-0.02em', marginBottom: 28, textTransform: 'uppercase' }}>
            <div style={{ color: 'white' }}>BUILD YOUR</div>
            <div style={{ background: `linear-gradient(135deg,${G} 0%,${OR} 60%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: `drop-shadow(0 0 40px rgba(245,184,65,0.5))` }}>DYNASTY</div>
          </h1>

          <p style={{ fontSize: 16, color: '#aaa', lineHeight: 1.6, maxWidth: 500, margin: '0 auto 40px', fontWeight: 500 }}>
            Host professional IPL-style auctions with friends, clubs and events. You control the room — they compete for glory.
          </p>

          <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
            <motion.button whileHover={{ scale: 1.05, boxShadow: `0 16px 50px rgba(245,184,65,0.4)` }} whileTap={{ scale: 0.97 }}
              onClick={() => { setModal('create'); setErr(''); }}
              style={{ padding: '16px 32px', borderRadius: 12, border: 'none', background: `linear-gradient(135deg,${G},${OR})`, color: '#1a0900', cursor: 'pointer', boxShadow: `0 8px 32px rgba(245,184,65,0.3)`, display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 20 }}>🔨</span>
              <div style={{ textAlign: 'left' }}>
                 <div style={{ fontSize: 15, fontWeight: 900, lineHeight: 1 }}>CREATE AUCTION ROOM</div>
                 <div style={{ fontSize: 10, fontWeight: 700, opacity: 0.8, marginTop: 4 }}>Start a new verbal auction</div>
              </div>
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
              onClick={() => { setModal('join'); setErr(''); }}
              style={{ padding: '16px 32px', borderRadius: 12, border: `1px solid rgba(245,184,65,0.3)`, background: 'rgba(20,20,20,0.6)', color: G, cursor: 'pointer', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', gap: 12 }}>
              <Users size={20} color={G} />
              <div style={{ textAlign: 'left' }}>
                 <div style={{ fontSize: 15, fontWeight: 900, lineHeight: 1 }}>JOIN VIA ROOM CODE</div>
                 <div style={{ fontSize: 10, fontWeight: 600, opacity: 0.8, marginTop: 4, color: '#aaa' }}>Enter code to join a room</div>
              </div>
            </motion.button>
          </div>

          {/* Stats Bar */}
          <div style={{ display: 'inline-flex', gap: 48, justifyContent: 'center', marginTop: 48, background: 'rgba(10,10,10,0.6)', border: '1px solid rgba(255,255,255,0.1)', padding: '24px 48px', borderRadius: 24, backdropFilter: 'blur(10px)' }}>
            {[{i: <Users size={24} color={G}/>, v: '200+', l: 'IPL Players'}, {i: <Shield size={24} color={G}/>, v: '8', l: 'Teams Max'}, {i: <span style={{fontSize:24,color:G,fontWeight:900,lineHeight:1}}>₹</span>, v: '₹150Cr', l: 'Per Team'}, {i: <Trophy size={24} color={G}/>, v: 'Host', l: 'In Control'}].map((item, idx) => (
              <div key={idx} style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ marginBottom: 8 }}>{item.i}</div>
                <div style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: 28, fontWeight: 800, color: 'white', lineHeight: 1 }}>{item.v}</div>
                <div style={{ fontSize: 9, color: '#888', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 6 }}>{item.l}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* BOTTOM INFO BAR */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', background: 'linear-gradient(to top, rgba(5,5,5,0.95), rgba(10,10,10,0.8))', borderTop: '1px solid rgba(255,255,255,0.05)', zIndex: 50, backdropFilter: 'blur(10px)' }}>
        {[
          { icon: <Shield size={28} color="#3b82f6" />, title: 'HOST CONTROLLED', desc: 'You decide the price and winning team.' },
          { icon: <Users size={28} color="#ef4444" />, title: 'IN-PERSON EXPERIENCE', desc: 'Perfect for local events, clubs & gatherings.' },
          { icon: <Trophy size={28} color="#f5a623" />, title: 'REAL IPL FEEL', desc: 'Professional auction setup with live excitement.' },
          { icon: <Zap size={28} color="#3b82f6" />, title: 'FAST & EASY', desc: 'Smooth flow, simple controls for the host.' }
        ].map((feat, i) => (
          <div key={i} style={{ padding: '32px 40px', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.03)' : 'none', display: 'flex', gap: 16, alignItems: 'center' }}>
            <div style={{ opacity: 0.8 }}>{feat.icon}</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: 'white', marginBottom: 4, letterSpacing: '0.05em' }}>{feat.title}</div>
              <div style={{ fontSize: 11, color: '#666', lineHeight: 1.5, fontWeight: 500 }}>{feat.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* MODALS */}
      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setModal(null)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)', padding: 24 }}>
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              onClick={e => e.stopPropagation()}
              style={{ background: '#111', border: `1px solid ${G}33`, borderRadius: 24, padding: '36px', width: '100%', maxWidth: modal === 'create' ? 540 : 440, position: 'relative', overflow: 'hidden', boxShadow: `0 40px 120px rgba(0,0,0,0.8), 0 0 0 1px ${G}11` }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,transparent,${G},${OR},transparent)` }} />

              {modal === 'create' ? (
                <>
                  <div style={{ marginBottom: 28 }}>
                    <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.2em', color: G, marginBottom: 8 }}>NEW AUCTION</div>
                    <h2 style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: 32, fontWeight: 700, color: 'white' }}>Create Auction Room</h2>
                    <p style={{ fontSize: 13, color: '#888', marginTop: 6 }}>You'll be the host and control the entire auction.</p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {[['hostName', 'Host Name', 'e.g. Rahul Dravid'], ['auctionName', 'Auction Name', 'e.g. IPL 2025 — Office League']].map(([k, label, ph]) => (
                      <div key={k}>
                        <label style={LBL}>{label}</label>
                        <input style={INP} placeholder={ph} value={form[k]} onChange={e => set(k, e.target.value)} />
                      </div>
                    ))}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                      <div>
                        <label style={LBL}>Budget Per Team</label>
                        <select style={INP} value={form.budget} onChange={e => set('budget', e.target.value)}>
                          <option value="150">₹150 Crore</option>
                          <option value="200">₹200 Crore</option>
                          <option value="custom">Custom</option>
                        </select>
                      </div>
                      <div>
                        <label style={LBL}>Max Squad Size</label>
                        <select style={INP} value={form.squad} onChange={e => set('squad', e.target.value)}>
                          <option value="11">11 Players</option>
                          <option value="15">15 Players</option>
                          <option value="18">18 Players</option>
                        </select>
                      </div>
                    </div>

                    {form.budget === 'custom' && (
                      <div>
                        <label style={LBL}>Custom Budget (Crore)</label>
                        <input style={INP} type="number" placeholder="e.g. 250" value={form.customBudget} onChange={e => set('customBudget', e.target.value)} />
                      </div>
                    )}

                    <div>
                      <label style={LBL}>Max Teams</label>
                      <select style={INP} value={form.maxTeams} onChange={e => set('maxTeams', e.target.value)}>
                        {[2, 3, 4, 5, 6, 7, 8].map(n => <option key={n} value={n}>{n} Teams</option>)}
                      </select>
                    </div>

                    {err && <div style={{ fontSize: 12, color: '#f87171', fontWeight: 600, padding: '8px 12px', background: 'rgba(239,68,68,0.08)', borderRadius: 8, border: '1px solid rgba(239,68,68,0.2)' }}>{err}</div>}

                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleCreate}
                      style={{ width: '100%', padding: '17px 0', borderRadius: 14, border: 'none', background: `linear-gradient(135deg,${G},${OR})`, color: '#1a0900', fontWeight: 900, fontSize: 16, cursor: 'pointer', letterSpacing: '0.06em', boxShadow: `0 8px 30px rgba(245,184,65,0.4)`, marginTop: 4 }}>
                      🏏 CREATE AUCTION
                    </motion.button>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ marginBottom: 28 }}>
                    <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.2em', color: G, marginBottom: 8 }}>JOIN ROOM</div>
                    <h2 style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: 32, fontWeight: 700, color: 'white' }}>Enter Auction Room</h2>
                    <p style={{ fontSize: 13, color: '#888', marginTop: 6 }}>Get the room code from your host.</p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                      <label style={LBL}>Room Code</label>
                      <input style={{ ...INP, textAlign: 'center', letterSpacing: '0.3em', fontSize: 22, fontWeight: 800, color: G, borderColor: joinForm.code ? `rgba(245,184,65,0.4)` : 'rgba(255,255,255,0.1)' }}
                        placeholder="A1B2C3" value={joinForm.code} onChange={e => setJ('code', e.target.value.toUpperCase())} />
                    </div>
                    {[['managerName', 'Manager Name', 'e.g. Rohit Sharma'], ['franchiseName', 'Franchise Name', 'e.g. Mumbai Indians']].map(([k, label, ph]) => (
                      <div key={k}>
                        <label style={LBL}>{label}</label>
                        <input style={INP} placeholder={ph} value={joinForm[k]} onChange={e => setJ(k, e.target.value)} />
                      </div>
                    ))}

                    {err && <div style={{ fontSize: 12, color: '#f87171', fontWeight: 600, padding: '8px 12px', background: 'rgba(239,68,68,0.08)', borderRadius: 8, border: '1px solid rgba(239,68,68,0.2)' }}>{err}</div>}

                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleJoin}
                      style={{ width: '100%', padding: '17px 0', borderRadius: 14, border: 'none', background: `linear-gradient(135deg,${EM},#00a07a)`, color: '#002218', fontWeight: 900, fontSize: 16, cursor: 'pointer', letterSpacing: '0.06em', boxShadow: `0 8px 30px rgba(0,200,150,0.3)`, marginTop: 4 }}>
                      🔗 JOIN ROOM
                    </motion.button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const LBL = { display: 'block', fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888', marginBottom: 8 };
const INP = { width: '100%', padding: '14px 16px', borderRadius: 12, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontFamily: 'Inter,sans-serif', fontSize: 14, fontWeight: 600, outline: 'none', boxSizing: 'border-box' };
