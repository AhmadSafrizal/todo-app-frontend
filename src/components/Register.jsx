import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {

  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('idUser');

  useEffect(() => {
    if (token && userId) {
      navigate('/');
    }
  }, [token, userId, navigate]);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  const handleRegister = async () => {
    const user = { username, email, password, phone };
    try {
      const response = await fetch('http://localhost:5000/api/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
      });
      if (!response.ok) {
        if (response.status === 400) {
          const data = await response.json();
          console.error(data.message);
        } else {
          throw new Error('Unexpected error occurred');
        }
      } else {
        const data = await response.json();
        console.log(data);

        navigate('/login');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <div className="bg-gray-700 text-white p-4 w-full max-w-md rounded-md shadow-md">
        <h2 className="text-2xl font-bold mb-4">Register</h2>
        <form>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-white">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="border-none p-2 w-full text-gray-700"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-white">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="border-none p-2 w-full text-gray-700"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-white">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="border-none p-2 w-full text-gray-700"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="phone" className="block text-sm font-medium text-white">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              className="border-none p-2 w-full text-gray-700"
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <button
            type="button"
            className="bg-green-500 text-white p-2 rounded-md w-full cursor-pointer"
            onClick={handleRegister}
          >
            Register
          </button>
          <div className="mt-2 text-center text-gray-300">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400">
              Login here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
