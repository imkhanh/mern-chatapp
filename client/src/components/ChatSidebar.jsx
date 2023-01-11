import React, { useEffect } from 'react';
import { ChatState } from '../context/ChatContext';
import { getAllChats } from '../utils/Requests';
import { getSender } from '../utils/ChatLogics';
import { IoAddOutline, IoChatbubblesSharp } from 'react-icons/io5';
import Avatar from './Avatar';
import Loader from './Loader';
import moment from 'moment';

const ChatSidebar = () => {
  const { user, chats, setChats, selectedChat, setSelectedChat } = ChatState();

  useEffect(() => {
    fetchAllChats();

    // eslint-disable-next-line
  }, []);

  const fetchAllChats = async () => {
    try {
      const { data } = await getAllChats();
      setChats(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="col-span-3 border-r border-gray-100">
      <div className="px-4 h-16 flex items-center justify-start border-b border-gray-100">
        <IoChatbubblesSharp className="text-4xl" />
        <span className="ml-3 text-xl font-bold">MeChat</span>
      </div>
      <div className="px-4 h-16 flex items-center justify-between ">
        <h1 className="text-gray-900 font-medium">My Chat</h1>
        <span className="block p-2 rounded-full bg-white hover:bg-gray-100 text-gray-900 hover:cursor-pointer">
          <IoAddOutline />
        </span>
      </div>
      <div className="px-2">
        {chats ? (
          chats.map((chat) => (
            <div
              key={chat._id}
              className={`${
                selectedChat === chat ? 'bg-sky-50' : 'bg-white'
              } p-2 flex items-center hover:cursor-pointer rounded-md`}
            >
              <div onClick={() => setSelectedChat(chat)} className="flex flex-1 items-center">
                {chat.isGroupChat ? (
                  <div>Group Chat</div>
                ) : (
                  <Avatar
                    size="48px"
                    alt={!chat.isGroupChat && getSender(user.user, chat.users).name}
                    src={!chat.isGroupChat && getSender(user.user, chat.users).image}
                  />
                )}
                <div className="ml-3">
                  <h3>{chat.isGroupChat ? chat.chatName : getSender(user.user, chat.users).name}</h3>
                  <p className="text-sm font-light text-black/40">{moment(chat.createdAt).fromNow()}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <Loader />
        )}
      </div>
    </section>
  );
};

export default ChatSidebar;
