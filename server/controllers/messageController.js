const Message = require('../models/messageModel');
const Chat = require('../models/chatModel');
const User = require('../models/userModel');

const chatController = {
  getMessage: async (req, res) => {
    const { chatId } = req.params;

    try {
      const message = await Message.find({ chatId })
        .populate('sender', '_id name email image')
        .populate('chatId');

      return res.json(message);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
  sendMessage: async (req, res) => {
    const { chatId, content } = req.body;

    if (!chatId || !content) return res.status(400).json({ error: 'Fields must be required' });

    try {
      let message = await Message.create({
        sender: req.user._id,
        chatId,
        content,
      });

      message = await message.populate('sender', '_id name image');
      message = await message.populate('chatId');
      message = await User.populate(message, {
        path: 'chatId.users',
        select: 'name email image',
      });

      await Chat.findByIdAndUpdate(
        chatId,
        {
          latestMessage: message,
        },
        { new: true }
      );

      return res.json(message);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
};

module.exports = chatController;
