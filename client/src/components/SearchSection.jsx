import React, { useEffect, useState } from 'react';
import { ChatState } from 'context/ChatContext';
import { accessChat, searchUser } from 'api';
import { IoArrowBack, IoCloseCircle, IoSearchOutline, IoSync } from 'react-icons/io5';
import SkeletonItem from './SkeletonItem';
import UserListItem from './UserListItem';
import Loader from './Loader';

const SearchSection = ({ setIsSearch }) => {
  const { chats, setChats, setSelectedChat } = ChatState();

  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

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

  const handleAccessChat = async (user) => {
    setLoading(true);
    setLoadingChat(true);

    try {
      const { data } = await accessChat(user);

      if (!chats.find((item) => item._id === data._id)) {
        setChats([...chats, data]);
      }

      setSelectedChat(data);
      setSearch('');
      setLoading(false);
      setLoadingChat(false);
      setIsSearch(false);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <section className="absolute top-[82px] left-0 w-full h-full bg-white z-20">
      <div className="mx-4 relative flex items-center space-x-2">
        <button
          type="button"
          onClick={() => setIsSearch(false)}
          className="block p-2.5 rounded-full bg-white hover:bg-gray-100"
        >
          <IoArrowBack className="text-lg" />
        </button>

        <input
          type="text"
          name="search"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-3 w-full h-11 bg-gray-100 outline-none placeholder:font-light rounded-lg"
        />
        {search && (
          <span className="absolute top-1/2 right-3 transform -translate-y-1/2 text-lg text-black/30">
            {loading ? (
              <IoSync className="animate-spin" />
            ) : (
              <IoCloseCircle className="cursor-pointer select-none" onClick={() => setSearch('')} />
            )}
          </span>
        )}
      </div>

      {search && (
        <div className="mx-4">
          <div className="px-2 py-4 flex items-center">
            <IoSearchOutline className="text-lg" />{' '}
            <span className="ml-6 font-light">Search for "{search}"</span>
          </div>
          <div className="max-h-[720px] overflow-y-scroll bg-white">
            {loading ? (
              <SkeletonItem count={12} />
            ) : users && users.length > 0 ? (
              users.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleClick={() => handleAccessChat(user)}
                />
              ))
            ) : (
              <div className="px-4 py-8 text-center">
                <p className="font-light text-base text-gray-400 italic">User does not exist</p>
              </div>
            )}
          </div>
        </div>
      )}

      {loadingChat && <Loader />}
    </section>
  );
};

export default SearchSection;
