import { useState, useEffect } from 'react';
import api from '../api/axios';

const Matching = () => {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState('');
    const [matches, setMatches] = useState([]);
    const [requiredSkills, setRequiredSkills] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await api.get('/projects');
            setProjects(response.data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    const handleMatch = async () => {
        if (!selectedProject) return;

        setLoading(true);
        try {
            const response = await api.get(`/matching/project/${selectedProject}`);
            setMatches(response.data.matches || []);
            setRequiredSkills(response.data.required_skills || []);
        } catch (error) {
            console.error('Error matching personnel:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Personnel-Project Matching</h1>

            <div className="bg-white p-6 rounded-lg shadow mb-8">
                <h2 className="text-xl font-semibold mb-4">Select Project</h2>
                <div className="flex gap-4">
                    <select
                        value={selectedProject}
                        onChange={(e) => setSelectedProject(e.target.value)}
                        className="flex-1 border rounded p-2 text-gray-700"
                    >
                        <option value="">-- Select a Project --</option>
                        {projects.map((project) => (
                            <option key={project.id} value={project.id}>
                                {project.name}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={handleMatch}
                        disabled={!selectedProject || loading}
                        className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Matching...' : 'Find Matches'}
                    </button>
                </div>
            </div>

            {requiredSkills.length > 0 && (
                <div className="bg-blue-50 p-6 rounded-lg shadow mb-8">
                    <h3 className="text-lg font-semibold mb-3 text-blue-900">Required Skills</h3>
                    <div className="flex flex-wrap gap-2">
                        {requiredSkills.map((skill, index) => (
                            <span
                                key={index}
                                className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                            >
                                {skill.skill_name} (Level {skill.min_proficiency_level}+)
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {matches.length > 0 ? (
                <div>
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">
                        Matched Personnel ({matches.length})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {matches.map((person) => (
                            <div key={person.id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">{person.name}</h3>
                                        <p className="text-gray-600">{person.role}</p>
                                        <p className="text-sm text-gray-500">{person.email}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-indigo-600">
                                            {person.match_percentage}%
                                        </div>
                                        <div className="text-xs text-gray-500">Match</div>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <span className={`inline-block px-3 py-1 rounded text-sm font-semibold ${person.experience_level === 'Senior' ? 'bg-purple-100 text-purple-800' :
                                            person.experience_level === 'Mid-Level' ? 'bg-green-100 text-green-800' :
                                                'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {person.experience_level}
                                    </span>
                                </div>

                                <div>
                                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Matched Skills:</h4>
                                    <div className="space-y-1">
                                        {person.matched_skills.map((skill, idx) => (
                                            <div key={idx} className="flex justify-between items-center text-sm">
                                                <span className="text-gray-700">{skill.skill_name}</span>
                                                <div className="flex gap-2 items-center">
                                                    <span className="text-gray-500">Required: {skill.required_level}</span>
                                                    <span className="text-green-600 font-semibold">Has: {skill.actual_level}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : selectedProject && !loading ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                    <p className="text-yellow-800 text-lg">
                        No personnel found matching all required skills for this project.
                    </p>
                </div>
            ) : null}
        </div>
    );
};

export default Matching;
