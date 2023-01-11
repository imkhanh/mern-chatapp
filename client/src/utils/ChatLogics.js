export const getSender = (loggedUser, users) => {
  return loggedUser._id !== users[0] ? users[1] : users[0];
};
