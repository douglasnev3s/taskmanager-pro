# TaskManager Pro
Professional task management application built with React + Redux + Node.js + MongoDB

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed
- [MongoDB Compass](https://www.mongodb.com/products/compass) (recommended for database management)

## MongoDB Local Development Setup

### 1. Start MongoDB with Docker Compose

```bash
# Start MongoDB and Mongo Express containers
docker-compose up -d

# Check container status
docker-compose ps
```

### 2. Environment Configuration

Copy the example environment file and configure variables:

```bash
cp .env.example .env
```

Default MongoDB connection:
- **Host**: localhost
- **Port**: 27017
- **Database**: taskmanager
- **Connection String**: `mongodb://localhost:27017/taskmanager`

### 3. Install MongoDB Compass (Optional)

Download and install [MongoDB Compass](https://www.mongodb.com/try/download/compass) for a graphical interface to your database.

**Connection String for Compass**: `mongodb://localhost:27017`

### 4. Access Web Interface (Optional)

Mongo Express is available at: http://localhost:8081
- Username: admin
- Password: password

### 5. Verify MongoDB Connection

You can test the connection using MongoDB Compass or by connecting to the container:

```bash
# Connect to MongoDB container
docker exec -it taskmanager-mongodb mongosh

# Create database and test collection
use taskmanager
db.test.insertOne({name: "test", createdAt: new Date()})
db.test.find()
```

### Troubleshooting

**Container won't start:**
- Ensure Docker Desktop is running
- Check if port 27017 is already in use: `netstat -an | findstr 27017`
- Try: `docker-compose down` then `docker-compose up -d`

**Can't connect with Compass:**
- Verify containers are running: `docker-compose ps`
- Use connection string: `mongodb://localhost:27017`
- Check Windows Firewall settings

**Data persistence:**
- MongoDB data is stored in Docker volumes (`mongodb_data`, `mongodb_config`)
- Data persists between container restarts
- To reset data: `docker-compose down -v`

### Stopping MongoDB

```bash
# Stop containers
docker-compose down

# Stop and remove data volumes (caution: removes all data)
docker-compose down -v
```