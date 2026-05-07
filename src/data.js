import PLAYERS_DATA from './players.json';
export const PLAYERS = PLAYERS_DATA;

export const ROLE_META = {
  BAT:  { label:"Batsman",     cls:"role-bat",  icon:"🏏" },
  BOWL: { label:"Bowler",      cls:"role-bowl", icon:"🎳" },
  AR:   { label:"All-rounder", cls:"role-ar",   icon:"⚡" },
  WK:   { label:"Wicket-keeper",cls:"role-wk", icon:"🧤" },
};

export const TEAM_COLORS = [
  ["#6366f1","#4f46e5"],["#ec4899","#db2777"],["#f59e0b","#d97706"],
  ["#10b981","#059669"],["#06b6d4","#0891b2"],["#8b5cf6","#7c3aed"],
  ["#f97316","#ea580c"],["#14b8a6","#0d9488"],
];

export const avgRating = (squad) => {
  if (!squad?.length) return "0.0";
  return (squad.reduce((s,p)=>s+p.rating,0)/squad.length).toFixed(1);
};
