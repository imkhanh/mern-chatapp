import React, { useState, useEffect } from 'react';
import { IoCloseOutline, IoSyncOutline } from 'react-icons/io5';
import { searchUser, renameGroup, addToGroup, removeFromGroup } from '../utils/Requests';
import { ChatState } from '../context/ChatContext';
import SkeletonItem from './SkeletonItem';
import UserListItem from './UserItem';
import UserBadgeItem from './UserBadgeItem';
import Loader from './Loader';
import toast from 'react-hot-toast';

const UpdateGroupChat = ({ setOnUpdateGroup }) => {
  const { user, selectedChat, setSelectedChat, fetchAgain, setFetchAgain } = ChatState();

  const [groupName, setGroupName] = useState('');
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
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

  const handleRenameGroup = async (e) => {
    e.preventDefault();

    if (!groupName) {
      toast.error('Please enter group name');
      return;
    }

    setSubmitting(true);

    try {
      const { data } = await renameGroup({ chatId: selectedChat._id, chatName: groupName });
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      toast.success(`A group has changed to ${data.chatName}`);

      setSubmitting(false);
      setOnUpdateGroup(false);
    } catch (error) {
      toast.error(error.response.data.error);
      setSubmitting(false);
      return;
    }
  };

  const handleAddMember = async (member) => {
    if (user.user._id !== selectedChat.groupAdmin._id) {
      toast.error('Only admins can add member');
      return;
    }

    if (member.email === 'guest@gmail.com') {
      toast.error('Guest user can added to group');
      return;
    }

    if (selectedChat.users.find((item) => item._id === member._id)) {
      toast.error('This member already repersent in the group');
      return;
    }

    try {
      const { data } = await addToGroup({ chatId: selectedChat._id, userId: member._id });
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
    } catch (error) {
      toast.error(error.response.data.error);
      return;
    }
  };

  const handleRemoveMember = async (member) => {
    if (user.user._id !== selectedChat.groupAdmin._id) {
      toast.error('Only admins can remove member');
      return;
    }

    try {
      const { data } = await removeFromGroup({ chatId: selectedChat._id, userId: member._id });
      user.user._id === member._id ? selectedChat('') : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
    } catch (error) {
      toast.error(error.response.data.error);
      return;
    }
  };

  const handleLeaveGroup = async (user) => {
    try {
    } catch (error) {
      toast.error(error.response.data.error);
      return;
    }
  };

  if (submitting) return <Loader />;

  return (
    <div>
      <div onClick={() => setOnUpdateGroup(false)} className="fixed inset-0 bg-black/40 z-50" />
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white max-w-xl w-full h-auto overflow-y-scroll border border-gray-100 rounded-md shadow-lg z-[100]">
        <div className="relative px-8 py-4 flex items-center justify-between border-b border-gray-200">
          <span className="text-xl font-semibold text-gray-900">Update Group</span>
          <span
            onClick={() => setOnUpdateGroup(false)}
            className="p-2 rounded-full text-gray-500 hover:text-gray-900 bg-white hover:bg-gray-200 hover:cursor-pointer"
          >
            <IoCloseOutline className="text-lg" />
          </span>
        </div>

        <div className="px-8 py-4 space-y-6">
          <form onSubmit={handleRenameGroup}>
            <label htmlFor="groupName" className="block mb-2 font-medium text-gray-700">
              Group Name
            </label>
            <div className="relative">
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
              <button
                type="submit"
                disabled={submitting}
                className="absolute inset-y-0 mx-0 right-1 my-1 px-4 py-1 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-md"
              >
                Rename
              </button>
            </div>
          </form>
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
          {selectedChat.users.length > 0 && (
            <div>
              <label htmlFor="groupMembers" className="block mb-2 font-medium text-gray-700">
                Group Members
              </label>
              <div className="flex flex-wrap gap-1.5">
                {selectedChat.users.map((user) => (
                  <UserBadgeItem key={user._id} user={user} handleClick={() => handleRemoveMember(user)} />
                ))}
              </div>
            </div>
          )}

          {search && (
            <div className="w-full max-h-[240px] overflow-y-scroll bg-white">
              {loading ? (
                <SkeletonItem count={4} />
              ) : searchResult.length > 0 ? (
                searchResult.map((user) => (
                  <UserListItem key={user._id} user={user} handleClick={() => handleAddMember(user)} />
                ))
              ) : (
                <div className="py-12">
                  <p className="text-slate-500 font-light italic">No search result</p>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="mt-8 px-8 pb-8">
          <div className="mb-4">
            <p className="text-gray-800 font-light">
              By leaving the Group, you will not be able to access old chat and all the chat media will be deleted as
              well
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setOnUpdateGroup(false)}
              className="px-5 py-2 text-sm font-medium text-gray-900 hover:text-red-500 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleLeaveGroup(user.user)}
              className="px-5 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-500 rounded-md transition-colors"
            >
              Leave Group
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateGroupChat;
