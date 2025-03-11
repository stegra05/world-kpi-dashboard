const express = require('express');
const next = require('next');
const path = require('path');
const fs = require('fs');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Serve static files from the public directory
  server.use(express.static(path.join(__dirname, 'public')));

  // Serve the world_kpi_anonym.txt file with proper headers
  server.get('/world_kpi_anonym.txt', (req, res) => {
    const filePath = path.join(__dirname, 'public', 'world_kpi_anonym.txt');
    if (fs.existsSync(filePath)) {
      res.setHeader('Content-Type', 'text/plain');
      res.sendFile(filePath);
    } else {
      res.status(404).send('File not found');
    }
  });

  // Let Next.js handle everything else
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
}); 