# Personnel Management System

A full-stack web application for managing personnel skills and matching them to project requirements.

## Tech Stack

### Frontend
- **React.js** (v19.2.0) - UI framework
- **Tailwind CSS** (v4.1.17) - Styling
- **React Router DOM** (v7.9.6) - Routing
- **Axios** (v1.13.2) - API calls
- **Vite** (v7.2.4) - Build tool

### Backend
- **Node.js** with **Express.js** (v5.2.0)
- **MySQL2** (v3.15.3) - Database driver
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables

### Database
- **MySQL** - Relational database

## Features

### 1. Personnel Management (CRUD)
- Create, Read, Update, Delete personnel records
- Fields: Name, Email, Role/Title, Experience Level (Junior/Mid-Level/Senior)
- Auto-generated creation timestamp

### 2. Skill Management (CRUD)
- Create, Read, Update, Delete skills
- Fields: Skill Name, Category, Description
- Assign skills to personnel with proficiency levels (1-5 scale)

### 3. Project Management
- Create projects with name, description, dates, and status
- Define required skills for each project with minimum proficiency levels
- Track project status (Planning, Active, Completed)

### 4. Skill Matching Feature
- Match personnel to projects based on required skills
- Filter by minimum proficiency level
- Display match percentage and detailed skill comparison
- Sort results by match quality

## Project Structure

```
Personal_Management/
├── client/                 # Frontend (React)
│   ├── src/
│   │   ├── api/           # API configuration
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── App.jsx        # Main app component
│   │   └── index.css      # Global styles
│   └── package.json
│
├── server/                # Backend (Node.js/Express)
│   ├── src/
│   │   ├── config/       # Database configuration
│   │   ├── controllers/  # Route controllers
│   │   ├── routes/       # API routes
│   │   └── models/       # (Reserved for future use)
│   ├── index.js          # Server entry point
│   ├── .env              # Environment variables
│   └── database_schema.sql
│
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MySQL Server
- npm or yarn

### Database Setup

1. **Start MySQL Server** and create the database:

```bash
mysql -u root -p
```

2. **Run the database schema**:

```sql
source server/database_schema.sql
```

Or manually execute the SQL file in MySQL Workbench.

3. **Update database credentials** in `server/.env`:

```env
PORT=5001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=personnelManagement
```

### Backend Setup

```bash
cd server
npm install
npm run dev
```

The server will run on `http://localhost:5001`

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

The client will run on `http://localhost:5175` (default Vite port)

## Docker Deployment (Alternative)

### Quick Start with Docker Compose

The easiest way to run the backend with Docker:

```bash
cd server
cp .env.docker.example .env
# Edit .env with your database password
docker-compose up -d
```

This will start:
- MySQL database on port 3306
- Backend API on port 5001

For detailed Docker instructions, see [server/DOCKER_GUIDE.md](server/DOCKER_GUIDE.md)

### Docker Files Included

- `server/Dockerfile` - Backend container definition
- `server/docker-compose.yml` - Multi-container orchestration
- `server/.dockerignore` - Files to exclude from image
- `server/.env.docker.example` - Example environment variables
- `server/DOCKER_GUIDE.md` - Complete Docker documentation


## API Endpoints

### Personnel
- `GET /api/personnel` - Get all personnel
- `POST /api/personnel` - Create personnel
- `GET /api/personnel/:id` - Get personnel by ID
- `PUT /api/personnel/:id` - Update personnel
- `DELETE /api/personnel/:id` - Delete personnel

### Personnel Skills
- `GET /api/personnel/:personnelId/skills` - Get personnel skills
- `POST /api/personnel/:personnelId/skills` - Assign skill to personnel
- `PUT /api/personnel/:personnelId/skills/:skillId` - Update skill proficiency
- `DELETE /api/personnel/:personnelId/skills/:skillId` - Remove skill

### Skills
- `GET /api/skills` - Get all skills
- `POST /api/skills` - Create skill
- `GET /api/skills/:id` - Get skill by ID
- `PUT /api/skills/:id` - Update skill
- `DELETE /api/skills/:id` - Delete skill

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create project (with skills)
- `GET /api/projects/:id` - Get project by ID (with skills)
- `PUT /api/projects/:id` - Update project (with skills)
- `DELETE /api/projects/:id` - Delete project

### Matching
- `GET /api/matching/project/:projectId` - Match personnel to project

## Usage Guide

### 1. Add Skills
Navigate to the **Skills** page and add skills like "React", "Python", "AWS", etc.

### 2. Add Personnel
Go to **Personnel** → **Add Personnel** and create personnel records.

### 3. Assign Skills to Personnel
Click **View** on any personnel to assign skills with proficiency levels (1-5).

### 4. Create Projects
Navigate to **Projects** → **Add Project** and define:
- Project details
- Required skills with minimum proficiency levels

### 5. Match Personnel to Projects
Go to **Matching** page, select a project, and click **Find Matches** to see qualified personnel.

## Database Schema

### Tables

1. **personnel** - Stores personnel information
2. **skills** - Stores skill catalog
3. **personnel_skills** - Junction table linking personnel to skills with proficiency
4. **projects** - Stores project information
5. **project_skills** - Junction table linking projects to required skills

## Development

### Running in Development Mode

**Backend:**
```bash
cd server
npm run dev  # Uses nodemon for auto-reload
```

**Frontend:**
```bash
cd client
npm run dev  # Uses Vite dev server with HMR
```

### Building for Production

**Frontend:**
```bash
cd client
npm run build
```

**Backend:**
```bash
cd server
npm start
```

## Features Implemented

Personnel CRUD operations  
Skill CRUD operations  
Project CRUD operations  
Skill assignment to personnel with proficiency levels  
Required skills for projects  
Personnel-to-project matching algorithm  
Match percentage calculation  
Responsive UI with Tailwind CSS  
Form validation  
Error handling  

## Future Enhancements

- User authentication and authorization
- Advanced search and filtering
- Export data to CSV/PDF
- Dashboard with analytics
- Skill recommendations
- Team composition suggestions
- Project timeline visualization

## License

MIT

## Author

Created for Personnel Management System
