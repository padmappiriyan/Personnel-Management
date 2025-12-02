import { Router } from 'express';
const router = Router();
import { getPersonnelSkills, assignSkill, updateSkillProficiency, removeSkill } from '../controllers/personnelSkillsController.js';

router.get('/:personnelId/skills', getPersonnelSkills);
router.post('/:personnelId/skills', assignSkill);
router.put('/:personnelId/skills/:skillId', updateSkillProficiency);
router.delete('/:personnelId/skills/:skillId', removeSkill);

export default router;
