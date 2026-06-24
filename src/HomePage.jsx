import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const GOLD = '#F5B841';
const ORANGE = '#FF6B35';
const CRIMSON = '#C1121F';
const EMERALD = '#00C896';

const playersLeft = [
  { name: 'V. Kohli', role: 'BAT', rating: '95+', nat: 'IN', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2024/164.png' },
  { name: 'J. Bumrah', role: 'BOWL', rating: '96+', nat: 'IN', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2024/1124.png' },
  { name: 'H. Pandya', role: 'AR', rating: '88+', nat: 'IN', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2024/2740.png' },
];
const playersRight = [
  { name: 'Rashid K.', role: 'BOWL', rating: '93+', nat: 'AF', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2024/2885.png' },
  { name: 'AB de V.', role: 'BAT', rating: '93+', nat: 'ZA', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2024/233.png' },
  { name: 'MS Dhoni', role: 'WK', rating: '94+', nat: 'IN', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2024/1.png' },
];

const feats = [
  { icon: '🏏', title: 'Real-Time Auctions', desc: 'Bid against friends in live real-time rooms with countdown timers.', glow: GOLD },
  { icon: '👥', title: 'Multiplayer Rooms', desc: 'Create private rooms. Invite up to 8 teams. Your rules.', glow: ORANGE },
  { icon: '💰', title: '₹150 Crore Budget', desc: 'Every team starts equal. How you spend it decides the champion.', glow: EMERALD },
  { icon: '🧠', title: 'Smart Ratings', desc: 'Every squad gets a real-time strength score based on player ratings.', glow: '#818cf8' },
  { icon: '🏆', title: 'Live Leaderboard', desc: 'Watch rankings change in real-time as players are auctioned.', glow: CRIMSON },
  { icon: '⚡', title: 'Verbal Mode', desc: 'Host-led manual auction. Perfect for in-person group battles.', glow: GOLD },
];

const steps = [
  { n: '01', title: 'Create Room', desc: 'Host creates an auction room and shares the code.' },
  { n: '02', title: 'Invite Friends', desc: 'Up to 8 team owners join with their franchise names.' },
  { n: '03', title: 'Auction Battle', desc: 'Outbid rivals. 15-second timer. Maximum pressure.' },
  { n: '04', title: 'Crown Champion', desc: 'Highest-rated squad wins the IPL Auction trophy.' },
];

function Counter({ target, suffix = '' }) {
  const [val, setVal] = useState(0);
  const ref = useRef();
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let start = 0;
        const step = target / 60;
        const t = setInterval(() => {
          start = Math.min(start + step, target);
          setVal(Math.floor(start));
          if (start >= target) clearInterval(t);
        }, 16);
      }
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref}>{val}{suffix}</span>;
}

function FloatingCard({ player, style, delay }) {
  const [err, setErr] = useState(false);
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: [0, -10, 0] }}
      transition={{ opacity: { delay, duration: 0.8 }, y: { duration: 4, repeat: Infinity, ease: 'easeInOut', delay } }}
      style={{
        position: 'absolute',
        width: 140,
        background: 'rgba(10, 10, 10, 0.7)',
        backdropFilter: 'blur(12px)',
        border: `1px solid rgba(245,184,65,0.4)`,
        borderRadius: 16,
        padding: '12px 12px 16px 12px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.8), inset 0 0 20px rgba(245,184,65,0.05)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 20,
        ...style
      }}
    >
      <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
        <div style={{ 
          position: 'absolute', top: -10, left: -10, width: 24, height: 24, borderRadius: '50%', 
          background: `linear-gradient(135deg, ${GOLD}, ${ORANGE})`, color: 'black', 
          fontSize: 10, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 
        }}>{player.nat}</div>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,107,53,0.15), transparent)', display: 'flex', alignItems: err ? 'center' : 'flex-end', justifyContent: 'center', overflow: 'hidden' }}>
           {!err ? (
             <img src={player.img} alt={player.name} style={{ height: '90%', objectFit: 'contain' }} onError={() => setErr(true)} />
           ) : (
             <div style={{ fontSize: 24, fontWeight: 900, color: GOLD }}>{player.name.split(' ').map(x=>x[0]).join('').slice(0,2)}</div>
           )}
        </div>
      </div>
      <div style={{ fontSize: 14, fontWeight: 800, color: 'white', marginTop: 12, textAlign: 'center' }}>{player.name}</div>
      <div style={{ fontSize: 11, fontWeight: 700, color: GOLD, marginTop: 4 }}>{player.rating} • {player.role}</div>
    </motion.div>
  );
}

