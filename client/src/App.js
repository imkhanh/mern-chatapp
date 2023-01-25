import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ChatProvider from 'context/ChatContext';

import Home from 'pages/Home';
import Chats from 'pages/Chats';

import { Toaster } from 'react-hot-toast';

const App = () => {
  return (
    <div className="app">
      <BrowserRouter>
        <ChatProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chats" element={<Chats />} />
          </Routes>
        </ChatProvider>
      </BrowserRouter>
      <Toaster position="top-right" />
    </div>
  );
};

export default App;
