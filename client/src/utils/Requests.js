import axios from 'axios';

const API = axios.create({ baseURL: `${process.env.REACT_APP_BASE_URL}/api` });

API.interceptors.request.use((req) => {
  if (localStorage.getItem('profile')) {
    req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
  }
  return req;
});

export const searchUser = (search) => API.get(`/user?=${search}`);
export const loginReq = (data) => API.post('/user/login', data);
export const registerReq = (data) => API.post('/user/register', data);

export const getAllChats = () => API.get('/chat/get-all');
export const accessChat = (userId) => API.post('/chat/access-chat', { userId });
export const deleteChat = (chatId) => API.delete(`/chat/delete-chat/${chatId}`);
export const createGroup = (data) => API.post('/chat/create-group', data);
export const renameGroup = (data) => API.patch('/chat/rename-group', data);
export const addToGroup = (data) => API.patch('/chat/add-group', data);
export const removeFromGroup = (data) => API.patch('/chat/remove-group', data);
