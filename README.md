# IPL Auction Game 2025-26

A premium, real-time auction experience built with React and Socket.io.

## Features
- **Real-time Bidding**: Instant updates across all connected clients.
- **Room System**: Create a room and share a unique ID for friends to join.
- **Budget Management**: Each team starts with 150 Cr.
- **Squad Limits**: Max 11 players per team as per IPL rules.
- **Dynamic Scoring**: Team points calculated based on player ratings.
- **Premium UI**: Glassmorphism design with IPL-themed aesthetics and animations.

## How to Play
1. **Host a Game**: Enter your name and team name, then click "Create New Room".
2. **Invite Friends**: Share the 6-character Room ID displayed in the lobby.
3. **Join a Game**: Enter your details and the Room ID to join an existing session.
4. **Auction Phase**:
   - Players are presented one by one.
   - Click the "BID" button to raise the price by 0.5 Cr.
   - The highest bidder when the 15-second timer hits zero wins the player.
   - If no one bids, the player goes "Unsold".
5. **Winning**: Once all players are auctioned, the team with the highest average rating (Points) wins!

## Setup Instructions
1. Run `npm install`
2. Start backend: `node server.cjs`
3. Start frontend: `npm run dev`
