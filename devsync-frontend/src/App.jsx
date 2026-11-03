import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import WorkspaceView from './pages/WorkspaceView'; // 1. Import the new page
import ProtectedRoute from './components/ProtectedRoute'; 

function App() {
  return (
    <div className="min-h-screen bg-brand-navy">
      <Navbar />
      <Routes>
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        
        {/* 2. Add the dynamic route. The ":id" tells React Router this part is a variable */}
        <Route path="/workspace/:id" element={<ProtectedRoute><WorkspaceView /></ProtectedRoute>} />
        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;







