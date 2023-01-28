import React, { useState, useEffect, useRef } from 'react';
import {
  IoChatbox,
  IoChevronDown,
  IoChevronUp,
  IoCloseCircle,
  IoHelpCircle,
  IoLogOut,
  IoNotifications,
  IoPeople,
  IoPersonCircle,
  IoSearchOutline,
  IoSync,
  IoTrashBin,
} from 'react-icons/io5';
import { ChatState } from 'context/ChatContext';
import { useNavigate } from 'react-router-dom';
import { accessChat, addNotification, deleteNotification, getNotification, searchUser } from 'api';
import ProfileModal from './ProfileModal';
import SkeletonItem from './SkeletonItem';
import UserListItem from './UserListItem';
import Loader from './Loader';
import moment from 'moment';

const Header = () => {
  const { user, chats, setChats, setSelectedChat, notification, setNotification } = ChatState();

  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [isProfile, setIsProfile] = useState(false);
  const [selectedTab, setSelectedTab] = useState({
    profile: false,
    notify: false,
  });

  const navigate = useNavigate();
  const selectedRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (selectedRef.current && !selectedRef.current.contains(e.target)) {
        setSelectedTab({ ...selectedTab, profile: false, notify: false });
        setSearch('');
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
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate('/');
  };

  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const { data } = await getNotification();

        setNotification(data.map((item) => item.notificationId));
      } catch (error) {
        console.log(error);
      }
    };

    fetchNotification();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    handleAddNotification();

    // eslint-disable-next-line
  }, [notification]);

  const handleAddNotification = async () => {
    if (!notification.length) return;

    try {
      await addNotification({ notification: notification[0].chatId.latestMessage });
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteNotify = async (id) => {
    try {
      await deleteNotification(id);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <header className="px-8 h-16 w-full flex items-center justify-between border-b border-gray-200">
      <div className="relative max-w-sm w-full h-10">
        {search ? null : (
          <span className="absolute top-1/2 left-3 transform -translate-y-1/2 text-lg text-black/30">
            <IoSearchOutline />
          </span>
        )}
        <input
          type="text"
          name="search"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`${
            search ? 'pl-3' : 'pl-10'
          } w-full h-full bg-gray-100 outline-none placeholder:font-light rounded-lg duration-200 ease-linear`}
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
            <div className="py-2 absolute mt-2 right-0 origin-top-right bg-white w-full border border-gray-200 rounded-md shadow-lg z-20">
              <div className="p-4 flex items-center text-black/50">
                <IoSearchOutline className="text-lg" />
                <span className="ml-6 font-light">Search for "{search}"</span>
              </div>
              <div className="max-h-[360] overflow-y-scroll bg-white">
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
                  <div className="px-4 py-8 text-center">
                    <p className="font-light text-base text-black/30 italic">User does not exist</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      <div ref={selectedRef} className="flex items-center space-x-6">
        <div className="relative">
          <button
            type="button"
            onClick={() =>
              setSelectedTab({ ...selectedTab, notify: !selectedTab.notify, profile: false })
            }
            className={`${
              selectedTab.notify ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'
            } p-2 rounded-full transition`}
          >
            <IoNotifications className="text-lg" />
          </button>

          {notification.length > 0 && (
            <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-sm bg-red-500 shadow-sm text-white border-2 border-white flex items-center justify-center">
              {notification.length}
            </span>
          )}

          {selectedTab.notify && (
            <div className="absolute mt-2 right-0 origin-top-right w-96 bg-white border border-gray-200 rounded-md shadow-lg z-10">
              <div className="block px-4 py-2 font-medium text-center text-gray-700 bg-gray-50 border-b border-gray-200">
                Notifications
              </div>
              <div className="divide-y divide-gray-100">
                {notification.length > 0 ? (
                  notification.map((notify) => (
                    <div
                      key={notify._id}
                      className="max-w-md w-full flex justify-between px-4 py-3 hover:bg-gray-100 cursor-pointer group"
                    >
                      <div
                        onClick={() => {
                          setSelectedChat(notify.chatId);
                          setSelectedTab({ ...selectedTab, notify: false });
                        }}
                        className="flex flex-1"
                      >
                        <div className="flex-shrink-0">
                          <img
                            alt={notify.sender?.name}
                            src={notify.sender?.image}
                            className="rounded-full w-11 h-11"
                          />
                          <div className="absolute flex items-center justify-center w-5 h-5 ml-6 -mt-5 bg-blue-600 text-white border border-white rounded-full dark:border-gray-800">
                            {notify.chatId.isGroupChat ? (
                              <IoPeople className="text-xs" />
                            ) : (
                              <IoChatbox className="text-xs" />
                            )}
                          </div>
                        </div>
                        <div className="w-full pl-3">
                          <div className="text-gray-500 text-sm mb-1.5">
                            New message {notify.chatId.isGroupChat ? 'in' : 'from'}{' '}
                            <span className="font-semibold text-gray-900">
                              {notify.chatId.isGroupChat
                                ? notify.chatId.chatName
                                : notify.sender.name}
                            </span>
                            : "{notify.content}"
                          </div>
                          <div className="text-xs text-blue-600">
                            {moment(notify.createdAt).fromNow()}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          handleDeleteNotify(notify.chatId._id);
                          setNotification(notification.filter((item) => item !== notify));
                        }}
                        className="p-2 flex items-center invisible group-hover:visible text-gray-500 hover:text-red-500 ransition rounded-full"
                      >
                        <IoTrashBin />
                      </button>
                    </div>
                  ))
                ) : (
                  <div>Empty</div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <div
            className="flex items-center cursor-pointer select-none"
            onClick={() =>
              setSelectedTab({ ...selectedTab, profile: !selectedTab.profile, notify: false })
            }
          >
            <img
              alt={user.name}
              src={user.image}
              className="w-8 h-8 rounded-full bg-white object-cover"
            />
            <div className="ml-2 text-left">
              <span className="block -mb-1 text-sm">{user.name}</span>
              <span className="block text-sm text-black/40 font-light">{user.email}</span>
            </div>

            <span className="block ml-4">
              {selectedTab.profile ? <IoChevronUp /> : <IoChevronDown />}
            </span>
          </div>

          {selectedTab.profile && (
            <ul className="absolute mt-2 right-0 origin-top-right w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
              <li
                onClick={() => {
                  setIsProfile(true);
                  setSelectedTab({ ...selectedTab, profile: false });
                }}
                className="m-1 px-4 py-2 flex items-center text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition rounded-md cursor-pointer"
              >
                <IoPersonCircle />
                <span className="ml-4 text-sm">Profile</span>
              </li>
              <li className="m-1 px-4 py-2 flex items-center text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition rounded-md cursor-pointer">
                <IoHelpCircle />
                <span className="ml-4 text-sm">Q&A</span>
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
          {isProfile && <ProfileModal user={user} setIsProfile={setIsProfile} />}
        </div>
      </div>

      {loadingChat && <Loader />}
    </header>
  );
};

export default Header;
