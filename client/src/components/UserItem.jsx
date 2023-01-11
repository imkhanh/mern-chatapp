import React from 'react';
import Avatar from './Avatar';

const UserItem = ({ user, handleClick }) => {
  return (
    <div
      onClick={handleClick}
      className="px-4 py-2 bg-white hover:bg-gray-100 flex items-center hover:cursor-pointer transition"
    >
      <Avatar alt={user.name} src={user.image} />
      <div className="ml-3 flex-1">
        <h4 className="text-gray-900">{user.name}</h4>
        <p className="text-sm font-light text-black/40">{user.email}</p>
      </div>
    </div>
  );
};

export default UserItem;
