import React from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import Avatar from './Avatar';

const UserBadgeItem = ({ user, handleClick }) => {
  return (
    <div className="pl-1 pr-0.5 py-0.5 flex items-center rounded-full bg-blue-50 hover:bg-blue-500 text-blue-500 hover:text-white border border-blue-500 hover:cursor-pointer group transition-colors">
      <Avatar size="22px" alt={user.name} src={user.image} />
      <span className="ml-1.5 text-sm font-medium">{user.name}</span>
      <span
        onClick={handleClick}
        className="ml-2 w-5 h-5 flex items-center justify-center text-white bg-blue-500 rounded-full group-hover:bg-white group-hover:text-blue-500 transition-colors"
      >
        <IoCloseOutline />
      </span>
    </div>
  );
};

export default UserBadgeItem;
