import React from 'react';
import { IoClose } from 'react-icons/io5';

const UserBadgeItem = ({ user, handleClick }) => {
  return (
    <div className="pl-1 py-0.5 flex items-center text-blue-500 hover:text-white bg-blue-50 hover:bg-blue-500 border border-blue-300 hover:border-blue-500 group transition rounded-full">
      <div className="flex items-center">
        <img
          alt={user.name}
          src={user.image}
          className="w-[22px] h-[22px] rounded-full bg-white object-cover border border-white"
        />
        <h4 className="ml-1 text-sm font-medium">{user.name}</h4>
      </div>
      <button
        type="button"
        onClick={handleClick}
        className="p-0.5 ml-3 mr-0.5 rounded-full text-white group-hover:text-blue-500 bg-blue-500 group-hover:bg-white transition"
      >
        <IoClose />
      </button>
    </div>
  );
};

export default UserBadgeItem;
