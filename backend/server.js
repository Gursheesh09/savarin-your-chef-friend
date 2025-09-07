const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

// Load environment variables
dotenv.config({ path: './config.env' });

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:8081",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Initialize data store
const dataStore = require('./dataStore');
console.log('✅ In-memory data store initialized with sample data');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const chefRoutes = require('./routes/chefs');
const sessionRoutes = require('./routes/sessions');
const bookingRoutes = require('./routes/bookings');
const paymentRoutes = require('./routes/payments');

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chefs', chefRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Live Chef Marketplace API is running!',
    timestamp: new Date().toISOString(),
    dataStore: {
      users: dataStore.users.size,
      chefs: dataStore.chefs.size,
      sessions: dataStore.sessions.size
    }
  });
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('🔌 New client connected:', socket.id);

  // Join a cooking session room
  socket.on('join-session', (sessionId) => {
    socket.join(sessionId);
    console.log(`👥 User joined session: ${sessionId}`);
  });

  // Leave a cooking session room
  socket.on('leave-session', (sessionId) => {
    socket.leave(sessionId);
    console.log(`👋 User left session: ${sessionId}`);
  });

  // Handle real-time chat messages
  socket.on('send-message', (data) => {
    socket.to(data.sessionId).emit('new-message', {
      sender: data.sender,
      message: data.message,
      timestamp: new Date(),
      type: data.type
    });
  });

  // Handle video call signaling
  socket.on('video-offer', (data) => {
    socket.to(data.sessionId).emit('video-offer', {
      offer: data.offer,
      from: data.from
    });
  });

  socket.on('video-answer', (data) => {
    socket.to(data.sessionId).emit('video-answer', {
      answer: data.answer,
      from: data.from
    });
  });

  socket.on('ice-candidate', (data) => {
    socket.to(data.sessionId).emit('ice-candidate', {
      candidate: data.candidate,
      from: data.from
    });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected:', socket.id);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
 });

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Live Chef Marketplace Backend running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📱 Frontend: ${process.env.FRONTEND_URL || 'http://localhost:8081'}`);
  console.log(`🔌 Socket.io: Ready for real-time connections`);
  console.log(`💾 Using in-memory data store (no database required)`);
});

module.exports = { app, io };
