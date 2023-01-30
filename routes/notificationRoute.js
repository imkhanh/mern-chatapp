const router = require('express').Router();
const notificationController = require('../controllers/notificationController');
const auth = require('../middleware/authMiddleware');

router
  .route('/')
  .get(auth, notificationController.getNotification)
  .post(auth, notificationController.addNotification);

router.delete('/:notificationId', auth, notificationController.deleteNotification);

module.exports = router;
