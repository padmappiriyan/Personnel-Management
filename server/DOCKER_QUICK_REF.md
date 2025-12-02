# Docker Quick Reference

## Essential Commands

### Start/Stop
```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose stop

# Stop and remove containers
docker-compose down

# Stop and remove everything (including volumes - DELETES DATA!)
docker-compose down -v
```

### Logs
```bash
# View all logs
docker-compose logs -f

# View backend logs only
docker-compose logs -f backend

# View database logs only
docker-compose logs -f db

# Last 100 lines
docker-compose logs --tail=100
```

### Status
```bash
# Check running containers
docker-compose ps

# View resource usage
docker stats

# Inspect container
docker inspect personnel_backend
```

### Rebuild
```bash
# Rebuild and restart
docker-compose up -d --build

# Force rebuild (no cache)
docker-compose build --no-cache
docker-compose up -d
```

### Execute Commands
```bash
# Shell into backend container
docker-compose exec backend sh

# Shell into database container
docker-compose exec db bash

# Run MySQL commands
docker-compose exec db mysql -u root -p personnelManagement

# Check environment variables
docker-compose exec backend env
```

### Database Operations
```bash
# Backup database
docker-compose exec db mysqldump -u root -prootpassword personnelManagement > backup.sql

# Restore database
docker-compose exec -T db mysql -u root -prootpassword personnelManagement < backup.sql

# Access MySQL shell
docker-compose exec db mysql -u root -p

# Check database status
docker-compose exec db mysqladmin ping -h localhost
```

### Cleanup
```bash
# Remove stopped containers
docker container prune

# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune

# Remove everything (CAREFUL!)
docker system prune -a --volumes
```

### Troubleshooting
```bash
# Check if port is in use (Windows)
netstat -ano | findstr :5001

# Check if port is in use (Linux/Mac)
lsof -i :5001

# Restart specific service
docker-compose restart backend

# View container details
docker inspect personnel_backend

# Check network
docker network inspect server_personnel_network
```

## First Time Setup

```bash
# 1. Navigate to server directory
cd server

# 2. Copy environment file
cp .env.docker.example .env

# 3. Edit .env (update password!)
notepad .env  # Windows
nano .env     # Linux/Mac

# 4. Start services
docker-compose up -d

# 5. Check logs
docker-compose logs -f

# 6. Test API
curl http://localhost:5001
```

## Daily Development

```bash
# Start work
docker-compose up -d

# View logs while working
docker-compose logs -f backend

# Make code changes (auto-reload with nodemon in dev mode)

# Restart if needed
docker-compose restart backend

# End work
docker-compose stop
```

## Production Deployment

```bash
# 1. Update environment
nano .env

# 2. Pull latest code
git pull

# 3. Rebuild and deploy
docker-compose down
docker-compose up -d --build

# 4. Verify
docker-compose ps
docker-compose logs -f

# 5. Test
curl http://your-server:5001
```

## Emergency Commands

```bash
# Container won't start - check logs
docker-compose logs backend

# Database connection error - restart db
docker-compose restart db

# Out of memory - check usage
docker stats

# Port conflict - stop everything
docker-compose down
netstat -ano | findstr :5001  # Find conflicting process

# Complete reset (DELETES ALL DATA!)
docker-compose down -v
docker system prune -a
docker-compose up -d --build
```

## Useful Aliases (Optional)

Add to your `.bashrc` or `.zshrc`:

```bash
alias dcu='docker-compose up -d'
alias dcd='docker-compose down'
alias dcl='docker-compose logs -f'
alias dcp='docker-compose ps'
alias dcr='docker-compose restart'
alias dcb='docker-compose up -d --build'
```

## Environment Variables Quick Reference

```env
# Database
DB_HOST=db                    # Use 'db' for Docker, 'localhost' for local
DB_USER=root
DB_PASSWORD=your_password     # CHANGE THIS!
DB_NAME=personnelManagement

# Backend
PORT=5001
NODE_ENV=production
```

## Common Issues

### Issue: Port already in use
```bash
# Windows
netstat -ano | findstr :5001
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :5001
kill -9 <PID>
```

### Issue: Database won't start
```bash
# Check logs
docker-compose logs db

# Remove and recreate
docker-compose down -v
docker-compose up -d
```

### Issue: Can't connect to database
```bash
# Check if db is healthy
docker-compose exec db mysqladmin ping

# Verify environment variables
docker-compose exec backend env | grep DB_

# Check network
docker network inspect server_personnel_network
```

### Issue: Changes not reflecting
```bash
# Rebuild without cache
docker-compose build --no-cache backend
docker-compose up -d
```

## Quick Health Check

```bash
# All in one
docker-compose ps && \
docker-compose exec db mysqladmin ping && \
curl http://localhost:5001 && \
echo "All systems operational!"
```

---

**Tip**: Keep this file handy for quick reference during development and deployment!
