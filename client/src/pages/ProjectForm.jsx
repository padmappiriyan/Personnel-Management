import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';

const ProjectForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        start_date: '',
        end_date: '',
        status: 'Planning',
    });
    const [availableSkills, setAvailableSkills] = useState([]);
    const [selectedSkills, setSelectedSkills] = useState([]); // Array of { skill_id, min_proficiency_level }

    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        fetchSkills();
        if (id) {
            fetchProject();
        }
    }, [id]);

    const fetchSkills = async () => {
        try {
            const response = await api.get('/skills');
            setAvailableSkills(response.data);
        } catch (error) {
            console.error('Error fetching skills:', error);
        }
    };

    const fetchProject = async () => {
        try {
            const response = await api.get(`/projects/${id}`);
            setFormData(response.data);
            // TODO: Fetch project skills and set selectedSkills
            // For now we assume the backend returns skills in the project object or we fetch them separately
        } catch (error) {
            console.error('Error fetching project:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSkillChange = (skillId, level) => {
        const existing = selectedSkills.find(s => s.skill_id === skillId);
        if (existing) {
            setSelectedSkills(selectedSkills.map(s => s.skill_id === skillId ? { ...s, min_proficiency_level: level } : s));
        } else {
            setSelectedSkills([...selectedSkills, { skill_id: skillId, min_proficiency_level: level }]);
        }
    };

    const handleRemoveSkill = (skillId) => {
        setSelectedSkills(selectedSkills.filter(s => s.skill_id !== skillId));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...formData, skills: selectedSkills };
            if (id) {
                await api.put(`/projects/${id}`, payload);
            } else {
                await api.post('/projects', payload);
            }
            navigate('/projects');
        } catch (error) {
            console.error('Error saving project:', error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto bg-white p-8 shadow rounded">
            <h2 className="text-2xl font-bold mb-6">{id ? 'Edit Project' : 'Add Project'}</h2>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Project Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                            <option value="Planning">Planning</option>
                            <option value="Active">Active</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                    <div className="col-span-2">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            rows="3"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Start Date</label>
                        <input
                            type="date"
                            name="start_date"
                            value={formData.start_date ? formData.start_date.split('T')[0] : ''}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">End Date</label>
                        <input
                            type="date"
                            name="end_date"
                            value={formData.end_date ? formData.end_date.split('T')[0] : ''}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="text-lg font-bold mb-2">Required Skills</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {availableSkills.map(skill => {
                            const isSelected = selectedSkills.find(s => s.skill_id === skill.id);
                            return (
                                <div key={skill.id} className="flex items-center justify-between border p-2 rounded">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={!!isSelected}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    handleSkillChange(skill.id, 1);
                                                } else {
                                                    handleRemoveSkill(skill.id);
                                                }
                                            }}
                                            className="mr-2"
                                        />
                                        <span>{skill.name}</span>
                                    </div>
                                    {isSelected && (
                                        <select
                                            value={isSelected.min_proficiency_level}
                                            onChange={(e) => handleSkillChange(skill.id, parseInt(e.target.value))}
                                            className="border rounded p-1 text-sm"
                                        >
                                            {[1, 2, 3, 4, 5].map(level => (
                                                <option key={level} value={level}>Level {level}</option>
                                            ))}
                                        </select>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Save Project
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProjectForm;
