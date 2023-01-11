import React, { useEffect, useState } from 'react';
import { IoAddOutline, IoAnalyticsSharp, IoTrashBin } from 'react-icons/io5';
import { ChatState } from '../context/ChatContext';
import { deleteChat, getAllChats } from '../utils/Requests';
import { getSender } from '../utils/ChatLogics';
import CreateGroupChat from './CreateGroupChat';
import Avatar from './Avatar';
import Loader from './Loader';
import moment from 'moment';

const ChatSidebar = () => {
  const { user, chats, setChats, selectedChat, setSelectedChat, fetchAgain } = ChatState();
  const [loading, setLoading] = useState(false);
  const [onCreateGroup, setOnCreateGroup] = useState(false);

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
      const { data } = await deleteChat(id);
      if (data) {
        fetchAllChats();
        setSelectedChat('');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="col-span-3 border-r border-gray-100 select-none">
      <div
        onClick={() => setSelectedChat('')}
        className="px-4 h-16 flex items-center justify-start border-b border-gray-100 hover:cursor-pointer"
      >
        <IoAnalyticsSharp className="text-3xl text-sky-500" />
        <h1 className="ml-3 text-2xl font-bold text-slate-900">meechat</h1>
      </div>

      <div>
        <div className="p-4 flex items-center justify-between ">
          <span className="text-gray-800 font-semibold">My Chat</span>
          <span
            onClick={() => setOnCreateGroup(true)}
            className="block p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-900 hover:cursor-pointer"
          >
            <IoAddOutline className="text-lg" />
          </span>
        </div>
        <div className="px-2">
          {loading ? (
            <Loader />
          ) : (
            chats.length > 0 &&
            chats.map((chat) => (
              <div
                key={chat._id}
                className={`${
                  selectedChat === chat ? 'bg-blue-50' : 'bg-white'
                } p-2 flex items-center justify-between hover:cursor-pointer rounded-md group`}
              >
                <div onClick={() => setSelectedChat(chat)} className="flex flex-1 items-center">
                  {chat.isGroupChat ? (
                    <div className="flex items-center -space-x-4">
                      {chat.users.slice(0, 2).map((u) => (
                        <img
                          key={u._id}
                          alt={u.name}
                          src={u.image}
                          className={`${
                            chat.users?.length === 1 ? 'w-12 h-12' : 'w-8 h-8 first:z-10 border-2 border-white'
                          } bg-white object-cover rounded-full`}
                        />
                      ))}
                    </div>
                  ) : (
                    <Avatar
                      size="48px"
                      alt={!chat.isGroupChat && getSender(user.user, chat.users).name}
                      src={!chat.isGroupChat && getSender(user.user, chat.users).image}
                    />
                  )}
                  <div className="ml-3">
                    <h4 className="text-gray-900 font-light">
                      {chat.isGroupChat ? chat.chatName : getSender(user.user, chat.users).name}
                    </h4>
                    <p className="text-sm font-light text-black/40">{moment(chat.createdAt).fromNow()}</p>
                  </div>
                </div>

                <div>
                  <span
                    onClick={() => handleDeleteChat(chat._id)}
                    className="invisible group-hover:visible block p-2 rounded-full bg-transparent hover:bg-gray-100 text-gray-400 hover:text-gray-900 hover:cursor-pointer"
                  >
                    <IoTrashBin className="text-lg" />
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {onCreateGroup && <CreateGroupChat setOnCreateGroup={setOnCreateGroup} />}
    </section>
  );
};

export default ChatSidebar;
