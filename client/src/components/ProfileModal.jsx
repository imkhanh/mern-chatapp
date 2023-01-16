import React from 'react';
import { IoCloseOutline } from 'react-icons/io5';

const ProfileModal = ({ user, setIsOpen }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 w-full h-full z-50">
      <div className="relative top-1/2 transform -translate-y-1/2 mx-auto p-8 border border-gray-50 max-w-xl w-full shadow-lg rounded-md bg-white z-[100]">
        <div className="mb-8 flex items-center justify-between">
          <span className="text-gray-900 text-xl font-bold">Profile</span>
          <span
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 cursor-pointer"
          >
            <IoCloseOutline className="text-lg" />
          </span>
        </div>
        <div className="py-8 flex flex-col items-center justify-center">
          <figure>
            <img
              alt={user.name}
              src={user.image}
              className="p-1 border-2 border-sky-500 w-40 h-40 rounded-full bg-white object-cover"
            />
          </figure>
          <div className="pt-4 text-center">
            <h1 className="text-lg text-sky-500">{user.name}</h1>
            <p className="text-black/40 font-light">{user.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