export default function HomePage({ onSelectMode }) {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 150]);

  return (
    <div style={{ backgroundColor: '#050505', fontFamily: 'Inter, sans-serif', overflowX: 'hidden', color: 'white' }}>
      
      {/* ========================================================
          HERO SECTION
          ======================================================== */}
      <div style={{ position: 'relative', minHeight: '100vh', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        
        {/* BACKGROUND STADIUM */}
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
            <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(20,20,20,0.8)', border: `1px solid rgba(245,184,65,0.3)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
              🔨
            </div>
            <div>
              <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 20, fontWeight: 900, color: 'white', letterSpacing: '0.05em', lineHeight: 1 }}>IPL AUCTION</div>
              <div style={{ fontSize: 10, fontWeight: 800, color: GOLD, letterSpacing: '0.2em' }}>GAME</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <button onClick={() => onSelectMode('normal')} style={{ padding: '10px 24px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontWeight: 700, fontSize: 14, cursor: 'pointer', transition: '0.2s', ':hover': {background: 'rgba(255,255,255,0.1)'} }}>Join Room</button>
            <button onClick={() => onSelectMode('normal')} style={{ padding: '10px 24px', borderRadius: 8, background: `linear-gradient(135deg, ${GOLD}, ${ORANGE})`, border: 'none', color: '#111', fontWeight: 800, fontSize: 14, cursor: 'pointer', boxShadow: `0 4px 15px rgba(255,107,53,0.4)` }}>Create Room &gt;</button>
          </div>
        </nav>

        {/* HERO CONTENT */}
        <motion.div style={{ y: heroY, display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10, paddingTop: 40 }}>
          
          {/* NOW LIVE PILL */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(20,20,20,0.6)', border: '1px solid rgba(255,255,255,0.1)', padding: '6px 20px', borderRadius: 99, marginBottom: 24, backdropFilter: 'blur(8px)' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#00C896', boxShadow: '0 0 10px #00C896' }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#aaa', letterSpacing: '0.1em' }}>SEASON 2025 — <span style={{ color: GOLD }}>NOW LIVE</span></span>
          </motion.div>

          {/* MAIN TITLE */}
          <motion.h1 initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }}
            style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 'clamp(64px, 8vw, 120px)', fontWeight: 900, lineHeight: 0.85, textAlign: 'center', margin: 0, textTransform: 'uppercase' }}>
            <div style={{ color: 'white' }}>BUILD YOUR</div>
            <div style={{ background: `linear-gradient(135deg, ${GOLD}, ${ORANGE})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 0 40px rgba(255,107,53,0.5))' }}>DYNASTY</div>
          </motion.h1>

          {/* SUBTITLE */}
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.4 }}
            style={{ fontSize: 16, color: '#aaa', textAlign: 'center', maxWidth: 600, marginTop: 32, lineHeight: 1.6, fontWeight: 500 }}>
            Create your IPL franchise. Outbid rivals in real-time auctions.<br/>Crown the ultimate auction champion.
          </motion.p>

          {/* BUTTONS */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }}
            style={{ display: 'flex', gap: 20, marginTop: 40, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button onClick={() => onSelectMode('normal')} style={{ padding: '16px 32px', borderRadius: 12, background: `linear-gradient(135deg, ${GOLD}, ${ORANGE})`, border: 'none', color: '#111', fontWeight: 800, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16, boxShadow: `0 10px 40px rgba(255,107,53,0.4)`, transition: '0.2s', transform: 'scale(1)' }}>
              <span style={{ fontSize: 20 }}>🔨</span>
              <div style={{ textAlign: 'left' }}>
                 <div style={{ lineHeight: 1 }}>CREATE AUCTION ROOM</div>
                 <div style={{ fontSize: 10, fontWeight: 600, opacity: 0.8, marginTop: 4 }}>Start a new auction</div>
              </div>
            </button>
            <button onClick={() => onSelectMode('verbal')} style={{ padding: '16px 32px', borderRadius: 12, background: 'rgba(20,20,20,0.6)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontWeight: 800, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16, backdropFilter: 'blur(10px)', transition: '0.2s', transform: 'scale(1)' }}>
              <span style={{ fontSize: 20 }}>👥</span>
              <div style={{ textAlign: 'left' }}>
                 <div style={{ lineHeight: 1 }}>VERBAL AUCTION</div>
                 <div style={{ fontSize: 10, fontWeight: 600, opacity: 0.6, marginTop: 4 }}>Host a verbal auction</div>
              </div>
            </button>
          </motion.div>

          {/* STATS ROW */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.8 }}
            style={{ display: 'flex', gap: 'clamp(20px, 4vw, 60px)', marginTop: 64, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 32, flexWrap: 'wrap', justifyContent: 'center' }}>
            {[
              { i: '👥', v: '200+', l: 'IPL PLAYERS' },
              { i: '🛡️', v: '8', l: 'TEAMS MAX' },
              { i: '🪙', v: '₹150Cr', l: 'PER TEAM' },
              { i: '🏆', v: '2', l: 'AUCTION MODES' },
            ].map((s, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ fontSize: 24, color: GOLD }}>{s.i}</div>
                <div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: GOLD, lineHeight: 1 }}>{s.v}</div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#888', marginTop: 4, letterSpacing: '0.1em' }}>{s.l}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* FLOATING CARDS */}
        <FloatingCard player={playersLeft[0]} style={{ top: '15%', left: '8%' }} delay={0} />
        <FloatingCard player={playersLeft[1]} style={{ top: '45%', left: '3%' }} delay={0.2} />
        <FloatingCard player={playersLeft[2]} style={{ bottom: '18%', left: '10%' }} delay={0.4} />
        
        <FloatingCard player={playersRight[0]} style={{ top: '15%', right: '8%' }} delay={0.1} />
        <FloatingCard player={playersRight[1]} style={{ top: '45%', right: '3%' }} delay={0.3} />
        <FloatingCard player={playersRight[2]} style={{ bottom: '18%', right: '10%' }} delay={0.5} />

        {/* SCROLL INDICATOR */}
        <motion.div 
          animate={{ y: [0, 10, 0] }} 
          transition={{ repeat: Infinity, duration: 2 }}
          style={{ position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)', opacity: 0.5, display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10 }}
        >
          <div style={{ fontSize: 10, letterSpacing: '0.2em', marginBottom: 8, fontWeight: 700 }}>SCROLL</div>
          <div style={{ width: 2, height: 40, background: `linear-gradient(to bottom, ${GOLD}, transparent)` }} />
        </motion.div>
      </div>

      {/* ========================================================
          FEATURES SECTION
          ======================================================== */}
      <div style={{ padding: '100px 24px', maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 20 }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 64 }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.25em', color: GOLD, marginBottom: 16 }}>GAME FEATURES</div>
          <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 'clamp(36px,6vw,64px)', fontWeight: 700, lineHeight: 1, color: 'white' }}>
            EVERYTHING YOU NEED<br /><span style={{ color: GOLD }}>TO WIN</span>
          </h2>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
          {feats.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              whileHover={{ y: -6, boxShadow: `0 20px 60px ${f.glow}22` }}
              style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid rgba(255,255,255,0.07)`, borderRadius: 20, padding: 32, cursor: 'default', transition: 'box-shadow 0.3s', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${f.glow}, transparent)` }} />
              <div style={{ fontSize: 36, marginBottom: 20 }}>{f.icon}</div>
              <h3 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 24, fontWeight: 700, color: 'white', marginBottom: 10 }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: '#777', lineHeight: 1.7 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ========================================================
          HOW IT WORKS
          ======================================================== */}
      <div style={{ padding: '100px 24px', maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 20 }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 80 }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.25em', color: GOLD, marginBottom: 16 }}>HOW IT WORKS</div>
          <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 'clamp(36px,6vw,64px)', fontWeight: 700, color: 'white' }}>
            YOUR PATH TO <span style={{ background: `linear-gradient(135deg,${GOLD},${ORANGE})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>GLORY</span>
          </h2>
        </motion.div>

        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 2, background: `linear-gradient(${GOLD}44,${ORANGE}44,transparent)`, transform: 'translateX(-50%)' }} className="timeline-line" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
            {steps.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                style={{ display: 'flex', justifyContent: i % 2 === 0 ? 'flex-start' : 'flex-end', position: 'relative' }}>
                <div style={{ width: '44%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: 28, position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${GOLD},${ORANGE})` }} />
                  <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 48, fontWeight: 700, color: `${GOLD}22`, lineHeight: 1, marginBottom: 8 }}>{s.n}</div>
                  <h3 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 26, fontWeight: 700, color: GOLD, marginBottom: 10 }}>{s.title}</h3>
                  <p style={{ fontSize: 14, color: '#777', lineHeight: 1.6 }}>{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================
          STATS BANNER
          ======================================================== */}
      <div style={{ background: `linear-gradient(135deg, rgba(245,184,65,0.08), rgba(255,107,53,0.06))`, border: '1px solid rgba(245,184,65,0.1)', padding: '60px 24px', textAlign: 'center', position: 'relative', zIndex: 20 }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', gap: 60, justifyContent: 'center', flexWrap: 'wrap' }}>
          {[{ v: 200, s: '+', l: 'IPL Players' }, { v: 8, s: '', l: 'Max Teams' }, { v: 150, s: 'Cr', l: 'Starting Budget' }, { v: 15, s: '', l: 'Squad Size' }].map(({ v, s, l }) => (
            <div key={l}>
              <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 56, fontWeight: 700, color: GOLD, lineHeight: 1 }}>
                <Counter target={v} suffix={s} />
              </div>
              <div style={{ fontSize: 12, color: '#888', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 6 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================
          FOOTER
          ======================================================== */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '32px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, background: '#050505', position: 'relative', zIndex: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: `linear-gradient(135deg,${GOLD},${ORANGE})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🏏</div>
          <span style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 800, fontSize: 16, color: 'white' }}>IPL AUCTION GAME</span>
        </div>
        <div style={{ fontSize: 13, color: '#444', fontWeight: 600 }}>© 2025 IPL Auction Game. For entertainment purposes only.</div>
        <div style={{ display: 'flex', gap: 24 }}>
          {['Normal Auction', 'Verbal Auction'].map(l => (
            <span key={l} style={{ fontSize: 13, color: '#555', fontWeight: 600, cursor: 'pointer' }}>{l}</span>
          ))}
        </div>
      </div>

      <style>{`
        @media(max-width:768px){
          nav{padding:14px 20px!important}
          .timeline-line{display:none}
          [style*="width: '44%'"]{width:90%!important}
        }
      `}</style>
    </div>
  );
}
