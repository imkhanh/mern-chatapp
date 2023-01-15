import { ChatState } from 'context/ChatContext';
import React from 'react';
import Header from './Header';

const ChatView = () => {
  const { selectedChat } = ChatState();

  return (
    <section className="w-full h-full bg-white">
      <Header />

      {selectedChat ? (
        <div>
          {selectedChat.isGroupChat ? (
            <>
              <div></div>
              <div></div>
            </>
          ) : (
            <>
              <div></div>
              <div></div>
            </>
          )}
        </div>
      ) : (
        <div></div>
      )}
    </section>
  );
};

export default ChatView;
