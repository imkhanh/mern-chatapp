import React, { useEffect, useState } from 'react';
import { IoCloseCircle, IoCloseOutline, IoSync } from 'react-icons/io5';
import { createGroup, searchUser } from 'api';
import { ChatState } from 'context/ChatContext';
import UserListItem from './UserListItem';
import UserBadgeItem from './UserBadgeItem';
import SkeletonItem from './SkeletonItem';
import Loader from './Loader';
import { toast } from 'react-hot-toast';

const CreateGroupChat = ({ setIsCreateGroupChat }) => {
  const { user, chats, setChats } = ChatState();

  const [search, setSearch] = useState('');
  const [groupName, setGroupName] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (user.email === 'guest@gmail.com') {
      toast.error('Guest user can not create the group');
      return;
    }

    if (
      selectedUser.map((user) => {
        if (user.email === 'guest@gmail.com') {
          toast.error('Guest user can not added to group');
        }
        return {};
      })
    ) {
    }

    setSubmitting(true);

    try {
      const users = JSON.stringify(selectedUser.map((u) => u._id));

      const { data } = await createGroup({ chatName: groupName, users: users });
      setChats([...chats, data]);

      toast.success(`${data.chatName} created successfully`);

      setSubmitting(false);
      setIsCreateGroupChat(false);
    } catch (error) {
      toast.error(error.response.data.error);
      setSubmitting(false);
      return;
    }
  };

  if (submitting) return <Loader />;

  return (
    <div>
      <div
        onClick={() => setIsCreateGroupChat(false)}
        className="fixed inset-0 w-full h-full bg-black opacity-50 z-50"
      />
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white max-w-xl w-full h-auto rounded-2xl z-[100]">
        <div className="relative p-8 flex items-center justify-between">
          <span className="text-2xl font-bold text-gray-900">Create Group Chat</span>
          <button
            type="button"
            onClick={() => setIsCreateGroupChat(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition"
          >
            <IoCloseOutline className="text-lg" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="pb-8 px-8 space-y-6">
          <div>
            <label htmlFor="groupName" className="block mb-1 text-sm font-bold text-gray-900">
              Group Name
            </label>
            <input
              type="text"
              name="groupName"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="px-4 w-full h-11 text-gray-700 bg-white placeholder:text-gray-400 placeholder:font-light 
          border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-offset-2 focus:ring-blue-200 
          duration-150 ease-linear outline-none rounded-md"
            />
          </div>
          <div>
            <label htmlFor="search" className="block mb-1 text-sm font-bold text-gray-900">
              Search Name
            </label>
            <div className="relative">
              <input
                type="text"
                name="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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
              <label htmlFor="groupMember" className="block mb-1 font-medium text-gray-900">
                Group Members
              </label>
              <div className="flex flex-wrap items-center gap-1.5">
                {selectedUser.map((user) => (
                  <UserBadgeItem
                    key={user._id}
                    user={user}
                    handleClick={() => handleRemoveUser(user)}
                  />
                ))}
              </div>
            </div>
          )}
          {search && (
            <div className="max-h-[240px] overflow-y-scroll bg-white">
              {loading ? (
                <SkeletonItem count={4} />
              ) : users && users.length > 0 ? (
                users.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleClick={() => handleAddUser(user)}
                  />
                ))
              ) : (
                <div className="h-[240px] flex items-center justify-center">
                  <p className="font-light text-base text-black/30 italic">User does not exist</p>
                </div>
              )}
            </div>
          )}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsCreateGroupChat(false)}
              className="px-6 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 bg-gray-50 hover:bg-white border border-gray-300 hover:border-gray-400 hover:ring-2 hover:ring-gray-200 hover:ring-offset-2 rounded-md transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 border border-blue-500 hover:ring-2 hover:ring-blue-200 hover:ring-offset-2 rounded-md transition"
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
