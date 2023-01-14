import React, { useEffect, useState } from 'react';
import {
  IoAnalyticsOutline,
  IoCloseOutline,
  IoCreateOutline,
  IoSearchOutline,
  IoSyncOutline,
  IoTrashBin,
} from 'react-icons/io5';
import { accessChat, getAllChats, searchUser } from 'utils/Requests';
import { ChatState } from 'context/ChatContext';
import { getSender } from 'utils/ChatLogics';
import TopBarProgress from 'react-topbar-progress-indicator';
import moment from 'moment';

TopBarProgress.config({
  barColors: {
    1: 'black',
  },
});

const ChatSidebar = () => {
  const { user, chats, setChats, selectedChat, setSelectedChat } = ChatState();

  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  useEffect(() => {
    const handleSearch = async () => {
      if (!search) return;

      setLoading(true);

      try {
        const { data } = await searchUser(search);
        setUsers(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    handleSearch();
  }, [search]);

  useEffect(() => {
    fetchAllChats();

    // eslint-disable-next-line
  }, []);

  const fetchAllChats = async () => {
    try {
      const { data } = await getAllChats();
      setChats(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAccessChat = async (user) => {
    setLoadingChat(true);

    try {
      const { data } = await accessChat(user);

      if (!chats.find((c) => c._id === data)) {
        setChats([...chats, data]);
      }
      setSelectedChat(data);
      setSearch('');
      setLoadingChat(false);
    } catch (error) {
      console.log(error);
    }
  };

  const skeletonLoading = (count) => {
    return (
      <>
        {Array(count)
          .fill(1)
          .map((_, index) => (
            <div key={index} className="px-4 py-2 flex items-center bg-white animate-pulse">
              <div className="w-12 h-12 rounded-full bg-black/10"></div>
              <div className="ml-3 flex-1">
                <div className="mb-2 h-4 rounded-full bg-black/10"></div>
                <div className="h-3 rounded-full bg-black/10"></div>
              </div>
            </div>
          ))}
      </>
    );
  };

  return (
    <section className="h-full max-w-sm w-full flex flex-col bg-white border-r">
      <div
        onClick={() => setSelectedChat('')}
        className="px-4 h-16 flex items-center border-b hover:cursor-pointer"
      >
        <IoAnalyticsOutline className="text-5xl text-sky-500" />
      </div>

      <div className="p-4 w-full flex items-center justify-between">
        <span className="text-base font-medium text-gray-900">My Chats</span>

        <span className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 hover:text-gray-900 cursor-pointer select-none">
          <IoCreateOutline className="text-lg" />
        </span>
      </div>

      <div className="mb-4 mx-4 relative h-auto">
        <IoSearchOutline className="absolute top-1/2 left-3 transform -translate-y-1/2 text-lg text-black/40" />
        <input
          type="text"
          id="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search"
          className="pl-10 w-full h-11 placeholder:text-black/40 bg-gray-100 outline-none border-0 rounded-lg"
        />

        {search && (
          <>
            <span className="absolute top-1/2 right-3 transform -translate-y-1/2 text-lg text-black/40">
              {loading ? (
                <IoSyncOutline className="text-lg animate-spin" />
              ) : (
                <IoCloseOutline
                  className="text-lg hover:cursor-pointer"
                  onClick={() => setSearch('')}
                />
              )}
            </span>
            <div
              className="py-2 absolute mt-2 origin-top-right w-full max-h-[600px] overflow-y-scroll bg-white border border-gray-100 
            rounded-lg shadow-xl z-10"
            >
              {users.length > 0 ? (
                users.map((user) => (
                  <div
                    key={user._id}
                    onClick={() => handleAccessChat(user)}
                    className="px-4 py-2 flex items-center hover:bg-gray-100 hover:cursor-pointer"
                  >
                    <figure>
                      <img
                        alt={user?.name}
                        src={user.image}
                        className="w-10 h-10 object-cover rounded-full bg-white"
                      />
                    </figure>
                    <div className="ml-3 flex-1">
                      <h3>{user.name}</h3>
                      <p className="text-sm text-black/40 font-light">{user.email}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="">
                  <p>User does not exists</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <div className="mx-4 overflow-y-scroll">
        {chats.length > 0
          ? chats.map((chat) => (
              <div
                key={chat._id}
                className={`${
                  selectedChat === chat ? 'bg-blue-50' : 'bg-white'
                } mb-1 p-2 flex items-center justify-between rounded-md hover:cursor-pointer hover:bg-gray-100 group`}
              >
                <div onClick={() => setSelectedChat(chat)} className="flex flex-1 items-center">
                  {chat.isGroupChat ? (
                    <div></div>
                  ) : (
                    <img
                      alt={getSender(user.user, chat.users).name}
                      src={getSender(user.user, chat.users).image}
                      className="w-12 h-12 rounded-full object-cover bg-white"
                    />
                  )}
                  <div className="ml-3 flex-1">
                    <h3 className="text-base text-gray-900 font-light">
                      {chat.isGroupChat ? chat.chatName : getSender(user.user, chat.users).name}
                    </h3>
                    <p className="text-sm text-black/40 font-light">
                      {moment(chat.createdAt).fromNow()}
                    </p>
                  </div>
                </div>
                <span className="p-2 rounded-full bg-transparent hover:bg-white text-gray-500 hover:text-gray-900 invisible group-hover:visible">
                  <IoTrashBin className="text-lg" />
                </span>
              </div>
            ))
          : skeletonLoading(10)}
      </div>

      {loadingChat && <TopBarProgress />}
    </section>
  );
};

export default ChatSidebar;
