const http = require('http');
const fs = require('fs');
const path = require('path');

let counter = 0;

const server = http.createServer((req, res) => {
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
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ counter }));
  } else if (req.url === '/increment' && req.method === 'POST') {
    counter++;
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ counter }));
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

const PORT = 8081;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});