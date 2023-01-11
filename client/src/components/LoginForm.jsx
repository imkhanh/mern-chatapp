import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import { loginReq } from '../utils/Requests';
import toast from 'react-hot-toast';

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    showPassword: false,
    loading: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const { data } = await loginReq(formData);
      if (data) {
        localStorage.setItem('profile', JSON.stringify(data));
        navigate('/chats');
      }
    } catch (error) {
      toast.error(error.response.data.error);
      return;
    }
  };

  const handleGuestLogin = () => {
    setFormData({ email: 'guest@gmail.com', password: '123123' });
  };

  return (
    <form onSubmit={handleLogin} className="space-y-6">
      <div>
        <label htmlFor="email" className="block mb-2 font-medium text-gray-700">
          Email Address
        </label>
        <input
          type="text"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Please enter your email address"
          className="px-4 text-sm w-full h-11 text-gray-700 bg-white placeholder:text-gray-400 placeholder:font-light 
          border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-offset-2 focus:ring-blue-200 
          duration-150 ease-linear outline-none rounded-md"
        />
      </div>
      <div>
        <label htmlFor="password" className="block mb-2 font-medium text-gray-700">
          Password
        </label>
        <div className="relative">
          <input
            type={formData.showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Please enter your password"
            className="px-4 text-sm w-full h-11 text-gray-700 bg-white placeholder:text-gray-400 placeholder:font-light 
            border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-offset-2 focus:ring-blue-200 
            duration-150 ease-linear outline-none rounded-md"
          />
          <span
            onClick={() => setFormData({ ...formData, showPassword: !formData.showPassword })}
            className="absolute top-1/2 right-2 transform -translate-y-1/2 block p-2 bg-white hover:bg-gray-100 rounded-full cursor-pointer select-none"
          >
            {formData.showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
          </span>
        </div>
      </div>
      <div className="flex gap-3">
        <button
          type="submit"
          className="inline-block w-full h-11 font-medium rounded-md transition border border-blue-500 text-white bg-blue-600 hover:bg-blue-500"
        >
          Login
        </button>
        <button
          type="button"
          onClick={handleGuestLogin}
          className="inline-block w-full h-11 font-medium rounded-md transition border border-gray-300 hover:border-gray-500 text-gray-500 hover:text-gray-700"
        >
          Guest
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
