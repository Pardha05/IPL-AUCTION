import React from 'react';
import { motion } from 'framer-motion';
import { ROLE_META, PLAYERS, avgRating, TEAM_COLORS } from './data.js';
import { Crown, Wallet, Users } from 'lucide-react';

export function RoleBadge({ role }) {
  const m = ROLE_META[role] || { label: role, cls: 'role-bat', icon: '🏏' };
  return <span className={`role-badge ${m.cls}`}>{m.icon} {m.label}</span>;
}

export function PlayerAvatar({ name, size = '', color = ['#6366f1','#4f46e5'] }) {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div className={`player-avatar ${size}`} style={{ background: `linear-gradient(135deg, ${color[0]}44, ${color[1]}66)`, borderColor: `${color[0]}66` }}>
      {initials}
    </div>
  );
}

export function StarRating({ rating }) {
  const stars = Math.round(rating / 2);
  return (
    <div className="stars">
      {[1,2,3,4,5].map(i => (
        <span key={i} className={`star ${i <= stars ? 'filled' : ''}`}>★</span>
      ))}
      <span style={{ fontSize: 12, color: '#fbbf24', marginLeft: 4, fontWeight: 700 }}>{rating}</span>
    </div>
  );
}

export function CircularTimer({ value, max = 15 }) {
  const r = 44, c = 2 * Math.PI * r;
  const offset = c - (value / max) * c;
  const color = value <= 5 ? '#ef4444' : value <= 10 ? '#f59e0b' : '#fbbf24';
  return (
    <div className="timer-wrap">
      <svg width="110" height="110" viewBox="0 0 110 110">
        <circle className="timer-bg" cx="55" cy="55" r={r} strokeWidth="7" />
        <circle
          className="timer-fill"
          cx="55" cy="55" r={r}
          strokeWidth="7"
          stroke={color}
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transform: 'rotate(-90deg)', transformOrigin: '55px 55px', transition: 'stroke-dashoffset 1s linear, stroke 0.5s' }}
        />
        <text x="55" y="55" textAnchor="middle" dominantBaseline="central"
          style={{ fill: 'white', fontSize: 26, fontWeight: 700, fontFamily: 'Rajdhani, sans-serif' }}>
          {value}
        </text>
      </svg>
    </div>
  );
}

export function Toast({ msg, type = 'error', onClose }) {
  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      className={`toast toast-${type}`}
    >
      <div className={`toast-icon toast-icon-${type}`}>{type === 'error' ? '⚠️' : '✅'}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: type === 'error' ? '#ef4444' : '#16c784', marginBottom: 2 }}>
          {type === 'error' ? 'Error' : 'Success'}
        </div>
        <div style={{ fontSize: 14, fontWeight: 600 }}>{msg}</div>
      </div>
      <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#8892a4', cursor: 'pointer', fontSize: 18, padding: '0 4px' }}>×</button>
    </motion.div>
  );
}

export function TeamRow({ user, rank, isLeading, isBidder, myId }) {
  const color = TEAM_COLORS[(rank) % TEAM_COLORS.length];
  const pts = avgRating(user.squad);
  const pct = (user.squad.length / 15) * 100;
  return (
    <div className={`team-row ${isLeading ? 'leading' : ''} ${isBidder ? 'active-bidder' : ''}`} style={{ borderLeftWidth: 4, borderLeftColor: color[0] }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <div style={{ width: 34, height: 34, borderRadius: 8, background: `linear-gradient(135deg,${color[0]},${color[1]})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 900, flexShrink: 0, color: 'white' }}>
          {user.teamName.substring(0, 2).toUpperCase()}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 800, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'flex', alignItems: 'center', gap: 6, color: 'white' }}>
            {user.teamName}
            {user.id === myId && <span style={{ fontSize: 9, background: 'rgba(245,166,35,0.12)', color: '#fbbf24', padding: '2px 8px', borderRadius: 99, fontWeight: 800, border: '1px solid rgba(245,166,35,0.2)' }}>YOU</span>}
          </div>
          <div style={{ fontSize: 11, color: '#8892a4', fontWeight: 600 }}>{user.name}</div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: 18, fontWeight: 900, color: '#fbbf24' }}>{pts}</div>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 6 }}>
        <span style={{ color: '#8892a4', fontWeight: 600 }}>₹{user.budget} Cr</span>
        <span style={{ color: '#8892a4', fontWeight: 600 }}>{user.squad.length}/15 players</span>
      </div>
      <div className="progress-bar" style={{ height: 3, background: 'rgba(255,255,255,0.05)' }}><div className="progress-fill" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color[0]}, ${color[1]})` }} /></div>
    </div>
  );
}
