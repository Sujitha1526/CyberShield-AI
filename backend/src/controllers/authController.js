import User from '../models/User.js';
import Violation from '../models/Violation.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d',
  });
};

export const registerUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const user = await User.create({
      username,
      email,
      password,
      role: role || 'user',
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        credibilityScore: user.credibilityScore,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ error: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    // If no user with this email, return a generic error
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check suspension BEFORE password — suspended users get a clear, specific error
    if (user.isSuspended) {
      return res.status(403).json({
        error: 'account_suspended',
        message: 'Your account has been suspended by an administrator due to violations of our community guidelines.',
      });
    }

    // Now verify password
    if (!(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      credibilityScore: user.credibilityScore,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      const violationsCount = await Violation.countDocuments({ user: user._id });
      res.json({
        ...user.toObject(),
        violationsCount
      });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
