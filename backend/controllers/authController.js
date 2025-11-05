const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register user
const registerUser = async (req, res) => {
  try {
    console.log('Register request received:', req.body);
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      console.log('Missing fields:', { name, email, password, role });
      return res.json({ success: false, message: 'All fields are required' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', email);
      return res.json({ success: false, message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();
    console.log('User registered successfully:', user._id);
    res.json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    console.error('Register error:', error);
    res.json({ success: false, message: error.message });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.json({ success: false, message: 'All fields are required' });
    }
    const user = await User.findOne({ email, role });
    if (!user) {
      return res.json({ success: false, message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret');
    const userData = { _id: user._id, name: user.name, email: user.email };
    res.json({ success: true, token, role, userData });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

module.exports = { registerUser, loginUser };
