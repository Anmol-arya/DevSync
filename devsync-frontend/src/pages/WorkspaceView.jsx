import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'; // 1. Import DnD
import api from '../utils/api';
import Button from '../components/Button';
import { io } from 'socket.io-client'; 

const socket = io('http://localhost:5000'); 

const WorkspaceView = () => {
  const { id } = useParams();
  
  const [members, setMembers] = useState([]);
  const [tasks, setTasks] = useState([]); 
  const [newTaskTitle, setNewTaskTitle] = useState(''); 
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWorkspaceData = async () => {
      try {
        const [membersRes, tasksRes] = await Promise.all([
          api.get(`/workspaces/${id}/members`),
          api.get(`/tasks/workspace/${id}`)
        ]);
        
        setMembers(membersRes.data);
        setTasks(tasksRes.data);
      } catch (err) {
        setError('Failed to load workspace data.');
      }
    };
    fetchWorkspaceData();

    socket.emit('joinWorkspace', id);

    socket.on('taskCreated', (newTask) => {
      setTasks((prev) => prev.some(t => t._id === newTask._id) ? prev : [newTask, ...prev]);
    });

    socket.on('taskUpdated', (updatedTask) => {
      setTasks((prev) => prev.map(t => t._id === updatedTask._id ? updatedTask : t));
    });

    socket.on('taskDeleted', (deletedTaskId) => {
      setTasks((prev) => prev.filter(t => t._id !== deletedTaskId));
    });

    return () => {
      socket.off('taskCreated');
      socket.off('taskUpdated');
      socket.off('taskDeleted');
    };
  }, [id]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return; 

    try {
      const response = await api.post('/tasks', { title: newTaskTitle, workspaceId: id });
      setTasks((prev) => [response.data, ...prev]);
      setNewTaskTitle(''); 
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return; 
    try {
      setTasks(tasks.filter(t => t._id !== taskId));
      await api.delete(`/tasks/${taskId}`);
    } catch (error) {
      alert(error.response?.data?.message || "Error deleting task");
    }
  };

  // 2. NEW: The Drag-and-Drop Handler
  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    // If dropped outside a valid column, do nothing
    if (!destination) return; 

    // If dropped in the exact same column, do nothing
    if (destination.droppableId === source.droppableId) return;

    const newStatus = destination.droppableId;
    const taskId = draggableId;

    // Optimistically update UI instantly for a snappy feel
    setTasks(tasks.map(t => t._id === taskId ? { ...t, status: newStatus } : t));

    try {
      // Send the update to the backend (which also triggers WebSockets for everyone else)
      await api.patch(`/tasks/${taskId}`, { status: newStatus });
    } catch (error) {
      console.error("Failed to update task status", error);
    }
  };

  const getTasksByStatus = (status) => tasks.filter(task => task.status === status);

  // 3. Upgraded Column Component with <Droppable>
  const TaskColumn = ({ title, status }) => {
    const columnTasks = getTasksByStatus(status);
    
    return (
      <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800 flex flex-col h-full min-h-[500px]">
        <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2">
          <h3 className="font-bold text-gray-300">{title}</h3>
          <span className="bg-gray-800 text-gray-400 text-xs px-2 py-1 rounded-full">{columnTasks.length}</span>
        </div>
        
        {/* The Drop Zone */}
        <Droppable droppableId={status}>
          {(provided, snapshot) => (
            <div 
              ref={provided.innerRef} 
              {...provided.droppableProps}
              className={`flex-1 space-y-3 transition-colors ${snapshot.isDraggingOver ? 'bg-gray-800/30 rounded-lg' : ''}`}
            >
              {columnTasks.map((task, index) => (
                
                
                <Draggable key={task._id} draggableId={task._id} index={index}>
                  {(provided, snapshot) => (
                    <div 
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`bg-brand-card p-3 rounded border shadow-sm group transition-all ${
                        snapshot.isDragging ? 'border-brand-yellow scale-105 shadow-xl rotate-1' : 'border-gray-700 hover:border-gray-500'
                      }`}
                    >
                      <p className="text-white text-sm font-medium mb-3">{task.title}</p>
                      <div className="flex justify-between items-center border-t border-gray-700 pt-2 mt-2">
                          <span className="text-xs font-semibold text-brand-yellow">{task.priority}</span>
                          
                          {/* The dropdown is gone! Replaced by drag capability */}
                          <button onClick={() => handleDeleteTask(task._id)} className="text-xs text-red-500 hover:text-red-400 font-medium transition opacity-0 group-hover:opacity-100">
                              Delete
                          </button>
                      </div>
                    </div>
                  )}
                </Draggable>

              ))}
              {/* Required by DnD to keep layout stable when dropping */}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    );
  };

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <Link to="/" className="text-brand-yellow hover:underline text-sm font-medium mb-2 inline-block">&larr; Back to Dashboard</Link>
          <h1 className="text-2xl font-bold text-white">Project Board</h1>
        </div>
        <div className="text-gray-400 text-sm">{members.length} Team Members</div>
      </div>
      
      {error && <div className="mb-4 p-3 bg-red-900/50 text-red-200 border border-red-800 rounded">{error}</div>}
      
      <form onSubmit={handleCreateTask} className="mb-8 flex gap-4 bg-brand-card p-4 rounded-lg border border-gray-800">
        <input 
          type="text" placeholder="What needs to be done?" value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          className="flex-1 bg-gray-900 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:border-brand-yellow"
        />
        <Button type="submit">Add Task</Button>
      </form>

      {/* 5. Wrap the columns in the DragDropContext */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 pb-10">
          <TaskColumn title="To Do" status="To Do" />
          <TaskColumn title="In Progress" status="In Progress" />
          <TaskColumn title="In Review" status="In Review" />
          <TaskColumn title="Done" status="Done" />
        </div>
      </DragDropContext>
    </div>
  );
};

export default WorkspaceView;


