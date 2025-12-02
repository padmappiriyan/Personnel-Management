import { query, getConnection } from '../config/db.js';

export async function getAllProjects(req, res) {
    try {
        const [rows] = await query('SELECT * FROM projects');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export async function createProject(req, res) {
    const { name, description, start_date, end_date, status, skills } = req.body;
    const connection = await getConnection();
    try {
        await connection.beginTransaction();

        const [result] = await connection.query(
            'INSERT INTO projects (name, description, start_date, end_date, status) VALUES (?, ?, ?, ?, ?)',
            [name, description, start_date, end_date, status]
        );
        const projectId = result.insertId;

        if (skills && skills.length > 0) {
            const values = skills.map(s => [projectId, s.skill_id, s.min_proficiency_level]);
            await connection.query(
                'INSERT INTO project_skills (project_id, skill_id, min_proficiency_level) VALUES ?',
                [values]
            );
        }

        await connection.commit();
        res.status(201).json({ id: projectId, name, description, start_date, end_date, status });
    } catch (err) {
        await connection.rollback();
        res.status(500).json({ message: err.message });
    } finally {
        connection.release();
    }
}

export async function getProjectById(req, res) {
    try {
        const [rows] = await query('SELECT * FROM projects WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Project not found' });

        const project = rows[0];
        const [skills] = await query(
            'SELECT s.id, s.name, ps.min_proficiency_level FROM skills s JOIN project_skills ps ON s.id = ps.skill_id WHERE ps.project_id = ?',
            [project.id]
        );
        project.skills = skills;

        res.json(project);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export async function updateProject(req, res) {
    const { name, description, start_date, end_date, status, skills } = req.body;
    const connection = await getConnection();
    try {
        await connection.beginTransaction();

        await connection.query(
            'UPDATE projects SET name = ?, description = ?, start_date = ?, end_date = ?, status = ? WHERE id = ?',
            [name, description, start_date, end_date, status, req.params.id]
        );

        if (skills) {
            // Delete existing skills
            await connection.query('DELETE FROM project_skills WHERE project_id = ?', [req.params.id]);

            // Insert new skills
            if (skills.length > 0) {
                const values = skills.map(s => [req.params.id, s.skill_id, s.min_proficiency_level]);
                await connection.query(
                    'INSERT INTO project_skills (project_id, skill_id, min_proficiency_level) VALUES ?',
                    [values]
                );
            }
        }

        await connection.commit();
        res.json({ message: 'Project updated' });
    } catch (err) {
        await connection.rollback();
        res.status(500).json({ message: err.message });
    } finally {
        connection.release();
    }
}

export async function deleteProject(req, res) {
    try {
        await query('DELETE FROM projects WHERE id = ?', [req.params.id]);
        res.json({ message: 'Project deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
