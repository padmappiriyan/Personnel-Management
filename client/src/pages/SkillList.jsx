import { useEffect, useState } from 'react';
import api from '../api/axios';

const SkillList = () => {
    const [skills, setSkills] = useState([]);
    const [newSkill, setNewSkill] = useState({ name: '', category: '', description: '' });

    useEffect(() => {
        fetchSkills();
    }, []);

    const fetchSkills = async () => {
        try {
            const response = await api.get('/skills');
            setSkills(response.data);
        } catch (error) {
            console.error('Error fetching skills:', error);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post('/skills', newSkill);
            setNewSkill({ name: '', category: '', description: '' });
            fetchSkills();
        } catch (error) {
            console.error('Error creating skill:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete skill?')) {
            try {
                await api.delete(`/skills/${id}`);
                fetchSkills();
            } catch (error) {
                console.error('Error deleting skill:', error);
            }
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Skills</h1>

            <div className="bg-white p-6 rounded shadow mb-8">
                <h2 className="text-xl font-semibold mb-4">Add New Skill</h2>
                <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input
                        type="text"
                        placeholder="Skill Name"
                        value={newSkill.name}
                        onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                        className="border p-2 rounded"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Category"
                        value={newSkill.category}
                        onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                        className="border p-2 rounded"
                    />
                    <input
                        type="text"
                        placeholder="Description"
                        value={newSkill.description}
                        onChange={(e) => setNewSkill({ ...newSkill, description: e.target.value })}
                        className="border p-2 rounded"
                    />
                    <button type="submit" className="bg-green-600 text-white p-2 rounded hover:bg-green-700">Add Skill</button>
                </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {skills.map((skill) => (
                    <div key={skill.id} className="bg-white p-4 rounded shadow">
                        <h3 className="font-bold text-lg">{skill.name}</h3>
                        <p className="text-sm text-gray-500">{skill.category}</p>
                        <p className="text-gray-700 mt-2">{skill.description}</p>
                        <button onClick={() => handleDelete(skill.id)} className="text-red-500 text-sm mt-4">Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SkillList;
