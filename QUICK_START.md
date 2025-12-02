# Quick Start Guide

##  Get Started in 5 Minutes

### Step 1: Database Setup (2 minutes)

1. **Open MySQL** (Command Line or MySQL Workbench)

2. **Run the schema file:**
```bash
mysql -u root -p < server/database_schema.sql
```

Or in MySQL Workbench:
- File → Open SQL Script → Select `server/database_schema.sql`
- Execute the script

3. **Update database credentials** in `server/.env`:
```env
PORT=5001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=personnelManagement
```

### Step 2: Start Backend (1 minute)

```bash
cd server
npm install    # First time only
npm run dev
```

 Server running at: `http://localhost:5001`

### Step 3: Start Frontend (1 minute)

Open a new terminal:

```bash
cd client
npm install    # First time only
npm run dev
```

 App running at: `http://localhost:5175`

### Step 4: Use the Application (1 minute)

1. **Open browser:** `http://localhost:5175`

2. **Add some skills:**
   - Click "Skills" in navigation
   - Add skills like: React, Node.js, Python, AWS, etc.

3. **Add personnel:**
   - Click "Personnel" → "Add Personnel"
   - Fill in the form and save

4. **Assign skills to personnel:**
   - Click "View" on any personnel
   - Assign skills with proficiency levels (1-5)

5. **Create a project:**
   - Click "Projects" → "Add Project"
   - Select required skills with minimum proficiency

6. **Match personnel to project:**
   - Click "Matching"
   - Select a project
   - Click "Find Matches"
   - See who qualifies! 

---

## Sample Data to Get Started

### Skills to Add:
1. React - Framework - JavaScript library for UI
2. Node.js - Runtime - JavaScript runtime environment
3. Python - Language - High-level programming language
4. MySQL - Database - Relational database system
5. AWS - Cloud - Amazon Web Services

### Sample Personnel:
1. **John Doe**
   - Email: john@example.com
   - Role: Frontend Developer
   - Experience: Mid-Level
   - Skills: React (4), Node.js (3)

2. **Jane Smith**
   - Email: jane@example.com
   - Role: Full Stack Developer
   - Experience: Senior
   - Skills: React (5), Node.js (5), Python (4)

3. **Bob Johnson**
   - Email: bob@example.com
   - Role: Backend Developer
   - Experience: Junior
   - Skills: Node.js (2), Python (3), MySQL (2)

### Sample Project:
- **Name:** E-commerce Website
- **Description:** Build a modern e-commerce platform
- **Start Date:** 2025-01-01
- **End Date:** 2025-06-30
- **Status:** Planning
- **Required Skills:**
  - React (Level 3+)
  - Node.js (Level 3+)

---

##  Quick Test Flow

1. Add the 5 skills listed above
2. Add the 3 personnel listed above
3. Assign skills to each person (use "View" button)
4. Create the sample project
5. Go to Matching page and select the project
6. See that Jane Smith matches 100%! 🎉

---

##  Troubleshooting

### Database Connection Error
- Check MySQL is running
- Verify credentials in `server/.env`
- Ensure database `personnelManagement` exists

### Port Already in Use
- Backend: Change PORT in `server/.env`
- Frontend: Change port in `client/vite.config.js`

### Module Not Found
```bash
cd server && npm install
cd client && npm install
```

---

##  Next Steps

- Read `README.md` for detailed documentation
- Check `API_TESTING_GUIDE.md` for API endpoints
- Review `PROJECT_SUMMARY.md` for feature list

---

**Enjoy building your team! **
