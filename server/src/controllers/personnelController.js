import { query } from '../config/db.js';

export async function getAllPersonnel(req, res) {
    try {
        const [rows] = await query('SELECT * FROM personnel');
        console.log(rows);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export async function createPersonnel(req, res) {
    const { name, email, role, experience_level } = req.body;
    try {
        const [result] = await query(
            'INSERT INTO personnel (name, email, role, experience_level) VALUES (?, ?, ?, ?)',
            [name, email, role, experience_level]
        );
        res.status(201).json({ id: result.insertId, name, email, role, experience_level });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export async function getPersonnelById(req, res) {
    try {
        const [rows] = await query('SELECT * FROM personnel WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Personnel not found' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export async function updatePersonnel(req, res) {
    const { name, email, role, experience_level } = req.body;
    try {
        await query(
            'UPDATE personnel SET name = ?, email = ?, role = ?, experience_level = ? WHERE id = ?',
            [name, email, role, experience_level, req.params.id]
        );
        res.json({ message: 'Personnel updated' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export async function deletePersonnel(req, res) {
    try {
        await query('DELETE FROM personnel WHERE id = ?', [req.params.id]);
        res.json({ message: 'Personnel deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
