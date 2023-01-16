import React, { useEffect, useRef, useState } from 'react';
import {
  IoAlertCircleOutline,
  IoCloseOutline,
  IoHelpCircleOutline,
  IoLogOutOutline,
  IoNotifications,
  IoPersonCircleOutline,
  IoSearchOutline,
  IoSyncOutline,
} from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { accessChat, searchUser } from 'api';
import { ChatState } from 'context/ChatContext';
import Loader from './Loader';
import UserListItem from './UserListItem';
import ProfileModal from './ProfileModal';

const Header = () => {
  const { user, chats, setChats, setSelectedChat } = ChatState();

  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState({
    profile: false,
    notify: false,
  });

  const navigate = useNavigate();
  const divRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (divRef.current && !divRef.current.contains(e.target)) {
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
        setUsers(data.users);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    handleSearch();
  }, [search]);

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

  const logout = () => {
    localStorage.removeItem('profile');
    navigate('/');
  };

  return (
    <header className="px-8 h-16 flex items-center justify-between border-b border-gray-200">
      <div className="relative max-w-sm w-full h-10">
        {search ? null : (
          <span className="absolute top-1/2 left-3 transform -translate-y-1/2 text-black/40">
            <IoSearchOutline className="text-lg" />
          </span>
        )}

        <input
          type="text"
          id="search"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`${
            search ? 'pl-3' : 'pl-10'
          } w-full h-full placeholder:text-[15px] placeholder:text-black/40 bg-gray-100 outline-none border border-gray-200 rounded-lg duration-150 ease-linear`}
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
              className="py-2 absolute mt-2 origin-top-right w-full max-h-[376px] overflow-y-scroll bg-white border border-gray-200 
      rounded-md shadow-lg z-10"
            >
              {loading ? (
                <div className="h-[360px] flex items-center justify-center text-black/40">
                  <IoSyncOutline className="text-lg animate-spin" />
                </div>
              ) : users && users.length > 0 ? (
                users.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleClick={() => handleAccessChat(user)}
                  />
                ))
              ) : (
                <div className="h-[360px] flex items-center justify-center text-black/40">
                  <p>User does not exists</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <div ref={divRef} className="flex items-center space-x-6">
        <div className="relative">
          <div
            onClick={() => setSelected({ ...selected, profile: !selected.profile, notify: false })}
            className={`${
              selected.profile ? 'bg-blue-50 text-blue-600' : 'bg-white'
            } px-1.5 py-0.5 flex items-center rounded-full cursor-pointer select-none`}
          >
            <img
              alt={user.user.name}
              src={user.user.image}
              className="w-8 h-8 rounded-full bg-white object-cover"
            />
            <p className="mx-2 text-base">{user.user.name}</p>
          </div>

          {selected.profile && (
            <ul
              className="absolute mt-2 right-1/2 transform translate-x-1/2 w-52 h-auto bg-white border border-gray-200 
      rounded-md shadow-lg z-10"
            >
              <li>
                <div
                  onClick={() => {
                    setIsOpen(true);
                    setSelected({ ...selected, notify: false, profile: false });
                  }}
                  className="m-1 px-4 py-[10px] flex items-center text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-100 rounded-md cursor-pointer transition-colors"
                >
                  <IoPersonCircleOutline className="text-lg" />
                  <span className="ml-4 text-sm font-medium">Profile</span>
                </div>
              </li>
              <li>
                <div className="m-1 px-4 py-[10px] flex items-center text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-100 rounded-md cursor-pointer transition-colors">
                  <IoAlertCircleOutline className="text-lg" />
                  <span className="ml-4 text-sm font-medium">Support</span>
                </div>
              </li>
              <li>
                <div className="m-1 px-4 py-[10px] flex items-center text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-100 rounded-md cursor-pointer transition-colors">
                  <IoHelpCircleOutline className="text-lg" />
                  <span className="ml-4 text-sm font-medium">Q&A</span>
                </div>
              </li>
              <li>
                <div className="w-full h-px bg-gray-200" />
              </li>
              <li>
                <div
                  onClick={logout}
                  className="m-1 px-4 py-[10px] flex items-center text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-100 rounded-md cursor-pointer transition-colors"
                >
                  <IoLogOutOutline className="text-lg" />
                  <span className="ml-4 text-sm font-medium">Logout</span>
                </div>
              </li>
            </ul>
          )}
        </div>

        <div className="relative">
          <span
            onClick={() => setSelected({ ...selected, notify: !selected.notify, profile: false })}
            className="block p-2 rounded-full bg-gray-100"
          >
            <IoNotifications className="text-lg" />
          </span>

          {selected.notify && (
            <div
              className="absolute mt-2 right-0 origin-top-right w-80 h-full bg-white border border-gray-200 
              rounded-md shadow-lg z-10"
            >
              Notifications
            </div>
          )}
        </div>
      </div>

      {loadingChat && <Loader />}
      {isOpen && <ProfileModal user={user.user} setIsOpen={setIsOpen} />}
    </header>
  );
};

export default Header;
