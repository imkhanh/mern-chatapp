import React, { useState } from 'react';
import { IoAnalyticsSharp, IoInformation, IoSettings } from 'react-icons/io5';
import { ChatState } from '../context/ChatContext';
import { getSender } from '../utils/ChatLogics';
import UpdateGroupChat from './UpdateGroupChat';
import Avatar from './Avatar';
import Header from './Header';

const ChatView = () => {
  const { user, selectedChat } = ChatState();
  const [onUpdateGroup, setOnUpdateGroup] = useState(false);

  return (
    <section className="col-span-9">
      <Header />

      {selectedChat ? (
        <div className="flex flex-col" style={{ width: '100%', height: 'calc(100% - 64px)' }}>
          <div className="px-8 py-4 flex items-center justify-between border-b border-gray-100">
            {selectedChat.isGroupChat ? (
              <>
                <div
                  onClick={() => setOnUpdateGroup(true)}
                  className="flex items-center hover:cursor-pointer select-none"
                >
                  <div className="flex items-center -space-x-4">
                    {selectedChat.users.slice(0, 2).map((u) => (
                      <img
                        key={u._id}
                        alt={u.name}
                        src={u.image}
                        className="w-8 h-8 first:z-10 border-2 border-white bg-white object-cover rounded-full"
                      />
                    ))}
                  </div>
                  <h4 className="ml-3 text-base">{selectedChat.isGroupChat ? selectedChat.chatName : ''}</h4>
                </div>
                <div
                  onClick={() => setOnUpdateGroup(true)}
                  className="block p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-900 hover:cursor-pointer"
                >
                  <IoSettings />
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center hover:cursor-pointer">
                  <Avatar
                    size="32px"
                    alt={getSender(user.user, selectedChat.users).name}
                    src={!selectedChat.isGroupChat && getSender(user.user, selectedChat.users).image}
                  />
                  <h4 className="ml-3 text-base">
                    {!selectedChat.isGroupChat ? getSender(user.user, selectedChat.users).name : ''}
                  </h4>
                </div>
                <div className="block p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-900 hover:cursor-pointer">
                  <IoInformation />
                </div>
              </>
            )}
          </div>

          <div className="px-8 py-4 flex-1 overflow-y-scroll">2</div>

          <div className="px-8 pb-4">
            <form>
              <input
                type="text"
                name="newMessage"
                placeholder="Type a message"
                className="p-4 w-full h-full bg-gray-100 outline-none border-0 rounded-full"
              />
            </form>
          </div>

          {onUpdateGroup && <UpdateGroupChat setOnUpdateGroup={setOnUpdateGroup} />}
        </div>
      ) : (
        <div
          className="flex flex-col items-center justify-center"
          style={{ width: '100%', height: 'calc(100% - 64px)' }}
        >
          <div className="mb-1 flex items-center">
            <IoAnalyticsSharp className="text-7xl text-sky-500" />
            <h1 className="ml-3 text-7xl font-bold text-slate-900">meechat</h1>
          </div>
          <p className="text-lg text-gray-600">Select on a user to start chat</p>
        </div>
      )}
    </section>
  );
};

export default ChatView;
