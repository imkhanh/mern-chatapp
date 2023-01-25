import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Chats from 'pages/Chats';
import { Toaster } from 'react-hot-toast';
import Home from 'pages/Home';

const App = () => {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chats" element={<Chats />} />
      </Routes>
      <Toaster position="top-right" />
    </div>
  );
};

export default App;
