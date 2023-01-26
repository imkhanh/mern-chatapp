import React, { useState, useEffect } from 'react';
import {
  IoChevronDown,
  IoChevronUp,
  IoHelpCircle,
  IoLogOut,
  IoNotifications,
  IoPersonCircle,
} from 'react-icons/io5';
import { ChatState } from 'context/ChatContext';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';

const Header = () => {
  const { user } = ChatState();

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

  const logout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <header className="px-8 h-16 w-full flex items-center justify-end">
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
    </header>
  );
};

export default Header;
