const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
const connectedUsers = new Map();

const setupSocket = (io) => {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.userId;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', async (socket) => {
    connectedUsers.set(socket.userId, socket.id);

    socket.on('join-chat', async (chatId) => {
      socket.join(chatId);
    });

    socket.on('send-message', async (data) => {
      try {
        const message = await prisma.message.create({
          data: {
            content: data.content,
            chatId: data.chatId,
            userId: socket.userId
          },
          include: { user: true }
        });
        io.to(data.chatId).emit('new-message', message);
      } catch (error) {
        console.error('Message error:', error);
      }
    });

    socket.on('typing', (data) => {
      socket.to(data.chatId).emit('user-typing', {
        userId: socket.userId,
        chatId: data.chatId
      });
    });

    socket.on('disconnect', () => {
      connectedUsers.delete(socket.userId);
    });
  });
};

module.exports = { setupSocket };