import React, { useEffect, useState } from 'react';
import { IoCreate, IoLogoReact, IoTrashBin } from 'react-icons/io5';
import { getSender } from 'config/ChatLogics';
import { ChatState } from 'context/ChatContext';
import { deleteChat, getAllChats } from 'api';
import CreateGroupChat from './CreateGroupChat';
import Loader from './Loader';
import moment from 'moment';

const ChatSidebar = () => {
  const { user, chats, setChats, selectedChat, setSelectedChat, fetchAgain } = ChatState();

  const [isCreateGroup, setIsCreateGroup] = useState(false);
  const [loading, setLoading] = useState(false);

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
    }
  };

  const handleDeleteChat = async (id) => {
    try {
      await deleteChat(id);
      fetchAllChats();
      setSelectedChat('');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="max-w-sm w-full h-full border-r border-gray-200">
      <div
        onClick={() => setSelectedChat('')}
        className="px-4 h-16 flex items-center border-b border-gray-200"
      >
        <IoLogoReact className="text-3xl text-sky-500" />
        <span className="ml-3 text-2xl font-semibold tracking-wider cursor-pointer">WeeChat</span>
      </div>
      <div className="px-4 h-16 flex items-center justify-between">
        <span>My Chats</span>
        <button
          type="button"
          onClick={() => setIsCreateGroup(true)}
          className="p-2 rounded-full bg-gray-100 cursor-pointer"
        >
          <IoCreate className="text-lg" />
        </button>
      </div>

      <div className="px-2">
        {chats.length > 0 &&
          chats.map((chat) => (
            <div
              key={chat._id}
              className={`${
                selectedChat === chat ? 'bg-blue-50' : 'bg-white'
              } p-2 flex items-center justify-between cursor-pointer rounded-md group`}
            >
              <div onClick={() => setSelectedChat(chat)} className="flex items-center flex-1">
                {chat.isGroupChat ? (
                  <div className="flex -space-x-4">
                    {chat.users.slice(0, 2).map((u) => (
                      <img
                        key={u._id}
                        alt={u.name}
                        src={u.image}
                        className={`${
                          chat.users.length === 1
                            ? 'w-12 h-12'
                            : 'w-8 h-8 first:z-10 first:mt-3 border-2 border-white'
                        } rounded-full bg-white object-cover`}
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
                <div className="ml-3 flex-1">
                  <p className="text-gray-900 font-light">
                    {chat.isGroupChat ? chat.chatName : getSender(user.user, chat.users).name}
                  </p>
                  <div className="flex items-center text-sm text-gray-400 font-light space-x-1">
                    {chat.latestMessage && (
                      <>
                        <p>Alo</p>
                        <p>-</p>
                      </>
                    )}
                    <p>{moment(chat.createdAt).fromNow()}</p>
                  </div>
                </div>
              </div>
              <div className="flex-none">
                <button
                  type="button"
                  onClick={() => handleDeleteChat(chat._id)}
                  className="block p-2 rounded-full text-gray-400 hover:text-gray-900 bg-transparent hover:bg-white cursor-pointer invisible group-hover:visible"
                >
                  <IoTrashBin />
                </button>
              </div>
            </div>
          ))}
      </div>
      {isCreateGroup && <CreateGroupChat setIsCreateGroup={setIsCreateGroup} />}
      {loading && <Loader />}
    </section>
  );
};

export default ChatSidebar;
