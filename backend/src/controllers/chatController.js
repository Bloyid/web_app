const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getChats = async (req, res) => {
  try {
    const chats = await prisma.chat.findMany({
      where: {
        participants: {
          some: { id: req.user.userId }
        }
      },
      include: {
        participants: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        lastMessageAt: 'desc'
      }
    });

    res.json(chats);
  } catch (error) {
    console.error('Get chats error:', error);
    res.status(500).json({ message: 'Failed to get chats' });
  }
};

exports.createChat = async (req, res) => {
  try {
    const { participantIds, type = 'DIRECT', name } = req.body;
    
    if (type === 'DIRECT' && participantIds.length === 1) {
      const existingChat = await prisma.chat.findFirst({
        where: {
          type: 'DIRECT',
          AND: [
            { participants: { some: { id: req.user.userId } } },
            { participants: { some: { id: participantIds[0] } } }
          ]
        }
      });

      if (existingChat) {
        return res.json(existingChat);
      }
    }

    const chat = await prisma.chat.create({
      data: {
        type,
        name,
        participants: {
          connect: [...participantIds, req.user.userId].map(id => ({ id }))
        }
      },
      include: {
        participants: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      }
    });

    res.json(chat);
  } catch (error) {
    console.error('Create chat error:', error);
    res.status(500).json({ message: 'Failed to create chat' });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { cursor } = req.query;
    const messagesPerPage = 50;

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

    const messages = await prisma.message.findMany({
      where: { chatId },
      take: messagesPerPage,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: 'desc' },
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

    res.json({
      messages,
      nextCursor: messages.length === messagesPerPage ? messages[messages.length - 1].id : null
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Failed to get messages' });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { content } = req.body;

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

    if (req.io) {
      req.io.to(chatId).emit('new_message', message);
    }

    res.json(message);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Failed to send message' });
  }
};