import express, { json } from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import personnelRoutes from './src/routes/personnelRoutes.js';
import skillRoutes from './src/routes/skillRoutes.js';
import projectRoutes from './src/routes/projectRoutes.js';
import personnelSkillsRoutes from './src/routes/personnelSkillsRoutes.js';
import matchingRoutes from './src/routes/matchingRoutes.js';

config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(json());

// Routes
app.use('/api/personnel', personnelRoutes);
app.use('/api/personnel', personnelSkillsRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/matching', matchingRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
