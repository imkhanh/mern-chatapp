export const getSender = (loggedUser, users) => {
  return loggedUser._id === users[0]._id ? users[1] : users[0];
};
