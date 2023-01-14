const router = require('express').Router();
const chatController = require('../controllers/chatController');
const auth = require('../middleware/authMiddleware');

router.get('/get-all', auth, chatController.getAllChats);
router.post('/access-chat', auth, chatController.accessChat);
router.post('/create-group', auth, chatController.createGroupChat);

router.patch('/add-group/:id', auth, chatController.addToGroupChat);
router.patch('/remove-group/:id', auth, chatController.removeFromGroupChat);
router.patch('/rename-group/:id', auth, chatController.renameGroupChat);
router.delete('/delete-chat/:id', auth, chatController.deleteChat);

module.exports = router;
