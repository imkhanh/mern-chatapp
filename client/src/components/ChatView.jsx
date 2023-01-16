import React, { useState } from 'react';
import { ChatState } from 'context/ChatContext';
import { IoAnalyticsOutline, IoInformation, IoSettings } from 'react-icons/io5';
import { getSender } from 'config/ChatLogics';
import Header from './Header';
import UpdateGroupModal from './UpdateGroupModal';

const ChatView = () => {
  const { user, selectedChat } = ChatState();
  const [isUpdate, setIsUpdate] = useState(false);

  return (
    <section className="w-full h-full bg-white">
      <Header />

      {selectedChat ? (
        <div className="flex flex-col" style={{ width: '100%', height: 'calc(100% - 64px)' }}>
          <div className="px-8 h-16 flex items-center justify-between border-b border-gray-100">
            {selectedChat.isGroupChat ? (
              <>
                <div className="flex items-center">
                  <div className="flex -space-x-4">
                    {selectedChat.users.slice(0, 2).map((u) => (
                      <img
                        key={u._id}
                        alt={u.name}
                        src={u.image}
                        className="w-8 h-8 first:z-10 first:mt-3 border-2 border-white
                        rounded-full bg-white object-cover"
                      />
                    ))}
                  </div>
                  <h3 className="ml-3 text-base font-medium text-gray-900">
                    {selectedChat.isGroupChat ? selectedChat.chatName : ''}
                  </h3>
                </div>
                <div>
                  <span
                    onClick={() => setIsUpdate(true)}
                    className="block p-2 rounded-full bg-gray-100 cursor-pointer"
                  >
                    <IoSettings className="text-lg" />
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center">
                  <img
                    alt={getSender(user.user, selectedChat.users).name}
                    src={getSender(user.user, selectedChat.users).image}
                    className="w-9 h-9 rounded-full bg-white object-cover"
                  />
                  <h3 className="ml-3 text-base font-medium text-gray-900">
                    {!selectedChat.isGroupChat ? getSender(user.user, selectedChat.users).name : ''}
                  </h3>
                </div>
                <div>
                  <span className="block p-2 rounded-full bg-gray-100 cursor-pointer">
                    <IoInformation className="text-lg" />
                  </span>
                </div>
              </>
            )}
          </div>

          {isUpdate && <UpdateGroupModal setIsUpdate={setIsUpdate} />}
        </div>
      ) : (
        <div
          className="flex flex-col items-center justify-center"
          style={{ width: '100%', height: 'calc(100% - 64px)' }}
        >
          <div className="flex items-center">
            <IoAnalyticsOutline className="text-7xl text-sky-500" />
            <h1 className="ml-3 text-5xl font-bold">meechat</h1>
          </div>
          <p className="text-lg font-medium text-gray-600">Select on user to start a chat</p>
        </div>
      )}
    </section>
  );
};

export default ChatView;
