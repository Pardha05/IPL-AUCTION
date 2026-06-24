import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TEAM_COLORS, ROLE_META, avgRating } from './data.js';

const G='#F5B841', EM='#16c784', BG='#0A0E13', BURG='#4A0E0E';

export default function VerbalAuctionScreen({room, myId, onSell, onUnsold, onEnd, onPrev, onSkip}) {
  const [selTeam, setSelTeam] = useState('');
  const [price, setPrice] = useState('');
  const [sold, setSold] = useState(null);
  const [endConfirm, setEndConfirm] = useState(false);
  const [viewSquadId, setViewSquadId] = useState(null);

  const isAdmin = room?.admin === myId;
  const player = room?.players?.[room?.currentPlayerIndex];
  const budget = room?.budget || 150;

  const jersey = player?.jersey || 99;
  const country = player?.country || 'India';
  const age = player?.age || 25;
  const batStyle = player?.battingStyle || 'RIGHT HAND BAT';
  const bowlStyle = player?.bowlingStyle || '-';
  const playerImg = player?.image || null;

  const doSell = () => {
    const p = parseFloat(price);
    if (!selTeam) return alert('Select winning team');
    if (!p || p <= 0) return alert('Enter valid price');
    const buyer = room.users.find(u => u.id === selTeam);
    if (buyer && buyer.budget < p) return alert(`${buyer.teamName} only has ₹${buyer.budget}Cr`);
    
    setSold({ teamName: buyer?.teamName, price: p, playerName: player?.name, sold: true });
    onSell(selTeam, p);
    setSelTeam(''); setPrice('');
    setTimeout(() => setSold(null), 3000);
  };

  const doUnsold = () => {
    setSold({ unsold: true, playerName: player?.name });
    onUnsold();
    setTimeout(() => setSold(null), 2500);
  };

  if (!player) return (
    <div style={{minHeight:'100vh',background:BG,display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{textAlign:'center',color:'white'}}>✅<br/><span style={{color:G,fontSize:24}}>All players auctioned!</span></div>
    </div>
  );


  const history = room?.history || [];
  const numSold = history.filter(h=>h.soldTo !== 'Unsold').length;
  const numUnsold = history.filter(h=>h.soldTo === 'Unsold').length;
  const avgBudget = room.users.length ? (room.users.reduce((acc, u)=>acc+u.budget, 0)/room.users.length).toFixed(2) : 0;
  
  const soldList = history.filter(h => h.soldTo !== 'Unsold');
  const myTeamName = room.users.find(u => u.id === myId)?.teamName;
  const myBuys = soldList.filter(h => h.soldTo === myTeamName);
  
  const mostExpensive = soldList.length > 0 ? soldList.reduce((a,b) => a.price > b.price ? a : b) : null;
  const topMyBuy = myBuys.length > 0 ? myBuys.reduce((a,b) => a.price > b.price ? a : b) : null;
  
  const getTheme = (p) => {
    if (p.rating >= 90) return { glow: '#F5B841', accent: '#F5B841' };
    if (p.role === 'BOWL') return { glow: '#3b82f6', accent: '#3b82f6' };
    if (p.role === 'AR') return { glow: '#8b5cf6', accent: '#8b5cf6' };
    if (p.role === 'WK') return { glow: '#ec4899', accent: '#ec4899' };
    return { glow: '#00C896', accent: '#00C896' };
  };

  const theme = getTheme(player);

  return (
    <div style={{height:'100vh',backgroundColor:'#050505',backgroundImage:'url(https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=2500&auto=format&fit=crop)',backgroundSize:'cover',backgroundPosition:'center',fontFamily:'Inter,sans-serif',color:'white',display:'flex',flexDirection:'column',overflow:'hidden'}}>
      
      {/* Background Overlay */}
      <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0.95) 100%)',pointerEvents:'none'}}/>

      {/* TOP HEADER */}
      <div style={{position:'relative',zIndex:20,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'16px 32px',borderBottom:`1px solid rgba(255,255,255,0.05)`,background:'rgba(0,0,0,0.4)',backdropFilter:'blur(10px)'}}>
        
        <div style={{display:'flex',alignItems:'center',gap:16}}>
          <div style={{color:G,fontSize:28,textShadow:`0 0 20px ${G}`}}>🎙️</div>
          <div>
            <div style={{fontFamily:'Rajdhani,sans-serif',fontWeight:900,fontSize:20,lineHeight:1,letterSpacing:'0.05em'}}>VERBAL</div>
            <div style={{fontSize:16,fontWeight:800,color:G,fontFamily:'Rajdhani,sans-serif',letterSpacing:'0.1em',lineHeight:1}}>AUCTION</div>
          </div>
        </div>

        <div style={{display:'flex',alignItems:'center',gap:40}}>
          <div style={{display:'flex',alignItems:'center',gap:16}}>
            <div style={{fontSize:10,color:'#888',fontWeight:700,letterSpacing:'0.1em'}}>ROOM CODE</div>
            <div style={{fontSize:20,fontWeight:800,background:'rgba(255,255,255,0.05)',padding:'6px 16px',borderRadius:8,letterSpacing:'0.1em',border:'1px solid rgba(255,255,255,0.1)'}}>{room.id.slice(0,6).toUpperCase()}</div>
          </div>
          <div style={{textAlign:'center'}}>
            <div style={{fontSize:10,color:'#888',fontWeight:700,letterSpacing:'0.1em'}}>PLAYERS</div>
            <div style={{fontSize:18,fontWeight:800}}><span style={{color:G}}>{room.currentPlayerIndex+1}</span> / {room.players.length}</div>
          </div>
          <div style={{textAlign:'center'}}>
            <div style={{fontSize:10,color:'#888',fontWeight:700,letterSpacing:'0.1em'}}>SOLD</div>
            <div style={{fontSize:18,fontWeight:800}}>{numSold}</div>
          </div>
          <div style={{textAlign:'center'}}>
            <div style={{fontSize:10,color:'#888',fontWeight:700,letterSpacing:'0.1em'}}>UNSOLD</div>
            <div style={{fontSize:18,fontWeight:800}}>{numUnsold}</div>
          </div>
          <div style={{textAlign:'center'}}>
            <div style={{fontSize:10,color:'#888',fontWeight:700,letterSpacing:'0.1em'}}>TEAMS</div>
            <div style={{fontSize:18,fontWeight:800}}>{room.users.length}</div>
          </div>
          <div>
            <div style={{fontSize:10,color:'#888',fontWeight:700,letterSpacing:'0.1em'}}>BUDGET LEFT (AVG)</div>
            <div style={{fontSize:18,fontWeight:800,color:EM}}>₹{avgBudget} Cr</div>
          </div>
        </div>

        <div style={{display:'flex',gap:12}}>
          <button style={{...BTN, border:'1px solid rgba(255,255,255,0.2)'}}>📄 AUCTION LOG</button>
          {isAdmin && <button onClick={()=>setEndConfirm(true)} style={{...BTN, border:`1px solid ${BURG}`,color:'#f87171',background:'rgba(74,14,14,0.3)'}}>🛑 END AUCTION</button>}
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div style={{flex:1,display:'flex',position:'relative',zIndex:5,padding:'24px',gap:24,overflow:'hidden'}}>

        {/* LEFT PANEL: TEAMS & BUDGETS */}
        <div style={{width: 320, display:'flex', flexDirection:'column', gap:16, background:'rgba(0,0,0,0.5)', borderRadius:16, border:'1px solid rgba(255,255,255,0.05)', padding:20, backdropFilter:'blur(10px)', overflowY:'auto'}}>
          <div style={{fontSize:12,fontWeight:800,color:G,letterSpacing:'0.1em'}}>TEAMS & BUDGETS</div>
          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            {room.users.map(u => {
              const color=TEAM_COLORS[room.users.findIndex(x=>x.id===u.id)%TEAM_COLORS.length];
              const pct=(u.budget/budget)*100;
              return (
                <div key={u.id} onClick={() => setViewSquadId(u.id)} style={{padding:'12px',background:'rgba(255,255,255,0.03)',borderRadius:12,border:`1px solid rgba(255,255,255,0.05)`,cursor:'pointer',transition:'background 0.2s'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12}}>
                    <div style={{display:'flex',gap:12,alignItems:'center'}}>
                      <div style={{width:40,height:40,borderRadius:'50%',background:`transparent`,border:`2px solid ${color[0]}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:900,color:color[0]}}>
                        {u.teamName.slice(0,2).toUpperCase()}
                      </div>
                      <div>
                        <div style={{fontSize:14,fontWeight:800,display:'flex',alignItems:'center',gap:6}}>{u.teamName} {u.id===myId && <span style={{fontSize:8,background:'#3b82f6',padding:'2px 6px',borderRadius:4}}>YOU</span>}</div>
                        <div style={{fontSize:10,color:'#888',fontWeight:600}}>{u.squad.length}/{room.squadSize||15} PLAYERS</div>
                      </div>
                    </div>
                    <div style={{textAlign:'right'}}>
                      <div style={{fontSize:14,fontWeight:900,color:EM}}>₹{u.budget.toFixed(2)} Cr</div>
                      <div style={{fontSize:9,color:'#888',fontWeight:700}}>BUDGET LEFT</div>
                    </div>
                  </div>
                  <div style={{height:4,background:'#222',borderRadius:2,overflow:'hidden'}}>
                    <div style={{height:'100%',width:`${pct}%`,background:`linear-gradient(90deg,${color[0]},${color[1]})`,borderRadius:2}}/>
                  </div>
                </div>
              );
            })}
          </div>
          <button style={{width:'100%',padding:'12px',background:'transparent',border:`1px solid ${G}66`,color:G,borderRadius:8,fontSize:12,fontWeight:800,cursor:'pointer',marginTop:'auto'}}>VIEW ALL TEAMS</button>
        </div>

        {/* CENTER PANEL: THE CARD */}
        <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',position:'relative'}}>
          
          {/* Top Title & Player Counter */}
          <div style={{position:'absolute',top:0,left:0,right:0,display:'flex',justifyContent:'center',alignItems:'center'}}>
            <div style={{fontSize:14,fontWeight:800,color:G,letterSpacing:'0.2em'}}>• CURRENT PLAYER</div>
            <div style={{position:'absolute',right:0,background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',padding:'8px 16px',borderRadius:8,textAlign:'center'}}>
               <div style={{fontSize:9,color:'#888',fontWeight:700,letterSpacing:'0.1em'}}>PLAYER</div>
               <div style={{fontSize:14,fontWeight:800}}><span style={{color:G}}>{room.currentPlayerIndex+1}</span> OF {room.players.length}</div>
            </div>
          </div>

          <div style={{display:'flex',alignItems:'center',gap:40,marginTop:20}}>
            
            {/* Left Prev Button */}
            {isAdmin ? (
              <button onClick={onPrev} disabled={room.currentPlayerIndex===0} style={{...SIDE_NAV_BTN, opacity:room.currentPlayerIndex===0?0.3:1}}>
                 <span style={{fontSize:18}}>❮</span><br/>PREVIOUS<br/>PLAYER
              </button>
            ) : <div style={{width:80}}/>}

            {/* THE GLOWING CARD AND PEDESTAL */}
            <div style={{position:'relative',display:'flex',flexDirection:'column',alignItems:'center'}}>
               {/* 3D Pedestal Base */}
               <div style={{position:'absolute',bottom:-40,width:400,height:80,background:`radial-gradient(ellipse at center, ${G}88 0%, transparent 70%)`,borderRadius:'50%',filter:'blur(10px)',zIndex:1}}/>
               <div style={{position:'absolute',bottom:-20,width:300,height:40,background:`radial-gradient(ellipse at center, ${G}ff 0%, transparent 80%)`,borderRadius:'50%',zIndex:2,boxShadow:`0 10px 40px ${G}`}}/>

               {/* ACTUAL CARD */}
               <motion.div
                  key={player.id}
                  initial={{ opacity:0, scale:0.95, y:20 }}
                  animate={{ opacity:1, scale:1, y:0 }}
                  transition={{ duration:0.4 }}
                  style={{
                    width: 380, height: 560,
                    position: 'relative',
                    zIndex: 10
                  }}
                >
                  {/* Outer Border Layer */}
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: `linear-gradient(135deg, ${G}, #ffd700, #b8860b)`,
                    clipPath: 'polygon(8% 0, 92% 0, 100% 5.5%, 100% 94.5%, 92% 100%, 8% 100%, 0 94.5%, 0 5.5%)'
                  }}>
                    {/* Inner Black Layer */}
                    <div style={{
                      position: 'absolute', inset: 2,
                      background: '#0a0a0a',
                      clipPath: 'polygon(8% 0, 92% 0, 100% 5.5%, 100% 94.5%, 92% 100%, 8% 100%, 0 94.5%, 0 5.5%)'
                    }}>
                      {/* Inner Thin Gold Border */}
                      <div style={{
                        position: 'absolute', inset: 4,
                        background: `linear-gradient(135deg, #ffd700, #8b6508)`,
                        clipPath: 'polygon(8% 0, 92% 0, 100% 5.5%, 100% 94.5%, 92% 100%, 8% 100%, 0 94.5%, 0 5.5%)'
                      }}>
                        {/* The actual Card Background */}
                        <div style={{
                          position: 'absolute', inset: 2,
                          background: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 20L20 0H10L0 10V20Z\' fill=\'%23F5B841\' fill-opacity=\'0.05\'/%3E%3C/svg%3E"), radial-gradient(circle at 50% 50%, #1a1500 0%, #050505 80%)',
                          clipPath: 'polygon(8% 0, 92% 0, 100% 5.5%, 100% 94.5%, 92% 100%, 8% 100%, 0 94.5%, 0 5.5%)',
                          display: 'flex', flexDirection: 'column'
                        }}>
                            {/* Internal Glow Behind Player */}
                            <div style={{position:'absolute',top:'40%',left:'50%',transform:'translate(-50%, -50%)',width:300,height:300,background:`radial-gradient(circle, ${G}33 0%, transparent 70%)`,zIndex:1}}/>

                            {/* Top Left Stats Stack */}
                            <div style={{ position: 'absolute', top: 24, left: 24, zIndex: 20 }}>
                              <div style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: 64, fontWeight: 900, lineHeight: 0.9, color: G, textShadow:`2px 2px 4px rgba(0,0,0,0.8)` }}>{player.rating.toFixed(1)}</div>
                              <div style={{ fontSize: 14, fontWeight: 700, color: G, letterSpacing: '0.1em', marginTop: 4 }}>{player.role === 'BAT' ? 'BATSMAN' : player.role === 'BOWL' ? 'BOWLER' : player.role === 'AR' ? 'ALL ROUNDER' : 'WK BATSMAN'}</div>
                              
                              <div style={{ marginTop: 20, display:'flex', flexDirection:'column', gap:0 }}>
                                <div style={{ fontSize: 16, fontWeight: 800, color: 'white', letterSpacing:'0.05em' }}>IN</div>
                                <div style={{ fontSize: 20, fontWeight: 900, color: 'white', letterSpacing:'0.05em' }}>{country==='India'?'INDIA':country.toUpperCase()}</div>
                                <div style={{ fontSize: 28, fontWeight: 900, color: G, marginTop:12 }}>#{jersey}</div>
                                <div style={{ fontSize: 10, color:'#888', fontWeight:700, letterSpacing:'0.1em' }}>JERSEY</div>
                              </div>
                            </div>

                            {/* Top Right Status & Stars */}
                            <div style={{ position: 'absolute', top: 24, right: 24, zIndex: 20, display:'flex', flexDirection:'column', alignItems:'flex-end', gap:12 }}>
                              <div style={{ border: `1px solid #16c784`, padding: '6px 16px', borderRadius: 99, color: '#16c784', fontSize: 10, fontWeight: 800, letterSpacing: '0.15em', background:'rgba(22, 199, 132, 0.1)' }}>AVAILABLE</div>
                              <div style={{display:'flex',flexDirection:'column',alignItems:'center',background:'rgba(0,0,0,0.6)',padding:'12px 8px',borderRadius:8,border:`1px solid ${G}44`,width:56}}>
                                <span style={{fontSize:18,color:G}}>⭐</span>
                                <span style={{fontSize:9,color:G,fontWeight:800,marginTop:4,textAlign:'center'}}>IN<br/>FORM</span>
                              </div>
                              <div style={{display:'flex',flexDirection:'column',alignItems:'center',background:'rgba(0,0,0,0.6)',padding:'12px 8px',borderRadius:8,border:`1px solid ${G}44`,width:56}}>
                                <span style={{fontSize:18,color:G}}>👑</span>
                                <span style={{fontSize:9,color:G,fontWeight:800,marginTop:4,textAlign:'center'}}>STAR<br/>PLAYER</span>
                              </div>
                            </div>

                            {/* REAL PLAYER IMAGE */}
                            <div style={{ position: 'absolute', inset: 0, zIndex: 10, display:'flex', alignItems:'flex-end', justifyContent:'center', pointerEvents:'none' }}>
                              {playerImg && <img src={playerImg} alt={player.name} style={{ width: '95%', height: '70%', objectFit: 'contain', objectPosition: 'bottom', filter: `drop-shadow(0 0 20px rgba(0,0,0,0.8))` }} />}
                            </div>

                            {/* Bottom Card Content Block */}
                            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 260, zIndex: 25, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', background: 'linear-gradient(transparent, #050505 25%, #000 100%)' }}>
                              
                              {/* Divider and Name */}
                              <div style={{position:'relative', width:'100%', display:'flex', flexDirection:'column', alignItems:'center'}}>
                                <div style={{display:'flex', alignItems:'center', width:'100%', padding:'0 24px', boxSizing:'border-box'}}>
                                  <div style={{flex:1, height:1, background:`linear-gradient(90deg,transparent,${G})`}}/>
                                  <div style={{width:20, height:20, borderTop:`1px solid ${G}`, borderRight:`1px solid ${G}`, transform:'rotate(45deg)', margin:'0 -10px', zIndex:1}}/>
                                  <div style={{width:20, height:20, borderBottom:`1px solid ${G}`, borderLeft:`1px solid ${G}`, transform:'rotate(45deg)', margin:'0 -10px', zIndex:1}}/>
                                  <div style={{flex:1, height:1, background:`linear-gradient(270deg,transparent,${G})`}}/>
                                </div>
                                <h2 style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: 42, fontWeight: 900, color: G, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '4px 0 0 0', textAlign:'center', textShadow:`2px 2px 4px rgba(0,0,0,0.8)` }}>{player.name}</h2>
                                <div style={{fontSize:11,color:'white',fontWeight:800,letterSpacing:'0.1em',textTransform:'uppercase', margin:'4px 0 12px 0'}}>{batStyle} • {bowlStyle}</div>
                                <div style={{width:'85%', height:1, background:`linear-gradient(90deg,transparent,${G}88,transparent)`}}/>
                              </div>

                              {/* Age / Styles Details Strip */}
                              <div style={{ display: 'flex', justifyContent:'space-between', padding: '16px 32px 12px', borderBottom:`1px solid ${G}33`, margin:'0 16px' }}>
                                <div style={{display:'flex',alignItems:'center',gap:8}}>
                                  <span style={{fontSize:20,color:G}}>📅</span>
                                  <div><div style={{fontSize:8,color:'#888',fontWeight:700,letterSpacing:'0.05em'}}>AGE</div><div style={{fontSize:13,fontWeight:900,color:'white'}}>{age}</div></div>
                                </div>
                                <div style={{display:'flex',alignItems:'center',gap:8}}>
                                  <span style={{fontSize:20,color:G}}>🏏</span>
                                  <div><div style={{fontSize:8,color:'#888',fontWeight:700,letterSpacing:'0.05em'}}>BATTING STYLE</div><div style={{fontSize:13,fontWeight:900,color:'white'}}>{batStyle.toUpperCase()}</div></div>
                                </div>
                                <div style={{display:'flex',alignItems:'center',gap:8}}>
                                  <span style={{fontSize:20,color:G}}>⚾</span>
                                  <div><div style={{fontSize:8,color:'#888',fontWeight:700,letterSpacing:'0.05em'}}>BOWLING STYLE</div><div style={{fontSize:13,fontWeight:900,color:'white'}}>{bowlStyle.split(' ').slice(0,2).join(' ').toUpperCase()}</div></div>
                                </div>
                              </div>

                              {/* Full Circular Progress Rings */}
                              <div style={{ display: 'flex', justifyContent: 'space-evenly', padding:'16px 0 24px' }}>
                                <FullRing label="BATTING" value={(player.role==='BAT'||player.role==='WK')?player.rating:player.rating*0.6} color={G} />
                                <FullRing label="BOWLING" value={(player.role==='BOWL')?player.rating:(player.role==='AR'?player.rating*0.8:player.rating*0.3)} color={G} />
                                <FullRing label="FIELDING" value={player.rating*0.8} color={G} />
                                <FullRing label="POTENTIAL" value={Math.min(10, player.rating+1.4)} color={G} />
                              </div>
                              
                              {/* Bottom Tab label */}
                              <div style={{position:'absolute', bottom:0, left:'50%', transform:'translateX(-50%)', borderTop:`1px solid ${G}`, borderLeft:`1px solid ${G}`, borderRight:`1px solid ${G}`, padding:'4px 24px', borderTopLeftRadius:8, borderTopRightRadius:8, background:'#111'}}>
                                <div style={{fontSize:10,color:G,fontWeight:800,letterSpacing:'0.1em'}}>{player.role === 'BAT' ? 'TOP ORDER BATSMAN' : player.role === 'WK' ? 'WICKET KEEPER' : player.role === 'AR' ? 'ALL ROUNDER' : 'PACE BOWLER'}</div>
                              </div>
                            </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
            </div>

            {/* Right Next Button */}
            {isAdmin ? (
              <button onClick={onSkip} style={SIDE_NAV_BTN}>
                NEXT<br/>PLAYER<br/><span style={{fontSize:18}}>❯</span>
              </button>
            ) : <div style={{width:80}}/>}

          </div>
        </div>

        {/* RIGHT PANEL: CONTROLS & RECENT */}
        <div style={{width: 340, display:'flex', flexDirection:'column', gap:24}}>
          
          {/* HOST CONTROLS */}
          {isAdmin && (
            <div style={{background:'rgba(0,0,0,0.5)', borderRadius:16, border:'1px solid rgba(255,255,255,0.05)', padding:24, backdropFilter:'blur(10px)'}}>
              <div style={{fontSize:12,fontWeight:800,color:G,letterSpacing:'0.1em',marginBottom:20}}>HOST CONTROLS</div>
              
              <div style={{marginBottom:16}}>
                <label style={LBL}>WINNING TEAM</label>
                <select value={selTeam} onChange={e=>setSelTeam(e.target.value)} style={INP}>
                  <option value="">Select franchise…</option>
                  {room.users.map(u=>(
                    <option key={u.id} value={u.id}>{u.teamName}</option>
                  ))}
                </select>
              </div>
              
              <div style={{marginBottom:24}}>
                <label style={LBL}>FINAL PRICE (MIN ₹{player.base} Cr)</label>
                <div style={{position:'relative'}}>
                  <input type="number" step="0.5" min={player.base} style={{...INP,fontSize:18,fontWeight:900,paddingRight:40}} placeholder="ENTER PRICE" value={price} onChange={e=>setPrice(e.target.value)}/>
                  <span style={{position:'absolute',right:16,top:14,color:'#888',fontWeight:800}}>Cr</span>
                </div>
              </div>

              <div style={{display:'flex',gap:12}}>
                <button onClick={doSell} style={{flex:1,padding:'12px 0',borderRadius:8,border:'none',background:`linear-gradient(180deg, #22c55e 0%, #16a34a 100%)`,color:'white',fontWeight:800,fontSize:14,cursor:'pointer',boxShadow:'0 4px 15px rgba(22,163,74,0.4)'}}>
                  ✅ SOLD<br/><span style={{fontSize:9,fontWeight:600}}>Assign Player</span>
                </button>
                <button onClick={doUnsold} style={{flex:1,padding:'12px 0',borderRadius:8,border:'none',background:`linear-gradient(180deg, #ef4444 0%, #dc2626 100%)`,color:'white',fontWeight:800,fontSize:14,cursor:'pointer',boxShadow:'0 4px 15px rgba(220,38,38,0.4)'}}>
                  ✕ UNSOLD<br/><span style={{fontSize:9,fontWeight:600}}>Skip Player</span>
                </button>
              </div>
            </div>
          )}

          {/* RECENTLY SOLD */}
          <div style={{flex:1, background:'rgba(0,0,0,0.5)', borderRadius:16, border:'1px solid rgba(255,255,255,0.05)', padding:24, backdropFilter:'blur(10px)', display:'flex', flexDirection:'column'}}>
            <div style={{fontSize:12,fontWeight:800,color:G,letterSpacing:'0.1em',marginBottom:16}}>RECENTLY SOLD PLAYERS</div>
            <div style={{flex:1, display:'flex', flexDirection:'column', gap:0}}>
              {history.length === 0 && <div style={{fontSize:12,color:'#555'}}>No history yet.</div>}
              {[...history].reverse().slice(0, 5).map((h, i) => {
                const u = room.users.find(x=>x.teamName===h.soldTo);
                const tColor = u ? TEAM_COLORS[room.users.findIndex(x=>x.id===u.id)%TEAM_COLORS.length] : ['#333','#111'];
                return (
                  <div key={i} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 0',borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
                    <div style={{display:'flex',alignItems:'center',gap:12}}>
                      <div style={{fontSize:11,fontWeight:800,color:'#666',width:12}}>{i+1}</div>
                      <div style={{width:24,height:24,borderRadius:'50%',background:`rgba(255,255,255,0.1)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10}}>👤</div>
                      {h.soldTo !== 'Unsold' && (
                        <div style={{width:24,height:24,borderRadius:'50%',background:`linear-gradient(135deg,${tColor[0]},${tColor[1]})`,fontSize:8,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900}}>{h.soldTo.slice(0,2).toUpperCase()}</div>
                      )}
                      <div>
                        <div style={{fontSize:12,fontWeight:800,color:'white',fontFamily:'Rajdhani,sans-serif'}}>{h.player.name}</div>
                        <div style={{fontSize:9,color:'#888'}}>{h.soldTo}</div>
                      </div>
                    </div>
                    {h.soldTo !== 'Unsold' ? (
                      <div style={{fontSize:13,fontWeight:900,color:EM}}>₹{h.price} Cr</div>
                    ) : (
                      <div style={{fontSize:11,fontWeight:800,color:'#f87171'}}>UNSOLD</div>
                    )}
                  </div>
                );
              })}
            </div>
            <button style={{width:'100%',padding:'12px',background:'transparent',border:`1px solid ${G}66`,color:G,borderRadius:8,fontSize:12,fontWeight:800,cursor:'pointer',marginTop:'16px'}}>VIEW FULL HISTORY</button>
          </div>

        </div>
      </div>

      {/* BOTTOM BAR: LIVE ACTIVITY */}
      <div style={{height: 70, borderTop:'1px solid rgba(255,255,255,0.05)', background:'rgba(0,0,0,0.6)', backdropFilter:'blur(10px)', zIndex:20, display:'flex', alignItems:'center', padding:'0 32px', gap:40}}>
        
        <div style={{flex:1}}>
          <div style={{display:'flex',justifyContent:'space-between',fontSize:10,fontWeight:800,letterSpacing:'0.1em',marginBottom:8}}>
            <span>AUCTION PROGRESS</span>
            <span style={{color:'#888'}}><span style={{color:G}}>{room.currentPlayerIndex}</span> / {room.players.length} PLAYERS</span>
          </div>
          <div style={{height:4,background:'#222',borderRadius:2}}>
             <motion.div animate={{width:`${room.currentPlayerIndex/Math.max(1,room.players.length)*100}%`}} style={{height:'100%',background:G,borderRadius:2}}/>
          </div>
        </div>

        <div style={{width:1,height:40,background:'rgba(255,255,255,0.1)'}}/>

        <div style={{flex:2, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 20px'}}>
           <div style={{display:'flex',alignItems:'center',gap:16}}>
             <div style={{fontSize:10,color:'#888',fontWeight:700,letterSpacing:'0.1em',width:80}}>MY TOP BUY</div>
             <div>
               <div style={{fontSize:16,fontWeight:900,color:'#a855f7'}}>{topMyBuy ? `₹${topMyBuy.price} Cr` : '--'}</div>
               <div style={{fontSize:10,fontWeight:700}}>{topMyBuy ? topMyBuy.player.name : 'No purchases yet'}</div>
             </div>
           </div>
           <div style={{display:'flex',alignItems:'center',gap:16}}>
             <div style={{fontSize:10,color:'#888',fontWeight:700,letterSpacing:'0.1em',width:100}}>MOST EXPENSIVE</div>
             <div>
               <div style={{fontSize:16,fontWeight:900,color:G}}>{mostExpensive ? `₹${mostExpensive.price} Cr` : '--'}</div>
               <div style={{fontSize:10,fontWeight:700}}>{mostExpensive ? mostExpensive.player.name : 'No players sold'}</div>
             </div>
           </div>
        </div>

        <div style={{width:1,height:40,background:'rgba(255,255,255,0.1)'}}/>

        <div style={{flex:1, display:'flex', alignItems:'center', justifyContent:'flex-end', gap:20}}>
          <button onClick={() => setViewSquadId(myId)} style={{padding:'10px 20px',borderRadius:8,background:`linear-gradient(135deg, ${EM}, #00a07a)`,color:'#000',border:'none',fontWeight:900,fontSize:12,cursor:'pointer',boxShadow:`0 4px 15px ${EM}44`}}>
            👁️ VIEW MY SQUAD
          </button>
          <div style={{width:36,height:36,borderRadius:8,background:`rgba(245,184,65,0.2)`,border:`1px solid ${G}`,display:'flex',alignItems:'center',justifyContent:'center',color:G,fontSize:16}}>
            🎙️
          </div>
        </div>

      </div>

      {/* SOLD CONFETTI AND BADGE */}
      <AnimatePresence>
        {sold && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} style={{position:'fixed',inset:0,zIndex:300,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(0,0,0,0.85)',backdropFilter:'blur(16px)'}}>
            <motion.div initial={{scale:0.5,opacity:0,rotate:-10,y:100}} animate={{scale:1,opacity:1,rotate:0,y:0}} exit={{scale:1.2,opacity:0}} transition={{type:'spring',stiffness:300,damping:20}} style={{zIndex:305}}>
              {sold.unsold?(
                <div style={{textAlign:'center',background:'linear-gradient(180deg, #1a0005 0%, #000 100%)',border:`2px solid ${BURG}`,borderRadius:30,padding:'48px 64px',boxShadow:`0 40px 100px rgba(193,18,31,0.6)`}}>
                  <div style={{fontFamily:'Rajdhani,sans-serif',fontSize:64,fontWeight:900,color:'#f87171',letterSpacing:'0.05em'}}>UNSOLD</div>
                  <div style={{fontSize:24,color:'#aaa',marginTop:16,fontWeight:600}}>{sold.playerName}</div>
                </div>
              ):(
                <div style={{textAlign:'center',background:'linear-gradient(180deg, #302400 0%, #000 100%)',border:`2px solid ${G}`,borderRadius:30,padding:'48px 64px',boxShadow:`0 40px 150px rgba(245,184,65,0.5)`}}>
                  <div style={{fontFamily:'Rajdhani,sans-serif',fontSize:64,fontWeight:900,color:G,lineHeight:1,textShadow:`0 0 40px ${G}`}}>SOLD TO</div>
                  <div style={{marginTop:32,display:'flex',alignItems:'center',gap:24,background:`rgba(0,0,0,0.5)`,border:`1px solid ${G}44`,borderRadius:16,padding:'24px 48px'}}>
                    <div>
                      <div style={{fontSize:28,color:'white',fontWeight:800}}>{sold.teamName}</div>
                      <div style={{fontSize:12,color:'#888',fontWeight:700,marginTop:4}}>BUDGET UPDATED</div>
                    </div>
                    <div style={{width:1,height:60,background:'rgba(255,255,255,0.2)'}}/>
                    <div style={{fontSize:48,fontWeight:900,color:EM}}>₹{sold.price} Cr</div>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SQUAD VIEWER MODAL */}
      <AnimatePresence>
        {viewSquadId && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} style={{position:'fixed',inset:0,zIndex:400,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(0,0,0,0.85)',backdropFilter:'blur(16px)'}} onClick={() => setViewSquadId(null)}>
            {(() => {
              const u = room.users.find(x => x.id === viewSquadId);
              if (!u) return null;
              const color = TEAM_COLORS[room.users.findIndex(x=>x.id===u.id)%TEAM_COLORS.length];
              return (
                <motion.div initial={{scale:0.9,opacity:0,y:20}} animate={{scale:1,opacity:1,y:0}} exit={{scale:0.95,opacity:0,y:20}} onClick={e=>e.stopPropagation()} style={{background:'#0a0e13',border:`1px solid ${color[0]}66`,borderRadius:24,padding:32,width:500,maxWidth:'90%',maxHeight:'85vh',display:'flex',flexDirection:'column',boxShadow:`0 40px 100px rgba(0,0,0,0.8), inset 0 0 80px ${color[0]}11`}}>
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:24}}>
                    <div style={{display:'flex',alignItems:'center',gap:16}}>
                      <div style={{width:48,height:48,borderRadius:'50%',background:`transparent`,border:`2px solid ${color[0]}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,fontWeight:900,color:color[0]}}>
                        {u.teamName.slice(0,2).toUpperCase()}
                      </div>
                      <div>
                        <div style={{fontSize:24,fontWeight:900,color:'white',fontFamily:'Rajdhani,sans-serif'}}>{u.teamName}</div>
                        <div style={{fontSize:12,color:'#888',fontWeight:700}}>{u.squad.length} / {room.squadSize||15} PLAYERS BOUGHT</div>
                      </div>
                    </div>
                    <button onClick={() => setViewSquadId(null)} style={{background:'transparent',border:'none',color:'#888',fontSize:24,cursor:'pointer'}}>✕</button>
                  </div>

                  <div style={{flex:1,overflowY:'auto',display:'flex',flexDirection:'column',gap:8,paddingRight:8}}>
                    {u.squad.length === 0 ? (
                      <div style={{padding:32,textAlign:'center',color:'#555',fontWeight:600}}>No players bought yet.</div>
                    ) : (
                      [...u.squad].reverse().map((p, idx) => (
                        <div key={idx} style={{display:'flex',alignItems:'center',justifyContent:'space-between',background:'rgba(255,255,255,0.03)',padding:'12px 16px',borderRadius:12,border:'1px solid rgba(255,255,255,0.05)'}}>
                          <div style={{display:'flex',alignItems:'center',gap:12}}>
                            <div style={{width:8,height:8,borderRadius:'50%',background:color[0]}}/>
                            <div>
                              <div style={{fontSize:14,fontWeight:800,color:'white',fontFamily:'Rajdhani,sans-serif'}}>{p.name}</div>
                              <div style={{fontSize:10,color:'#888',fontWeight:700,marginTop:2}}>{p.role} • {p.country||'IND'}</div>
                            </div>
                          </div>
                          <div style={{fontSize:15,fontWeight:900,color:EM}}>₹{p.soldPrice ?? p.price} Cr</div>
                        </div>
                      ))
                    )}
                  </div>

                  <div style={{marginTop:24,paddingTop:24,borderTop:'1px solid rgba(255,255,255,0.05)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <div>
                      <div style={{fontSize:10,color:'#888',fontWeight:800,letterSpacing:'0.1em'}}>BUDGET LEFT</div>
                      <div style={{fontSize:24,fontWeight:900,color:EM}}>₹{u.budget.toFixed(2)} Cr</div>
                    </div>
                    <button onClick={() => setViewSquadId(null)} style={{padding:'12px 24px',borderRadius:8,background:'rgba(255,255,255,0.05)',color:'white',border:'1px solid rgba(255,255,255,0.1)',fontWeight:800,fontSize:12,cursor:'pointer'}}>CLOSE SQUAD</button>
                  </div>
                </motion.div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FullRing({ label, value, color }) {
  const radius = 28;
  const stroke = 4;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - ((value*10) / 100) * circumference;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <div style={{ position: 'relative', width: radius*2, height: radius*2 }}>
        <svg height={radius * 2} width={radius * 2}>
          <circle stroke="rgba(255,255,255,0.1)" fill="transparent" strokeWidth={stroke} r={normalizedRadius} cx={radius} cy={radius} />
          <motion.circle initial={{ strokeDashoffset: circumference }} animate={{ strokeDashoffset }} transition={{ duration: 1.5, ease: 'easeOut' }} stroke={color} fill="transparent" strokeWidth={stroke} strokeLinecap="round" strokeDasharray={circumference} style={{ strokeDashoffset }} r={normalizedRadius} cx={radius} cy={radius} transform={`rotate(-90 ${radius} ${radius})`} />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 900, color: 'white', fontFamily: 'Rajdhani,sans-serif' }}>
          {value.toFixed(1)}
        </div>
      </div>
      <div style={{ fontSize: 10, fontWeight: 800, color: '#aaa', letterSpacing: '0.05em' }}>{label}</div>
    </div>
  );
}

const LBL={display:'block',fontSize:9,fontWeight:800,letterSpacing:'0.1em',color:'#888',marginBottom:8};
const INP={width:'100%',padding:'12px 14px',borderRadius:8,background:'rgba(0,0,0,0.5)',border:'1px solid #333',color:'white',fontFamily:'Inter,sans-serif',fontSize:14,fontWeight:600,outline:'none',boxSizing:'border-box'};
const BTN={padding:'8px 16px',borderRadius:8,background:'transparent',color:'white',fontWeight:800,fontSize:10,cursor:'pointer',letterSpacing:'0.1em'};
const SIDE_NAV_BTN={display:'flex',flexDirection:'column',alignItems:'center',gap:4,padding:'16px',borderRadius:12,border:'1px solid rgba(245,184,65,0.4)',background:'rgba(0,0,0,0.5)',color:G,cursor:'pointer',fontWeight:800,fontSize:10,letterSpacing:'0.1em'};

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = Math.imul(31, hash) + str.charCodeAt(i) | 0;
  return hash;
}
