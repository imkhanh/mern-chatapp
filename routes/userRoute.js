const router = require('express').Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');

router.get('/', auth, userController.searchUser);
router.post('/login', userController.login);
router.post('/register', userController.register);

module.exports = router;
