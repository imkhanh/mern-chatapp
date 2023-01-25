const Chat = require('../models/chatModel');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');

const chatController = {
  accessChat: asyncHandler(async (req, res) => {
    const { user } = req.body;

    if (!user) return res.status(400).json({ error: 'User does not exist' });

    let isChat = await Chat.find({
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: user } } },
      ],
    });

    isChat = await User.populate(isChat, {
      path: 'latestMessage.sender',
      select: 'name email image',
    });

    if (isChat.length > 0) {
      return res.json(isChat[0]);
    }

    try {
      const createChat = await Chat.create({
        isGroupChat: false,
        chatName: 'sender',
        users: [req.user._id, user],
      });

      const fullChat = await Chat.findOne({ _id: createChat._id })
        .populate('users', '-password')
        .populate('groupAdmin', '-password');

      return res.json(fullChat);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }),
  getAllChats: asyncHandler(async (req, res) => {
    try {
      let chats = await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
        .populate('users', '-password')
        .populate('groupAdmin', '-password')
        .populate('latestMessage')
        .sort('-createdAt');

      chats = await User.populate(chats, {
        path: 'latestMessage.sender',
        select: 'nam email image',
      });

      return res.json(chats);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }),
  createGroupChat: asyncHandler(async (req, res) => {
    try {
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }),
  addToGroupChat: asyncHandler(async (req, res) => {
    try {
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }),
  removeFromGroupChat: asyncHandler(async (req, res) => {
    try {
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }),
  renameGroupChat: asyncHandler(async (req, res) => {
    try {
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }),
  deleteChat: asyncHandler(async (req, res) => {
    try {
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }),
};

module.exports = chatController;
