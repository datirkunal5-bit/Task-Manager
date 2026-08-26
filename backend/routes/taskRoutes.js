const express = require('express');
const router = express.Router();
const {
  createTask,
  getTasksByProject,
  getTaskById,
  updateTask,
  deleteTask,
  addComment,
  deleteComment,
  addChecklistItem,
  toggleChecklistItem,
  deleteChecklistItem,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/').post(createTask);
router.route('/project/:projectId').get(getTasksByProject);
router.route('/:id').get(getTaskById).put(updateTask).delete(deleteTask);

router.route('/:id/comments').post(addComment);
router.route('/:id/comments/:commentId').delete(deleteComment);

router.route('/:id/checklist').post(addChecklistItem);
router.route('/:id/checklist/:itemId').patch(toggleChecklistItem).delete(deleteChecklistItem);

module.exports = router;