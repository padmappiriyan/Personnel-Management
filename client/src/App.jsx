import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import PersonnelList from './pages/PersonnelList';
import PersonnelForm from './pages/PersonnelForm';
import PersonnelDetail from './pages/PersonnelDetail';
import SkillList from './pages/SkillList';
import ProjectList from './pages/ProjectList';
import ProjectForm from './pages/ProjectForm';
import Matching from './pages/Matching';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <Navbar />
        <div className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<PersonnelList />} />
            <Route path="/personnel" element={<PersonnelList />} />
            <Route path="/personnel/new" element={<PersonnelForm />} />
            <Route path="/personnel/edit/:id" element={<PersonnelForm />} />
            <Route path="/personnel/:id" element={<PersonnelDetail />} />
            <Route path="/skills" element={<SkillList />} />
            <Route path="/projects" element={<ProjectList />} />
            <Route path="/projects/new" element={<ProjectForm />} />
            <Route path="/projects/edit/:id" element={<ProjectForm />} />
            <Route path="/matching" element={<Matching />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
