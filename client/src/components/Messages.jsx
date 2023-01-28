import React from 'react';
import {
  getSameSender,
  isLastMessage,
  getSameMarginLeft,
  getSameMarginTop,
} from 'config/ChatLogics';
import { ChatState } from 'context/ChatContext';

const Messages = ({ messages }) => {
  const { user } = ChatState();

  return (
    <>
      {messages &&
        messages.map((message, index) => (
          <div key={message._id} className="flex items-end">
            {(getSameSender(messages, message, index, user._id) ||
              isLastMessage(messages, index, user._id)) && (
              <img
                alt={message.sender.name}
                src={message.sender.image}
                className="w-8 h-8 rounded-full bg-white object-cover"
              />
            )}
            <span
              className={`${
                user._id !== message.sender._id
                  ? 'bg-gray-100 text-gray-900'
                  : 'bg-blue-500 text-white'
              }`}
              style={{
                maxWidth: '66%',
                padding: '0.4rem 1.2rem',
                borderRadius:
                  user._id !== message.sender._id
                    ? '1.6rem 1.6rem 1.6rem 0'
                    : '1.6rem 1.6rem 0 1.6rem',
                marginLeft: getSameMarginLeft(messages, message, index, user._id),
                marginTop: getSameMarginTop(messages, message, index) ? 6 : 24,
              }}
            >
              {message.content}
            </span>
          </div>
        ))}
    </>
  );
};

export default Messages;
