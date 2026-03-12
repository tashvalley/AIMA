const { PrismaClient } = require('@prisma/client');
const authService = require('../services/authService');

const prisma = new PrismaClient();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
const NAME_MAX_LENGTH = 100;

exports.register = async (req, res, next) => {
  try {
    const { email, name, password } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ success: false, message: 'Email, name, and password are required' });
    }

    if (typeof email !== 'string' || typeof name !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ success: false, message: 'Invalid input types' });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    }

    if (trimmedName.length > NAME_MAX_LENGTH) {
      return res.status(400).json({ success: false, message: `Name must be ${NAME_MAX_LENGTH} characters or fewer` });
    }

    if (password.length < PASSWORD_MIN_LENGTH) {
      return res.status(400).json({ success: false, message: `Password must be at least ${PASSWORD_MIN_LENGTH} characters` });
    }

    if (!PASSWORD_REGEX.test(password)) {
      return res.status(400).json({ success: false, message: 'Password must contain at least one uppercase letter, one lowercase letter, and one digit' });
    }

    const existing = await prisma.user.findUnique({ where: { email: trimmedEmail } });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email already in use' });
    }

    const hashedPassword = await authService.hashPassword(password);
    const user = await prisma.user.create({
      data: { email: trimmedEmail, name: trimmedName, password: hashedPassword },
    });

    const token = authService.generateToken(user.id);

    res.status(201).json({
      success: true,
      data: { token, user: { id: user.id, email: user.email, name: user.name } },
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ success: false, message: 'Invalid input types' });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email: trimmedEmail } });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const valid = await authService.comparePassword(password, user.password);
    if (!valid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = authService.generateToken(user.id);

    res.json({
      success: true,
      data: { token, user: { id: user.id, email: user.email, name: user.name } },
    });
  } catch (err) {
    next(err);
  }
};

exports.me = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, email: true, name: true, createdAt: true },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};
