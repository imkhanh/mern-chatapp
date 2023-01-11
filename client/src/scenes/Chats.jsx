import React from 'react';
import ChatSidebar from '../components/ChatSidebar';
import ChatView from '../components/ChatView';
import { ChatState } from '../context/ChatContext';

const Chats = () => {
  const { user } = ChatState();

  return (
    <>
      {user && (
        <div className="h-screen grid grid-cols-12">
          <ChatSidebar />
          <ChatView />
        </div>
      )}
    </>
  );
};

export default Chats;
