import React from 'react';

const Messages = ({ messages }) => {
  return (
    <div>
      {messages &&
        messages.map((message, index) => (
          <div key={index}>
            <div>{message.content}</div>
          </div>
        ))}
    </div>
  );
};

export default Messages;
