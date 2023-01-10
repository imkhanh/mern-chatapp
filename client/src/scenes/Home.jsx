import { useState, useEffect } from 'react';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    const profile = JSON.parse(localStorage.getItem('profile'));

    if (profile) return navigate('/chats');
  }, [navigate]);

  return (
    <div className="h-screen grid grid-cols-8">
      <div className="col-span-5 bg-gradient-to-br from-blue-500 to-blue-100"></div>
      <div className="col-span-3">
        <div className="pt-24 px-12 space-y-8">
          <div>
            <h1 className="text-2xl text-gray-900 font-bold uppercase">{isLogin ? 'Login' : 'Register'}</h1>
          </div>

          <div>{isLogin ? <LoginForm /> : <RegisterForm />}</div>

          <div>
            <p className="text-gray-500 font-light">
              {isLogin ? 'Create new one?' : 'Already an account?'}
              <span
                onClick={() => setIsLogin(!isLogin)}
                className="ml-1 text-gray-700 font-medium hover:text-blue-500 underline hover:decoration-blue-500 cursor-pointer selection:"
              >
                {isLogin ? 'Join us' : 'Login'}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
