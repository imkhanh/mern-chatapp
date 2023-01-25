import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoLogoWechat } from 'react-icons/io5';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

const Home = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem('user'));

    if (loggedUser) return navigate('/chats');
  }, [navigate]);

  return (
    <div className="h-screen bg-slate-100 flex items-center justify-center">
      <div className="p-8 bg-white max-w-md w-full rounded-md shadow-lg space-y-8">
        <div className="flex flex-col items-center justify-center">
          <IoLogoWechat className="text-5xl text-blue-500" />

          <p className="mt-4 text-2xl text-gray-900 font-bold uppercase">
            {isLogin ? 'Wellcome to my' : 'Become a member'}{' '}
            <span className="text-blue-500">MeChat</span>
          </p>
        </div>

        <div>{isLogin ? <LoginForm /> : <RegisterForm />}</div>

        <div className="border-t border-gray-200 text-center">
          <p className="pt-8 text-gray-400 font-light">
            {isLogin ? "Don't have an account?" : 'Already an account?'}
            <span
              onClick={() => setIsLogin(!isLogin)}
              className="ml-1 text-gray-500 hover:text-gray-900 underline cursor-pointer selection:"
            >
              {isLogin ? 'Join us' : 'Login'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
