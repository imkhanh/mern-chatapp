const router = require('express').Router();
const chatController = require('../controllers/chatController');
const auth = require('../middleware/authMiddleware');

router.get('/get-all', auth, chatController.getAllChats);
router.post('/access-chat', auth, chatController.accessChat);
router.post('/create-group', auth, chatController.createGroupChat);

router.patch('/add-group', auth, chatController.addToGroupChat);
router.patch('/remove-group', auth, chatController.removeFromGroupChat);
router.patch('/rename-group', auth, chatController.renameGroupChat);
router.delete('/delete-chat/:chatId', auth, chatController.deleteChat);

module.exports = router;
