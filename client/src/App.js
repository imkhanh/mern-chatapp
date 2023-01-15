import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ChatProvider from 'context/ChatContext';

import Home from 'scenes/Home';
import Chats from 'scenes/Chats';

import { Toaster } from 'react-hot-toast';

const App = () => {
  return (
    <>
      <BrowserRouter>
        <ChatProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chats" element={<Chats />} />
          </Routes>
        </ChatProvider>
      </BrowserRouter>
      <Toaster position="top-right" />
    </>
  );
};

export default App;
