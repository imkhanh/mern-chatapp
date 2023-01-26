import React, { useEffect, useState } from 'react';
import { IoCloseCircle, IoSync } from 'react-icons/io5';
import { addToGroup, removeFromGroup, renameGroup, searchUser } from 'api';
import { ChatState } from 'context/ChatContext';
import SkeletonItem from './SkeletonItem';
import UserListItem from './UserListItem';
import UserBadgeItem from './UserBadgeItem';
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
        className="fixed inset-0 w-full h-full bg-black/40 z-50"
      />
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white max-w-xl w-full h-auto rounded-md z-[100]">
        <div className="px-8 py-4 flex items-center justify-between border-b border-gray-200">
          <span className="text-xl font-bold text-gray-900">Update Group Chat</span>
        </div>
        <div className="px-8 py-4 space-y-6">
          <form onSubmit={handleRenameGroup}>
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
          </form>
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
          {selectedChat.users.length > 0 && (
            <div>
              <label htmlFor="groupMember" className="block mb-1 font-medium text-gray-700">
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
            <div className="max-h-[300px] overflow-y-scroll bg-white">
              {loading ? (
                <SkeletonItem count={5} />
              ) : users && users.length > 0 ? (
                users.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleClick={() => handleAddMember(user)}
                  />
                ))
              ) : (
                <div className="px-4 py-8 text-center">
                  <p className="font-light text-base text-gray-400 italic">User does not exist</p>
                </div>
              )}
            </div>
          )}

          <div className="pt-4">
            <div className="mb-4 flex items-start">
              <span htmlFor="note" className="text-sm font-medium text-gray-700">
                Note:
              </span>
              <p className="ml-1 text-sm">
                By Leaving the Group, you will not be able to access old chat and all the chat media
                will be deleted as well
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsUpdateGroupChat(false)}
                className="px-6 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-900 bg-white hover:bg-gray-100 rounded-md transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleLeaveGroup(user)}
                className="px-6 py-2.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-md transition"
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
