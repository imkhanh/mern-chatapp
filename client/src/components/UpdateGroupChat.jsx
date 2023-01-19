import React, { useEffect, useState } from 'react';
import { addToGroup, removeFromGroup, renameGroup, searchUser } from 'api';
import { IoClose, IoSync } from 'react-icons/io5';
import { ChatState } from 'context/ChatContext';
import UserListItem from './UserListItem';
import Skeleton from './Skeleton';
import UserBadgeItem from './UserBadgeItem';
import Loader from './Loader';
import { toast } from 'react-hot-toast';

const UpdateGroupChat = ({ setIsUpdateGroup }) => {
  const { user, selectedChat, setSelectedChat, fetchAgain, setFetchAgain } = ChatState();

  const [search, setSearch] = useState('');
  const [groupName, setGroupName] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setGroupName(selectedChat.chatName);
  }, [selectedChat.chatName]);

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

  const handleRenameGroup = async (e) => {
    e.preventDefault();

    if (!groupName) return;

    setSubmitting(true);

    try {
      const { data } = await renameGroup({ chatId: selectedChat._id, chatName: groupName });
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      toast.success(`Group name has changed to ${data.chatName}`);

      setIsUpdateGroup(false);
      setSubmitting(false);
    } catch (error) {
      toast.error(error.response.data.error);
      setSubmitting(false);
      return;
    }
  };

  const handleAddMember = async (member) => {
    if (user.user._id !== selectedChat.groupAdmin._id) {
      toast.error('Only admins can remove member');
      return;
    }
    if (member.email === 'guest@gmail.com') {
      toast.error('Guest user can not added to group');
      return;
    }
    if (selectedChat.users.find((user) => user._id === member._id)) {
      toast.error('Member already repersent in this group');
      return;
    }

    setSubmitting(true);

    try {
      const { data } = await addToGroup({ chatId: selectedChat._id, userId: member._id });
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setSearch('');
      setSubmitting(false);
    } catch (error) {
      toast.error(error.response.data.error);
      setSubmitting(false);
      return;
    }
  };

  const handleRemoveMember = async (member) => {
    if (user.user._id !== selectedChat.groupAdmin._id) {
      toast.error('Only admins can remove member');
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await removeFromGroup({ chatId: selectedChat._id, userId: member._id });
      user.user._id === member._id ? setSelectedChat('') : setSelectedChat(data);
      setFetchAgain(!fetchAgain);

      setSubmitting(false);
    } catch (error) {
      toast.error(error.response.data.error);
      setSubmitting(false);
      return;
    }
  };

  const handleLeaveGroup = async (user) => {
    setSubmitting(true);

    try {
      await removeFromGroup({ chatId: selectedChat._id, userId: user._id });
      setFetchAgain(!fetchAgain);
      setSelectedChat('');

      setSubmitting(false);
    } catch (error) {
      toast.error(error.response.data.error);
      setSubmitting(false);
      return;
    }
  };

  return (
    <div>
      <div
        onClick={() => setIsUpdateGroup(false)}
        className="fixed inset-0 w-full h-full bg-black/40 z-50"
      />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-8 max-w-xl w-full h-auto bg-white rounded-md shadow-lg z-[100]">
        <div className="mb-8">
          <h4 className="text-gray-900 text-xl font-bold">
            <span className="underline underline-offset-4 decoration-blue-300">Update</span> Group
          </h4>
          <button
            type="button"
            onClick={() => setIsUpdateGroup(false)}
            className="absolute top-4 right-4 p-2 rounded-full text-gray-500 hover:text-gray-900 bg-white hover:bg-gray-50 transition"
          >
            <IoClose className="text-lg" />
          </button>
        </div>

        <div className="space-y-6">
          <form onSubmit={handleRenameGroup}>
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
          </form>
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

          {selectedChat.users.length > 0 && (
            <div>
              <label htmlFor="groupMembers" className="block mb-2 font-medium text-gray-700">
                Group Members
              </label>
              <div className="flex items-center flex-wrap gap-1.5">
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
            <div className="w-full max-h-[240px] overflow-y-scroll">
              {loading ? (
                <Skeleton count={4} />
              ) : users && users.length > 0 ? (
                users.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleClick={() => handleAddMember(user)}
                  />
                ))
              ) : (
                <div className="py-8 flex items-center justify-center">
                  <p className="text-gray-400 font-light italic">User does not exist</p>
                </div>
              )}
            </div>
          )}
          <div>
            <p className="text-base text-gray-500 font-light">
              By Leaving the Group, you will not be able to access old chat and all the chat media
              will be deleted as well
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsUpdateGroup(false)}
              className="px-6 py-2 font-medium rounded-md text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={() => handleLeaveGroup(user.user)}
              className="px-6 py-2 font-medium rounded-md bg-red-500 text-white hover:bg-red-600 transition"
            >
              Leave Group
            </button>
          </div>
        </div>
      </div>

      {submitting && <Loader />}
    </div>
  );
};

export default UpdateGroupChat;
