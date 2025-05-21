
const express = require('express');
const router = express.Router();
const User = require('../models/User');


router.get('/', async (req, res) => {
  try {
    const loggedInUser = req.user; 
    let users = await User.find({ _id: { $ne: loggedInUser.id } });
    
    users = users.filter(user => !loggedInUser.blocked?.includes(user._id.toString()));
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
