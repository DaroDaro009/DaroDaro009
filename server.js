const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Handle chat messages
  socket.on('chat message', (data) => {
    console.log('Message received:', data);
    io.emit('chat message', data);
  });

  // Handle user typing
  socket.on('typing', (data) => {
    socket.broadcast.emit('typing', data);
  });

  // Handle user stopped typing
  socket.on('stop typing', (data) => {
    socket.broadcast.emit('stop typing', data);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
