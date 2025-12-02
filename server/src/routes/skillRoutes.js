import { Router } from 'express';
const router = Router();
import { getAllSkills, createSkill, getSkillById, updateSkill, deleteSkill } from '../controllers/skillController.js';

router.get('/', getAllSkills);
router.post('/', createSkill);
router.get('/:id', getSkillById);
router.put('/:id', updateSkill);
router.delete('/:id', deleteSkill);

export default router;
