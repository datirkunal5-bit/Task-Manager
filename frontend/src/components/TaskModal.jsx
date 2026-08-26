import { useForm } from 'react-hook-form';
import { useEffect } from 'react';

function TaskModal({ isOpen, onClose, onSubmit, editingTask }) {
  const {
    register,
    handleSubmit,
    reset,
    forimport { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import API from '../api/axios';
import toast from 'react-hot-toast';

function TaskModal({ isOpen, onClose, onSubmit, editingTask, onRefresh }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const [newChecklistText, setNewChecklistText] = useState('');
  const [newCommentText, setNewCommentText] = useState('');

  useEffect(() => {
    if (editingTask) {
      reset({
        title: editingTask.title,
        description: editingTask.description,
        status: editingTask.status,
        priority: editingTask.priority,
        dueDate: editingTask.dueDate ? editingTask.dueDate.split('T')[0] : '',
        labels: editingTask.labels?.join(', ') || '',
      });
    } else {
      reset({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        dueDate: '',
        labels: '',
      });
    }
  }, [editingTask, isOpen, reset]);

  if (!isOpen) return null;

  const handleFormSubmit = async (data) => {
    const labelsArray = data.labels
      ? data.labels.split(',').map((l) => l.trim()).filter(Boolean)
      : [];
    await onSubmit({ ...data, labels: labelsArray });
  };

  const handleAddChecklistItem = async () => {
    if (!newChecklistText.trim()) return;
    try {
      await API.post(`/tasks/${editingTask._id}/checklist`, { text: newChecklistText });
      setNewChecklistText('');
      onRefresh();
    } catch (error) {
      toast.error('Failed to add checklist item');
    }
  };

  const handleToggleChecklistItem = async (itemId) => {
    try {
      await API.patch(`/tasks/${editingTask._id}/checklist/${itemId}`);
      onRefresh();
    } catch (error) {
      toast.error('Failed to update checklist item');
    }
  };

  const handleDeleteChecklistItem = async (itemId) => {
    try {
      await API.delete(`/tasks/${editingTask._id}/checklist/${itemId}`);
      onRefresh();
    } catch (error) {
      toast.error('Failed to delete checklist item');
    }
  };

  const handleAddComment = async () => {
    if (!newCommentText.trim()) return;
    try {
      await API.post(`/tasks/${editingTask._id}/comments`, { text: newCommentText });
      setNewCommentText('');
      onRefresh();
    } catch (error) {
      toast.error('Failed to add comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await API.delete(`/tasks/${editingTask._id}/comments/${commentId}`);
      onRefresh();
    } catch (error) {
      toast.error('Failed to delete comment');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {editingTask ? 'Edit Task' : 'New Task'}
        </h2>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              {...register('title', { required: 'Title is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              {...register('description')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                {...register('status')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="todo">Todo</option>
                <option value="in-progress">In Progress</option>
                <option value="review">Review</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                {...register('priority')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
            <input
              type="date"
              {...register('dueDate')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Labels <span className="text-gray-400 font-normal">(comma separated)</span>
            </label>
            <input
              type="text"
              placeholder="design, urgent, bug"
              {...register('labels')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition"
            >
              {isSubmitting ? 'Saving...' : editingTask ? 'Update' : 'Create'}
            </button>
          </div>
        </form>

        {editingTask && (
          <>
            <div className="border-t border-gray-200 mt-6 pt-5">
              <h3 className="font-semibold text-gray-800 mb-3">Checklist</h3>
              <div className="space-y-2 mb-3">
                {editingTask.checklist?.map((item) => (
                  <div key={item._id} className="flex items-center gap-2 group">
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => handleToggleChecklistItem(item._id)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span
                      className={`flex-1 text-sm ${
                        item.completed ? 'line-through text-gray-400' : 'text-gray-700'
                      }`}
                    >
                      {item.text}
                    </span>
                    <button
                      onClick={() => handleDeleteChecklistItem(item._id)}
                      className="text-xs text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                {(!editingTask.checklist || editingTask.checklist.length === 0) && (
                  <p className="text-gray-400 text-sm">No checklist items yet</p>
                )}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newChecklistText}
                  onChange={(e) => setNewChecklistText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddChecklistItem())}
                  placeholder="Add checklist item..."
                  className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleAddChecklistItem}
                  className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition"
                >
                  Add
                </button>
              </div>
            </div>

            <div className="border-t border-gray-200 mt-6 pt-5">
              <h3 className="font-semibold text-gray-800 mb-3">Comments</h3>
              <div className="space-y-3 mb-3 max-h-48 overflow-y-auto">
                {editingTask.comments?.map((comment) => (
                  <div key={comment._id} className="bg-gray-50 rounded-lg p-3 group">
                    <div className="flex justify-between items-start">
                      <p className="text-xs font-medium text-gray-700">
                        {comment.author?.name || 'Unknown'}
                      </p>
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="text-xs text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ✕
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{comment.text}</p>
                  </div>
                ))}
                {(!editingTask.comments || editingTask.comments.length === 0) && (
                  <p className="text-gray-400 text-sm">No comments yet</p>
                )}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddComment())}
                  placeholder="Write a comment..."
                  className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleAddComment}
                  className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition"
                >
                  Post
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default TaskModal;mState: { errors, isSubmitting } useForm();

  useEffect(() => {
    if (editingTask) {
      reset({
        title: editingTask.title,
        description: editingTask.description,
        status: editingTask.status,
        priority: editingTask.priority,
        dueDate: editingTask.dueDate ? editingTask.dueDate.split('T')[0] : '',
        labels: editingTask.labels?.join(', ') || '',
      });
    } else {
      reset({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        dueDate: '',
        labels: '',
      });
    }
  }, [editingTask, isOpen, reset]);

  if (!isOpen) return null;

  const handleFormSubmit = async (data) => {
    const labelsArray = data.labels
      ? data.labels.split(',').map((l) => l.trim()).filter(Boolean)
      : [];
    await onSubmit({ ...data, labels: labelsArray });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {editingTask ? 'Edit Task' : 'New Task'}
        </h2>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              {...register('title', { required: 'Title is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              {...register('description')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                {...register('status')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="todo">Todo</option>
                <option value="in-progress">In Progress</option>
                <option value="review">Review</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                {...register('priority')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
            <input
              type="date"
              {...register('dueDate')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Labels <span className="text-gray-400 font-normal">(comma separated)</span>
            </label>
            <input
              type="text"
              placeholder="design, urgent, bug"
              {...register('labels')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition"
            >
              {isSubmitting ? 'Saving...' : editingTask ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskModal;