# Counter App with PostgreSQL

A simple counter application with a web interface that stores data in PostgreSQL.

## Prerequisites

1. **Install PostgreSQL:**
   ```bash
   brew install postgresql
   brew services start postgresql
   ```

2. **Create the database:**
   ```bash
   createdb counter_app
   psql -d counter_app -f setup-db.sql
   ```

## Running the Application

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the server:**
   ```bash
   npm start
   ```

3. **Open your browser:**
   Navigate to `http://localhost:8081`

## Database Configuration

The application expects PostgreSQL to be running on:
- Host: localhost
- Port: 5432
- Database: counter_app
- User: postgres
- Password: postgres

You can modify these settings in `server.js` if needed.

## Files

- `server.js` - Backend server with PostgreSQL integration
- `index.html` - Frontend web interface
- `setup-db.sql` - Database initialization script
- `package.json` - Node.js dependencies