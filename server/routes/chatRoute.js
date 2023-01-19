const router = require('express').Router();
const chatController = require('../controllers/chatController');
const auth = require('../middleware/authMiddleware');

router.get('/get-all', auth, chatController.getAllChats);
router.post('/access-chat', auth, chatController.accessChat);
router.post('/create-group', auth, chatController.createGroupChat);

router.post('/add-group', auth, chatController.addToGroupChat);
router.post('/remove-group', auth, chatController.removeFromGroupChat);
router.post('/rename-group', auth, chatController.renameGroupChat);
router.post('/delete-chat', auth, chatController.deleteChat);

module.exports = router;
