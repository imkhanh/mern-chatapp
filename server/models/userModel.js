const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
	{
		name: { type: String, require: true, maxLength: 200 },
		email: { type: String, require: true, unique: true },
		password: { type: String, require: true },
		image: Object,
	},
	{ timestamps: true }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
