// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const upload = require('../middleware/multerConfig');

router.post('/register', upload.single('img'),authController.register);
router.post('/login', authController.login);

module.exports = router;
