# Docker Setup for WealthE Application

This directory contains Docker configuration for the WealthE application with both frontend and backend services.

## Prerequisites

- Docker Desktop 4.0+
- Docker Compose 2.0+
- At least 4GB RAM available for Docker

## Quick Start

### 1. Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Edit the .env file with your configuration
# Make sure to change default passwords and secrets!
```

### 2. Production Deployment
```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Check service status
docker-compose ps
```

### 3. Development Setup
```bash
# Start with development overrides
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

# For hot reload development
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up frontend backend
```

## Services

### Frontend (React)
- **Port**: 80 (production) / 3000 (development)
- **Health Check**: `http://localhost/health`
- **Technology**: React 19, Nginx (production)

### Backend (Spring Boot)
- **Port**: 8081
- **Health Check**: `http://localhost:8081/actuator/health`
- **Technology**: Spring Boot 3.5, Java 17

### Database (PostgreSQL)
- **Port**: 5432
- **Database**: wealthe_db
- **Health Check**: PostgreSQL ready check

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_NAME` | PostgreSQL database name | `wealthe_db` |
| `DB_USER` | PostgreSQL username | `wealthe_user` |
| `DB_PASSWORD` | PostgreSQL password | `wealthe_password` |
| `JWT_SECRET` | JWT signing secret | `your-256-bit-secret...` |
| `JWT_EXPIRATION` | JWT expiration time (ms) | `86400000` |
| `BACKEND_PORT` | Backend service port | `8081` |
| `FRONTEND_PORT` | Frontend service port | `80` |

### Security Notes

🚨 **Important**: Change default passwords and secrets in production!

- Update `DB_PASSWORD` to a strong password
- Generate a secure `JWT_SECRET` (256-bit key)
- Use Docker secrets for production (see `docker-compose.prod.yml`)

## Commands

### Basic Operations
```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f [service-name]

# Rebuild and restart
docker-compose up -d --build

# Scale services
docker-compose up -d --scale backend=2
```

### Database Operations
```bash
# Access database
docker-compose exec database psql -U wealthe_user -d wealthe_db

# Backup database
docker-compose exec database pg_dump -U wealthe_user wealthe_db > backup.sql

# Restore database
docker-compose exec -T database psql -U wealthe_user wealthe_db < backup.sql
```

### Development
```bash
# Development with hot reload
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# Debug backend (port 5005)
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up backend

# Frontend only with hot reload
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up frontend
```

### Production
```bash
# Production deployment with secrets
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Health checks
docker-compose exec frontend wget -qO- http://localhost/health
docker-compose exec backend wget -qO- http://localhost:8081/actuator/health
```

## Monitoring and Maintenance

### Health Checks
All services include health checks:
- Frontend: `GET /health`
- Backend: `GET /actuator/health`
- Database: PostgreSQL ready check

### Logs
```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f database

# Follow logs with timestamps
docker-compose logs -f -t
```

### Resource Monitoring
```bash
# View resource usage
docker stats

# View service status
docker-compose ps

# View volumes
docker volume ls

# View networks
docker network ls
```

## Troubleshooting

### Common Issues

1. **Port conflicts**
   ```bash
   # Check what's using the port
   netstat -tlnp | grep :8081
   
   # Change ports in .env file
   BACKEND_PORT=8082
   ```

2. **Database connection issues**
   ```bash
   # Check database logs
   docker-compose logs database
   
   # Verify database is healthy
   docker-compose ps database
   ```

3. **Frontend build issues**
   ```bash
   # Rebuild frontend
   docker-compose build --no-cache frontend
   
   # Check frontend logs
   docker-compose logs frontend
   ```

4. **CORS issues**
   ```bash
   # Update CORS origins in .env
   CORS_ORIGINS=http://localhost:3000,http://localhost:80,http://your-domain.com
   ```

### Reset Everything
```bash
# Stop and remove everything
docker-compose down -v --remove-orphans

# Remove images
docker-compose down --rmi all

# Rebuild from scratch
docker-compose up -d --build
```

## Security Best Practices

1. **Never use default passwords in production**
2. **Use Docker secrets for sensitive data**
3. **Regularly update base images**
4. **Scan images for vulnerabilities**
5. **Use non-root users in containers**
6. **Limit container resources**
7. **Enable logging and monitoring**

## Updates

### Updating Images
```bash
# Pull latest base images
docker-compose pull

# Rebuild with latest
docker-compose build --pull

# Restart with new images
docker-compose up -d
```

### Backup Strategy
```bash
# Create backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
docker-compose exec -T database pg_dump -U wealthe_user wealthe_db > "backup_${DATE}.sql"
docker cp wealthe-backend:/app/logs "logs_backup_${DATE}"
```

## Support

For issues and questions:
1. Check the logs: `docker-compose logs -f`
2. Verify health checks: `docker-compose ps`
3. Review environment variables in `.env`
4. Check resource usage: `docker stats`
