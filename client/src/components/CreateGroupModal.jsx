import React, { useEffect, useState } from 'react';
import { IoCloseOutline, IoSyncOutline } from 'react-icons/io5';
import { ChatState } from 'context/ChatContext';
import { createGroup, searchUser } from 'api';
import UserListItem from './UserListItem';
import UserBadgeItem from './UserBadgeItem';
import Loader from './Loader';
import { toast } from 'react-hot-toast';

const CreateGroupModal = ({ setIsCreate }) => {
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

    if (user.user.email === 'guest@gmail.com') {
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
      const userString = JSON.stringify(selectedUser.map((v) => v._id));

      const { data } = await createGroup({ chatName: groupName, users: userString });
      setChats([...chats, data]);
      toast.success(`A ${data.chatName} group created successfully`);

      setIsCreate(false);
      setSubmitting(false);
    } catch (error) {
      toast.error(error.response.data.error);
      setSubmitting(false);
      return;
    }
  };

  if (submitting) return <Loader />;

  return (
    <div className="fixed inset-0 bg-black/50 w-full h-full z-50">
      <div className="relative top-1/2 transform -translate-y-1/2 mx-auto p-8 border border-gray-50 max-w-xl w-full shadow-lg rounded-md bg-white z-[100]">
        <div className="mb-8 flex items-center justify-between">
          <span className="text-gray-900 text-xl font-bold">Create Group Chat</span>
          <span
            onClick={() => setIsCreate(false)}
            className="absolute top-4 right-4 p-2 rounded-full text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 cursor-pointer"
          >
            <IoCloseOutline className="text-lg" />
          </span>
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
              Search
            </label>
            <div className="relative">
              <input
                type="text"
                id="search"
                name="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Please enter user name"
                className="px-4 w-full h-11 text-gray-700 bg-white placeholder:text-gray-400 placeholder:font-light 
          border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-offset-2 focus:ring-blue-200 
          duration-150 ease-linear outline-none rounded-md"
              />

              {search && (
                <span className="absolute top-1/2 right-3 transform -translate-y-1/2 text-lg text-black/40">
                  {loading ? (
                    <IoSyncOutline className="text-lg animate-spin" />
                  ) : (
                    <IoCloseOutline
                      className="text-lg hover:cursor-pointer"
                      onClick={() => setSearch('')}
                    />
                  )}
                </span>
              )}
            </div>
          </div>

          {selectedUser.length > 0 && (
            <div>
              <label htmlFor="members" className="block mb-2 font-medium text-gray-700">
                Members
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
            <div className="border-l border-blue-500 w-full max-h-[240px] overflow-y-scroll">
              {loading ? (
                <div className="h-[240px] flex items-center justify-center text-black/40">
                  <IoSyncOutline className="text-lg animate-spin" />
                </div>
              ) : users && users.length > 0 ? (
                users.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleClick={() => handleAddUser(user)}
                  />
                ))
              ) : (
                <div className="h-[240px] flex items-center justify-center text-black/40">
                  <p>User does not exists</p>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsCreate(false)}
              className="px-8 py-2.5 text-sm font-medium text-gray-900 hover:text-red-500 bg-white focus:ring-2 focus:ring-gray-300 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-2.5 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 rounded-md"
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
