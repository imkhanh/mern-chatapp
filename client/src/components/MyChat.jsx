import React, { useState, useEffect } from 'react';
import { IoCreateOutline, IoTrashBin } from 'react-icons/io5';
import { deleteChat, getAllChats } from 'api';
import { ChatState } from 'context/ChatContext';
import { getSender } from 'config/ChatLogics';
import CreateGroupChat from './CreateGroupChat';
import Loader from './Loader';
import moment from 'moment';

const MyChat = () => {
  const { user, selectedChat, setSelectedChat, chats, setChats, fetchAgain } = ChatState();

  const [loading, setLoading] = useState(false);
  const [isCreateGroupChat, setIsCreateGroupChat] = useState(false);

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
    <section className="max-w-[400px] w-full bg-white border-r border-gray-200">
      <div className="p-4 flex items-center justify-between">
        <span
          onClick={() => setSelectedChat(null)}
          className="text-lg font-medium text-gray-800 cursor-pointer"
        >
          Chat
        </span>

        <button
          type="button"
          onClick={() => setIsCreateGroupChat(true)}
          className="p-2 rounded-full text-gray-600 hover:text-gray-900 bg-gray-100"
        >
          <IoCreateOutline className="text-lg" />
        </button>
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
                  <div className="flex items-center text-sm text-black/40 font-light space-x-2">
                    {chat.latestMessage?.content && (
                      <>
                        <p>
                          {chat.latestMessage?.content?.length < 15
                            ? chat.latestMessage?.content
                            : chat.latestMessage?.content.slice(0, 15) + '...'}
                        </p>
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

      {loading && <Loader />}
      {isCreateGroupChat && <CreateGroupChat setIsCreateGroupChat={setIsCreateGroupChat} />}
    </section>
  );
};

export default MyChat;
