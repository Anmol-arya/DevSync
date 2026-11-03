import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api'; 
import useAuthStore from '../store/authStore'; // 1. Import our global store
import Input from '../components/Input';
import Button from '../components/Button';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // 2. Extract the login function from our global store
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await api.post('/auth/login', { email, password });
      
      // 3. Call our global login function and pass the backend data
      login(response.data.user, response.data.token);
      
      // 4. Redirect immediately since Zustand handles the state update instantly
      navigate('/'); 

    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Something went wrong. Please try again.');
      }
    }
  };

  return (
    <div className="flex items-center justify-center mt-20 px-4">
      <div className="w-full max-w-md bg-brand-card p-8 rounded-lg shadow-xl border border-gray-800">
        <h2 className="text-3xl font-bold text-white text-center mb-6">Welcome Back</h2>
        
        {error && <div className="mb-4 p-3 bg-red-900/50 text-red-200 border border-red-800 rounded">{error}</div>}

        <form onSubmit={handleLogin}>
          <Input label="Email Address" type="email" placeholder="name@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input label="Password" type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
          
          <div className="mt-6">
            <Button type="submit">Log In</Button>
          </div>
        </form>

        <p className="text-gray-400 text-center mt-4 text-sm">
          Don't have an account? <Link to="/register" className="text-brand-yellow hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;






