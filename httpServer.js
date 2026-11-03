import http from 'http';
import fs from 'fs';

// Maintain task records in an array
let tasks = [];

const server = http.createServer((req, res) => {
    // GET / : Welcome message in HTML format
    if (req.method === 'GET' && req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<h1>Welcome to Employee Task Management</h1>');
    } 
    // GET /about : Application information
    else if (req.method === 'GET' && req.url === '/about') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Employee task management application information');
    } 
    // GET /tasks : List of employee tasks in JSON format
    else if (req.method === 'GET' && req.url === '/tasks') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(tasks));
    } 
    // GET /home : Serve HTML page using FS module
    else if (req.method === 'GET' && req.url === '/home') {
        fs.readFile('./public/index.html', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error reading file');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    } 
    // POST /add-task : Accept task details and add to array
    else if (req.method === 'POST' && req.url === '/add-task') {
        let body = '';
        
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', () => {
            try {
                const taskData = JSON.parse(body);
                
                // Validate required fields
                if (!taskData.id || !taskData.taskName || !taskData.assignedTo || !taskData.status) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ error: 'Missing required fields: id, taskName, assignedTo, and status' }));
                }
                
                // Add new task record to array
                tasks.push(taskData);
                
                // Return success message
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Task added successfully', task: taskData }));
            } catch (error) {
                // Handle invalid JSON requests
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid JSON request format' }));
            }
        });
    } 
    // Error Handling: 404 for invalid routes
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }
});

// Configure the server to listen on port 3000
server.listen(3000, () => {
    console.log('HTTP Server running at http://localhost:3000');
});