const Notification = require('../models/notificationModel');

const notificationController = {
  addNotification: async (req, res) => {
    try {
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
  getNotification: async (req, res) => {
    try {
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
  deleteNotification: async (req, res) => {
    try {
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
};
module.exports = notificationController;
