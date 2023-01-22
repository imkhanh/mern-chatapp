import React from 'react';
import { IoClose } from 'react-icons/io5';

const Profile = ({ user, setIsProfile }) => {
  return (
    <div>
      <div
        onClick={() => setIsProfile(false)}
        className="fixed inset-0 w-full h-full bg-black/40 z-50"
      />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-8 max-w-xl w-full h-auto bg-white rounded-md shadow-lg z-[100]">
        <div className="mb-8">
          <h4 className="text-gray-900 text-xl font-bold">
            <span className="underline underline-offset-4 decoration-blue-300">Profile</span>
          </h4>
          <button
            type="button"
            onClick={() => setIsProfile(false)}
            className="absolute top-4 right-4 p-2 rounded-full text-gray-500 hover:text-gray-900 bg-white hover:bg-gray-50 transition"
          >
            <IoClose className="text-lg" />
          </button>
        </div>
        <div className="flex flex-col items-center justify-center">
          <img
            alt={user.name}
            src={user.image}
            className="w-40 h-40 rounded-full bg-white object-cover"
          />
          <div className="pt-6 text-center">
            <h2 className="text-sky-600 font-medium">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
