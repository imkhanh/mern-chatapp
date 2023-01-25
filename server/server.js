require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

//middleware
app.use(cors());
app.use(express.json());

// connect db
mongoose
  .connect(process.env.MONGO_URI, {
    autoIndex: false,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4,
  })
  .then(() => console.log(`Mongoose DB connected successfully`))
  .catch(() => console.log(`ERROR:::::::`));

// routes
app.use('/api/user', require('./routes/userRoute'));
app.use('/api/chat', require('./routes/chatRoute'));
app.use('/api/message', require('./routes/messageRoute'));
app.use('/api/notification', require('./routes/notificationRoute'));

// run server
const PORT = 5000 || process.env.PORT;
app.listen(PORT, console.log(`Server running on port ::::: ${PORT}`));
