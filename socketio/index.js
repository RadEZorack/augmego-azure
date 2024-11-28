// index.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  credentials: true
}));

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

const PORT = process.env.PORT || 5001;

// Start the server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Keep track of broadcaster and viewers
const broadcasters = new Set();
const viewers = new Set();

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Forward everyone currently online to the new user
  broadcasters.forEach((broadcaster) => {
    console.log(broadcaster, " to ", socket.id)
    io.to(socket.id).emit('broadcaster', broadcaster);
  })

  // Handle broadcaster joining
  socket.on('broadcaster', () => {
    console.log('Broadcaster connected:', socket.id);
    // Tell everyone about the new user
    broadcasters.forEach((broadcaster) => {
      console.log(broadcaster)
      io.to(broadcaster).emit('broadcaster', socket.id);
    })
    // Add the new user for future reference
    broadcasters.add(socket.id);
  });

  // Handle viewer joining
  socket.on('viewer', ({ broadcasterId }) => {
    viewers.add(socket.id);
    console.log('Viewer connected:', socket.id);
    // Notify the specific broadcaster that a viewer has joined
    io.to(broadcasterId).emit('viewer', socket.id);
  });

  // Handle client disconnect
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    if (socket.id in broadcasters) {
      broadcasters.delete(socket.id);
      // Notify viewers that broadcaster has disconnected
      viewers.forEach((viewerId) => {
        io.to(viewerId).emit('broadcasterDisconnected');
      });
    } else {
      viewers.delete(socket.id);
    }
  });

  // Relay the offer to the peer
  socket.on('offer', (payload) => {
    console.log("Forwarding offer");
    io.to(payload.target).emit('offer', payload);
  });

  // Relay the answer to the peer
  socket.on('answer', (payload) => {
    io.to(payload.target).emit('answer', payload);
  });

  // Relay ICE candidates between peers
  socket.on('ice-candidate', (payload) => {
    console.log('Relaying ICE candidate');
    io.to(payload.target).emit('ice-candidate', payload);
  });
});
  