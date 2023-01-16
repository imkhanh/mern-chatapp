import React, { useEffect, useState } from 'react';
import { IoCloseOutline, IoSyncOutline } from 'react-icons/io5';
import { ChatState } from 'context/ChatContext';
import { addToGroup, removeFromGroup, renameGroup, searchUser } from 'api';
import UserListItem from './UserListItem';
import UserBadgeItem from './UserBadgeItem';
import Loader from './Loader';
import { toast } from 'react-hot-toast';

const UpdateGroupModal = ({ setIsUpdate }) => {
  const { user, selectedChat, setSelectedChat, fetchAgain, setFetchAgain } = ChatState();

  const [search, setSearch] = useState('');
  const [groupName, setGroupName] = useState('');
  const [users, setUsers] = useState([]);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!groupName) return;

    setSubmitting(true);

    try {
      const { data } = await renameGroup(selectedChat._id, groupName);
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);

      toast.success(`Group name successfully changed to ${data.chatName}`);

      setIsUpdate(false);
      setSubmitting(false);
    } catch (error) {
      toast.error(error.response.data.error);
      setSubmitting(false);
      return;
    }
  };

  const handleAddMember = async (member) => {
    if (user.user._id !== selectedChat.groupAdmin._id) {
      toast.error('Only admins can add user');
      return;
    }

    if (selectedChat.users.find((u) => u._id === member._id)) {
      toast.error('Member already repersent in this group');
      return;
    }

    if (member.email === 'guest@gmail.com') {
      toast.error('Guest user can not added to group');
      return;
    }

    setSubmitting(true);

    try {
      const { data } = await addToGroup(selectedChat._id, member._id);

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
      toast.error('Only admins can add user');
      return;
    }

    setSubmitting(true);

    try {
      const { data } = await removeFromGroup(selectedChat._id, member._id);

      user.user._id === member._id ? setSelectedChat('') : setSelectedChat(data);

      setFetchAgain(!fetchAgain);
      setSearch('');
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
      await removeFromGroup(selectedChat._id, user._id);

      setSelectedChat('');

      setFetchAgain(!fetchAgain);
      setSearch('');
      setSubmitting(false);
    } catch (error) {
      toast.error(error.response.data.error);
      setSubmitting(false);
      return;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 w-full h-full z-50">
      <div className="relative top-1/2 transform -translate-y-1/2 mx-auto p-8 border border-gray-50 max-w-xl w-full shadow-lg rounded-md bg-white z-[100]">
        <div className="mb-8 flex items-center justify-between">
          <span className="text-gray-900 text-xl font-bold">Update Group Chat</span>
          <span
            onClick={() => setIsUpdate(false)}
            className="absolute top-4 right-4 p-2 rounded-full text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 cursor-pointer"
          >
            <IoCloseOutline className="text-lg" />
          </span>
        </div>

        <div className="space-y-6">
          <form onSubmit={handleSubmit}>
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

          {selectedChat.users.length > 0 && (
            <div>
              <label htmlFor="members" className="block mb-2 font-medium text-gray-700">
                Members
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
            <div className="border-l border-sky-500 w-full max-h-[240px] overflow-y-scroll">
              {loading ? (
                <div className="h-[240px] flex items-center justify-center text-black/40">
                  <IoSyncOutline className="text-lg animate-spin" />
                </div>
              ) : users && users.length > 0 ? (
                users.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleClick={() => handleAddMember(user)}
                  />
                ))
              ) : (
                <div className="h-[240px] flex items-center justify-center text-black/40">
                  <p>User does not exists</p>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="mt-12 space-y-6">
          <p className="text-gray-600 font-light">
            By leaving the Group, you will not be able to access old chat and all the chat media
            will be deleted as well
          </p>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsUpdate(false)}
              className="px-8 py-2.5 text-sm font-medium text-gray-900 hover:text-red-500 bg-white focus:ring-2 focus:ring-gray-300 rounded-md"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleLeaveGroup(user.user)}
              className="px-8 py-2.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 focus:ring-2 focus:ring-blue-300 rounded-md"
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

export default UpdateGroupModal;
