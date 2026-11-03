import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore'; // 1. Import the store

const Navbar = () => {
  // 2. Extract the authentication status and logout function
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Clear the global state and local storage
    navigate('/login'); // Send user back to login page
  };

  return (
    <nav className="bg-brand-card border-b border-gray-700 p-4 flex justify-between items-center shadow-md">
      <Link to="/" className="text-xl font-bold text-brand-yellow tracking-wider">
        DevSync
      </Link>
      
      <div className="flex gap-4 items-center">
        {/* 3. Conditional Rendering based on Global State */}
        {isAuthenticated ? (
          <button 
            onClick={handleLogout}
            className="text-gray-300 hover:text-brand-yellow font-medium transition"
          >
            Logout
          </button>
        ) : (
          <>
            <Link to="/login" className="text-gray-300 hover:text-white transition">Login</Link>
            <Link to="/register" className="bg-brand-yellow text-brand-navy px-4 py-1.5 rounded font-bold hover:bg-yellow-400 transition">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;



