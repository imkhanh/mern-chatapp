import React from 'react';

const CreateGroupChat = ({ setOnCreateGroupChat }) => {
  return (
    <div>
      <div
        onClick={() => setOnCreateGroupChat(false)}
        className="fixed inset-0 w-full h-full bg-black/40 z-50"
      />
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white max-w-xl w-full h-auto rounded-md z-[100]">
        <div className="px-8 py-4 flex items-center justify-between border-b border-gray-200">
          <span className="text-xl font-bold text-gray-900">Create Group Chat</span>
        </div>
        <form className="px-8 py-4 space-y-6">
          <div>
            <label htmlFor="groupName" className="block mb-1 font-medium text-gray-700">
              Group Name
            </label>
            <input
              type="text"
              name="groupName"
              placeholder="Please enter group name"
              className="px-4 text-sm w-full h-11 text-gray-700 bg-white placeholder:text-gray-400 placeholder:font-light 
          border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-offset-2 focus:ring-blue-200 
          duration-150 ease-linear outline-none rounded-md"
            />
          </div>
          <div>
            <label htmlFor="search" className="block mb-1 font-medium text-gray-700">
              Search Name
            </label>
            <input
              type="text"
              name="search"
              placeholder="Please enter user name"
              className="px-4 text-sm w-full h-11 text-gray-700 bg-white placeholder:text-gray-400 placeholder:font-light 
          border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-offset-2 focus:ring-blue-200 
          duration-150 ease-linear outline-none rounded-md"
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setOnCreateGroupChat(false)}
              className="px-6 py-2 text-sm text-gray-500 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-md transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded-md transition"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupChat;
