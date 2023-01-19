const router = require('express').Router();
const messageController = require('../controllers/messageController');
const auth = require('../middleware/authMiddleware');

router.get('/:chatId', auth, messageController.getMessage);
router.post('/send-message', auth, messageController.sendMessage);

module.exports = router;
