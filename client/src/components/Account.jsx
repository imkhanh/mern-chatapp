import React, { useState, useEffect } from 'react';
import {
  IoChevronDown,
  IoChevronUp,
  IoHelpCircle,
  IoLogOut,
  IoPersonCircle,
} from 'react-icons/io5';
import { ChatState } from 'context/ChatContext';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import ProfileModal from './ProfileModal';

const Account = () => {
  const { user } = ChatState();

  const [isOpen, setIsOpen] = useState(false);
  const [isProfile, setIsProfile] = useState(false);

  const navigate = useNavigate();
  const divRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (divRef.current && !divRef.current.contains(e.target)) {
        setIsOpen(false);
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
    <header className="px-4 h-16 w-full flex items-center border-t border-gray-200">
      <div ref={divRef} className="relative">
        <div className="flex items-center cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
          <img
            alt={user.name}
            src={user.image}
            className="w-8 h-8 rounded-full bg-white object-cover"
          />
          <div className="ml-2 text-left">
            <span className="block -mb-1 text-sm">{user.name}</span>
            <span className="block text-sm text-black/40 font-light">{user.email}</span>
          </div>

          <span className="block ml-4">{!isOpen ? <IoChevronUp /> : <IoChevronDown />}</span>
        </div>

        {isOpen && (
          <ul className="absolute -top-36 -right-4 w-48 bg-white border border-gray-100 rounded-md shadow-lg z-10">
            <li
              onClick={() => {
                setIsProfile(true);
                setIsOpen(false);
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

      {isProfile && <ProfileModal user={user} setIsProfile={setIsProfile} />}
    </header>
  );
};

export default Account;
