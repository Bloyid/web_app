const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.sendFriendRequest = async (req, res) => {
  try {
    const { receiverId } = req.body;
    
    if (!receiverId) {
      return res.status(400).json({ message: 'receiverId is required' });
    }

    if (receiverId === req.user.userId) {
      return res.status(400).json({ message: 'Cannot send friend request to yourself' });
    }

    const receiver = await prisma.user.findUnique({
      where: { id: receiverId }
    });

    if (!receiver) {
      return res.status(404).json({ message: 'User not found' });
    }

    const existingFriend = await prisma.friend.findFirst({
      where: {
        OR: [
          { userId: req.user.userId, friendId: receiverId },
          { userId: receiverId, friendId: req.user.userId }
        ]
      }
    });

    if (existingFriend) {
      return res.status(400).json({ message: 'Already friends' });
    }

    const existingRequest = await prisma.friendRequest.findFirst({
      where: {
        OR: [
          { senderId: req.user.userId, receiverId, status: 'PENDING' },
          { senderId: receiverId, receiverId: req.user.userId, status: 'PENDING' }
        ]
      }
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'Friend request already exists' });
    }

    const request = await prisma.friendRequest.create({
      data: {
        senderId: req.user.userId,
        receiverId,
        status: 'PENDING'
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      }
    });

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: 'Failed to send friend request' });
  }
};

exports.getFriends = async (req, res) => {
  try {
    const friends = await prisma.friend.findMany({
      where: {
        userId: req.user.userId,
      },
      include: {
        friend: {
          select: {
            id: true,
            name: true,
            avatar: true,
          }
        }
      }
    });
    
    const formattedFriends = friends.map(f => ({
      id: f.friend.id,
      name: f.friend.name,
      avatar: f.friend.avatar
    }));

    res.json(formattedFriends);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get friends' });
  }
};

exports.searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query || query.length < 3) {
      return res.json([]);
    }

    const users = await prisma.user.findMany({
      where: {
        AND: [
          { name: { contains: query } },
          { id: { not: req.user.userId } },
          { NOT: { friends: { some: { friendId: req.user.userId } } } }
        ]
      },
      select: {
        id: true,
        name: true,
        avatar: true
      },
      take: 10
    });

    const filteredUsers = users.filter(user => 
      user.name.toLowerCase().includes(query.toLowerCase())
    );

    res.json(filteredUsers);
  } catch (error) {
    res.status(500).json({ message: 'Failed to search users' });
  }
};

exports.getFriendRequests = async (req, res) => {
    try {
      const receivedRequests = await prisma.friendRequest.findMany({
        where: {
          receiverId: req.user.userId,
          status: 'PENDING'
        },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          }
        }
      });
  
      const sentRequests = await prisma.friendRequest.findMany({
        where: {
          senderId: req.user.userId,
          status: 'PENDING'
        },
        include: {
          receiver: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          }
        }
      });
  
      const formattedRequests = [
        ...receivedRequests.map(request => ({
          ...request,
          type: 'INCOMING'
        })),
        ...sentRequests.map(request => ({
          ...request,
          type: 'OUTGOING'
        }))
      ];
  
      res.json(formattedRequests);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get friend requests' });
    }
  };

exports.checkFriendRequestStatus = async (req, res) => {
  try {
    const { receiverId } = req.params;

    const existingRequest = await prisma.friendRequest.findFirst({
      where: {
        OR: [
          { senderId: req.user.userId, receiverId },
          { senderId: receiverId, receiverId: req.user.userId }
        ]
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true
          }
        },
        receiver: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    const existingFriend = await prisma.friend.findFirst({
      where: {
        OR: [
          { userId: req.user.userId, friendId: receiverId },
          { userId: receiverId, friendId: req.user.userId }
        ]
      }
    });

    res.json({
      existingRequest,
      existingFriend,
      canSendRequest: !existingRequest && !existingFriend
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to check friend request status' });
  }
};