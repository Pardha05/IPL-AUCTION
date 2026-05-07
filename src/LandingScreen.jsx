import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, LogIn, Users, Zap, ShieldCheck } from 'lucide-react';
import { Toast } from './Components.jsx';
import { TEAM_COLORS } from './data.js';

export default function LandingScreen({ onCreate, onJoin }) {
  const [name, setName] = useState('');
  const [team, setTeam] = useState('');
  const [roomId, setRoomId] = useState('');
  const [toast, setToast] = useState(null);
  const [tab, setTab] = useState('create');

  const showError = (msg) => { setToast({ msg, type: 'error' }); setTimeout(() => setToast(null), 4000); };

  const handleCreate = () => {
    if (!name.trim() || !team.trim()) return showError('Enter your name and team name.');
    onCreate(name.trim(), team.trim());
  };

  const handleJoin = () => {
    if (!name.trim() || !team.trim() || !roomId.trim()) return showError('All fields are required.');
    onJoin(name.trim(), team.trim(), roomId.trim().toUpperCase());
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, position: 'relative', overflow: 'hidden' }}>
      <div className="stadium-bg" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="glass-elevated mobile-stack"
        style={{ width: '100%', maxWidth: 1000, display: 'flex', borderRadius: 24, overflow: 'hidden', position: 'relative', zIndex: 10 }}
      >
        {/* Left hero section */}
        <div className="mobile-hidden" style={{ flex: 1.2, padding: '60px 50px', background: 'rgba(13,18,36,0.5)', borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#6366f1,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(99,102,241,0.3)' }}>
                <Zap size={20} color="white" fill="white" />
              </div>
              <span style={{ fontWeight: 800, fontSize: 13, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#818cf8' }}>IPL AUCTION 2025</span>
            </div>
            
            <h1 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 68, fontWeight: 700, lineHeight: 1, letterSpacing: '-0.02em', marginBottom: 24, color: 'white' }}>
              THE ULTIMATE<br />
              <span className="text-gradient-primary">CRICKET</span><br />
              STRATEGY
            </h1>
            
            <p style={{ color: '#8892a4', fontSize: 17, lineHeight: 1.6, maxWidth: 360, marginBottom: 40 }}>
              Build your dream franchise. Outsmart opponents in real-time bidding wars and claim the championship trophy.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { icon: <ShieldCheck size={18} color="#16c784" />, text: 'Real-time multi-player bidding' },
                { icon: <ShieldCheck size={18} color="#16c784" />, text: 'Authentic 2025 player database' },
                { icon: <ShieldCheck size={18} color="#16c784" />, text: 'Dynamic team strength scoring' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#f0f2f5', fontSize: 14, fontWeight: 500 }}>
                  {item.icon} {item.text}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ display: 'flex', marginLeft: 8 }}>
              {TEAM_COLORS.slice(0,4).map((c, i) => (
                <div key={i} style={{ width: 34, height: 34, borderRadius: '50%', background: `linear-gradient(135deg,${c[0]},${c[1]})`, border: '2px solid #0d1224', marginLeft: -10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: 'white' }}>
                  {String.fromCharCode(65+i)}
                </div>
              ))}
            </div>
            <span style={{ color: '#4a5568', fontSize: 13, fontWeight: 600 }}>1.2k Players Online</span>
          </div>
        </div>

        {/* Right form section */}
        <div className="responsive-padding" style={{ flex: 1, padding: '60px 50px', background: 'rgba(8,12,24,0.4)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: 40 }}>
            <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 32, fontWeight: 700, color: 'white', marginBottom: 8 }}>Start Your Journey</h2>
            <p style={{ color: '#8892a4', fontSize: 14 }}>Create a room or join your friends' auction.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, flex: 1 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label className="input-label">Manager Name</label>
                <input 
                  className="input" 
                  placeholder="e.g. Virat Kohli" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  onKeyDown={e => e.key === 'Enter' && (tab === 'create' ? handleCreate() : handleJoin())}
                />
              </div>
              <div>
                <label className="input-label">Franchise Name</label>
                <input 
                  className="input" 
                  placeholder="e.g. Royal Challengers Bangalore" 
                  value={team} 
                  onChange={e => setTeam(e.target.value)} 
                  onKeyDown={e => e.key === 'Enter' && (tab === 'create' ? handleCreate() : handleJoin())}
                />
              </div>
            </div>

            {/* Tab Switcher */}
            <div style={{ display: 'flex', gap: 6, padding: 4, background: 'rgba(0,0,0,0.2)', borderRadius: 14, border: '1px solid rgba(255,255,255,0.05)' }}>
              {['create', 'join'].map(t => (
                <button 
                  key={t} 
                  onClick={() => setTab(t)}
                  style={{ 
                    flex: 1, padding: '12px 0', border: 'none', borderRadius: 11, cursor: 'pointer', 
                    fontFamily: 'Inter,sans-serif', fontWeight: 700, fontSize: 13, transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                    background: tab === t ? 'linear-gradient(135deg,#6366f1,#4f46e5)' : 'transparent',
                    color: tab === t ? 'white' : '#8892a4',
                    boxShadow: tab === t ? '0 10px 20px rgba(79,70,229,0.25)' : 'none'
                  }}
                >
                  {t === 'create' ? 'Host New Room' : 'Join via ID'}
                </button>
              ))}
            </div>

            <div style={{ marginTop: 'auto' }}>
              <AnimatePresence mode="wait">
                {tab === 'create' ? (
                  <motion.div
                    key="create"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={handleCreate}>
                      <PlusCircle size={20} /> Create Auction Room
                    </button>
                    <p style={{ textAlign: 'center', fontSize: 12, color: '#4a5568', marginTop: 16 }}>
                      You will be the host and can start the auction.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="join"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
                  >
                    <input 
                      className="input" 
                      placeholder="ENTER ROOM CODE" 
                      value={roomId} 
                      onChange={e => setRoomId(e.target.value.toUpperCase())}
                      style={{ textAlign: 'center', fontFamily: 'monospace', letterSpacing: '0.3em', fontSize: 22, fontWeight: 700, color: '#fbbf24', borderColor: roomId ? 'rgba(251,191,36,0.3)' : '' }}
                      onKeyDown={e => e.key === 'Enter' && handleJoin()}
                    />
                    <button className="btn btn-green btn-lg" style={{ width: '100%' }} onClick={handleJoin}>
                      <LogIn size={20} /> Join Arena
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Background Decorative elements */}
      <div style={{ position: 'absolute', top: '10%', left: '5%', width: 300, height: 300, background: 'rgba(99,102,241,0.05)', filter: 'blur(100px)', borderRadius: '50%' }} />
      <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: 400, height: 400, background: 'rgba(124,58,237,0.05)', filter: 'blur(120px)', borderRadius: '50%' }} />

      <AnimatePresence>
        {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  );
}
