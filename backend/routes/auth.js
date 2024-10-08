const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const router = express.Router();

// RegEx for whitelisting inputs
const validateEmail = (email) => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
const validateAccountNumber = (accountNumber) => /^\d{10}$/.test(accountNumber);  // 10 digits
const validatePassword = (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{6,20}$/.test(password);

// Register a new user
router.post('/register', async (req, res) => {
  const { fullName, idNumber, accountNumber, email, password } = req.body;

  // Validate inputs
  if (!validateEmail(email)) {
    return res.status(400).json({ msg: 'Invalid email format' });
  }
  if (!validateAccountNumber(accountNumber)) {
    return res.status(400).json({ msg: 'Invalid account number format' });
  }
  if (!validatePassword(password)) {
    return res.status(400).json({ msg: 'Password must be 6-20 characters long and include uppercase, lowercase, number, and special character' });
  }

  // Registration process
  try {
    let user = await User.findOne({ accountNumber });
    if (user) {
      return res.status(400).json({ msg: 'Account already exists' });
    }

    user = new User({ fullName, idNumber, accountNumber, email, password });
    await user.save();
    res.status(201).json({ msg: 'User registered successfully', user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Login user
router.post('/login', async (req, res) => {
  const { accountNumber, password } = req.body;

  // Validate inputs
  if (!validateAccountNumber(accountNumber)) {
    return res.status(400).json({ msg: 'Invalid account number format' });
  }
  if (!validatePassword(password)) {
    return res.status(400).json({ msg: 'Invalid password format' });
  }

  try {
    // Find user by accountNumber
    const user = await User.findOne({ accountNumber });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    console.log('Generated Token:', token);

    // Send token and user data as the response
    res.status(200).json({ token, msg: 'Login successful', user });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;