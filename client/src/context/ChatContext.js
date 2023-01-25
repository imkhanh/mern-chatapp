import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [notification, setNotification] = useState([]);
  const [fetchAgain, setFetchAgain] = useState(false);

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem('user'));

    setUser(loggedUser);

    if (!loggedUser) navigate('/');
  }, [navigate]);

  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        chats,
        setChats,
        selectedChat,
        setSelectedChat,
        notification,
        setNotification,
        fetchAgain,
        setFetchAgain,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;

export const ChatState = () => {
  return useContext(ChatContext);
};
