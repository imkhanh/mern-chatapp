export const getSender = (loggedUser, users) => {
  return loggedUser._id === users[0]._id ? users[1] : users[0];
};

export const getSameSender = (messages, message, index, userId) => {
  return (
    index < messages.length - 1 &&
    (messages[index + 1].sender._id !== message.sender._id ||
      messages[index + 1].sender._id === undefined) &&
    messages[index].sender._id !== userId
  );
};

export const isLastMessage = (messages, index, userId) => {
  return (
    index === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id
  );
};

export const getSameMarginLeft = (messages, message, index, userId) => {
  if (
    index < messages.length - 1 &&
    messages[index + 1].sender._id === message.sender._id &&
    messages[index].sender._id !== userId
  ) {
    return 38;
  } else if (
    (index < messages.length - 1 &&
      messages[index + 1].sender._id !== message.sender._id &&
      messages[index].sender._id !== userId) ||
    (index === messages.length - 1 && messages[index].sender._id !== userId)
  ) {
    return 8;
  } else {
    return 'auto';
  }
};

export const getSameMarginTop = (messages, message, index) => {
  return index > 0 && messages[index - 1].sender._id === message.sender._id;
};
