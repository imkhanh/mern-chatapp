import axios from 'axios';

const API = axios.create({ baseURL: `${process.env.REACT_APP_BASE_URL}/api` });

API.interceptors.request.use((req) => {
  if (localStorage.getItem('profile')) {
    req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile'))?.token}`;
  }
  return req;
});

export const searchUser = (search) => API.get(`/user?=${search}`);
export const loginReq = (data) => API.post('/user/login', data);
export const registerReq = (data) => API.post('/user/register', data);

export const getAllChats = () => API.get('/chat/get-all');
export const accessChat = (user) => API.post('/chat/access-chat', { user });
export const deleteChat = (id) => API.delete(`/chat/delete-chat/${id}`);
export const createGroup = (data) => API.post('/chat/create-group', data);
export const addToGroup = (id, userId) => API.patch(`/chat/add-group/${id}`, { userId });
export const renameGroup = (id, userId) => API.patch(`/chat/rename-group/${id}`, { userId });
export const removeFromGroup = (id, chatName) =>
  API.patch(`/chat/remove-group/${id}`, { chatName });
