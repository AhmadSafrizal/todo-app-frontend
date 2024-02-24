import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';

const loginUser = async (user) => {
  try {
    const response = await fetch('http://localhost:5000/api/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }

    const responseData = await response.json();
    return responseData; // Ensure that responseData has 'token' and 'userId' fields
  } catch (error) {
    throw new Error(error.message);
  }
};

const Login = () => {

  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('idUser');

  useEffect(() => {
    if (token && userId) {
      navigate('/');
    }
  }, [token, userId, navigate]);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const mutation = useMutation(loginUser);

  const handleLogin = async () => {
    try {
      const { data } = await mutation.mutateAsync({ username, password });

      console.log('Response Data:', data);

      const { token, userId } = data;

      console.log('token', token);
      console.log('idUser', userId);

      localStorage.setItem('token', token);
      localStorage.setItem('idUser', userId);

      navigate('/');
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <div className="bg-gray-700 text-white p-4 max-w-60vw w-full sm:w-80 sm:mx-3 rounded-md">
        <h2 className="text-2xl font-bold mb-4">Login</h2>

        <form>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-bold mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="border-none p-2 w-full text-gray-500"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="border-none p-2 w-full text-gray-500"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="button"
            className="bg-green-500 text-white border-none mt-4 p-2 w-full cursor-pointer"
            onClick={handleLogin}
          >
            Login
          </button>
          <div className="mt-2 text-center text-gray-300">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-400">
            Register here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
