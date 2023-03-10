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

if (process.env.NODE_ENV === 'production') {
  //*Set static folder up in production
  app.use(express.static('client/build'));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  );
}

// run server
const PORT = 5000 || process.env.PORT;
const server = app.listen(PORT, console.log(`Server running on port ::::: ${PORT}`));

const io = require('socket.io')(server, { cors: { pingTimeout: 6000, origin: '*' } });

io.on('connection', (socket) => {
  console.log('Sockets are in action');

  socket.on('setup', (user) => {
    socket.join(user._id);
    console.log(user.name, 'connected');
    socket.emit('connected');
  });

  socket.on('join chat', (room) => {
    socket.join(room);
    console.log('User joined room::: ' + room);
  });

  socket.on('new message', (newMessage) => {
    var chat = newMessage.chatId;

    if (!chat.users) return;

    chat.users.forEach((user) => {
      if (user._id === newMessage.sender._id) return;

      socket.in(user._id).emit('message received', newMessage);
    });

    socket.on('typing', (room) => {
      socket.in(room).emit('typing');
    });

    socket.on('stop typing', (room) => {
      socket.in(room).emit('stop typing');
    });
  });

  socket.off('setup', () => {
    socket.leave(user._id);
  });
});
