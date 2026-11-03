import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // <-- Imported correctly at the top!
import useAuthStore from '../store/authStore';
import api from '../utils/api';
import Button from '../components/Button';
import Input from '../components/Input';

const Dashboard = () => {
  const user = useAuthStore((state) => state.user);
  
  const [workspaces, setWorkspaces] = useState([]);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [newWorkspaceDesc, setNewWorkspaceDesc] = useState('');

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const response = await api.get('/workspaces');
        setWorkspaces(response.data);
      } catch (error) {
        console.error("Error fetching workspaces:", error);
      }
    };
    fetchWorkspaces();
  }, []);

  const handleCreateWorkspace = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/workspaces', {
        name: newWorkspaceName,
        description: newWorkspaceDesc
      });
      
      setWorkspaces([response.data.workspace, ...workspaces]);
      setNewWorkspaceName('');
      setNewWorkspaceDesc('');
    } catch (error) {
      console.error("Error creating workspace:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
      
      {/* Welcome Banner */}
      <div className="bg-brand-card rounded-lg shadow border border-gray-800 p-6 mb-8 flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, <span className="text-brand-yellow">{user?.name || 'Engineer'}</span>!
            </h1>
            <p className="text-gray-400">Logged in as: {user?.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Create Workspace Form */}
        <div className="col-span-1 bg-brand-card p-6 rounded-lg border border-gray-800 self-start">
          <h3 className="text-xl font-bold text-gray-300 mb-4">Create Workspace</h3>
          <form onSubmit={handleCreateWorkspace}>
            <Input 
              label="Workspace Name" 
              placeholder="e.g., Engineering Team" 
              value={newWorkspaceName} 
              onChange={(e) => setNewWorkspaceName(e.target.value)} 
            />
            <Input 
              label="Description (Optional)" 
              placeholder="What is this workspace for?" 
              value={newWorkspaceDesc} 
              onChange={(e) => setNewWorkspaceDesc(e.target.value)} 
            />
            <Button type="submit">Create Workspace</Button>
          </form>
        </div>

        {/* Right Column: Display Workspaces */}
        <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold text-gray-300 mb-4">My Workspaces</h3>
            
            {workspaces.length === 0 ? (
                <div className="bg-brand-card p-6 rounded-lg border border-gray-800 text-center text-gray-500">
                    You don't have any workspaces yet. Create one to get started!
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* The Link wrapper is now correctly placed inside the JSX map function! */}
                    {workspaces.map((ws) => (
                        <Link to={`/workspace/${ws._id}`} key={ws._id}>
                            <div className="bg-brand-card p-6 rounded-lg border border-gray-700 hover:border-brand-yellow transition cursor-pointer h-full">
                                <h4 className="text-lg font-bold text-white mb-1">{ws.name}</h4>
                                <p className="text-gray-400 text-sm line-clamp-2">
                                    {ws.description || "No description provided."}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;







