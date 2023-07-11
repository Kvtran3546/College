const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  // Set the content type based on the file extension
  const filePath = path.join(__dirname, req.url);
  const contentType = getContentType(filePath);

  // Read the file
  fs.readFile(filePath, (err, content) => {
    if (err) {
      // If the file doesn't exist, return a 404 error
      if (err.code === 'ENOENT') {
        res.writeHead(404);
        res.end('File not found');
      } else {
        // For other types of errors, return a 500 error
        res.writeHead(500);
        res.end('Server error');
      }
    } else {
      // If the file exists, set the appropriate content type and serve it
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

const port = 3000;
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

// Helper function to determine the content type based on file extension
function getContentType(filePath) {
  const extname = path.extname(filePath);
  switch (extname) {
    case '.html':
      return 'text/html';
    case '.css':
      return 'text/css';
    case '.js':
      return 'text/javascript';
    case '.json':
      return 'application/json';
    default:
      return 'text/plain';
  }
}
