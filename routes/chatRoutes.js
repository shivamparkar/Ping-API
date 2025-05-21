// routes/chatRoutes.js
const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

router.get('/messages/:chatId', chatController.getChatMessages);
router.get('/:userId', chatController.getUserChats);
router.post('/createchat', chatController.createChat)
module.exports = router;
