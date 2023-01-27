import React, { useState } from 'react';
import { FaCloudUploadAlt, FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import { registerReq } from 'api';
import toast from 'react-hot-toast';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    image: null,
    showPassword: false,
    loading: false,
  });
  const [isUpload, setIsUpload] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpload = async (file) => {
    if (!file) {
      toast.error('File does not exist');
      return;
    }

    if (file.type !== 'image/png') {
      toast.error('Invalid format of Image\n Only .png accepted');
      return;
    }
    setIsUpload(true);
    try {
      const form_data = new FormData();
      form_data.append('file', file);
      form_data.append('upload_preset', 'fzdh8twv');
      form_data.append('cloud_name', 'imkhanh');

      const res = await fetch('http://api.cloudinary.com/v1_1/imkhanh/image/upload', {
        method: 'POST',
        body: form_data,
      });

      const data = await res.json();

      setFormData({ ...formData, image: data.secure_url });
      setIsUpload(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setFormData({ ...formData, loading: true });

    try {
      const { data } = await registerReq({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        image: formData.image,
      });

      toast.success(`${data.success}`);

      setFormData({
        ...formData,
        name: '',
        email: '',
        password: '',
        image: null,
        showPassword: false,
        loading: false,
      });
    } catch (error) {
      toast.error(error.response.data.error);
      setFormData({ ...formData, loading: false });
      return;
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-6">
      <div>
        <label htmlFor="name" className="block mb-1 font-medium text-gray-900">
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
        <label htmlFor="email" className="block mb-1 font-medium text-gray-900">
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
        <label htmlFor="password" className="block mb-1 font-medium text-gray-900">
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
          <button
            type="button"
            onClick={() => setFormData({ ...formData, showPassword: !formData.showPassword })}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {formData.showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
          </button>
        </div>
      </div>
      <div>
        <label htmlFor="avatar" className="block mb-1 font-medium text-gray-900">
          Avatar
        </label>
        <div className="relative px-4 h-16 border-dotted border-2 border-gray-200 rounded-md">
          <FaCloudUploadAlt className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl text-gray-400" />
          <input
            type="file"
            multiple={false}
            accept="image/*"
            onChange={(e) => handleUpload(e.target.files[0])}
            className="w-full h-full opacity-0 cursor-pointer z-10"
          />
        </div>
        <span className="block mt-2 text-sm text-gray-500 font-light">Only Jpg, Jpeg, Png</span>
      </div>
      <div className="">
        <button
          type="submit"
          disabled={isUpload}
          className="inline-block w-full h-11 font-medium rounded-md transition border border-blue-500 text-white bg-blue-600 hover:bg-blue-500 hover:ring-2 hover:ring-blue-200 hover:ring-offset-2"
        >
          Register
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;
