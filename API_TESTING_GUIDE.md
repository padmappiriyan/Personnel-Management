# API Testing Guide

This document provides examples for testing all API endpoints using tools like Postman, Thunder Client, or curl.

## Base URL
```
http://localhost:5001/api
```

## 1. Personnel Endpoints

### Create Personnel
**POST** `/personnel`

**Body (JSON):**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "role": "Frontend Developer",
  "experience_level": "Mid-Level"
}
```

**Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john.doe@example.com",
  "role": "Frontend Developer",
  "experience_level": "Mid-Level"
}
```

### Get All Personnel
**GET** `/personnel`

**Response:**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "Frontend Developer",
    "experience_level": "Mid-Level",
    "created_at": "2025-12-01T17:00:00.000Z"
  }
]
```

### Get Personnel by ID
**GET** `/personnel/:id`

Example: `/personnel/1`

### Update Personnel
**PUT** `/personnel/:id`

**Body (JSON):**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "role": "Senior Frontend Developer",
  "experience_level": "Senior"
}
```

### Delete Personnel
**DELETE** `/personnel/:id`

Example: `/personnel/1`

---

## 2. Skills Endpoints

### Create Skill
**POST** `/skills`

**Body (JSON):**
```json
{
  "name": "React",
  "category": "Framework",
  "description": "JavaScript library for building user interfaces"
}
```

### Get All Skills
**GET** `/skills`

**Response:**
```json
[
  {
    "id": 1,
    "name": "React",
    "category": "Framework",
    "description": "JavaScript library for building user interfaces"
  }
]
```

### Get Skill by ID
**GET** `/skills/:id`

### Update Skill
**PUT** `/skills/:id`

**Body (JSON):**
```json
{
  "name": "React.js",
  "category": "Frontend Framework",
  "description": "A JavaScript library for building user interfaces"
}
```

### Delete Skill
**DELETE** `/skills/:id`

---

## 3. Personnel Skills Endpoints

### Get Personnel Skills
**GET** `/personnel/:personnelId/skills`

Example: `/personnel/1/skills`

**Response:**
```json
[
  {
    "id": 1,
    "name": "React",
    "category": "Framework",
    "proficiency_level": 4
  }
]
```

### Assign Skill to Personnel
**POST** `/personnel/:personnelId/skills`

Example: `/personnel/1/skills`

**Body (JSON):**
```json
{
  "skill_id": 1,
  "proficiency_level": 4
}
```

### Update Skill Proficiency
**PUT** `/personnel/:personnelId/skills/:skillId`

Example: `/personnel/1/skills/1`

**Body (JSON):**
```json
{
  "proficiency_level": 5
}
```

### Remove Skill from Personnel
**DELETE** `/personnel/:personnelId/skills/:skillId`

Example: `/personnel/1/skills/1`

---

## 4. Projects Endpoints

### Create Project
**POST** `/projects`

**Body (JSON):**
```json
{
  "name": "E-commerce Website",
  "description": "Build a modern e-commerce platform",
  "start_date": "2025-01-01",
  "end_date": "2025-06-30",
  "status": "Planning",
  "skills": [
    {
      "skill_id": 1,
      "min_proficiency_level": 3
    },
    {
      "skill_id": 2,
      "min_proficiency_level": 4
    }
  ]
}
```

### Get All Projects
**GET** `/projects`

**Response:**
```json
[
  {
    "id": 1,
    "name": "E-commerce Website",
    "description": "Build a modern e-commerce platform",
    "start_date": "2025-01-01",
    "end_date": "2025-06-30",
    "status": "Planning",
    "created_at": "2025-12-01T17:00:00.000Z"
  }
]
```

### Get Project by ID
**GET** `/projects/:id`

**Response:**
```json
{
  "id": 1,
  "name": "E-commerce Website",
  "description": "Build a modern e-commerce platform",
  "start_date": "2025-01-01",
  "end_date": "2025-06-30",
  "status": "Planning",
  "created_at": "2025-12-01T17:00:00.000Z",
  "skills": [
    {
      "id": 1,
      "name": "React",
      "min_proficiency_level": 3
    },
    {
      "id": 2,
      "name": "Node.js",
      "min_proficiency_level": 4
    }
  ]
}
```

### Update Project
**PUT** `/projects/:id`

**Body (JSON):**
```json
{
  "name": "E-commerce Platform",
  "description": "Build a modern e-commerce platform with payment integration",
  "start_date": "2025-01-01",
  "end_date": "2025-07-31",
  "status": "Active",
  "skills": [
    {
      "skill_id": 1,
      "min_proficiency_level": 4
    },
    {
      "skill_id": 2,
      "min_proficiency_level": 4
    }
  ]
}
```

### Delete Project
**DELETE** `/projects/:id`

---

## 5. Matching Endpoint

### Match Personnel to Project
**GET** `/matching/project/:projectId`

Example: `/matching/project/1`

**Response:**
```json
{
  "matches": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@example.com",
      "role": "Frontend Developer",
      "experience_level": "Mid-Level",
      "match_percentage": 85,
      "matched_skills": [
        {
          "skill_name": "React",
          "required_level": 3,
          "actual_level": 4
        },
        {
          "skill_name": "Node.js",
          "required_level": 4,
          "actual_level": 4
        }
      ]
    }
  ],
  "required_skills": [
    {
      "skill_id": 1,
      "skill_name": "React",
      "min_proficiency_level": 3
    },
    {
      "skill_id": 2,
      "skill_name": "Node.js",
      "min_proficiency_level": 4
    }
  ]
}
```

---

## Testing Workflow

### 1. Setup Test Data

1. **Create Skills:**
   - POST `/skills` with React, Node.js, Python, AWS, etc.

2. **Create Personnel:**
   - POST `/personnel` with multiple people

3. **Assign Skills to Personnel:**
   - POST `/personnel/:id/skills` for each person

4. **Create Projects:**
   - POST `/projects` with required skills

5. **Test Matching:**
   - GET `/matching/project/:id` to see matches

### 2. Sample Test Sequence

```bash
# 1. Create a skill
curl -X POST http://localhost:5001/api/skills \
  -H "Content-Type: application/json" \
  -d '{"name":"React","category":"Framework","description":"UI library"}'

# 2. Create personnel
curl -X POST http://localhost:5001/api/personnel \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Smith","email":"jane@example.com","role":"Developer","experience_level":"Senior"}'

# 3. Assign skill to personnel
curl -X POST http://localhost:5001/api/personnel/1/skills \
  -H "Content-Type: application/json" \
  -d '{"skill_id":1,"proficiency_level":5}'

# 4. Create project
curl -X POST http://localhost:5001/api/projects \
  -H "Content-Type: application/json" \
  -d '{"name":"Web App","description":"Build web app","start_date":"2025-01-01","end_date":"2025-06-30","status":"Planning","skills":[{"skill_id":1,"min_proficiency_level":3}]}'

# 5. Match personnel to project
curl http://localhost:5001/api/matching/project/1
```

---

## Error Responses

### 404 Not Found
```json
{
  "message": "Personnel not found"
}
```

### 500 Server Error
```json
{
  "message": "Error message details"
}
```

---

## Notes

- All dates should be in `YYYY-MM-DD` format
- Proficiency levels are integers from 1 to 5
- Experience levels: "Junior", "Mid-Level", "Senior"
- Project status: "Planning", "Active", "Completed"
- Email must be unique for personnel
- Skill names must be unique
