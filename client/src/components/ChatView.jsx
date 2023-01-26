import React from 'react';
import { ChatState } from 'context/ChatContext';
import { IoChatbubblesSharp } from 'react-icons/io5';
import Header from './Header';

const ChatView = () => {
  const { selectedChat } = ChatState();

  return (
    <section className="w-full bg-white">
      <Header />

      {selectedChat ? (
        <div className="flex flex-col" style={{ width: '100%', height: 'calc(100% - 64px)' }}>
          <div className="px-8 h-16 flex items-center justify-between">
            {selectedChat.isGroupChat ? (
              <>
                <div></div>
                <button></button>
              </>
            ) : (
              <>
                <div></div>
                <button></button>
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
        </div>
      ) : (
        <div
          className="flex flex-col items-center justify-center"
          style={{ height: 'calc(100% - 64px)' }}
        >
          <div className="mb-1 flex items-center">
            <IoChatbubblesSharp className="text-7xl" />
            <h1 className="ml-3 text-6xl font-bold">mechat</h1>
          </div>
          <p className="text-lg text-gray-500">Select on a user to start chat</p>
        </div>
      )}
    </section>
  );
};

export default ChatView;
