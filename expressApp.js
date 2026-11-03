import express from 'express';

// Configure Express.js
const app = express();

// Configure JSON parsing middleware
app.use(express.json());

// Initialize an array containing at least three sample employee task records
let tasks = [
    {
        id: 1,
        taskName: "Develop Login Page",
        assignedTo: "Rahul Sharma",
        status: "Pending",
        priority: "High"
    },
    {
        id: 2,
        taskName: "Design Database Schema",
        assignedTo: "Priya Singh",
        status: "Completed",
        priority: "High"
    },
    {
        id: 3,
        taskName: "Fix UI Bugs",
        assignedTo: "Amit Patel",
        status: "In Progress",
        priority: "Medium"
    }
];

// GET /tasks: Retrieve all employee tasks
app.get('/tasks', (req, res) => {
    res.json(tasks);
});

// GET /tasks/:id : Retrieve a task by ID
app.get('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const task = tasks.find(t => t.id === taskId);
    
    if (!task) {
        return res.status(404).json({ error: "Task not found" });
    }
    res.json(task);
});

// POST /tasks : Add a new task
app.post('/tasks', (req, res) => {
    const newTask = req.body;
    
    // Basic validation
    if (!newTask.id || !newTask.taskName || !newTask.assignedTo || !newTask.status) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    
    tasks.push(newTask);
    
    // Return HTTP status code 201 when a task is successfully created
    res.status(201).json({
        message: "Task added successfully",
        task: newTask
    });
});

// PUT /tasks/:id : Update task details
app.put('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex === -1) {
        return res.status(404).json({ error: "Task not found" });
    }
    
    // Update the existing task details
    tasks[taskIndex] = { ...tasks[taskIndex], ...req.body };
    
    res.json({
        message: "Task updated successfully",
        task: tasks[taskIndex]
    });
});

// DELETE /tasks/:id : Delete a task
app.delete('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex === -1) {
        return res.status(404).json({ error: "Task not found" });
    }
    
    // Delete the task from the array
    tasks.splice(taskIndex, 1);
    
    res.json({ message: "Task deleted successfully" });
});

// Handle invalid requests globally
app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

// Configure the application to listen on port 4000
app.listen(4000, () => {
    console.log('Express Server running at http://localhost:4000');
});