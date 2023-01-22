import React, { useState, useEffect } from 'react';
import { ChatState } from 'context/ChatContext';
import { getSender } from 'config/ChatLogics';
import { IoInformation, IoLogoReact, IoSettings } from 'react-icons/io5';
import Header from './Header';
import Profile from './Profile';
import Messages from './Messages';
import UpdateGroupChat from './UpdateGroupChat';
import Loader from './Loader';
import io from 'socket.io-client';
import { getMessage, sendMessage } from 'api';

var socket, selectedChatCompare;
const ENDPOINT = process.env.REACT_APP_BASE_URL;

const ChatView = () => {
  const { user, selectedChat } = ChatState();
  const [isUpdateGroup, setIsUpdateGroup] = useState(false);
  const [isProfile, setIsProfile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit('setup', user.user);

    socket.on('connected', () => setSocketConnected(true));
    socket.on('typing', () => setIsTyping(true));
    socket.on('stop typing', () => setIsTyping(false));

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    socket.on('message received', (newMessageReceived) => {
      if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chatId._id) {
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
  });

  useEffect(() => {
    fetchMessage();

    selectedChatCompare = selectedChat;

    // eslint-disable-next-line
  }, [selectedChat]);

  const fetchMessage = async () => {
    if (!selectedChat) return;

    setLoading(true);

    try {
      const { data } = await getMessage(selectedChat._id);
      setMessages(data);
      socket.emit('join chat', selectedChat._id);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit('typing', selectedChat._id);
    }

    let timerLength = 3000;
    let lastTime = new Date().getTime();

    setTimeout(() => {
      const timeNow = new Date().getTime();
      const timeDiff = timeNow - lastTime;

      if (timeDiff >= lastTime && typing) {
        setTyping(false);
        socket.emit('stop typing', selectedChat._id);
      }
    }, timerLength);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    socket.emit('stop typing', selectedChat._id);

    try {
      const { data } = await sendMessage({ chatId: selectedChat._id, content: newMessage });

      setMessages([...messages, data]);
      socket.emit('new message', data);

      setNewMessage('');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="w-full h-full">
      <Header />

      {selectedChat ? (
        <div className="flex flex-col" style={{ width: '100%', height: 'calc(100% - 64px)' }}>
          <div className="px-8 h-16 flex items-center justify-between">
            {selectedChat.isGroupChat ? (
              <>
                <div className="flex items-center">
                  <div className="flex -space-x-4">
                    {selectedChat.users.slice(0, 2).map((u) => (
                      <img
                        key={u._id}
                        alt={u.name}
                        src={u.image}
                        className={`${
                          selectedChat.users.length === 1
                            ? ''
                            : 'first:z-10 first:mt-3 border-2 border-white'
                        } w-8 h-8  rounded-full bg-white object-cover`}
                      />
                    ))}
                  </div>
                  <h2 className="ml-3 text-base font-normal">
                    {selectedChat.isGroupChat ? selectedChat.chatName : ''}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setIsUpdateGroup(true)}
                  className="p-2 rounded-full text-gray-700 hover:text-gray-900 bg-gray-100 transition"
                >
                  <IoSettings />
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center">
                  <img
                    alt={getSender(user.user, selectedChat.users).name}
                    src={getSender(user.user, selectedChat.users).image}
                    className="w-8 h-8 rounded-full bg-white object-cover"
                  />
                  <h2 className="ml-3 text-base font-normal">
                    {!selectedChat.isGroupChat ? getSender(user.user, selectedChat.users).name : ''}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setIsProfile(true)}
                  className="p-2 rounded-full text-gray-700 hover:text-gray-900 bg-gray-100 transition"
                >
                  <IoInformation />
                </button>
              </>
            )}
          </div>

          <div className="px-8 flex-1 overflow-y-scroll">
            {isTyping && <div>Typing...</div>}
            {loading ? <Loader /> : <Messages messages={messages} />}
          </div>

          <div className="px-8 py-4">
            <form onSubmit={handleSendMessage}>
              <input
                type="text"
                name="newMessage"
                value={newMessage}
                onChange={typingHandler}
                placeholder="Type a message"
                className="p-4 rounded-full w-full h-full bg-gray-100 outline-none border-0"
              />
            </form>
          </div>

          {isUpdateGroup && <UpdateGroupChat setIsUpdateGroup={setIsUpdateGroup} />}
          {isProfile && (
            <Profile user={getSender(user.user, selectedChat.users)} setIsProfile={setIsProfile} />
          )}
        </div>
      ) : (
        <div
          className="flex flex-col items-center justify-center select-none"
          style={{ width: '100%', height: 'calc(100% - 64px)' }}
        >
          <div className="mb-2 flex items-center">
            <IoLogoReact className="text-5xl text-sky-500" />
            <h1 className="ml-3 text-gray-500 text-5xl font-bold">WeeChat</h1>
          </div>
          <div>
            <p className="text-lg text-gray-500">Select on a user to start chat</p>
          </div>
        </div>
      )}
    </section>
  );
};

export default ChatView;
