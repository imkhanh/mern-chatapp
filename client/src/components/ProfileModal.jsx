import React from 'react';

const ProfileModal = ({ user, setIsProfile }) => {
  return (
    <div>
      <div
        onClick={() => setIsProfile(false)}
        className="fixed inset-0 w-full h-full bg-black/40 z-50"
      />
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white max-w-xl w-full h-auto rounded-md z-[100]">
        <div className="px-8 py-4 flex items-center justify-between border-b border-gray-200">
          <span className="text-xl font-bold text-gray-900">Profile</span>
        </div>
        <div className="p-8 flex flex-col items-center justify-center">
          <img
            alt={user.name}
            src={user.image}
            className="w-40 h-40 rounded-full bg-white object-cover p-1 border border-sky-500"
          />
          <div className="pt-4 text-center">
            <h4 className="text-sky-600 font-medium">Name: {user.name}</h4>
            <p className="text-gray-500">Email: {user.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
