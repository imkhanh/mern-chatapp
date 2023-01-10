const Notification = require('../models/notificationModel');

const notificationController = {
	getNotification: async (req, res) => {
		try {
			const item = await Notification.find({ user: req.user._id })
				.populate('user', '-password')
				.populate('notificationId');

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
			return res.status(500).json({ error: message.error });
		}
	},
	addNotification: async (req, res) => {
		const { notification } = req.body;

		try {
			const isExist = await Notification.findOne({
				notificationId: notification,
			});

			if (isExist) return res.status(400).json({ error: 'Duplicates not allowed' });

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
			return res.status(500).json({ error: message.error });
		}
	},
	deleteNotification: async (req, res) => {
		const { notificationId } = req.params;
		try {
			const item = await Notification.findOneAndDelete({ chatId: notificationId });
			return res.json(item);
		} catch (error) {
			return res.status(500).json({ error: message.error });
		}
	},
};
module.exports = notificationController;
