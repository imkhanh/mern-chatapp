const Notification = require('../models/notificationModel');

const notificationController = {
  addNotification: async (req, res) => {
    const { notification } = req.body;

    const isExist = await Notification.findOne({ notificationId: notification });
    if (isExist) return res.status(400).json({ error: 'Duplicates not allowed' });

    try {
      var newNotification = await Notification.create({
        user: req.user._id,
        notificationId: notification,
      });

      newNotification = await newNotification.populate('user', 'name email image');
      newNotification = await newNotification.populate('notificationId');

      newNotification = await Notification.populate(newNotification, {
        path: 'notificationId.sender',
        select: 'name email image',
      });

      newNotification = await Notification.populate(newNotification, {
        path: 'notificationId.chatId',
        select: 'chatName isGroupChat latestMessage users',
      });

      newNotification = await Notification.populate(newNotification, {
        path: 'notificationId.chatId.users',
        select: 'name email image',
      });

      return res.json(newNotification);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
  getNotification: async (req, res) => {
    try {
      var notificationItem = await Notification.find({ user: req.user._id })
        .populate('user', 'name email image')
        .populate('notificationId');

      notificationItem = await Notification.populate(notificationItem, {
        path: 'notificationId.sender',
        select: 'name email image',
      });

      notificationItem = await Notification.populate(notificationItem, {
        path: 'notificationId.chatId',
        select: 'chatName isGroupChat latestMessage users',
      });

      notificationItem = await Notification.populate(notificationItem, {
        path: 'notificationId.chatId.users',
        select: 'name email image',
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
  deleteNotification: async (req, res) => {
    const { notificationId } = req.params;

    try {
      const newNotification = await Notification.findOneAndDelete({ chatId: notificationId });
      return res.json(newNotification);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
};
module.exports = notificationController;
