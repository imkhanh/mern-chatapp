import React from 'react';

const UserListItem = ({ user, handleClick }) => {
  return (
    <div
      onClick={handleClick}
      className="px-4 py-2 flex items-center hover:bg-gray-100 cursor-pointer transition"
    >
      <img
        alt={user.name}
        src={user.image}
        className="w-10 h-10 rounded-full object-cover bg-white"
      />
      <div className="ml-3 flex-1">
        <h4 className="text-gray-900 text-base font-normal">{user.name}</h4>
        <p className="text-sm text-gray-400"> {user.email} </p>
      </div>
    </div>
  );
};

export default UserListItem;
