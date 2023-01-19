import React, { useEffect, useState } from 'react';
import { createGroup, searchUser } from 'api';
import { IoClose, IoSync } from 'react-icons/io5';
import { ChatState } from 'context/ChatContext';
import UserListItem from './UserListItem';
import Skeleton from './Skeleton';
import UserBadgeItem from './UserBadgeItem';
import { toast } from 'react-hot-toast';
import Loader from './Loader';

const CreateGroupChat = ({ setIsCreateGroup }) => {
  const { user, chats, setChats, setSelectedChat } = ChatState();

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
      }
    };

    handleSearch();
  }, [search]);

  const handleAddUser = (user) => {
    if (selectedUser.includes(user)) {
      toast.error('User already added to group');
      return;
    }
    setSelectedUser([...selectedUser, user]);
  };

  const handleRemoveUser = (user) => {
    setSelectedUser(selectedUser.filter((u) => u._id !== user._id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (user.user.email === 'guest@gmail.com') {
      toast.error('Guest user can not create group');
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

    const userString = JSON.stringify(selectedUser.map((u) => u._id));

    try {
      const { data } = await createGroup({ chatName: groupName, users: userString });
      if (!chats.find((u) => u._id === data._id)) {
        setChats([...chats, data]);
      }
      setSelectedChat(data);

      toast.success(`${data.chatName} group created successfully`);

      setIsCreateGroup(false);
      setSubmitting(false);
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
        onClick={() => setIsCreateGroup(false)}
        className="fixed inset-0 w-full h-full bg-black/40 z-50"
      />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-8 max-w-xl w-full h-auto bg-white rounded-md shadow-lg z-[100]">
        <div className="mb-8">
          <h4 className="text-gray-900 text-xl font-bold">
            <span className="underline underline-offset-4 decoration-blue-300">Create</span> Group
          </h4>
          <button
            type="button"
            onClick={() => setIsCreateGroup(false)}
            className="absolute top-4 right-4 p-2 rounded-full text-gray-500 hover:text-gray-900 bg-white hover:bg-gray-50 transition"
          >
            <IoClose className="text-lg" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="groupName" className="block mb-2 font-medium text-gray-700">
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
            <label htmlFor="search" className="block mb-2 font-medium text-gray-700">
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
                <span className="absolute top-1/2 right-1 -translate-y-1/2 p-2 text-gray-500 transition hover:text-gray-700 cursor-pointer">
                  {loading ? (
                    <IoSync className="animate-spin" />
                  ) : (
                    <IoClose onClick={() => setSearch('')} />
                  )}
                </span>
              )}
            </div>
          </div>

          {selectedUser.length > 0 && (
            <div>
              <label htmlFor="groupMembers" className="block mb-2 font-medium text-gray-700">
                Group Members
              </label>
              <div className="flex items-center flex-wrap gap-1.5">
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
            <div className="w-full max-h-[240px] overflow-y-scroll">
              {loading ? (
                <Skeleton count={4} />
              ) : users && users.length > 0 ? (
                users.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleClick={() => handleAddUser(user)}
                  />
                ))
              ) : (
                <div className="py-8 flex items-center justify-center">
                  <p className="text-gray-400 font-light italic">User does not exist</p>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsCreateGroup(false)}
              className="px-6 py-2 font-medium rounded-md text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 font-medium rounded-md bg-blue-500 text-white hover:bg-blue-600 transition"
            >
              {submitting ? 'Creating' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupChat;
