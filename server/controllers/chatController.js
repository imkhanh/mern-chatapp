const Chat = require('../models/chatModel');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');

const chatController = {
  accessChat: asyncHandler(async (req, res) => {
    try {
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }),
  getAllChats: asyncHandler(async (req, res) => {
    try {
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
