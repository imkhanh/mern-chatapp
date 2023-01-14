import React from 'react';
import { ChatState } from 'context/ChatContext';
import ChatSidebar from './ChatSidebar';
import ChatView from './ChatView';

const Chats = () => {
  const { user } = ChatState();

  return (
    <div className="h-screen flex items-start">
      {user && <ChatSidebar />}
      {user && <ChatView />}
    </div>
  );
};

export default Chats;
