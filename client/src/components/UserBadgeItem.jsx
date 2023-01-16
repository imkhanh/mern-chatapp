import React from 'react';

const UserBadgeItem = ({ user, handleClick }) => {
  return (
    <div className="p-0.5 flex items-center text-blue-500 hover:text-white bg-blue-50 hover:bg-blue-500 border border-blue-300 rounded-full group cursor-pointer select-none transition-colors">
      <div className="flex items-center">
        <figure>
          <img
            alt={user.name}
            src={user.image}
            className="w-[22px] h-[22px] rounded-full bg-white object-cover border border-white"
          />
        </figure>
        <p className="ml-1 text-sm font-medium">{user.name}</p>
      </div>

      <span
        onClick={handleClick}
        className="ml-2 w-5 h-5 rounded-full text-white group-hover:text-blue-500 bg-blue-500 group-hover:bg-white flex items-center justify-center transition-colors"
      >
        &times;
      </span>
    </div>
  );
};

export default UserBadgeItem;
