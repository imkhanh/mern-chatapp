const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userController = {
  searchUser: async (req, res) => {
    try {
      const keyword = req.query.search
        ? {
            $or: [
              { name: { $regex: req.query.search, $options: 'i' } },
              { email: { $regex: req.query.search, $options: 'i' } },
            ],
          }
        : {};

      const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });

      if (users.length === 0) {
        return res.status(400).json({ error: 'User does not exist' });
      } else {
        return res.status(200).json(users);
      }
    } catch (error) {
      return res.status(500).json(error.message);
    }
  },
  register: async (req, res) => {
    try {
      const { name, email, password, image } = req.body;
      if (!(name && email && password && image))
        return res.status(400).json({ error: 'Please fill all the fields' });

      const isExists = await User.findOne({ email });
      if (isExists) res.status(400).json({ error: 'This user already exists' });

      if (password.length < 6)
        return res.status(400).json({ error: 'Password must be at least 6 characters long' });

      const passwordHash = await bcrypt.hash(password, 12);

      const newUser = new User({ name, email, password: passwordHash, image });

      await newUser.save();

      return res.json({
        token: generateToken(newUser._id),
        user: {
          ...newUser._doc,
          password: '',
        },
      });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!(email && password))
        return res.status(400).json({ error: 'Please fill all the fields' });

      const user = await User.findOne({ email });
      if (!user) res.status(400).json({ error: 'User does not exists' });

      if (password.length < 6)
        return res.status(400).json({ error: 'Password must be at least 6 characters long' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ error: 'Password is incorrect' });

      return res.json({
        token: generateToken(user._id),
        user: {
          ...user._doc,
          password: '',
        },
      });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  },
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

module.exports = userController;
