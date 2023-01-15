import React from 'react';
import { IoCloseOutline } from 'react-icons/io5';

const CreateGroupModal = ({ setIsOpen }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 w-full h-full z-50">
      <div className="relative top-52 mx-auto p-8 border border-gray-50 max-w-xl w-full shadow-lg rounded-md bg-white z-[100]">
        <div className="mb-8 flex items-center justify-between">
          <span className="text-gray-900 text-xl font-bold">Create Group Chat</span>
          <span
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 cursor-pointer"
          >
            <IoCloseOutline className="text-lg" />
          </span>
        </div>
        <form className="space-y-6">
          <div>
            <label htmlFor="groupName" className="block mb-2 font-medium text-sm text-gray-700">
              Group Name
            </label>
            <input
              type="text"
              name="groupName"
              placeholder="Please enter group name"
              className="px-4 w-full h-11 text-gray-700 bg-white placeholder:text-gray-400 placeholder:font-light 
          border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-offset-2 focus:ring-blue-200 
          duration-150 ease-linear outline-none rounded-md"
            />
          </div>
          <div>
            <label htmlFor="search" className="block mb-2 font-medium text-sm text-gray-700">
              Search
            </label>
            <input
              type="text"
              name="search"
              placeholder="Please enter user name"
              className="px-4 w-full h-11 text-gray-700 bg-white placeholder:text-gray-400 placeholder:font-light 
          border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-offset-2 focus:ring-blue-200 
          duration-150 ease-linear outline-none rounded-md"
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-8 py-2.5 text-sm font-medium text-gray-900 hover:text-sky-500 bg-white focus:ring-2 focus:ring-gray-300 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-2.5 text-sm font-medium text-white bg-sky-500 hover:bg-sky-600 focus:ring-2 focus:ring-blue-300 rounded-md"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupModal;
