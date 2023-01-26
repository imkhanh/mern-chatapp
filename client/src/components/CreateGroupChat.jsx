import React, { useEffect, useState } from 'react';
import { IoCloseCircle, IoSync } from 'react-icons/io5';
import { searchUser } from 'api';
import SkeletonItem from './SkeletonItem';
import UserListItem from './UserListItem';
import { toast } from 'react-hot-toast';

const CreateGroupChat = ({ setIsCreateGroupChat }) => {
  const [search, setSearch] = useState('');
  const [groupName, setGroupName] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleSearch = async () => {
      if (!search) return;

      setLoading(true);

      try {
        const { data } = await searchUser(search);
        setUsers(data.users);
        setLoading(false);
      } catch (error) {
        console.log(error);
        return;
      }
    };

    handleSearch();
  }, [search]);

  const handleAddUser = (user) => {
    if (selectedUser.includes(user)) {
      toast.error('This user already added to group');
      return;
    }

    setSelectedUser([...selectedUser, user]);
  };

  const handleRemoveUser = (user) => {
    setSelectedUser(selectedUser.filter((u) => u._id !== user._id));
  };

  return (
    <div>
      <div
        onClick={() => setIsCreateGroupChat(false)}
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
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Please enter group name"
              className="px-4 w-full h-11 text-gray-700 bg-white placeholder:text-gray-400 placeholder:font-light 
          border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-offset-2 focus:ring-blue-200 
          duration-150 ease-linear outline-none rounded-md"
            />
          </div>
          <div>
            <label htmlFor="search" className="block mb-1 font-medium text-gray-700">
              Search Name
            </label>
            <div className="relative">
              <input
                type="text"
                name="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Please enter user name"
                className="px-4 w-full h-11 text-gray-700 bg-white placeholder:text-gray-400 placeholder:font-light 
          border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-offset-2 focus:ring-blue-200 
          duration-150 ease-linear outline-none rounded-md"
              />
              {search && (
                <span className="absolute top-1/2 right-3 transform -translate-y-1/2 text-lg text-black/30">
                  {loading ? (
                    <IoSync className="animate-spin" />
                  ) : (
                    <IoCloseCircle
                      className="cursor-pointer select-none"
                      onClick={() => setSearch('')}
                    />
                  )}
                </span>
              )}
            </div>
          </div>
          {selectedUser.length > 0 && (
            <div>
              <div className="flex flex-wrap items-center gap-1.5">
                {selectedUser.map((user) => (
                  <div key={user._id}>{user.name}</div>
                ))}
              </div>
            </div>
          )}
          {search && (
            <div className="max-h-[300px] overflow-y-scroll bg-white">
              {loading ? (
                <SkeletonItem count={5} />
              ) : users && users.length > 0 ? (
                users.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleClick={() => handleAddUser(user)}
                  />
                ))
              ) : (
                <div className="px-4 text-center">
                  <p className="font-light text-base text-gray-400 italic">User does not exist</p>
                </div>
              )}
            </div>
          )}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsCreateGroupChat(false)}
              className="px-6 py-2.5 text-sm text-gray-500 hover:text-gray-900 bg-white hover:bg-gray-100 rounded-md transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded-md transition"
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
