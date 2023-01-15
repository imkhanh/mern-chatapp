import React, { useEffect, useState } from 'react';
import { IoAnalyticsOutline, IoCreateOutline, IoTrashBin } from 'react-icons/io5';
import { deleteChat, getAllChats } from 'api';
import { ChatState } from 'context/ChatContext';
import { getSender } from 'config/ChatLogics';
import CreateGroupModal from './CreateGroupModal';
import Loader from './Loader';
import moment from 'moment';

const ChatSidebar = () => {
  const { user, chats, setChats, selectedChat, setSelectedChat } = ChatState();
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchAllChats();

    // eslint-disable-next-line
  }, []);

  const fetchAllChats = async () => {
    setLoading(true);

    try {
      const { data } = await getAllChats();
      setChats(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteChat = async (id) => {
    try {
      const { data } = await deleteChat(id);
      if (data.success) {
        setSelectedChat('');
        fetchAllChats();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="h-full max-w-sm w-full flex flex-col bg-white border-r">
      <div
        onClick={() => setSelectedChat('')}
        className="px-4 h-16 flex items-center border-b hover:cursor-pointer"
      >
        <IoAnalyticsOutline className="text-4xl text-sky-600" />
        <span className="ml-3 text-2xl font-semibold">meechat</span>
      </div>

      <div className="px-4 h-16 w-full flex items-center justify-between">
        <span className="text-base font-medium text-gray-900">My Chats</span>

        <span
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 hover:text-gray-900 cursor-pointer select-none"
        >
          <IoCreateOutline className="text-lg" />
        </span>
      </div>

      <div className="px-2 overflow-y-scroll">
        {loading ? (
          <Loader />
        ) : (
          chats.length > 0 &&
          chats.map((chat) => (
            <div
              key={chat._id}
              className={`${
                selectedChat === chat ? 'bg-blue-50' : 'bg-white'
              } mb-1 p-2 flex items-center justify-between rounded-md cursor-pointer select-none hover:bg-gray-100 group`}
            >
              <div onClick={() => setSelectedChat(chat)} className="flex flex-1 items-center">
                {chat.isGroupChat ? (
                  <div className="flex -space-x-4">
                    {chat.users.slice(0, 2).map((u) => (
                      <img
                        key={user._id}
                        alt={u.name}
                        src={u.image}
                        className="w-12 h-12 rounded-full bg-white object-cover"
                      />
                    ))}
                  </div>
                ) : (
                  <img
                    alt={getSender(user.user, chat.users).name}
                    src={getSender(user.user, chat.users).image}
                    className="w-12 h-12 rounded-full object-cover bg-white"
                  />
                )}
                <div className="ml-3">
                  <h3 className="text-base text-gray-900 font-light">
                    {chat.isGroupChat ? chat.chatName : getSender(user.user, chat.users).name}
                  </h3>
                  <div className="flex items-center text-sm text-black/40 font-light space-x-2">
                    {chat.latestMessage && (
                      <>
                        <p>{chat.latestMessage}</p>
                        <p>-</p>
                      </>
                    )}
                    <p>{moment(chat.createdAt).fromNow('')}</p>
                  </div>
                </div>
              </div>

              <span
                onClick={() => handleDeleteChat(chat._id)}
                className="p-2 rounded-full bg-transparent hover:bg-white text-gray-500 hover:text-gray-900 invisible group-hover:visible"
              >
                <IoTrashBin className="text-lg" />
              </span>
            </div>
          ))
        )}
      </div>

      {isOpen && <CreateGroupModal setIsOpen={setIsOpen} />}
    </section>
  );
};

export default ChatSidebar;
