import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const ProtectedRoute = ({ children }) => {
  // 1. Ask Zustand if the user is currently logged in
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // 2. If they are NOT logged in, redirect them to the login page immediately
  // 'replace' means they can't click the "Back" button to return to the protected page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 3. If they ARE logged in, render whatever component was passed inside (e.g., Dashboard)
  return children;
};

export default ProtectedRoute;

