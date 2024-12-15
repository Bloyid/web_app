const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.post('/', messageController.sendMessage);

module.exports = router;