import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Shield, Trophy, Users, Zap, CheckCircle, Search } from 'lucide-react';
import { Toast } from './Components.jsx';
import { TEAM_COLORS } from './data.js';

export default function LandingScreen({ onCreate, onJoin, onBack }) {
  const [name, setName] = useState('');
  const [team, setTeam] = useState('');
  const [roomId, setRoomId] = useState('');
  const [toast, setToast] = useState(null);
  const [tab, setTab] = useState('create'); // 'create' or 'join'

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
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, position: 'relative', overflow: 'hidden', fontFamily: 'Inter, sans-serif' }}>
      
      {/* RICH STADIUM BACKGROUND */}
      <div style={{ 
        position: 'absolute', inset: 0, 
        backgroundImage: `url('https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=2560&auto=format&fit=crop')`, 
        backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.4 
      }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 50%, rgba(10,15,30,0.5) 0%, rgba(5,8,15,0.95) 100%)' }} />
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

      {/* TOP NAVBAR (Logo and Online Stats) */}
      <div style={{ position: 'absolute', top: 32, left: 48, right: 48, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
           <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, #f5a623, #d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(245,166,35,0.4)' }}>
             <Trophy size={24} color="#111" fill="#111" />
           </div>
           <div>
             <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 24, fontWeight: 900, color: 'white', lineHeight: 1 }}>IPL AUCTION</div>
             <div style={{ fontSize: 14, fontWeight: 800, color: '#f5a623', letterSpacing: '0.1em' }}>2025</div>
           </div>
        </div>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(20,30,50,0.6)', border: '1px solid rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: 99, backdropFilter: 'blur(8px)' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
               <Users size={16} color="#16c784" />
               <span style={{ fontSize: 13, fontWeight: 800, color: 'white' }}>1.2K+</span>
             </div>
             <span style={{ fontSize: 10, fontWeight: 700, color: '#16c784', letterSpacing: '0.1em' }}>PLAYERS ONLINE</span>
           </div>
           <button style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '10px 20px', borderRadius: 12, fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
             <span style={{ border: '1px solid white', borderRadius: '50%', width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>?</span>
             HOW TO PLAY
           </button>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 0.5 }}
        style={{ width: '100%', maxWidth: 1100, display: 'flex', borderRadius: 24, overflow: 'hidden', position: 'relative', zIndex: 10, border: '1px solid rgba(255,166,35,0.2)', boxShadow: '0 30px 60px rgba(0,0,0,0.8), 0 0 100px rgba(245,166,35,0.1)' }}
      >
        {/* LEFT SECTION */}
        <div style={{ flex: 1.1, padding: '50px 48px', background: 'linear-gradient(135deg, rgba(10,15,35,0.95), rgba(5,8,20,0.95))', borderRight: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', backdropFilter: 'blur(20px)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#6366f1,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(99,102,241,0.4)' }}>
                🔨
              </div>
              <span style={{ fontWeight: 800, fontSize: 13, letterSpacing: '0.1em', color: '#818cf8' }}>IPL AUCTION 2025</span>
            </div>
            {onBack && (
              <button onClick={onBack} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: '#64748b', background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', marginBottom: 24 }}>← Back to Home</button>
            )}

            <h1 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 64, fontWeight: 800, lineHeight: 0.95, letterSpacing: '-0.02em', marginBottom: 24, color: 'white', textTransform: 'uppercase' }}>
              THE ULTIMATE<br />
              <span style={{ color: '#f5a623', textShadow: '0 0 30px rgba(245,166,35,0.4)' }}>CRICKET</span><br />
              STRATEGY
            </h1>
            
            <p style={{ color: '#8892a4', fontSize: 16, lineHeight: 1.6, maxWidth: 360, marginBottom: 40 }}>
              Build your dream franchise. Outsmart opponents in real-time bidding wars and claim the championship trophy.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {[
                { icon: <Shield size={20} color="#6366f1" />, title: 'Real-time multi-player bidding', desc: 'Live bidding with 15s countdown' },
                { icon: <Users size={20} color="#f5a623" />, title: 'Authentic 2025 player database', desc: '200+ players with real stats & roles' },
                { icon: <Trophy size={20} color="#16c784" />, title: 'Dynamic team strength scoring', desc: 'Build a balanced squad and dominate' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                  <div style={{ marginTop: 2 }}>{item.icon}</div>
                  <div>
                    <div style={{ color: 'white', fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{item.title}</div>
                    <div style={{ color: '#64748b', fontSize: 13, fontWeight: 500 }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 'auto', paddingTop: 40 }}>
            <div style={{ display: 'flex', marginLeft: 8 }}>
              {TEAM_COLORS.slice(0,4).map((c, i) => (
                <div key={i} style={{ width: 32, height: 32, borderRadius: '50%', background: `linear-gradient(135deg,${c[0]},${c[1]})`, border: '2px solid #0a0f23', marginLeft: -10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: 'white' }}>
                  {String.fromCharCode(65+i)}
                </div>
              ))}
            </div>
            <span style={{ color: '#64748b', fontSize: 13, fontWeight: 600 }}>+1.2K Players Online</span>
          </div>
        </div>

        {/* RIGHT SECTION (Form) */}
        <div style={{ flex: 1, padding: '50px 48px', background: 'linear-gradient(180deg, rgba(15,22,45,0.95), rgba(8,12,24,0.98))', display: 'flex', flexDirection: 'column', backdropFilter: 'blur(20px)' }}>
          <div style={{ marginBottom: 40 }}>
            <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 32, fontWeight: 800, color: 'white', marginBottom: 8, textTransform: 'uppercase' }}>Start Your Journey</h2>
            <p style={{ color: '#8892a4', fontSize: 14 }}>Create a room or join your friends' auction.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, flex: 1 }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Manager Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={18} color="#64748b" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, padding: '16px 16px 16px 44px', color: 'white', fontSize: 15, outline: 'none' }}
                    placeholder="e.g. Virat Kohli" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    onKeyDown={e => e.key === 'Enter' && (tab === 'create' ? handleCreate() : handleJoin())}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Franchise Name</label>
                <div style={{ position: 'relative' }}>
                  <Shield size={18} color="#f5a623" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, padding: '16px 16px 16px 44px', color: 'white', fontSize: 15, outline: 'none' }}
                    placeholder="e.g. Royal Challengers Bangalore" 
                    value={team} 
                    onChange={e => setTeam(e.target.value)} 
                    onKeyDown={e => e.key === 'Enter' && (tab === 'create' ? handleCreate() : handleJoin())}
                  />
                </div>
              </div>
            </div>

            {/* TAB TOGGLE */}
            <div style={{ display: 'flex', background: 'rgba(0,0,0,0.3)', borderRadius: 12, padding: 4, marginTop: 8 }}>
              <button 
                onClick={() => setTab('create')}
                style={{ flex: 1, padding: '14px 0', borderRadius: 10, border: 'none', background: tab === 'create' ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'transparent', color: tab === 'create' ? 'white' : '#64748b', fontWeight: 700, fontSize: 14, cursor: 'pointer', transition: '0.2s', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, boxShadow: tab === 'create' ? '0 4px 15px rgba(99,102,241,0.3)' : 'none' }}>
                <Users size={16} /> Host Room
              </button>
              <button 
                onClick={() => setTab('join')}
                style={{ flex: 1, padding: '14px 0', borderRadius: 10, border: 'none', background: tab === 'join' ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'transparent', color: tab === 'join' ? 'white' : '#64748b', fontWeight: 700, fontSize: 14, cursor: 'pointer', transition: '0.2s', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, boxShadow: tab === 'join' ? '0 4px 15px rgba(99,102,241,0.3)' : 'none' }}>
                <Search size={16} /> Join via ID
              </button>
            </div>

            {/* ACTION AREA */}
            <div style={{ marginTop: 'auto' }}>
              <AnimatePresence mode="wait">
                {tab === 'join' && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ marginBottom: 20 }}>
                    <div style={{ position: 'relative' }}>
                      <Zap size={18} color="#6366f1" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }} />
                      <input 
                        style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, padding: '16px 16px 16px 44px', color: 'white', fontSize: 15, outline: 'none', textTransform: 'uppercase' }}
                        placeholder="ENTER 6-DIGIT ROOM CODE" 
                        value={roomId} 
                        onChange={e => setRoomId(e.target.value.toUpperCase())} 
                        onKeyDown={e => e.key === 'Enter' && handleJoin()}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <button 
                onClick={tab === 'create' ? handleCreate : handleJoin}
                style={{ width: '100%', padding: '18px 0', borderRadius: 14, background: 'linear-gradient(135deg, #f5a623, #d97706)', border: 'none', color: '#111', fontWeight: 900, fontSize: 16, cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, boxShadow: '0 10px 30px rgba(245,166,35,0.4)', transition: '0.2s' }}>
                {tab === 'create' ? <><Trophy size={20} /> CREATE AUCTION ROOM &gt;</> : 'JOIN ROOM &gt;'}
              </button>
              <div style={{ textAlign: 'center', color: '#64748b', fontSize: 12, marginTop: 16, fontWeight: 500 }}>
                {tab === 'create' ? 'You will be the host and can start the auction.' : 'Enter the host\'s code to join their room.'}
              </div>
            </div>

            {/* BOTTOM STATS */}
            <div style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: 16, marginTop: 16 }}>
               <div style={{ textAlign: 'center' }}>
                 <Users size={20} color="#f5a623" style={{ margin: '0 auto 6px' }} />
                 <div style={{ fontSize: 16, fontWeight: 800, color: 'white' }}>200+</div>
                 <div style={{ fontSize: 9, color: '#64748b', fontWeight: 700, letterSpacing: '0.05em' }}>IPL PLAYERS</div>
               </div>
               <div style={{ width: 1, background: 'rgba(255,255,255,0.1)' }} />
               <div style={{ textAlign: 'center' }}>
                 <Shield size={20} color="#6366f1" style={{ margin: '0 auto 6px' }} />
                 <div style={{ fontSize: 16, fontWeight: 800, color: 'white' }}>8</div>
                 <div style={{ fontSize: 9, color: '#64748b', fontWeight: 700, letterSpacing: '0.05em' }}>TEAMS MAX</div>
               </div>
               <div style={{ width: 1, background: 'rgba(255,255,255,0.1)' }} />
               <div style={{ textAlign: 'center' }}>
                 <div style={{ fontSize: 16, color: '#16c784', fontWeight: 900, marginBottom: 6 }}>₹</div>
                 <div style={{ fontSize: 16, fontWeight: 800, color: 'white' }}>₹150Cr</div>
                 <div style={{ fontSize: 9, color: '#64748b', fontWeight: 700, letterSpacing: '0.05em' }}>PURSE PER TEAM</div>
               </div>
            </div>

          </div>
        </div>
      </motion.div>

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
