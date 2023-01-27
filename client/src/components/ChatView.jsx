import React, { useEffect, useState } from 'react';
import { ChatState } from 'context/ChatContext';
import { getSender } from 'config/ChatLogics';
import { getMessage, sendMessage } from 'api';
import { IoInformation, IoLogoWechat, IoSettings } from 'react-icons/io5';
import ProfileModal from './ProfileModal';
import UpdateGroupChat from './UpdateGroupChat';
import Messages from './Messages';
import Loader from './Loader';

import io from 'socket.io-client';

var socket, selectedChatCompare;
const ENDPOINT = process.env.REACT_APP_BASE_URL;

const ChatView = () => {
  const { user, selectedChat, notification, setNotification, fetchAgain, setFetchAgain } =
    ChatState();
  const [isProfile, setIsProfile] = useState(false);
  const [isUpdateGroupChat, setIsUpdateGroupChat] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit('setup', user);
    socket.on('connected', () => setConnected(true));
    socket.on('typing', () => setIsTyping(true));
    socket.on('stop typing', () => setIsTyping(false));

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    socket.on('message received', (newMessageReceived) => {
      if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chatId._id) {
        if (!notification.includes()) {
          setNotification([...notification, newMessageReceived]);
          setFetchAgain(!fetchAgain);
        }
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
    }
  };
  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!connected) return;

    if (!typing) {
      setTyping(true);
      socket.emit('typing', selectedChat._id);
    }

    const length = 3000;
    const lastTimeTyping = new Date().getTime();

    setTimeout(() => {
      const timeNow = new Date().getTime();
      const timeDiff = timeNow - lastTimeTyping;

      if (timeDiff > length && typing) {
        setTyping(false);
        socket.emit('stop typing', selectedChat._id);
      }
    }, length);
  };

  const handleSendeMessage = async (e) => {
    e.preventDefault();

    socket.emit('stop typing', selectedChat._id);

    try {
      const { data } = await sendMessage({ chatId: selectedChat._id, content: newMessage });
      setMessages([...messages, data]);
      socket.emit('new message', data);
      setNewMessage('');
    } catch (error) {
      console.log(error);
      return;
    }
  };

  return (
    <>
      {selectedChat ? (
        <section
          className="w-full bg-white flex flex-col"
          style={{ width: '100%', height: 'calc(100%)' }}
        >
          <div className="px-8 h-16 flex items-center justify-between border-b">
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
                            ? 'border-0'
                            : 'border-2 border-white first:z-10 first:mt-3 '
                        } w-8 h-8 rounded-full bg-white object-cover`}
                      />
                    ))}
                  </div>
                  <h3 className="ml-2 text-gray-900">
                    {selectedChat.isGroupChat ? selectedChat.chatName : ''}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsUpdateGroupChat(true)}
                  className="p-2 rounded-full bg-gray-100"
                >
                  <IoSettings />
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center">
                  <img
                    alt={getSender(user, selectedChat.users).name}
                    src={getSender(user, selectedChat.users).image}
                    className="w-8 h-8 rounded-full bg-white object-cover"
                  />
                  <h3 className="ml-2 text-gray-900">{getSender(user, selectedChat.users).name}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsProfile(true)}
                  className="p-2 rounded-full bg-gray-100"
                >
                  <IoInformation />
                </button>
              </>
            )}
          </div>

          <div className="px-8 flex-1 overflow-y-scroll">
            {loading ? <Loader /> : <Messages messages={messages} />}
          </div>
          {isTyping && <span className="block text-center text-black/40">Typing....</span>}

          <div className="px-8 py-4">
            <form onSubmit={handleSendeMessage}>
              <input
                type="text"
                name="newMessage"
                value={newMessage}
                onChange={typingHandler}
                placeholder="Type a message"
                className="p-4 bg-gray-100 w-full h-full rounded-full outline-none border-0"
              />
            </form>
          </div>

          {isProfile && (
            <ProfileModal user={getSender(user, selectedChat.users)} setIsProfile={setIsProfile} />
          )}
          {isUpdateGroupChat && <UpdateGroupChat setIsUpdateGroupChat={setIsUpdateGroupChat} />}
        </section>
      ) : (
        <section
          className="w-full bg-white flex flex-col items-center justify-center"
          style={{ height: 'calc(100% - 64px)' }}
        >
          <div className="mb-1 flex items-center">
            <IoLogoWechat className="text-6xl text-blue-500" />
            <h1 className="ml-3 text-6xl font-bold">MeChat</h1>
          </div>
          <p className="text-lg text-gray-500">Select on a user to start chat</p>
        </section>
      )}
    </>
  );
};

export default ChatView;
