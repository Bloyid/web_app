const express = require('express');
const router = express.Router();
const friendController = require('../controllers/friendController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', friendController.getFriends);
router.get('/search', friendController.searchUsers);
router.get('/requests', friendController.getFriendRequests);
router.post('/request', friendController.sendFriendRequest);
router.get('/request/status/:receiverId', friendController.checkFriendRequestStatus);

module.exports = router;