import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api'; // 1. Import our custom axios setup
import Input from '../components/Input';
import Button from '../components/Button';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // 2. State to hold success or error messages
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // 3. React Router hook to redirect the user to a different page programmatically
  const navigate = useNavigate();

  // 4. Mark the function as 'async' because network requests take time
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');   // Clear old errors
    setSuccess(''); // Clear old success messages

    try {
      // 5. 'await' pauses the code here until the backend replies
      // We are sending a POST request to /api/auth/register with the state data
      const response = await api.post('/auth/register', {
        name,
        email,
        password
      });

      // If we reach this line, the backend replied with a success status (200 or 201)
      setSuccess('Registration successful! Redirecting to login...');
      
      // Wait 2 seconds, then redirect the user to the login page
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      // If the backend throws an error (like "Email already exists" -> 400 Bad Request)
      // Axios automatically jumps to this catch block
      console.error("Registration Error:", err);
      
      // We extract the exact error message sent from our Express backend
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
        <h2 className="text-3xl font-bold text-white text-center mb-6">Create an Account</h2>
        
        {/* 6. Display Error or Success messages if they exist */}
        {error && <div className="mb-4 p-3 bg-red-900/50 text-red-200 border border-red-800 rounded">{error}</div>}
        {success && <div className="mb-4 p-3 bg-green-900/50 text-green-200 border border-green-800 rounded">{success}</div>}

        <form onSubmit={handleRegister}>
          <Input label="Full Name" type="text" placeholder="Anmol Kumar" value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="Email Address" type="email" placeholder="anmol@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input label="Password" type="password" placeholder="Create a strong password" value={password} onChange={(e) => setPassword(e.target.value)} />
          
          <div className="mt-6">
            <Button type="submit">Sign Up</Button>
          </div>
        </form>

        <p className="text-gray-400 text-center mt-4 text-sm">
          Already have an account? <Link to="/login" className="text-brand-yellow hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;





