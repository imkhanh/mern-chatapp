import React, { useState, useEffect } from 'react';
import { accessChat, searchUser } from 'api';
import {
  IoChevronDown,
  IoChevronUp,
  IoCloseCircle,
  IoHelpCircle,
  IoLogOut,
  IoNotifications,
  IoPersonCircle,
  IoSearch,
  IoSync,
} from 'react-icons/io5';
import { ChatState } from 'context/ChatContext';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import UserListItem from './UserListItem';
import SkeletonItem from './SkeletonItem';
import Loader from './Loader';

const Header = () => {
  const { user, chats, setChats, setSelectedChat } = ChatState();

  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [options, setOptions] = useState({
    profile: false,
    notify: false,
  });

  const navigate = useNavigate();
  const optionRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (optionRef.current && !optionRef.current.contains(e.target)) {
        setOptions({ ...options, profile: false, notify: false });
      }
    };

    document.addEventListener('click', handleClick);

    return () => document.removeEventListener('click', handleClick);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const handleSearch = async () => {
      if (!search) return;

      setLoading(true);

      try {
        const { data } = await searchUser(search);
        setUsers(data.users);
        setLoading(false);
      } catch (error) {
        console.log(error);
        return;
      }
    };

    handleSearch();
  }, [search]);

  const handleAccessChat = async (user) => {
    setLoadingChat(true);

    try {
      const { data } = await accessChat(user);

      if (!chats.find((item) => item._id === data._id)) {
        setChats([...chats, data]);
      }

      setSelectedChat(data);
      setSearch('');
      setLoadingChat(false);
    } catch (error) {
      console.log(error);
      setLoadingChat(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <header className="px-8 h-16 w-full flex items-center justify-between border-b border-gray-200">
      <div className="relative max-w-sm w-full h-10">
        {search ? null : (
          <span className="absolute top-1/2 left-3 transform -translate-y-1/2 text-lg text-black/30">
            <IoSearch />
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
          } w-full h-full bg-gray-100 outline-none placeholder:text-[15px] rounded-full duration-200 ease-linear`}
        />
        {search && (
          <>
            <span className="absolute top-1/2 right-3 transform -translate-y-1/2 text-lg text-black/30">
              {loading ? (
                <IoSync className="animate-spin" />
              ) : (
                <IoCloseCircle
                  className="cursor-pointer select-none"
                  onClick={() => setSearch('')}
                />
              )}
            </span>

            <div className="py-2 absolute mt-2 right-0 origin-top-right w-full max-h-[372px] overflow-y-scroll bg-white border border-gray-200 rounded-md shadow-lg z-10">
              {loading ? (
                <SkeletonItem count={6} />
              ) : users && users.length > 0 ? (
                users.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleClick={() => handleAccessChat(user)}
                  />
                ))
              ) : (
                <div className="h-[372px] flex items-center justify-center">
                  <p className="font-light text-base text-gray-400 italic">User does not exist</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <div ref={optionRef} className="flex items-center space-x-6">
        <div className="relative">
          <button
            type="button"
            className="p-2 rounded-full text-gray-600 hover:text-gray-800 bg-gray-100"
            onClick={() => setOptions({ ...options, notify: !options.notify, profile: false })}
          >
            <IoNotifications className="text-lg" />
          </button>
          {options.notify && (
            <ul className="absolute mt-2 right-0 origin-top-right w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
              Notify
            </ul>
          )}
        </div>

        <div className="relative">
          <button
            type="button"
            className="flex items-center"
            onClick={() => setOptions({ ...options, profile: !options.profile, notify: false })}
          >
            <img
              alt={user.name}
              src={user.image}
              className="w-8 h-8 rounded-full bg-white object-cover"
            />
            <div className="ml-2 mr-3 text-left">
              <span className="block -mb-1 text-sm">{user.name}</span>
              <span className="block text-sm text-black/40 font-light">{user.email}</span>
            </div>

            <div>{options.profile ? <IoChevronUp /> : <IoChevronDown />}</div>
          </button>

          {options.profile && (
            <ul className="absolute mt-2 right-0 origin-top-right w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
              <li className="m-1 px-4 py-2 flex items-center text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition rounded-md cursor-pointer">
                <IoPersonCircle />
                <span className="ml-4 text-sm">Profile</span>
              </li>
              <li className="m-1 px-4 py-2 flex items-center text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition rounded-md cursor-pointer">
                <IoHelpCircle />
                <span className="ml-4 text-sm">Q&A</span>
              </li>
              <li>
                <span className="w-full h-px block bg-gray-200" />
              </li>
              <li
                onClick={logout}
                className="m-1 px-4 py-2 flex items-center text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition rounded-md cursor-pointer"
              >
                <IoLogOut />
                <span className="ml-4 text-sm">Logout</span>
              </li>
            </ul>
          )}
        </div>
      </div>
      {loadingChat && <Loader />}
    </header>
  );
};

export default Header;
