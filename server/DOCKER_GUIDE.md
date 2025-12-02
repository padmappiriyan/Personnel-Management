# Docker Deployment Guide

This guide explains how to containerize and deploy the Personnel Management System backend using Docker.

## Prerequisites

- Docker installed (version 20.10+)
- Docker Compose installed (version 2.0+)

## Quick Start with Docker Compose

### 1. Navigate to Server Directory

```bash
cd server
```

### 2. Create Environment File

Copy the example environment file:

```bash
cp .env.docker.example .env
```

Edit `.env` and update the values if needed:

```env
DB_HOST=db
DB_USER=root
DB_PASSWORD=your_secure_password
DB_NAME=personnelManagement
PORT=5001
NODE_ENV=production
```

### 3. Start All Services

```bash
docker-compose up -d
```

This will:
- Pull the MySQL 8.0 image
- Build the backend Node.js image
- Create a network for the services
- Initialize the database with the schema
- Start both containers

### 4. Check Status

```bash
docker-compose ps
```

You should see:
- `personnel_db` - MySQL database (port 3306)
- `personnel_backend` - Node.js API (port 5001)

### 5. View Logs

```bash
# All services
docker-compose logs -f

# Backend only
docker-compose logs -f backend

# Database only
docker-compose logs -f db
```

### 6. Test the API

```bash
curl http://localhost:5001
# Should return: "API is running..."
```

## Docker Commands Reference

### Build and Run

```bash
# Build and start in detached mode
docker-compose up -d

# Build and start with logs
docker-compose up

# Rebuild images
docker-compose up -d --build

# Start specific service
docker-compose up -d backend
```

### Stop and Remove

```bash
# Stop all services
docker-compose stop

# Stop and remove containers
docker-compose down

# Stop and remove containers + volumes (deletes database data!)
docker-compose down -v
```

### Manage Containers

```bash
# List running containers
docker-compose ps

# View logs
docker-compose logs -f

# Execute command in container
docker-compose exec backend sh
docker-compose exec db mysql -u root -p

# Restart services
docker-compose restart

# Restart specific service
docker-compose restart backend
```

## Using Dockerfile Only (Without Compose)

### 1. Build the Image

```bash
cd server
docker build -t personnel-backend:latest .
```

### 2. Run MySQL Container

```bash
docker run -d \
  --name personnel_db \
  -e MYSQL_ROOT_PASSWORD=rootpassword \
  -e MYSQL_DATABASE=personnelManagement \
  -p 3306:3306 \
  -v mysql_data:/var/lib/mysql \
  mysql:8.0
```

### 3. Initialize Database

```bash
# Wait for MySQL to be ready
sleep 30

# Import schema
docker exec -i personnel_db mysql -uroot -prootpassword personnelManagement < database_schema.sql
```

### 4. Run Backend Container

```bash
docker run -d \
  --name personnel_backend \
  --link personnel_db:db \
  -e PORT=5001 \
  -e DB_HOST=db \
  -e DB_USER=root \
  -e DB_PASSWORD=rootpassword \
  -e DB_NAME=personnelManagement \
  -p 5001:5001 \
  personnel-backend:latest
```

## Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Backend server port | 5001 | No |
| `DB_HOST` | MySQL host | db | Yes |
| `DB_USER` | MySQL user | root | Yes |
| `DB_PASSWORD` | MySQL password | - | Yes |
| `DB_NAME` | Database name | personnelManagement | Yes |
| `NODE_ENV` | Node environment | production | No |

## Volume Management

### Backup Database

```bash
# Create backup
docker-compose exec db mysqldump -u root -p personnelManagement > backup.sql

# Or with password in command (less secure)
docker-compose exec db mysqldump -u root -prootpassword personnelManagement > backup.sql
```

### Restore Database

```bash
# Restore from backup
docker-compose exec -T db mysql -u root -prootpassword personnelManagement < backup.sql
```

### List Volumes

```bash
docker volume ls
```

### Remove Volumes

```bash
# Remove all volumes (WARNING: deletes data!)
docker-compose down -v
```

## Networking

The Docker Compose setup creates a bridge network called `personnel_network`. Services communicate using their service names:

- Backend connects to database using hostname: `db`
- Frontend (when containerized) would connect to backend using: `backend`

## Health Checks

The MySQL service includes a health check:

```yaml
healthcheck:
  test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
  timeout: 20s
  retries: 10
```

The backend waits for the database to be healthy before starting.

## Production Deployment

### Security Best Practices

1. **Use Strong Passwords**
   ```bash
   # Generate secure password
   openssl rand -base64 32
   ```

2. **Don't Expose Database Port**
   Remove the `ports` section from the `db` service in production.

3. **Use Docker Secrets** (for Docker Swarm)
   ```bash
   echo "my_secure_password" | docker secret create db_password -
   ```

4. **Run as Non-Root User**
   Add to Dockerfile:
   ```dockerfile
   USER node
   ```

### Optimization

1. **Multi-stage Build** (for smaller images)
   ```dockerfile
   # Build stage
   FROM node:20-alpine AS builder
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   COPY . .

   # Production stage
   FROM node:20-alpine
   WORKDIR /app
   COPY --from=builder /app .
   CMD ["node", "index.js"]
   ```

2. **Use .dockerignore**
   Already included to reduce image size.

## Troubleshooting

### Container Won't Start

```bash
# Check logs
docker-compose logs backend

# Check if port is already in use
netstat -ano | findstr :5001  # Windows
lsof -i :5001                 # Linux/Mac
```

### Database Connection Error

```bash
# Check if database is ready
docker-compose exec db mysqladmin ping -h localhost

# Check database exists
docker-compose exec db mysql -u root -p -e "SHOW DATABASES;"

# Verify environment variables
docker-compose exec backend env | grep DB_
```

### Permission Issues

```bash
# Fix volume permissions (Linux)
sudo chown -R 999:999 /var/lib/docker/volumes/server_mysql_data
```

### Reset Everything

```bash
# Stop and remove everything
docker-compose down -v

# Remove images
docker rmi personnel-backend:latest

# Start fresh
docker-compose up -d --build
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Build and Push Docker Image

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Build Docker image
        run: |
          cd server
          docker build -t personnel-backend:${{ github.sha }} .
      
      - name: Push to registry
        run: |
          echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
          docker push personnel-backend:${{ github.sha }}
```

## Monitoring

### View Resource Usage

```bash
# Real-time stats
docker stats

# Specific container
docker stats personnel_backend
```

### Inspect Container

```bash
# View container details
docker inspect personnel_backend

# View network details
docker network inspect server_personnel_network
```

## Scaling (with Docker Swarm)

```bash
# Initialize swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.yml personnel

# Scale backend
docker service scale personnel_backend=3
```

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [MySQL Docker Image](https://hub.docker.com/_/mysql)
- [Node.js Docker Best Practices](https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md)

---

**Note:** For production deployments, consider using orchestration platforms like Kubernetes, Docker Swarm, or managed services like AWS ECS, Google Cloud Run, or Azure Container Instances.
