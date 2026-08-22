const express = require('express');
const router = express.Router();
const {
  createTask,
  getTasksByProject,
  getTaskById,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/').post(createTask);
router.route('/project/:projectId').get(getTasksByProject);
router.route('/:id').get(getTaskById).put(updateTask).delete(deleteTask);

module.exports = router;