const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Configure CORS for Socket.IO
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // React app URL
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use(cors());
app.use(express.json());

// Store connected users and current background color
const connectedUsers = new Set();
let currentBackgroundColor = '#ffffff'; // Default white background

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  
  // Handle user joining the color room
  socket.on('join_color_room', () => {
    connectedUsers.add(socket.id);
    console.log(`User ${socket.id} joined color room. Total users: ${connectedUsers.size}`);
    
    // Send current color to the new user
    socket.emit('current_color', { color: currentBackgroundColor });
    
    // Update all users with current user count
    io.emit('users_count', connectedUsers.size);
  });

  // Handle color change
  socket.on('change_color', (data) => {
    const { color } = data;
    console.log(`Color changed by ${socket.id} to: ${color}`);
    
    // Update the current background color
    currentBackgroundColor = color;
    
    // Broadcast the color change to all other connected users
    socket.broadcast.emit('color_changed', { color });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    connectedUsers.delete(socket.id);
    console.log(`User ${socket.id} disconnected. Total users: ${connectedUsers.size}`);
    
    // Update all remaining users with current user count
    io.emit('users_count', connectedUsers.size);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🎨 Color Sync Server running on port ${PORT}`);
  console.log(`📱 Connect your React app to http://localhost:${PORT}`);
  console.log(`🌈 Current background color: ${currentBackgroundColor}`);
});
