import { query } from '../config/db.js';

// Get all skills for a personnel
export async function getPersonnelSkills(req, res) {
    try {
        const [rows] = await query(
            `SELECT s.id, s.name, s.category, ps.proficiency_level 
       FROM skills s 
       JOIN personnel_skills ps ON s.id = ps.skill_id 
       WHERE ps.personnel_id = ?`,
            [req.params.personnelId]
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// Assign skill to personnel
export async function assignSkill(req, res) {
    const { skill_id, proficiency_level } = req.body;
    try {
        await query(
            'INSERT INTO personnel_skills (personnel_id, skill_id, proficiency_level) VALUES (?, ?, ?)',
            [req.params.personnelId, skill_id, proficiency_level]
        );
        res.status(201).json({ message: 'Skill assigned successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// Update personnel skill proficiency
export async function updateSkillProficiency(req, res) {
    const { proficiency_level } = req.body;
    try {
        await query(
            'UPDATE personnel_skills SET proficiency_level = ? WHERE personnel_id = ? AND skill_id = ?',
            [proficiency_level, req.params.personnelId, req.params.skillId]
        );
        res.json({ message: 'Proficiency updated' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// Remove skill from personnel
export async function removeSkill(req, res) {
    try {
        await query(
            'DELETE FROM personnel_skills WHERE personnel_id = ? AND skill_id = ?',
            [req.params.personnelId, req.params.skillId]
        );
        res.json({ message: 'Skill removed' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
