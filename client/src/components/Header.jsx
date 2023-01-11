import React, { useState, useEffect, useRef } from 'react';
import {
  IoCloseOutline,
  IoLogOutOutline,
  IoNotifications,
  IoPersonOutline,
  IoSearchOutline,
  IoSyncOutline,
} from 'react-icons/io5';
import { accessChat, searchUser } from '../utils/Requests';
import { ChatState } from '../context/ChatContext';
import { useNavigate } from 'react-router-dom';
import UserItem from './UserItem';
import SkeletonItem from './SkeletonItem';
import Loader from './Loader';

const Header = () => {
  const { user, chats, setChats, setSelectedChat, notification } = ChatState();

  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [selected, setSelected] = useState({
    profile: false,
    notify: false,
  });

  const navigate = useNavigate();
  const selectedRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (selectedRef.current && !selectedRef.current.contains(e.target)) {
        setSelected({ ...selected, profile: false, notify: false });
        setSearch('');
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [selected]);

  useEffect(() => {
    const handleSearch = async () => {
      if (!search) return;

      setLoading(true);
      try {
        const { data } = await searchUser(search);
        setSearchResult(data.users);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    handleSearch();
  }, [search]);

  const handleAccessChat = async (userId) => {
    setLoadingChat(true);

    try {
      const { data } = await accessChat(userId);

      if (!chats.find((item) => item._id === data._id)) {
        setChats([...chats, data]);
      }

      setSelectedChat(data);
      setLoadingChat(false);
    } catch (error) {
      console.log(error);
    }
  };

  const logout = () => {
    localStorage.removeItem('profile');
    navigate('/');
  };

  return (
    <header className="px-8 h-16 flex items-center justify-between border-b border-gray-100">
      <div className="relative h-10 max-w-sm w-full">
        {search ? null : (
          <span className="block absolute top-1/2 left-3 transform -translate-y-1/2 text-black/30">
            <IoSearchOutline className="text-lg" />
          </span>
        )}
        <input
          type="text"
          name="search"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`${
            search ? 'pl-3' : 'pl-9'
          } w-full h-full text-gray-700 bg-gray-100 placeholder:text-[15px] placeholder:text-black/40 
          border border-gray-200 outline-none rounded-md duration-150 ease-linear`}
        />
        {search && (
          <>
            <span className="block absolute top-1/2 right-3 transform -translate-y-1/2 text-black/30">
              {loading ? (
                <IoSyncOutline className="text-lg animate-spin" />
              ) : (
                <IoCloseOutline
                  className="text-lg hover:text-gray-900 hover:cursor-pointer"
                  onClick={() => setSearch('')}
                />
              )}
            </span>

            <div className="absolute mt-2 right-0 origin-top-right py-2 w-full max-h-[376px] overflow-y-scroll bg-white rounded-md border border-gray-100 shadow-lg z-10">
              {loading ? (
                <SkeletonItem count={6} />
              ) : searchResult.length > 0 ? (
                searchResult.map((user) => (
                  <UserItem key={user._id} user={user} handleClick={() => handleAccessChat(user)} />
                ))
              ) : (
                <div>
                  <p className="text-slate-500 font-light italic">No search result</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <div ref={selectedRef} className="flex items-center space-x-6">
        <div className="relative">
          <div
            onClick={() => {
              setSearch('');
              setSelected({ ...selected, profile: !selected.profile, notify: false });
            }}
            className={`${
              selected.profile ? 'bg-blue-50 text-blue-600' : 'white text-gray-900'
            } px-2 py-1 flex items-center hover:cursor-pointer select-none rounded-full`}
          >
            <img alt={user.user?.name} src={user.user?.image} className="w-8 h-8 object-cover bg-white rounded-full" />
            <span className="ml-2 mr-1 text-sm font-medium">{user.user?.name}</span>
          </div>
          {selected.profile && (
            <div className="absolute mt-2 right-0 origin-top-right w-44 bg-white border border-gray-100 rounded-md shadow-lg z-10">
              <div className="m-1 px-4 py-2 flex items-center text-gray-700 hover:text-gray-900 hover:bg-gray-100 hover:cursor-pointer rounded-md">
                <IoPersonOutline />
                <span className="ml-3 text-sm">Proflie</span>
              </div>
              <div
                onClick={logout}
                className="m-1 px-4 py-2 flex items-center text-gray-700 hover:text-gray-900 hover:bg-gray-100 hover:cursor-pointer rounded-md"
              >
                <IoLogOutOutline />
                <span className="ml-3 text-sm">Logout</span>
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <span
            onClick={() => {
              setSearch('');
              setSelected({ ...selected, notify: !selected.notify, profile: false });
            }}
            className={`${
              selected.notify ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-900'
            } block p-2 rounded-full cursor-pointer select-none`}
          >
            <IoNotifications className="text-lg" />
          </span>
          {notification.length > 0 && (
            <span className="absolute -top-2 -right-3 flex items-center justify-center w-6 h-6 bg-red-500 text-white text-sm rounded-full border-2 border-white">
              {notification.length}
            </span>
          )}
          {selected.notify && (
            <div className="absolute mt-2 right-0 origin-top-right bg-white border border-gray-100 rounded-md shadow-lg z-10">
              <div className="m-1 px-4 py-2 flex items-center hover:bg-gray-100 hover:cursor-pointer rounded-md">
                <span className="ml-3 text-sm">Notify</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {loadingChat && <Loader />}
    </header>
  );
};

export default Header;
