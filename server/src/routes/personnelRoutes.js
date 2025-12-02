import { Router } from 'express';
const router = Router();
import { getAllPersonnel, createPersonnel, getPersonnelById, updatePersonnel, deletePersonnel } from '../controllers/personnelController.js';

router.get('/', getAllPersonnel);
router.post('/', createPersonnel);
router.get('/:id', getPersonnelById);
router.put('/:id', updatePersonnel);
router.delete('/:id', deletePersonnel);

export default router;
