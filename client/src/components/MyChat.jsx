import React, { useState, useEffect } from 'react';
import { IoAdd, IoChatbubblesSharp, IoTrashBin } from 'react-icons/io5';
import { ChatState } from 'context/ChatContext';
import { getSender } from 'config/ChatLogics';
import { getAllChats } from 'api';
import Loader from './Loader';
import moment from 'moment';
import CreateGroupChat from './CreateGroupChat';

const MyChat = () => {
  const { user, selectedChat, setSelectedChat, chats, setChats, fetchAgain } = ChatState();
  const [loading, setLoading] = useState(false);
  const [onCreateGroupChat, setOnCreateGroupChat] = useState(false);

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
    <section className="max-w-sm w-full bg-white border-r border-gray-200">
      <div
        onClick={() => setSelectedChat(null)}
        className="px-4 h-16 flex items-center justify-center border-b cursor-pointer select-none"
      >
        <IoChatbubblesSharp className="text-4xl text-blue-500" />
        <span className="ml-3 text-2xl font-semibold">MeChat</span>
      </div>

      <div>
        <div className="p-4 flex items-center justify-between">
          <span>My Chat</span>
          <button
            type="button"
            onClick={() => setOnCreateGroupChat(true)}
            className="p-2 rounded-full bg-gray-100"
          >
            <IoAdd className="text-lg" />
          </button>
        </div>

        <div className="px-2">
          {chats &&
            chats.map((chat) => (
              <div
                key={chat._id}
                className={`${
                  selectedChat === chat ? 'bg-blue-50' : 'bg-white'
                } p-2 flex items-center justify-between rounded-md cursor-pointer group`}
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
                              : 'w-12 h-12'
                          } rounded-full bg-white object-cover`}
                        />
                      ))}
                    </div>
                  ) : (
                    <img
                      alt={getSender(user, chat.users).name}
                      src={getSender(user, chat.users).image}
                      className="w-12 h-12 rounded-full bg-white object-cover"
                    />
                  )}
                  <div className="ml-3 flex-1">
                    <h4>{chat.isGroupChat ? chat.chatName : getSender(user, chat.users).name}</h4>
                    <p className="text-sm text-black/40 font-light">
                      {moment(chat.createdAt).fromNow()}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className="p-2 rounded-full invisible text-gray-500 hover:text-gray-900 group-hover:visible bg-transparent hover:bg-gray-100"
                >
                  <IoTrashBin className="text-lg" />
                </button>
              </div>
            ))}
        </div>
      </div>

      {loading && <Loader />}
      {onCreateGroupChat && <CreateGroupChat setOnCreateGroupChat={setOnCreateGroupChat} />}
    </section>
  );
};

export default MyChat;
