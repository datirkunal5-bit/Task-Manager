const Task = require('./models/Task');
const Project = require('../models/Project');

const verifyProjectOwnership = async (projectId, userId) => {
  const project = await Project.findById(projectId);
  if (!project) return { error: 'Project not found', status: 404 };
  if (project.owner.toString() !== userId.toString()) {
    return { error: 'Not authorized to access this project', status: 403 };
  }
  return { project };
};

const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, labels, project, assignedTo } = req.body;

    if (!title || !project) {
      return res.status(400).json({ message: 'Title and project are required' });
    }

    const check = await verifyProjectOwnership(project, req.user._id);
    if (check.error) {
      return res.status(check.status).json({ message: check.error });
    }

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      labels,
      project,
      assignedTo,
      createdBy: req.user._id,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getTasksByProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const check = await verifyProjectOwnership(projectId, req.user._id);
    if (check.error) {
      return res.status(check.status).json({ message: check.error });
    }

    const tasks = await Task.find({ project: projectId })
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('assignedTo', 'name email');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const check = await verifyProjectOwnership(task.project, req.user._id);
    if (check.error) {
      return res.status(check.status).json({ message: check.error });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const check = await verifyProjectOwnership(task.project, req.user._id);
    if (check.error) {
      return res.status(check.status).json({ message: check.error });
    }

    const { title, description, status, priority, dueDate, labels, assignedTo } = req.body;

    task.title = title ?? task.title;
    task.description = description ?? task.description;
    task.status = status ?? task.status;
    task.priority = priority ?? task.priority;
    task.dueDate = dueDate ?? task.dueDate;
    task.labels = labels ?? task.labels;
    task.assignedTo = assignedTo ?? task.assignedTo;

    const updatedTask = await task.save();

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const check = await verifyProjectOwnership(task.project, req.user._id);
    if (check.error) {
      return res.status(check.status).json({ message: check.error });
    }

    await task.deleteOne();

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createTask,
  getTasksByProject,
  getTaskById,
  updateTask,
  deleteTask,
};