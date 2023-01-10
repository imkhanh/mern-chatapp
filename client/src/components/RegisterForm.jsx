import { useState } from 'react';
import { FaCloudUploadAlt, FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import toast from 'react-hot-toast';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
    } catch (error) {
      toast.error(error.response.data.error);
      return;
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-6">
      <div>
        <label htmlFor="name" className="block mb-2 font-medium text-gray-700">
          Full Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Please enter your full name"
          className="px-4 text-sm w-full h-11 text-gray-700 bg-white placeholder:text-gray-400 placeholder:font-light 
    border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-offset-2 focus:ring-blue-200 
    duration-150 ease-linear outline-none rounded-md"
        />
      </div>
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
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Please enter your password"
            className="px-4 text-sm w-full h-11 text-gray-700 bg-white placeholder:text-gray-400 placeholder:font-light 
    border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-offset-2 focus:ring-blue-200 
    duration-150 ease-linear outline-none rounded-md"
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-1/2 right-2 transform -translate-y-1/2 block p-2 bg-white hover:bg-gray-100 rounded-full cursor-pointer select-none"
          >
            {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
          </span>
        </div>
      </div>
      <div>
        <label htmlFor="avatar" className="block mb-2 font-medium text-gray-700">
          Avatar
        </label>
        <div className="relative px-4 h-16 border-dotted border-2 border-gray-200 rounded-md">
          <FaCloudUploadAlt className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl text-gray-400" />
          <input
            type="file"
            multiple={false}
            accept="image/*"
            className="w-full h-full opacity-0 cursor-pointer z-10"
          />
        </div>
        <span className="block mt-1 text-sm text-gray-500 font-light">Only Jpg, Jpeg, Png</span>
      </div>
      <div className="flex gap-3">
        <button
          type="submit"
          className="inline-block w-full h-11 font-medium rounded-md transition border border-blue-500 text-white bg-blue-600 hover:bg-blue-500"
        >
          Register
        </button>
        <button
          type="button"
          className="inline-block w-full h-11 font-medium rounded-md transition border border-gray-300 hover:border-gray-500 text-gray-500 hover:text-gray-700"
        >
          Clear
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;
