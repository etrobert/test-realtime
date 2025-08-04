# Real-Time Counter App

A real-time counter application with PostgreSQL persistence and Server-Sent Events (SSE) for live updates across multiple users.

## Features

- **Real-time synchronization**: When one user increments the counter, all connected users see the update instantly
- **PostgreSQL persistence**: Counter value is stored in a database and persists between server restarts
- **Server-Sent Events (SSE)**: Lightweight, HTTP-based real-time communication
- **Multi-user support**: Multiple users can interact with the same counter simultaneously
- **Simple web interface**: Clean, responsive frontend with increment button

## How It Works

1. **Frontend**: Users click the increment button which sends a POST request to `/increment`
2. **Backend**: Server updates the counter in PostgreSQL and broadcasts the new value via SSE
3. **Real-time updates**: All connected clients receive the update through their SSE connection (`/events`)
4. **Live synchronization**: Counter updates appear instantly on all open browser tabs/windows

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

## Testing Real-Time Features

To test the real-time functionality:

1. Open multiple browser tabs/windows to `http://localhost:8081`
2. Click the increment button in any tab
3. Watch the counter update instantly in all other tabs
4. Try opening the app on different devices on the same network

## Architecture

### Backend (`server.js`)
- HTTP server serving static files and API endpoints
- PostgreSQL integration for data persistence
- SSE endpoint (`/events`) for real-time communication
- Broadcasts counter updates to all connected clients

### Frontend (`index.html`)
- EventSource connection to `/events` for real-time updates
- Button click sends POST to `/increment` endpoint
- Automatic counter updates via SSE messages

### Database (`setup-db.sql`)
- Simple counter table with single row
- Atomic increment operations for consistency

## Database Configuration

The application expects PostgreSQL to be running on:
- Host: localhost
- Port: 5432
- Database: counter_app
- User: etienne (or your system username)

You can modify these settings in `server.js` if needed.

## Files

- `server.js` - Backend server with PostgreSQL and SSE integration
- `index.html` - Frontend web interface with EventSource connection
- `setup-db.sql` - Database initialization script
- `package.json` - Node.js dependencies
- `.gitignore` - Git ignore file for Node.js projects