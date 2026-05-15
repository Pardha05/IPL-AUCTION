import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Copy, Play, CheckCircle, Users, Shield } from 'lucide-react';
import { TEAM_COLORS } from './data.js';

export default function LobbyScreen({ room, myId, onStart }) {
  const [copied, setCopied] = React.useState(false);
  const [auctionOrder, setAuctionOrder] = React.useState('mixed');
  const isAdmin = room?.admin === myId;

  const copy = () => {
    navigator.clipboard.writeText(room?.id || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Show loading if room data hasn't arrived yet
  if (!room?.id || !room?.users) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
        <div className="stadium-bg" />
        <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 32, marginBottom: 16 }}>⏳</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#fbbf24' }}>Connecting to room…</div>
          <div style={{ fontSize: 13, color: '#8892a4', marginTop: 8 }}>Please wait</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <div className="stadium-bg" />
      {/* All content must be above the fixed bg */}
      <div className="responsive-padding" style={{ position: 'relative', zIndex: 2, padding: '32px 24px', maxWidth: 960, margin: '0 auto' }}>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
        className="mobile-stack"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#fbbf24', marginBottom: 6 }}>Auction Lobby</div>
          <h1 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 44, fontWeight: 700, letterSpacing: '-0.02em', color: 'white' }}>Waiting Room</h1>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Room ID badge */}
          <div className="glass" style={{ borderRadius: 16, padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#8892a4', marginBottom: 4 }}>Room Code</div>
              <div style={{ fontFamily: 'monospace', fontSize: 26, fontWeight: 700, letterSpacing: '0.18em', color: 'white' }}>{room?.id}</div>
            </div>
            <button onClick={copy} className="btn btn-ghost btn-sm" style={{ gap: 6 }}>
              {copied ? <CheckCircle size={16} color="#16c784" /> : <Copy size={16} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          {isAdmin && (
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <select value={auctionOrder} onChange={(e) => setAuctionOrder(e.target.value)} style={{ padding: '12px 16px', borderRadius: 16, background: '#1a1f2e', color: 'white', border: '1px solid rgba(255,255,255,0.1)', outline: 'none', fontWeight: 600 }}>
                <option value="mixed">Mixed Order</option>
                <option value="BAT">Batsmen First</option>
                <option value="BOWL">Bowlers First</option>
                <option value="AR">All-Rounders First</option>
              </select>
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                className="btn btn-primary btn-lg" style={{ gap: 10, paddingLeft: 32, paddingRight: 32 }}
                onClick={() => onStart(auctionOrder)}>
                <Play size={20} fill="white" color="white" /> Start Auction
              </motion.button>
            </div>
          )}
        </div>
      </motion.div>

      <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
        {/* Players grid */}
        <div className="glass" style={{ borderRadius: 24, padding: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
            <Users size={20} color="#fbbf24" />
            <h2 style={{ fontSize: 18, fontWeight: 700 }}>Franchise Owners</h2>
            <span style={{ marginLeft: 'auto', background: 'rgba(245,166,35,0.12)', color: '#fbbf24', borderRadius: 99, padding: '3px 12px', fontSize: 12, fontWeight: 700 }}>
              {room?.users?.length || 0} joined
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
            {room?.users?.map((u, i) => {
              const color = TEAM_COLORS[i % TEAM_COLORS.length];
              return (
                <motion.div key={u.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                  className="lobby-player">
                  <div className="lobby-avatar" style={{ background: `linear-gradient(135deg,${color[0]},${color[1]})`, borderRadius: 12 }}>
                    {u.teamName.slice(0,2).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', gap: 6 }}>
                      {u.teamName}
                      {u.id === myId && <span style={{ fontSize: 9, background: 'rgba(245,166,35,0.12)', color: '#fbbf24', padding: '2px 7px', borderRadius: 99, fontWeight: 800 }}>YOU</span>}
                    </div>
                    <div style={{ fontSize: 12, color: '#8892a4', marginTop: 2 }}>{u.name}</div>
                  </div>
                  {u.id === room.admin && <Crown size={16} color="#fbbf24" fill="#fbbf24" />}
                </motion.div>
              );
            })}
          </div>
          {!isAdmin && (
            <div style={{ marginTop: 28, padding: '16px 20px', background: 'rgba(245,166,35,0.05)', borderRadius: 14, border: '1px solid rgba(245,166,35,0.12)', textAlign: 'center', color: '#8892a4', fontSize: 14 }}>
              ⏳ Waiting for the host to start the auction…
            </div>
          )}
        </div>

        {/* Rules panel */}
        <div className="glass" style={{ borderRadius: 24, padding: 28, height: 'fit-content' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
            <Shield size={18} color="#fbbf24" />
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>Auction Rules</h3>
          </div>
          {[
            ['💰', 'Starting Purse', '₹150 Crore per team'],
            ['👥', 'Squad Size', 'Max 15 players'],
            ['⏱️', 'Bid Timer', '15 sec, resets on each bid'],
            ['🏆', 'Win Condition', 'Highest average squad rating'],
            ['📈', 'Bid Increment', '+0.5 Cr per raise'],
          ].map(([icon, label, desc]) => (
            <div key={label} style={{ display: 'flex', gap: 14, marginBottom: 18, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>{icon}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'white', marginBottom: 2 }}>{label}</div>
                <div style={{ fontSize: 12, color: '#8892a4' }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
        </div>
      </div>
    </div>
  );
}
