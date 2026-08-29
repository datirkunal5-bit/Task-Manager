import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  DndContext,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import API from '../api/axios';
import KanbanColumn from '../components/KanbanColumn';
import TaskModal from '../components/TaskModal';
import toast from 'react-hot-toast';

const COLUMNS = [
  { key: 'todo', label: 'Todo' },
  { key: 'in-progress', label: 'In Progress' },
  { key: 'review', label: 'Review' },
  { key: 'completed', label: 'Completed' },
];

function ProjectBoard() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  useEffect(() => {
    fetchData();
  }, [projectId]);

  useEffect(() => {
    if (editingTask) {
      const updated = tasks.find((t) => t._id === editingTask._id);
      if (updated) setEditingTask(updated);
    }
  }, [tasks]);

  const fetchData = async () => {
    try {
      const [projectRes, tasksRes] = await Promise.all([
        API.get(`/projects/${projectId}`),
        API.get(`/tasks/project/${projectId}`),
      ]);
      setProject(projectRes.data);
      setTasks(tasksRes.data);
    } catch (error) {
      toast.error('Failed to load project');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedTasks = useMemo(() => {
    let result = [...tasks];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q) ||
          t.labels?.some((label) => label.toLowerCase().includes(q))
      );
    }

    if (priorityFilter !== 'all') {
      result = result.filter((t) => t.priority === priorityFilter);
    }

    const priorityOrder = { high: 0, medium: 1, low: 2 };
    if (sortBy === 'priority') {
      result.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    } else if (sortBy === 'dueDate') {
      result.sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      });
    } else if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    return result;
  }, [tasks, searchQuery, priorityFilter, sortBy]);

  const handleOpenCreateModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleSubmit = async (data) => {
    try {
      if (editingTask) {
        await API.put(`/tasks/${editingTask._id}`, data);
        toast.success('Task updated');
      } else {
        await API.post('/tasks', { ...data, project: projectId });
        toast.success('Task created');
      }
      handleCloseModal();
      fetchData();
    } catch (error) {
      const message = error.response?.data?.message || 'Something went wrong';
      toast.error(message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await API.delete(`/tasks/${id}`);
      toast.success('Task deleted');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id;
    const draggedTask = tasks.find((t) => t._id === taskId);
    if (!draggedTask) return;

    let newStatus = over.id;
    const overTask = tasks.find((t) => t._id === over.id);
    if (overTask) {
      newStatus = overTask.status;
    }

    if (draggedTask.status === newStatus) return;

    const previousTasks = tasks;
    setTasks((prev) =>
      prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
    );

    try {
      await API.put(`/tasks/${taskId}`, { status: newStatus });
    } catch (error) {
      setTasks(previousTasks);
      toast.error('Failed to move task');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:p-10">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate('/dashboard')}
          className="text-sm text-gray-500 hover:text-gray-800 mb-4 flex items-center gap-1"
        >
          ← Back to Dashboard
        </button>

        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{project?.title}</h1>
            <p className="text-gray-500 text-sm mt-1">{project?.description}</p>
          </div>
          <button
            onClick={handleOpenCreateModal}
            className="bg-gray-900 text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-gray-800 active:scale-95 transition-all"
          >
            + New Task
          </button>
        </div>

        <div className="flex flex-wrap gap-3 mb-6 bg-white p-3 rounded-xl border border-gray-100">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
            className="flex-1 min-w-[180px] px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="priority">Priority</option>
            <option value="dueDate">Due Date</option>
          </select>

          {(searchQuery || priorityFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setPriorityFilter('all');
              }}
              className="text-sm text-gray-500 hover:text-red-600 px-3 py-2"
            >
              Clear filters
            </button>
          )}
        </div>

        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {COLUMNS.map((col) => (
              <KanbanColumn
                key={col.key}
                id={col.key}
                label={col.label}
                tasks={filteredAndSortedTasks.filter((t) => t.status === col.key)}
                onEdit={handleOpenEditModal}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </DndContext>
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        editingTask={editingTask}
        onRefresh={fetchData}
      />
    </div>
  );
}

export default ProjectBoard;