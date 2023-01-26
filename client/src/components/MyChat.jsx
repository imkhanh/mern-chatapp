import React, { useState, useEffect } from 'react';
import { IoCreateOutline, IoSearchOutline, IoTrashBin } from 'react-icons/io5';
import { ChatState } from 'context/ChatContext';
import { getSender } from 'config/ChatLogics';
import { getAllChats } from 'api';
import Loader from './Loader';
import moment from 'moment';
import CreateGroupChat from './CreateGroupChat';
import SearchSection from './SearchSection';

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
      setChats(data);

      setLoading(false);
    } catch (error) {
      console.log(error);
      return;
    }
  };

  return (
    <section className="relative max-w-[400px] w-full bg-white border-r border-gray-200 overflow-hidden">
      <div>
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

          <button
            type="button"
            onClick={() => {
              setIsSearch(false);
              setIsCreateGroupChat(true);
            }}
            className="p-2 rounded-full bg-gray-100"
          >
            <IoCreateOutline className="text-lg" />
          </button>
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

        <div className="px-2">
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
                              ? 'w-8 h-8 border-2 border-white first:z-10 first:-m-3'
                              : 'w-12 h-12 border border-white'
                          } rounded-full bg-white object-cover`}
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
                  className="p-2 rounded-full invisible text-gray-400 hover:text-gray-900 group-hover:visible bg-transparent hover:bg-gray-100"
                >
                  <IoTrashBin className="text-lg" />
                </button>
              </div>
            ))}
        </div>
      </div>

      {loading && <Loader />}

      {isSearch && <SearchSection setIsSearch={setIsSearch} />}
      {isCreateGroupChat && <CreateGroupChat setIsCreateGroupChat={setIsCreateGroupChat} />}
    </section>
  );
};

export default MyChat;
