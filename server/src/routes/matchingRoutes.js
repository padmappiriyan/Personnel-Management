import { Router } from 'express';
const router = Router();
import { matchPersonnelToProject } from '../controllers/matchingController.js';

router.get('/project/:projectId', matchPersonnelToProject);

export default router;
