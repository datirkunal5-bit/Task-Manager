import NotificationBell from '../components/NotificationBell';
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import ProjectCard from '../components/ProjectCard';
import ProjectModal from '../components/ProjectModal';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
function Dashboard() {
  const { user, logout } = useAuth();
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    fetchProjects();
    fetchStats();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await API.get('/projects');
      setProjects(response.data);
    } catch (error) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await API.get('/projects/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to load stats');
    }
  };

  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) return projects;
    const q = searchQuery.toLowerCase();
    return projects.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
    );
  }, [projects, searchQuery]);

  const handleOpenCreateModal = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
  };

  const handleSubmit = async (data) => {
    try {
      if (editingProject) {
        await API.put(`/projects/${editingProject._id}`, data);
        toast.success('Project updated');
      } else {
        await API.post('/projects', data);
        toast.success('Project created');
      }
      handleCloseModal();
      fetchProjects();
      fetchStats();
    } catch (error) {
      const message = error.response?.data?.message || 'Something went wrong';
      toast.error(message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await API.delete(`/projects/${id}`);
      toast.success('Project deleted');
      fetchProjects();
      fetchStats();
    } catch (error) {
      toast.error('Failed to delete project');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6 sm:p-10 transition-colors">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
           <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Dashboard</h1>
            <p className="text-gray-500 mt-1">Welcome back, {user?.name?.split(' ')[0]}</p>
          </div>
          <button
            onClick={logout}
            className="text-sm font-medium text-gray-500 hover:text-red-600 border border-gray-200 hover:border-red-200 px-4 py-2 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
        <div className="flex items-center gap-3">
  <button
    onClick={() => navigate('/profile')}
    className="text-sm font-medium text-gray-500 hover:text-gray-800 border border-gray-200 px-4 py-2 rounded-lg transition-colors"
  >
    Profile
  </button>
  <button
  onClick={toggleTheme}
  className="text-sm font-medium text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 border border-gray-200 dark:border-gray-700 px-3 py-2 rounded-lg transition-colors"
>
  {isDark ? '☀️' : '🌙'}
</button>
  <button
    onClick={logout}
    className="text-sm font-medium text-gray-500 hover:text-red-600 border border-gray-200 hover:border-red-200 px-4 py-2 rounded-lg transition-colors"
  >
    Logout
  </button>
  <div className="flex items-center gap-3">
  <NotificationBell />
  <button onClick={toggleTheme} ...>...</button>
  <button onClick={() => navigate('/profile')} ...>Profile</button>
  <button onClick={logout} ...>Logout</button>
</div>
</div>


        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <p className="text-gray-400 text-xs font-medium uppercase tracking-wide mb-1">
                Projects
              </p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalProjects}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <p className="text-gray-400 text-xs font-medium uppercase tracking-wide mb-1">
                Total Tasks
              </p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalTasks}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <p className="text-gray-400 text-xs font-medium uppercase tracking-wide mb-1">
                Completed
              </p>
              <p className="text-2xl font-bold text-emerald-600">{stats.completedTasks}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <p className="text-gray-400 text-xs font-medium uppercase tracking-wide mb-1">
                High Priority
              </p>
              <p className="text-2xl font-bold text-red-600">{stats.highPriorityTasks}</p>
            </div>
          </div>
        )}

        <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
          <h2 className="text-lg font-semibold text-gray-800">
            Your Projects
            <span className="text-gray-400 font-normal ml-2">{filteredProjects.length}</span>
          </h2>
          <div className="flex gap-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
            />
            <button
              onClick={handleOpenCreateModal}
              className="bg-gray-900 text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-gray-800 active:scale-95 transition-all"
            >
              + New Project
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading projects...</p>
        ) : filteredProjects.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-16 text-center">
            {searchQuery ? (
              <p className="text-gray-400">No projects match "{searchQuery}"</p>
            ) : (
              <>
                <p className="text-gray-400 mb-4">No projects yet</p>
                <button
                  onClick={handleOpenCreateModal}
                  className="text-blue-600 font-medium hover:underline"
                >
                  Create your first project
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                onEdit={handleOpenEditModal}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      <ProjectModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        editingProject={editingProject}
      />
    </div>
  );
}

export default Dashboard;