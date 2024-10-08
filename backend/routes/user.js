
const express = require('express');
const authMiddleware = require('../middlewares/authmiddleware'); // Import your middleware

const router = express.Router();

// Protected route to retrieve user data
router.get('/user-data', authMiddleware, (req, res) => {
  // This route is protected by JWT, and the decoded user data is available in req.user
  res.status(200).json({ 
    msg: 'User data retrieved successfully', 
    userId: req.user.userId // The userId is available in req.user from the decoded token
  });
});

module.exports = router;
