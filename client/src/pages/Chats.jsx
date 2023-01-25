import React from 'react';
import { ChatState } from 'context/ChatContext';
import ChatView from 'components/ChatView';
import MyChat from 'components/MyChat';

const Chats = () => {
  const { user } = ChatState();

  return (
    <div className="h-screen flex">
      {user && <MyChat />}
      {user && <ChatView />}
    </div>
  );
};

export default Chats;
