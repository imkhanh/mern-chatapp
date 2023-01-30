const Notification = require('../models/notificationModel');
const asyncHandler = require('express-async-handler');

const notificationController = {
  getNotification: asyncHandler(async (req, res) => {
    try {
      let item = await Notification.find({ user: req.user._id })
        .populate('user', '-password')
        .populate('notificationId')
        .sort('-createdAt');

      item = await Notification.populate(item, {
        path: 'notificationId.sender',
        select: 'name email image',
      });
      item = await Notification.populate(item, {
        path: 'notificationId.chatId',
        select: 'chatName isGroupChat latestMessage users',
      });
      item = await Notification.populate(item, {
        path: 'notificationId.chatId.users',
        select: 'name email image',
      });
      return res.json(item);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }),

  addNotification: asyncHandler(async (req, res) => {
    const { notification } = req.body;

    const isExist = await Notification.findOne({ notificationId: notification });
    if (isExist) return res.status(400).json({ error: 'Notification already exist' });

    try {
      let newItem = await Notification.create({
        user: req.user._id,
        notificationId: notification,
      });

      newItem = await newItem.populate('user', '-password');
      newItem = await newItem.populate('notificationId');

      newItem = await Notification.populate(newItem, {
        path: 'notificationId.sender',
        select: 'name email image',
      });

      newItem = await Notification.populate(newItem, {
        path: 'notificationId.chatId',
        select: 'chatName isGroupChat latestMessage users',
      });

      newItem = await Notification.populate(newItem, {
        path: 'notificationId.chatId.users',
        select: 'name email image',
      });

      return res.json(newItem);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }),

  deleteNotification: asyncHandler(async (req, res) => {
    try {
      await Notification.findByIdAndDelete(req.params.notificationId);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }),
};
module.exports = notificationController;
