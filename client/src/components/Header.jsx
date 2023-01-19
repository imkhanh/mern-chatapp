import React, { useEffect, useRef, useState } from 'react';
import { ChatState } from 'context/ChatContext';
import {
  IoAlertCircleOutline,
  IoChevronDown,
  IoClose,
  IoLogOutOutline,
  IoNotifications,
  IoPersonCircleOutline,
  IoSettingsOutline,
  IoSearch,
  IoSync,
  IoChevronUp,
} from 'react-icons/io5';
import { accessChat, searchUser } from 'api';
import { useNavigate } from 'react-router-dom';
import Skeleton from './Skeleton';
import UserListItem from './UserListItem';
import Loader from './Loader';

const Header = () => {
  const { user, chats, setChats, setSelecetedChat } = ChatState();

  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [clicked, setClicked] = useState({
    profile: false,
    notify: false,
  });

  const divRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClick = (e) => {
      if (divRef.current && !divRef.current.contains(e.target)) {
        setClicked({ ...clicked, profile: false, notify: false });
        setSearch('');
      }
    };

    document.addEventListener('click', handleClick);

    return () => document.removeEventListener('click', handleClick);
  }, [clicked]);

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
    setLoading(true);
    setLoadingChat(true);

    try {
      const { data } = await accessChat(user);
      if (!chats.find((item) => item._id === data._id)) {
        setChats([...chats, data]);
      }
      setSelecetedChat(data);
      setLoading(false);
      setLoadingChat(false);
    } catch (error) {
      console.log(error);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <header className="bg-white px-8 h-16 flex items-center justify-between border-b border-gray-200">
      <div className="relative h-10 max-w-sm w-full">
        <input
          id="search"
          type="text"
          name="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search"
          className="pl-4 pr-10 text-sm w-full h-full bg-white outline-none rounded-lg border border-gray-200 focus:border-blue-500 shadow-sm duration-200 ease-in-out"
        />
        <span className="absolute top-1/2 right-1 -translate-y-1/2 p-2 text-gray-500 transition hover:text-gray-700 cursor-pointer">
          {loading ? (
            <IoSync className="animate-spin" />
          ) : search ? (
            <IoClose onClick={() => setSearch('')} />
          ) : (
            <IoSearch />
          )}
        </span>

        {search && (
          <div className="py-2 absolute mt-2 right-0 origin-top-right w-full max-h-[600px] overflow-y-scroll bg-white border border-gray-100 rounded-md shadow-lg z-10">
            {loading ? (
              <Skeleton count={10} />
            ) : users && users.length > 0 ? (
              users.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleClick={() => handleAccessChat(user)}
                />
              ))
            ) : (
              <div className="py-8 flex items-center justify-center">
                <p className="text-gray-400 font-light italic">User does not exist</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div ref={divRef} className="flex items-center justify-between gap-8">
        <div className="relative">
          <button
            type="button"
            onClick={() => setClicked({ ...clicked, notify: !clicked.notify, profile: false })}
            className="block shrink-0 rounded-full bg-gray-100 p-2.5 text-gray-600 shadow-sm hover:text-gray-700"
          >
            <IoNotifications className="text-lg" />
          </button>

          {clicked.notify && (
            <ul className="absolute mt-2 right-0 origin-top-right bg-white border border-gray-100 rounded-md shadow-lg z-10">
              <li>
                <div className="px-4 py-2 w-80 flex items-center">
                  <IoPersonCircleOutline />
                  <span className="ml-3 text-sm">Profile</span>
                </div>
              </li>
            </ul>
          )}
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setClicked({ ...clicked, profile: !clicked.profile, notify: false })}
            className="group flex shrink-0 items-center rounded-lg hover:bg-gray-100 p-1 transition"
          >
            <img
              alt={user.user.name}
              src={user.user.image}
              className="h-9 w-9 rounded-full object-cover bg-white"
            />
            <p className="mx-2 text-left text-xs">
              <strong className="block font-medium">{user.user.name}</strong>
              <span className="text-gray-500"> {user.user.email} </span>
            </p>
            {clicked.profile ? (
              <IoChevronUp className="text-lg" />
            ) : (
              <IoChevronDown className="text-lg" />
            )}
          </button>

          {clicked.profile && (
            <ul className="absolute mt-2 right-0 origin-top-right w-52 h-auto bg-white border border-gray-100 rounded-md shadow-lg z-10">
              <li>
                <div className="m-1 px-4 py-2 flex items-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition cursor-pointer select-none">
                  <IoPersonCircleOutline />
                  <span className="ml-3 text-sm">Profile</span>
                </div>
              </li>
              <li>
                <div className="m-1 px-4 py-2 flex items-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition cursor-pointer select-none">
                  <IoSettingsOutline />
                  <span className="ml-3 text-sm">Settings</span>
                </div>
              </li>
              <li>
                <div className="m-1 px-4 py-2 flex items-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition cursor-pointer select-none">
                  <IoAlertCircleOutline />
                  <span className="ml-3 text-sm">Support</span>
                </div>
              </li>
              <li>
                <div className="w-full h-px bg-gray-200" />
              </li>
              <li>
                <div
                  onClick={logout}
                  className="m-1 px-4 py-2 flex items-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition cursor-pointer select-none"
                >
                  <IoLogOutOutline />
                  <span className="ml-3 text-sm">Logout</span>
                </div>
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
