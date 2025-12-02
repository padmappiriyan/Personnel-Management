import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const PersonnelDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [personnel, setPersonnel] = useState(null);
    const [personnelSkills, setPersonnelSkills] = useState([]);
    const [allSkills, setAllSkills] = useState([]);
    const [selectedSkill, setSelectedSkill] = useState('');
    const [proficiencyLevel, setProficiencyLevel] = useState(1);

    useEffect(() => {
        fetchPersonnel();
        fetchPersonnelSkills();
        fetchAllSkills();
    }, [id]);

    const fetchPersonnel = async () => {
        try {
            const response = await api.get(`/personnel/${id}`);
            setPersonnel(response.data);
        } catch (error) {
            console.error('Error fetching personnel:', error);
        }
    };

    const fetchPersonnelSkills = async () => {
        try {
            const response = await api.get(`/personnel/${id}/skills`);
            setPersonnelSkills(response.data);
        } catch (error) {
            console.error('Error fetching personnel skills:', error);
        }
    };

    const fetchAllSkills = async () => {
        try {
            const response = await api.get('/skills');
            setAllSkills(response.data);
        } catch (error) {
            console.error('Error fetching skills:', error);
        }
    };

    const handleAssignSkill = async (e) => {
        e.preventDefault();
        if (!selectedSkill) return;

        try {
            await api.post(`/personnel/${id}/skills`, {
                skill_id: parseInt(selectedSkill),
                proficiency_level: proficiencyLevel,
            });
            setSelectedSkill('');
            setProficiencyLevel(1);
            fetchPersonnelSkills();
        } catch (error) {
            console.error('Error assigning skill:', error);
            alert('Error assigning skill. It may already be assigned.');
        }
    };

    const handleRemoveSkill = async (skillId) => {
        if (window.confirm('Remove this skill?')) {
            try {
                await api.delete(`/personnel/${id}/skills/${skillId}`);
                fetchPersonnelSkills();
            } catch (error) {
                console.error('Error removing skill:', error);
            }
        }
    };

    const handleUpdateProficiency = async (skillId, newLevel) => {
        try {
            await api.put(`/personnel/${id}/skills/${skillId}`, {
                proficiency_level: newLevel,
            });
            fetchPersonnelSkills();
        } catch (error) {
            console.error('Error updating proficiency:', error);
        }
    };

    const availableSkills = allSkills.filter(
        (skill) => !personnelSkills.find((ps) => ps.id === skill.id)
    );

    if (!personnel) return <div>Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <button
                onClick={() => navigate('/personnel')}
                className="mb-4 text-indigo-600 hover:text-indigo-800"
            >
                ← Back to Personnel List
            </button>

            <div className="bg-white p-6 rounded-lg shadow mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{personnel.name}</h1>
                <p className="text-gray-600 mb-1">{personnel.email}</p>
                <p className="text-gray-600 mb-1">Role: {personnel.role}</p>
                <span className={`inline-block px-3 py-1 rounded text-sm font-semibold ${personnel.experience_level === 'Senior' ? 'bg-purple-100 text-purple-800' :
                        personnel.experience_level === 'Mid-Level' ? 'bg-green-100 text-green-800' :
                            'bg-yellow-100 text-yellow-800'
                    }`}>
                    {personnel.experience_level}
                </span>
            </div>

            <div className="bg-white p-6 rounded-lg shadow mb-8">
                <h2 className="text-xl font-semibold mb-4">Assign New Skill</h2>
                <form onSubmit={handleAssignSkill} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <select
                        value={selectedSkill}
                        onChange={(e) => setSelectedSkill(e.target.value)}
                        className="border rounded p-2"
                        required
                    >
                        <option value="">-- Select Skill --</option>
                        {availableSkills.map((skill) => (
                            <option key={skill.id} value={skill.id}>
                                {skill.name}
                            </option>
                        ))}
                    </select>
                    <select
                        value={proficiencyLevel}
                        onChange={(e) => setProficiencyLevel(parseInt(e.target.value))}
                        className="border rounded p-2"
                    >
                        <option value={1}>Level 1 - Beginner</option>
                        <option value={2}>Level 2 - Elementary</option>
                        <option value={3}>Level 3 - Intermediate</option>
                        <option value={4}>Level 4 - Advanced</option>
                        <option value={5}>Level 5 - Expert</option>
                    </select>
                    <button
                        type="submit"
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        Assign Skill
                    </button>
                </form>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Current Skills</h2>
                {personnelSkills.length === 0 ? (
                    <p className="text-gray-500">No skills assigned yet.</p>
                ) : (
                    <div className="space-y-4">
                        {personnelSkills.map((skill) => (
                            <div
                                key={skill.id}
                                className="flex items-center justify-between border-b pb-4"
                            >
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-800">{skill.name}</h3>
                                    <p className="text-sm text-gray-500">{skill.category}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <select
                                        value={skill.proficiency_level}
                                        onChange={(e) =>
                                            handleUpdateProficiency(skill.id, parseInt(e.target.value))
                                        }
                                        className="border rounded p-1 text-sm"
                                    >
                                        <option value={1}>Level 1</option>
                                        <option value={2}>Level 2</option>
                                        <option value={3}>Level 3</option>
                                        <option value={4}>Level 4</option>
                                        <option value={5}>Level 5</option>
                                    </select>
                                    <button
                                        onClick={() => handleRemoveSkill(skill.id)}
                                        className="text-red-600 hover:text-red-800 text-sm"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PersonnelDetail;
