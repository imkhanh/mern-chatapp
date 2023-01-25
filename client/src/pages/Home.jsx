import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    <div className="h-screen bg-gray-100 flex items-center justify-center">
      <div className="p-8 bg-white max-w-lg w-full rounded-lg shadow-md borderborder-gray-100 space-y-8">
        <div>
          <h1 className="text-2xl text-gray-900 font-bold uppercase">
            {isLogin ? 'Login' : 'Register'}
          </h1>
        </div>

        <div>{isLogin ? <LoginForm /> : <RegisterForm />}</div>

        <div>
          <p className="text-gray-400 font-light">
            {isLogin ? 'Create new one?' : 'Already an account?'}
            <span
              onClick={() => setIsLogin(!isLogin)}
              className="ml-1 text-gray-700 hover:text-blue-500 underline hover:decoration-blue-500 cursor-pointer selection:"
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
