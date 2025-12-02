import { query } from '../config/db.js';

export async function getAllSkills(req, res) {
    try {
        const [rows] = await query('SELECT * FROM skills');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export async function createSkill(req, res) {
    const { name, category, description } = req.body;
    try {
        const [result] = await query(
            'INSERT INTO skills (name, category, description) VALUES (?, ?, ?)',
            [name, category, description]
        );
        res.status(201).json({ id: result.insertId, name, category, description });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export async function getSkillById(req, res) {
    try {
        const [rows] = await query('SELECT * FROM skills WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Skill not found' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export async function updateSkill(req, res) {
    const { name, category, description } = req.body;
    try {
        await query(
            'UPDATE skills SET name = ?, category = ?, description = ? WHERE id = ?',
            [name, category, description, req.params.id]
        );
        res.json({ message: 'Skill updated' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export async function deleteSkill(req, res) {
    try {
        await query('DELETE FROM skills WHERE id = ?', [req.params.id]);
        res.json({ message: 'Skill deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
