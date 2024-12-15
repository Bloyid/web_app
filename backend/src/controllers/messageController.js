const messageController = {
    sendMessage: async (req, res) => {
      try {
        const { chatId, content } = req.body;
  
        const chat = await prisma.chat.findFirst({
          where: {
            id: chatId,
            participants: {
              some: { id: req.user.userId }
            }
          }
        });
  
        if (!chat) {
          return res.status(403).json({ message: 'Not a participant of this chat' });
        }
  
        const message = await prisma.message.create({
          data: {
            content,
            chatId,
            userId: req.user.userId
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            }
          }
        });
  
        await prisma.chat.update({
          where: { id: chatId },
          data: { lastMessageAt: new Date() }
        });
  
        req.io.to(chatId).emit('new_message', message);
  
        res.json(message);
      } catch (error) {
        res.status(500).json({ message: 'Failed to send message' });
      }
    }
  };