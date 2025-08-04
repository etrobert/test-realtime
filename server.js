const http = require('http');
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

// Track SSE clients
let sseClients = [];

const client = new Client({
  user: 'etienne',
  host: 'localhost',
  database: 'counter_app',
  port: 5432,
});

async function initializeDatabase() {
  try {
    await client.connect();
    await client.query(`
      CREATE TABLE IF NOT EXISTS counter (
        id SERIAL PRIMARY KEY,
        value INTEGER NOT NULL DEFAULT 0
      )
    `);
    
    const result = await client.query('SELECT COUNT(*) FROM counter');
    if (parseInt(result.rows[0].count) === 0) {
      await client.query('INSERT INTO counter (value) VALUES (0)');
    }
    
    console.log('Database initialized successfully');
  } catch (err) {
    console.error('Database initialization error:', err);
  }
}

async function getCounter() {
  try {
    const result = await client.query('SELECT value FROM counter WHERE id = 1');
    return result.rows[0]?.value || 0;
  } catch (err) {
    console.error('Error getting counter:', err);
    return 0;
  }
}

async function incrementCounter() {
  try {
    const result = await client.query('UPDATE counter SET value = value + 1 WHERE id = 1 RETURNING value');
    return result.rows[0].value;
  } catch (err) {
    console.error('Error incrementing counter:', err);
    return 0;
  }
}

function broadcastCounterUpdate(counter) {
  const data = `data: ${JSON.stringify({ counter })}\n\n`;
  sseClients.forEach((client, index) => {
    try {
      client.write(data);
    } catch (err) {
      console.log('Removing disconnected SSE client');
      sseClients.splice(index, 1);
    }
  });
}

const server = http.createServer(async (req, res) => {
  if (req.url === '/' && req.method === 'GET') {
    fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('File not found');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  } else if (req.url === '/counter' && req.method === 'GET') {
    const counter = await getCounter();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ counter }));
  } else if (req.url === '/increment' && req.method === 'POST') {
    const counter = await incrementCounter();
    broadcastCounterUpdate(counter);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ counter }));
  } else if (req.url === '/events' && req.method === 'GET') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control'
    });
    
    sseClients.push(res);
    
    const counter = await getCounter();
    res.write(`data: ${JSON.stringify({ counter })}\n\n`);
    
    req.on('close', () => {
      sseClients = sseClients.filter(client => client !== res);
      console.log('SSE client disconnected');
    });
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

const PORT = 8081;

initializeDatabase().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});