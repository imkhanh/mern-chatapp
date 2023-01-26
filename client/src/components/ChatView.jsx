import React, { useState } from 'react';
import { ChatState } from 'context/ChatContext';
import { getSender } from 'config/ChatLogics';
import { IoChatbubblesOutline, IoInformation, IoSettings } from 'react-icons/io5';
import ProfileModal from './ProfileModal';
import UpdateGroupChat from './UpdateGroupChat';

const ChatView = () => {
  const { user, selectedChat } = ChatState();
  const [isProfile, setIsProfile] = useState(false);
  const [isUpdateGroupChat, setIsUpdateGroupChat] = useState(false);

  return (
    <>
      {selectedChat ? (
        <section
          className="w-full bg-white flex flex-col"
          style={{ width: '100%', height: 'calc(100%)' }}
        >
          <div className="px-8 h-16 flex items-center justify-between border-b">
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
                            ? 'border-0'
                            : 'border-2 border-white first:z-10 first:mt-3 '
                        } w-8 h-8 rounded-full bg-white object-cover`}
                      />
                    ))}
                  </div>
                  <h3 className="ml-2 text-gray-900">
                    {selectedChat.isGroupChat ? selectedChat.chatName : ''}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsUpdateGroupChat(true)}
                  className="p-2 rounded-full bg-gray-100"
                >
                  <IoSettings />
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center">
                  <img
                    alt={getSender(user, selectedChat.users).name}
                    src={getSender(user, selectedChat.users).image}
                    className="w-8 h-8 rounded-full bg-white object-cover"
                  />
                  <h3 className="ml-2 text-gray-900">{getSender(user, selectedChat.users).name}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsProfile(true)}
                  className="p-2 rounded-full bg-gray-100"
                >
                  <IoInformation />
                </button>
              </>
            )}
          </div>

          <div className="px-8 flex-1">Message</div>

          <div className="px-8 py-4">
            <form>
              <input
                type="text"
                name="newMessage"
                placeholder="Type a message"
                className="p-4 bg-gray-100 w-full h-full rounded-full outline-none border-0"
              />
            </form>
          </div>

          {isProfile && (
            <ProfileModal user={getSender(user, selectedChat.users)} setIsProfile={setIsProfile} />
          )}
          {isUpdateGroupChat && <UpdateGroupChat setIsUpdateGroupChat={setIsUpdateGroupChat} />}
        </section>
      ) : (
        <section
          className="w-full bg-white flex flex-col items-center justify-center"
          style={{ height: 'calc(100% - 64px)' }}
        >
          <div className="mb-1 flex items-center">
            <IoChatbubblesOutline className="text-5xl" />
            <h1 className="ml-3 text-6xl font-bold">mechat</h1>
          </div>
          <p className="text-lg text-gray-500">Select on a user to start chat</p>
        </section>
      )}
    </>
  );
};

export default ChatView;
