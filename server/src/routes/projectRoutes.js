import { Router } from 'express';
const router = Router();
import { getAllProjects, createProject, getProjectById, updateProject, deleteProject } from '../controllers/projectController.js';

router.get('/', getAllProjects);
router.post('/', createProject);
router.get('/:id', getProjectById);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);

export default router;
