const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
	try {
		let token = req.headers.authorization.split(' ')[1];

		if (!token) return res.status(400).json({ error: 'Invalid Authorization' });

		const decoded = await jwt.verify(token, process.env.JWT_SECRET);
		const user = await User.findById(decoded.id);
		req.user = user;

		next();
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

module.exports = auth;
