import moment from 'moment';
import React from 'react';
import { IoChatbox, IoPeople, IoTrashBin } from 'react-icons/io5';

const NotificationItem = ({ notify }) => {
  const chatId = notify?.chatId;
  const sender = notify?.sender;
  const content = notify?.content;
  const createdAt = notify?.createdAt;

  return (
    <div className="max-w-md w-full flex px-4 py-3 hover:bg-gray-100 cursor-pointer group">
      <div className="flex-shrink-0">
        <img alt={sender?.name} src={sender?.image} className="rounded-full w-11 h-11" />
        <div className="absolute flex items-center justify-center w-5 h-5 ml-6 -mt-5 bg-blue-600 text-white border border-white rounded-full dark:border-gray-800">
          {chatId.isGroupChat ? (
            <IoPeople className="text-xs" />
          ) : (
            <IoChatbox className="text-xs" />
          )}
        </div>
      </div>
      <div className="w-full pl-3">
        <div className="text-gray-500 text-sm mb-1.5">
          New message in{' '}
          <span className="font-semibold text-gray-900">
            {chatId.isGroupChat ? chatId.chatName : sender.name}
          </span>
          : "{content}"
        </div>
        <div className="text-xs text-blue-600">{moment(createdAt).fromNow()}</div>
      </div>
      <button
        type="button"
        className="p-2 flex items-center invisible group-hover:visible text-gray-500 hover:text-red-500 bg-transparent hover:bg-white transition rounded-full"
      >
        <IoTrashBin />
      </button>
    </div>
  );
};

export default NotificationItem;
