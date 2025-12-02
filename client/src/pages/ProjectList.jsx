import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const ProjectList = () => {
    const [projects, setProjects] = useState([]);

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

    const deleteProject = async (id) => {
        if (window.confirm('Are you sure?')) {
            try {
                await api.delete(`/projects/${id}`);
                fetchProjects();
            } catch (error) {
                console.error('Error deleting project:', error);
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Projects</h1>
                <Link to="/projects/new" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
                    Add Project
                </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <div key={project.id} className="bg-white shadow rounded-lg p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{project.name}</h3>
                        <p className="text-gray-600 mb-4">{project.description}</p>
                        <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                            <span>{new Date(project.start_date).toLocaleDateString()}</span>
                            <span>-</span>
                            <span>{new Date(project.end_date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${project.status === 'Active' ? 'bg-green-100 text-green-800' :
                                    project.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                                        'bg-yellow-100 text-yellow-800'
                                }`}>
                                {project.status}
                            </span>
                            <div>
                                <Link to={`/projects/edit/${project.id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</Link>
                                <button onClick={() => deleteProject(project.id)} className="text-red-600 hover:text-red-900">Delete</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProjectList;
