const Message = require('../models/messageModel');
const Chat = require('../models/chatModel');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');

const chatController = {
  getMessage: asyncHandler(async (req, res) => {
    try {
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }),

  sendMessage: asyncHandler(async (req, res) => {
    try {
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }),
};

module.exports = chatController;
