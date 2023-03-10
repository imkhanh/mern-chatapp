import axios from 'axios';

const API = axios.create({ baseURL: `${process.env.REACT_APP_BASE_URL}/api` });

API.interceptors.request.use((req) => {
  if (localStorage.getItem('token')) {
    req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('token'))}`;
  }
  return req;
});

// auth
export const searchUser = (search) => API.get(`/user?search=${search}`);
export const loginReq = (data) => API.post('/user/login', data);
export const registerReq = (data) => API.post('/user/register', data);

//chats
export const getAllChats = () => API.get('/chat/get-all');
export const accessChat = (user) => API.post('/chat/access-chat', { user });

export const createGroup = (data) => API.post('/chat/create-group', data);
export const addToGroup = (data) => API.patch('/chat/add-group', data);
export const renameGroup = (data) => API.patch(`/chat/rename-group`, data);
export const removeFromGroup = (data) => API.patch('/chat/remove-group', data);
export const deleteChat = (chatId) => API.delete(`/chat/delete-chat/${chatId}`);

//messages

export const getMessage = (chatId) => API.get(`/message/${chatId}`);
export const sendMessage = (data) => API.post('/message/send-message', data);

//notitications
export const getNotification = () => API.get(`/notification`);
export const addNotification = (data) => API.post(`/notification`, data);
export const deleteNotification = (notificationId) => API.delete(`/notification/${notificationId}`);
