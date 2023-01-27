import React, { useState, useEffect } from 'react';
import { IoCreateOutline, IoNotifications, IoSearchOutline, IoTrashBin } from 'react-icons/io5';
import { ChatState } from 'context/ChatContext';
import { getSender } from 'config/ChatLogics';
import { deleteChat, getAllChats } from 'api';
import CreateGroupChat from './CreateGroupChat';
import SearchSection from './SearchSection';
import Account from './Account';
import Loader from './Loader';
import moment from 'moment';

const MyChat = () => {
  const { user, selectedChat, setSelectedChat, chats, setChats, fetchAgain } = ChatState();
  const [loading, setLoading] = useState(false);
  const [isCreateGroupChat, setIsCreateGroupChat] = useState(false);
  const [isSearch, setIsSearch] = useState(false);

  useEffect(() => {
    fetchAllChats();
    // eslint-disable-next-line
  }, [fetchAgain]);

  const fetchAllChats = async () => {
    setLoading(true);

    try {
      const { data } = await getAllChats();
      console.log(data);
      setChats(data);

      setLoading(false);
    } catch (error) {
      console.log(error);
      return;
    }
  };

  const handleDeleteChat = async (id) => {
    try {
      const { data } = await deleteChat(id);
      if (data && data.success) {
        fetchAllChats();
        setSelectedChat(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="relative max-w-[400px] w-full bg-white border-r border-gray-200 overflow-y-hidden">
      <div className="flex-1" style={{ height: 'calc(100% - 64px)' }}>
        <div className="p-4 flex items-center justify-between">
          <span
            onClick={() => {
              setSelectedChat(null);
              setIsSearch(false);
            }}
            className="text-lg font-medium text-gray-800 cursor-pointer"
          >
            Chat
          </span>

          <div className="flex space-x-6">
            <button
              type="button"
              className="p-2 rounded-full text-gray-600 hover:text-gray-900 bg-gray-100"
            >
              <IoNotifications className="text-lg" />
            </button>
            <button
              type="button"
              onClick={() => setIsCreateGroupChat(true)}
              className="p-2 rounded-full text-gray-600 hover:text-gray-900 bg-gray-100"
            >
              <IoCreateOutline className="text-lg" />
            </button>
          </div>
        </div>

        <div className="p-4">
          <div
            onClick={() => setIsSearch(true)}
            className="pl-4 flex items-center w-full h-11 rounded-lg text-black/40 bg-gray-100 cursor-pointer select-none"
          >
            <IoSearchOutline className="text-lg" />
            <span className="ml-3 font-light">Search</span>
          </div>
        </div>

        <div className="px-4">
          {chats &&
            chats.map((chat) => (
              <div
                key={chat._id}
                className={`${
                  selectedChat === chat ? 'bg-blue-50' : 'bg-white'
                } mb-1 p-2 flex items-center justify-between rounded-md cursor-pointer transition group`}
              >
                <div className="flex flex-1" onClick={() => setSelectedChat(chat)}>
                  {chat.isGroupChat ? (
                    <div className="flex -space-x-4">
                      {chat.users.slice(0, 2).map((u) => (
                        <img
                          key={u._id}
                          alt={u.name}
                          src={u.image}
                          className={`${
                            chat.users.length === 1
                              ? 'w-12 h-12 border'
                              : 'w-8 h-8 border-2 first:z-10 first:mt-3'
                          } border-white rounded-full bg-white object-cover`}
                        />
                      ))}
                    </div>
                  ) : (
                    <img
                      alt={getSender(user, chat.users).name}
                      src={getSender(user, chat.users).image}
                      className="w-12 h-12 rounded-full bg-white object-cover border border-white"
                    />
                  )}
                  <div className="ml-3 flex-1">
                    <h4 className="text-base font-light">
                      {chat.isGroupChat ? chat.chatName : getSender(user, chat.users).name}
                    </h4>
                    <div className="text-sm text-black/40 font-light space-x-2">
                      {chat.latestMessage?.content && (
                        <>
                          <p>{chat.latestMessage?.content}</p>
                          <p>-</p>
                        </>
                      )}
                      <p>{moment(chat.createdAt).fromNow()}</p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteChat(chat._id)}
                  className="p-2 rounded-full invisible text-gray-400 hover:text-gray-900 group-hover:visible bg-transparent hover:bg-gray-100"
                >
                  <IoTrashBin className="text-lg" />
                </button>
              </div>
            ))}
        </div>
      </div>

      <Account />

      {loading && <Loader />}
      {isSearch && <SearchSection setIsSearch={setIsSearch} />}
      {isCreateGroupChat && <CreateGroupChat setIsCreateGroupChat={setIsCreateGroupChat} />}
    </section>
  );
};

export default MyChat;
