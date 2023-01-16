import React from 'react';

const UserListItem = ({ user, handleClick }) => {
  return (
    <div
      onClick={handleClick}
      className="px-4 py-2 flex items-center hover:bg-gray-100 hover:cursor-pointer"
    >
      <figure>
        <img
          alt={user?.name}
          src={user?.image}
          className="w-10 h-10 object-cover rounded-full bg-white"
        />
      </figure>
      <div className="ml-3 flex-1">
        <h3>{user.name}</h3>
        <p className="text-sm text-black/40 font-light">{user.email}</p>
      </div>
    </div>
  );
};

export default UserListItem;
