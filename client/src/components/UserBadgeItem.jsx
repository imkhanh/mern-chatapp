import React from 'react';
import { IoCloseOutline } from 'react-icons/io5';

const UserBadgeItem = ({ user, handleClick }) => {
  return (
    <div className="pl-1 pr-0.5 py-0.5 flex items-center text-blue-500 hover:text-white bg-blue-50 hover:bg-blue-500 border border-blue-300 rounded-full group transition">
      <div className="flex items-center">
        <img
          alt={user.name}
          src={user.image}
          className="w-5 h-5 rounded-full bg-white object-cover"
        />
        <span className="ml-1.5 text-sm font-medium">{user.name}</span>
      </div>
      <button
        type="button"
        onClick={handleClick}
        className="ml-3 w-5 h-5 rounded-full text-white group-hover:text-blue-500 bg-blue-500 group-hover:bg-white flex items-center justify-center transition"
      >
        <IoCloseOutline />
      </button>
    </div>
  );
};

export default UserBadgeItem;
