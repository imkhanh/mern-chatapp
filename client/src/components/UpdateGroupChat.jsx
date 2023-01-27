import React, { useEffect, useState } from 'react';
import { IoCloseCircle, IoCloseOutline, IoInformationCircle, IoSync } from 'react-icons/io5';
import { addToGroup, removeFromGroup, renameGroup, searchUser } from 'api';
import { ChatState } from 'context/ChatContext';
import UserListItem from './UserListItem';
import UserBadgeItem from './UserBadgeItem';
import SkeletonItem from './SkeletonItem';
import Loader from './Loader';
import { toast } from 'react-hot-toast';

const UpdateGroupChat = ({ setIsUpdateGroupChat }) => {
  const { user, selectedChat, setSelectedChat, fetchAgain, setFetchAgain } = ChatState();

  const [search, setSearch] = useState('');
  const [groupName, setGroupName] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => setGroupName(selectedChat.chatName), [selectedChat.chatName]);

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

  const handleRenameGroup = async (e) => {
    e.preventDefault();
    if (!groupName) return;

    setSubmitting(true);
    try {
      const { data } = await renameGroup({ chatId: selectedChat._id, chatName: groupName });
      setSelectedChat(data);

      toast.success(`A group has changed to ${data.chatName}`);
      setFetchAgain(!fetchAgain);
      setSubmitting(false);
      setIsUpdateGroupChat(false);
    } catch (error) {
      toast.error(error.response.data.error);
      setSubmitting(false);
      return;
    }
  };

  const handleAddMember = async (member) => {
    if (user._id !== selectedChat.groupAdmin._id) {
      toast.error('Only admins can add member');
      return;
    }

    if (selectedChat.users.find((u) => u._id === member._id)) {
      toast.error('This member already repersent in group');
      return;
    }

    if (member.email === 'guest@gmail.com') {
      toast.error('Guest user can not add to group');
      return;
    }

    try {
      const { data } = await addToGroup({ chatId: selectedChat._id, userId: member._id });
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setSearch('');
    } catch (error) {
      toast.error(error.response.data.error);
      return;
    }
  };

  const handleRemoveMember = async (member) => {
    if (user._id !== selectedChat.groupAdmin._id) {
      toast.error('Only admins can remove member');
      return;
    }

    try {
      const { data } = await removeFromGroup({ chatId: selectedChat._id, userId: member._id });

      user._id === member._id ? setSelectedChat(null) : setSelectedChat(data);
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

  return (
    <div>
      <div
        onClick={() => setIsUpdateGroupChat(false)}
        className="fixed inset-0 w-full h-full bg-black opacity-50 z-50"
      />
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white max-w-xl w-full h-auto rounded-2xl z-[100]">
        <div className="relative p-8 flex items-center justify-between">
          <span className="text-2xl font-bold text-gray-900">Update Group Chat</span>
          <button
            type="button"
            onClick={() => setIsUpdateGroupChat(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition"
          >
            <IoCloseOutline className="text-lg" />
          </button>
        </div>
        <div className="pb-8 px-8 space-y-6">
          <form onSubmit={handleRenameGroup}>
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
          </form>
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
          {selectedChat.users.length > 0 && (
            <div>
              <label htmlFor="groupMember" className="block mb-1 text-sm font-bold text-gray-900">
                Group Members
              </label>
              <div className="flex flex-wrap items-center gap-1.5">
                {selectedChat.users.map((user) => (
                  <UserBadgeItem
                    key={user._id}
                    user={user}
                    handleClick={() => handleRemoveMember(user)}
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
                    handleClick={() => handleAddMember(user)}
                  />
                ))
              ) : (
                <div className="h-[240px] flex items-center justify-center">
                  <p className="font-light text-base text-black/30 italic">User does not exist</p>
                </div>
              )}
            </div>
          )}

          <div className="pt-8 space-y-6">
            <div className="p-4 border-l-8 border-blue-500 flex items-start bg-blue-50 rounded-xl">
              <span htmlFor="note" className="block text-blue-500">
                <IoInformationCircle className="text-lg" />
              </span>
              <p className="ml-4 text-sm font-light text-blue-800">
                By Leaving the Group, you will not be able to access old chat and all the chat media
                will be deleted as well
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsUpdateGroupChat(false)}
                className="px-6 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 bg-gray-50 hover:bg-white border border-gray-300 hover:border-gray-400 hover:ring-2 hover:ring-gray-200 hover:ring-offset-2 rounded-md transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleLeaveGroup(user)}
                className="px-6 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 border border-red-500 hover:ring-2 hover:ring-red-200 hover:ring-offset-2 rounded-md transition"
              >
                Leave Group
              </button>
            </div>
          </div>
        </div>
      </div>

      {submitting && <Loader />}
    </div>
  );
};

export default UpdateGroupChat;
