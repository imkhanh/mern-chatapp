const Chat = require('../models/chatModel');
const User = require('../models/userModel');

const chatController = {
  accessChat: async (req, res) => {
    const { user } = req.body;

    try {
      if (!user) {
        return res.status(400).json({ error: 'User does not exists' });
      }

      let isChat = await Chat.find({
        isGroupChat: false,
        $and: [
          { users: { $elemMatch: { $eq: req.user._id } } },
          { users: { $elemMatch: { $eq: user } } },
        ],
      })
        .populate('users', '-password')
        .populate('latestMessage');

      isChat = await User.populate(isChat, {
        path: 'latestMessage.sender',
        select: 'name email image',
      });

      if (isChat.length > 0) {
        return res.json(isChat[0]);
      }

      const createChat = await Chat.create({
        chatName: 'sender',
        isGroupChat: false,
        users: [req.user._id, user],
      });

      const fullChat = await Chat.findOne({ _id: createChat._id }).populate('users', '-password');

      return res.status(200).json(fullChat);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
  getAllChats: async (req, res) => {
    try {
      let chats = await Chat.find({})
        .populate('users', '-password')
        .populate('groupAdmin', '-password')
        .populate('latestMessage')
        .sort('-createdAt');

      chats = await User.populate(chats, {
        path: 'latestMessage.sender',
        select: 'name email image',
      });

      return res.status(200).json(chats);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
  createGroupChat: async (req, res) => {
    try {
      if (!req.body.chatName || !req.body.users) {
        return res.status(400).json({ error: 'Fields must be required' });
      }
      const users = JSON.parse(req.body.users);

      if (users.length < 2) {
        return res.status(400).json({ error: 'A group must have at least 3 members' });
      }

      users.push(req.user);

      const createGroup = await Chat.create({
        chatName: req.body.chatName,
        users: users,
        isGroupChat: true,
        groupAdmin: req.user._id,
      });

      const fullGroup = await Chat.findOne({ _id: createGroup._id })
        .populate('users', '-password')
        .populate('groupAdmin', '-password');

      return res.status(200).json(fullGroup);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
  addToGroupChat: async (req, res) => {
    const { userId } = req.body;

    try {
      if (!userId) {
        return res.status(400).json({ error: 'User does not exists' });
      }

      const chatData = await Chat.findByIdAndUpdate(
        { _id: req.params.id },
        {
          $push: { users: userId },
        },
        { new: true }
      )
        .populate('users', '-password')
        .populate('groupAdmin', '-password');

      return res.status(200).json(chatData);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
  removeFromGroupChat: async (req, res) => {
    const { userId } = req.body;

    try {
      if (!userId) {
        return res.status(400).json({ error: 'User does not exists' });
      }

      const chatData = await Chat.findByIdAndUpdate(
        { _id: req.params.id },
        {
          $pull: { users: userId },
        },
        { new: true }
      )
        .populate('users', '-password')
        .populate('groupAdmin', '-password');

      return res.status(200).json(chatData);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
  renameGroupChat: async (req, res) => {
    const { chatName } = req.body;

    try {
      if (!chatName) {
        return res.status(400).json({ error: 'Please enter group name' });
      }

      const chatData = await Chat.findByIdAndUpdate(
        { _id: req.params.id },
        {
          chatName: chatName,
        },
        { new: true }
      )
        .populate('users', '-password')
        .populate('groupAdmin', '-password');

      return res.status(200).json(chatData);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
  deleteChat: async (req, res) => {
    try {
      await Chat.findByIdAndDelete(req.params.id);
      return res.json({ success: true });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
};

module.exports = chatController;
