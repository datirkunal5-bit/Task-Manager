const express = require('express');
const router = express.Router();
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getDashboardStats,
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/stats').get(getDashboardStats);
router.route('/').post(createProject).get(getProjects);
router.route('/:id').get(getProjectById).put(updateProject).delete(deleteProject);

module.exports = router;