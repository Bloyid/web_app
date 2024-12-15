const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
const JWT_EXPIRY = '7d';
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { name: username }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: existingUser.email === email ? 'Email already registered' : 'Username already taken'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await prisma.user.create({
      data: {
        name: username,
        email,
        password: hashedPassword
      }
    });

    const token = jwt.sign(
      { userId: user.id, username: user.name },
      process.env.JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: COOKIE_MAX_AGE
    });

    res.json({ 
      user: { 
        id: user.id, 
        username: user.name,
        email: user.email 
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, username: user.name },
      process.env.JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: COOKIE_MAX_AGE
    });

    res.json({ 
      user: { 
        id: user.id, 
        username: user.name,
        email: user.email 
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login' });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
};

exports.getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId }
    });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        username: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed' });
  }
};