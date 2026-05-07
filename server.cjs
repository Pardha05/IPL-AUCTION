const express = require('express');
const http    = require('http');
const { Server } = require('socket.io');
const cors    = require('cors');
const path    = require('path');

const app = express();
app.use(cors());

app.use(express.static(path.join(__dirname, 'dist')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*', methods: ['GET','POST'] } });

const PLAYERS = require('./src/players.json');

const rooms = new Map();

function makeRoomId() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

io.on('connection', (socket) => {
  console.log('Connected:', socket.id);

  socket.on('create_room', ({ teamName, playerName }) => {
    const id = makeRoomId();
    const room = {
      id, admin: socket.id, status: 'waiting',
      players: [...PLAYERS],
      currentPlayerIndex: 0, currentBid: PLAYERS[0].base,
      currentBidder: null, timer: 15, history: [],
      users: [{ id: socket.id, name: playerName, teamName, budget: 150, squad: [] }]
    };
    rooms.set(id, room);
    socket.join(id);
    socket.emit('room_created', room);
  });

  socket.on('join_room', ({ roomId, teamName, playerName }) => {
    const room = rooms.get(roomId);
    if (!room || room.status !== 'waiting') {
      return socket.emit('error', 'Room not found or already started.');
    }
    if (room.users.some(u => u.teamName.toLowerCase() === teamName.toLowerCase())) {
      return socket.emit('error', 'That team name is already taken.');
    }
    room.users.push({ id: socket.id, name: playerName, teamName, budget: 150, squad: [] });
    socket.join(roomId);
    io.to(roomId).emit('room_updated', room);
  });

  socket.on('start_auction', ({ roomId, order }) => {
    const room = rooms.get(roomId);
    if (!room || room.admin !== socket.id) return;
    
    if (order && order !== 'mixed') {
      room.players.sort((a, b) => {
        if (a.role === order && b.role !== order) return -1;
        if (b.role === order && a.role !== order) return 1;
        return 0;
      });
    }

    room.status = 'active';
    room.currentPlayerIndex = 0;
    room.currentBid   = room.players[0].base;
    room.currentBidder = null;
    room.timer = 15;
    io.to(roomId).emit('auction_started', room);
    startTimer(roomId);
  });

  socket.on('place_bid', ({ roomId, bidAmount }) => {
    const room = rooms.get(roomId);
    if (!room || room.status !== 'active') return;
    const user = room.users.find(u => u.id === socket.id);
    if (!user) return;
    if (user.squad.length >= 11) return socket.emit('error', 'Your squad is full (11/11).');
    if (user.budget < bidAmount)  return socket.emit('error', 'Insufficient budget.');
    if (bidAmount <= room.currentBid) return;
    room.currentBid    = +bidAmount.toFixed(1);
    room.currentBidder = { id: user.id, teamName: user.teamName };
    room.timer = 15;
    io.to(roomId).emit('bid_updated', room);
  });

  socket.on('pause_auction', (roomId) => {
    const room = rooms.get(roomId);
    if (!room || room.admin !== socket.id) return;
    if (room.status !== 'active') return;
    room.status = 'paused';
    io.to(roomId).emit('auction_paused', room);
  });

  socket.on('resume_auction', (roomId) => {
    const room = rooms.get(roomId);
    if (!room || room.admin !== socket.id) return;
    if (room.status !== 'paused') return;
    room.status = 'active';
    io.to(roomId).emit('auction_resumed', room);
    startTimer(roomId);
  });

  socket.on('skip_player', (roomId) => {
    const room = rooms.get(roomId);
    if (!room || room.admin !== socket.id) return;
    if (room.status !== 'active') return;
    
    // Mark as skipped/unsold in history
    const player = room.players[room.currentPlayerIndex];
    room.history.push({ player, soldTo: 'Skipped', price: 0 });

    room.currentPlayerIndex++;
    if (room.currentPlayerIndex < room.players.length) {
      const next = room.players[room.currentPlayerIndex];
      room.currentBid    = next.base;
      room.currentBidder = null;
      room.timer = 15;
      io.to(roomId).emit('player_sold', room);
    } else {
      room.status = 'finished';
      io.to(roomId).emit('auction_finished', room);
    }
  });

  socket.on('end_auction', (roomId) => {
    const room = rooms.get(roomId);
    if (!room || room.admin !== socket.id) return;
    room.status = 'finished';
    io.to(roomId).emit('auction_finished', room);
  });

  socket.on('jump_to_player', ({ roomId, playerIndex }) => {
    const room = rooms.get(roomId);
    if (!room || room.admin !== socket.id) return;
    if (playerIndex >= 0 && playerIndex < room.players.length) {
      room.currentPlayerIndex = playerIndex;
      const next = room.players[room.currentPlayerIndex];
      room.currentBid = next.base;
      room.currentBidder = null;
      room.timer = 15;
      io.to(roomId).emit('player_sold', room); // Using player_sold to update UI
    }
  });

  socket.on('disconnect', () => {
    console.log('Disconnected:', socket.id);
  });
});

function startTimer(roomId) {
  const interval = setInterval(() => {
    const room = rooms.get(roomId);
    if (!room || room.status !== 'active') return clearInterval(interval);

    room.timer--;
    if (room.timer > 0) {
      io.to(roomId).emit('timer_tick', room.timer);
      return;
    }

    // Time's up — sell or mark unsold
    const player = room.players[room.currentPlayerIndex];
    if (room.currentBidder) {
      const buyer = room.users.find(u => u.id === room.currentBidder.id);
      if (buyer) {
        buyer.budget = +(buyer.budget - room.currentBid).toFixed(1);
        buyer.squad.push({ ...player, soldPrice: room.currentBid });
      }
      room.history.push({ player, soldTo: room.currentBidder.teamName, price: room.currentBid });
    } else {
      room.history.push({ player, soldTo: 'Unsold', price: 0 });
    }

    room.currentPlayerIndex++;
    if (room.currentPlayerIndex < room.players.length) {
      const next = room.players[room.currentPlayerIndex];
      room.currentBid    = next.base;
      room.currentBidder = null;
      room.timer = 15;
      io.to(roomId).emit('player_sold', room);
    } else {
      room.status = 'finished';
      io.to(roomId).emit('auction_finished', room);
      clearInterval(interval);
    }
  }, 1000);
}

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`✅  Server running on port ${PORT}`));
