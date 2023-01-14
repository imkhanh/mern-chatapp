import { ChatState } from 'context/ChatContext';
import React from 'react';

const ChatView = () => {
  const { selectedChat } = ChatState();

  return (
    <section className="w-full h-full bg-white">
      <div className="px-8 h-16 flex items-center justify-end">Header</div>

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
