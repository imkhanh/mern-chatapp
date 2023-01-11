import React, { useState, useEffect } from 'react';
import { IoCloseOutline, IoSyncOutline } from 'react-icons/io5';
import { createGroup, searchUser } from '../utils/Requests';
import { ChatState } from '../context/ChatContext';
import SkeletonItem from './SkeletonItem';
import UserListItem from './UserItem';
import UserBadgeItem from './UserBadgeItem';
import Loader from './Loader';
import toast from 'react-hot-toast';

const CreateGroupChat = ({ setOnCreateGroup }) => {
  const { user, chats, setChats } = ChatState();

  const [groupName, setGroupName] = useState('');
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [selectedUser, setSelectedUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const handleSearch = async () => {
      if (!search) return;

      setLoading(true);
      try {
        const { data } = await searchUser(search);
        setSearchResult(data.users);
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

  const handleCreateGroup = async (e) => {
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

    const userString = JSON.stringify(selectedUser.map((u) => u._id));

    try {
      const { data } = await createGroup({ chatName: groupName, users: userString });
      setChats([...chats, data]);

      toast.success(`${data.chatName} group created successfully`);

      setOnCreateGroup(false);
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
      <div onClick={() => setOnCreateGroup(false)} className="fixed inset-0 bg-black/40 z-50" />
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white max-w-xl w-full h-auto border border-gray-100 rounded-md shadow-lg z-[100]">
        <div className="relative px-8 py-4 flex items-center justify-between border-b border-gray-200">
          <span className="text-xl font-semibold text-gray-900">Create Group</span>
          <span
            onClick={() => setOnCreateGroup(false)}
            className="p-2 rounded-full text-gray-500 hover:text-gray-900 bg-white hover:bg-gray-200 hover:cursor-pointer"
          >
            <IoCloseOutline className="text-lg" />
          </span>
        </div>

        <form onSubmit={handleCreateGroup} className="px-8 py-4 space-y-6">
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
              className="px-4 text-sm w-full h-11 text-gray-700 bg-white placeholder:text-gray-400 placeholder:font-light 
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
                name="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Please enter user name"
                className="px-4 text-sm w-full h-11 text-gray-700 bg-white placeholder:text-gray-400 placeholder:font-light 
          border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-offset-2 focus:ring-blue-200 
          duration-150 ease-linear outline-none rounded-md"
              />
              {search && (
                <span className="block absolute top-1/2 right-3 transform -translate-y-1/2 text-black/30">
                  {loading ? (
                    <IoSyncOutline className="text-lg animate-spin" />
                  ) : (
                    <IoCloseOutline
                      className="text-lg hover:text-gray-900 hover:cursor-pointer"
                      onClick={() => setSearch('')}
                    />
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
              <div className="flex flex-wrap gap-1.5">
                {selectedUser.map((user) => (
                  <UserBadgeItem key={user._id} user={user} handleClick={() => handleRemoveUser(user)} />
                ))}
              </div>
            </div>
          )}

          {search && (
            <div className="w-full max-h-[300px] overflow-y-scroll bg-white">
              {loading ? (
                <SkeletonItem count={5} />
              ) : searchResult.length > 0 ? (
                searchResult.map((user) => (
                  <UserListItem key={user._id} user={user} handleClick={() => handleAddUser(user)} />
                ))
              ) : (
                <div className="py-12">
                  <p className="text-slate-500 font-light italic">No search result</p>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setOnCreateGroup(false)}
              className="px-5 py-2 text-sm font-medium text-gray-900 hover:text-blue-500 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-md transition-colors"
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
