import db from '../config/db.js';

// Match personnel to a project based on required skills
export async function matchPersonnelToProject(req, res) {
    const { projectId } = req.params;

    try {
        // Get project required skills
        const [requiredSkills] = await db.query(
            `SELECT ps.skill_id, s.name as skill_name, ps.min_proficiency_level 
       FROM project_skills ps 
       JOIN skills s ON ps.skill_id = s.id 
       WHERE ps.project_id = ?`,
            [projectId]
        );

        if (requiredSkills.length === 0) {
            return res.json({ message: 'No skills required for this project', matches: [] });
        }

        // Get all personnel with their skills
        const [personnel] = await db.query(`
      SELECT DISTINCT p.id, p.name, p.email, p.role, p.experience_level
      FROM personnel p
    `);

        const matches = [];

        for (const person of personnel) {
            // Get person's skills
            const [personSkills] = await db.query(
                `SELECT skill_id, proficiency_level 
         FROM personnel_skills 
         WHERE personnel_id = ?`,
                [person.id]
            );

            // Check if person has all required skills with minimum proficiency
            let hasAllSkills = true;
            let matchedSkills = [];
            let totalMatch = 0;

            for (const reqSkill of requiredSkills) {
                const personSkill = personSkills.find(ps => ps.skill_id === reqSkill.skill_id);

                if (!personSkill || personSkill.proficiency_level < reqSkill.min_proficiency_level) {
                    hasAllSkills = false;
                    break;
                } else {
                    matchedSkills.push({
                        skill_name: reqSkill.skill_name,
                        required_level: reqSkill.min_proficiency_level,
                        actual_level: personSkill.proficiency_level
                    });
                    totalMatch += personSkill.proficiency_level;
                }
            }

            if (hasAllSkills) {
                const matchPercentage = Math.round((totalMatch / (requiredSkills.length * 5)) * 100);
                matches.push({
                    ...person,
                    matched_skills: matchedSkills,
                    match_percentage: matchPercentage
                });
            }
        }

        // Sort by match percentage (highest first)
        matches.sort((a, b) => b.match_percentage - a.match_percentage);

        res.json({ matches, required_skills: requiredSkills });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
