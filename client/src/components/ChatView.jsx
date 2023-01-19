import React, { useState } from 'react';
import { ChatState } from 'context/ChatContext';
import { getSender } from 'config/ChatLogics';
import { IoInformation, IoLogoReact, IoSettings } from 'react-icons/io5';
import Header from './Header';
import UpdateGroupChat from './UpdateGroupChat';
import Profile from './Profile';

const ChatView = () => {
  const { user, selectedChat } = ChatState();
  const [isUpdateGroup, setIsUpdateGroup] = useState(false);
  const [isProfile, setIsProfile] = useState(false);

  return (
    <section className="w-full h-full">
      <Header />

      {selectedChat ? (
        <div className="flex flex-col" style={{ width: '100%', height: 'calc(100% - 64px)' }}>
          <div className="px-8 h-16 flex items-center justify-between">
            {selectedChat.isGroupChat ? (
              <>
                <div className="flex items-center">
                  <div className="flex -space-x-4">
                    {selectedChat.users.slice(0, 2).map((u) => (
                      <img
                        key={u._id}
                        alt={u.name}
                        src={u.image}
                        className={`${
                          selectedChat.users.length === 1
                            ? ''
                            : 'first:z-10 first:mt-3 border-2 border-white'
                        } w-8 h-8  rounded-full bg-white object-cover`}
                      />
                    ))}
                  </div>
                  <h2 className="ml-3 text-base font-normal">
                    {selectedChat.isGroupChat ? selectedChat.chatName : ''}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setIsUpdateGroup(true)}
                  className="p-2 rounded-full text-gray-700 hover:text-gray-900 bg-gray-100 transition"
                >
                  <IoSettings />
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center">
                  <img
                    alt={getSender(user.user, selectedChat.users).name}
                    src={getSender(user.user, selectedChat.users).image}
                    className="w-8 h-8 rounded-full bg-white object-cover"
                  />
                  <h2 className="ml-3 text-base font-normal">
                    {!selectedChat.isGroupChat ? getSender(user.user, selectedChat.users).name : ''}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setIsProfile(true)}
                  className="p-2 rounded-full text-gray-700 hover:text-gray-900 bg-gray-100 transition"
                >
                  <IoInformation />
                </button>
              </>
            )}
          </div>

          <div className="flex-1 overflow-y-scroll">1</div>

          <div className="px-8 pb-4">
            <form>
              <input
                type="text"
                name="newMessage"
                placeholder="Type a message"
                className="p-4 rounded-full w-full h-full bg-gray-100 outline-none border-0"
              />
            </form>
          </div>

          {isUpdateGroup && <UpdateGroupChat setIsUpdateGroup={setIsUpdateGroup} />}
          {isProfile && <Profile setIsProfile={setIsProfile} />}
        </div>
      ) : (
        <div
          className="flex flex-col items-center justify-center select-none"
          style={{ width: '100%', height: 'calc(100% - 64px)' }}
        >
          <div className="mb-2 flex items-center">
            <IoLogoReact className="text-5xl text-sky-500" />
            <h1 className="ml-3 text-gray-500 text-5xl font-bold">WeeChat</h1>
          </div>
          <div>
            <p className="text-lg text-gray-500">Select on a user to start chat</p>
          </div>
        </div>
      )}
    </section>
  );
};

export default ChatView;
