/**
 * TODO ROUTES (API ENDPOINTS)
 * This file defines all the API endpoints for todo operations
 * It handles HTTP requests from the frontend and performs database operations
 * 
 * CRUD Operations:
 * - CREATE: POST /api/todos (add new todo)
 * - READ:   GET /api/todos (get all todos)
 * - UPDATE: PUT /api/todos/:id (modify existing todo)
 * - DELETE: DELETE /api/todos/:id (remove todo)
 */

// Import required modules
const express = require("express");     // Web framework
const router = express.Router();        // Create router to define routes
const Todo = require("../models/todo"); // Import our Todo model for database operations

/**
 * GET /api/todos - FETCH ALL TODOS
 * This endpoint returns all todos from the database
 * Frontend calls this when the app loads to display existing todos
 */
router.get("/", async (req, res) => {
  try {
    // Find all todos in database and sort by creation date (newest first)
    // .sort({ createdAt: -1 }) means sort by createdAt field in descending order
    const todos = await Todo.find().sort({ createdAt: -1 });
    
    // Send todos back to frontend as JSON
    res.json(todos);
  } catch (err) {
    // If something goes wrong (database error, etc.), send error response
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/todos - CREATE NEW TODO
 * This endpoint creates a new todo in the database
 * Frontend sends todo title in request body: { title: "Buy groceries" }
 */
router.post("/", async (req, res) => {
  try {
    // Extract title from request body (data sent by frontend)
    const { title } = req.body;
    
    // Validation: make sure title exists and isn't empty
    if (!title) {
      return res.status(400).json({ error: "Title required" });
    }
    
    // Create new todo using our Todo model
    const todo = new Todo({ title });
    
    // Save to database (this is when it actually gets stored)
    await todo.save();
    
    // Send the created todo back to frontend with 201 status (Created)
    res.status(201).json(todo);
  } catch (err) {
    // Handle any errors (validation errors, database errors, etc.)
    res.status(500).json({ error: err.message });
  }
});

/**
 * PUT /api/todos/:id - UPDATE EXISTING TODO
 * This endpoint updates a specific todo by its ID
 * Frontend sends updates in request body: { completed: true } or { title: "New title" }
 * The :id in the URL is a parameter (e.g., /api/todos/507f1f77bcf86cd799439011)
 */
router.put("/:id", async (req, res) => {
  try {
    // Extract todo ID from URL parameters
    const { id } = req.params;
    
    // Extract update data from request body
    const updates = req.body; // Could be { completed: true } or { title: 'new title' }
    
    // Find todo by ID and update it with new data
    // { new: true } option returns the updated todo (not the old one)
    const todo = await Todo.findByIdAndUpdate(id, updates, { new: true });
    
    // Send updated todo back to frontend
    res.json(todo);
  } catch (err) {
    // Handle errors (invalid ID, todo not found, database errors, etc.)
    res.status(500).json({ error: err.message });
  }
});

/**
 * DELETE /api/todos/:id - DELETE TODO
 * This endpoint permanently removes a todo from the database
 * The :id in the URL specifies which todo to delete
 */
router.delete("/:id", async (req, res) => {
  try {
    // Extract todo ID from URL parameters
    const { id } = req.params;
    
    // Find and delete the todo by ID
    await Todo.findByIdAndDelete(id);
    
    // Send confirmation message back to frontend
    res.json({ message: "Todo deleted successfully" });
  } catch (err) {
    // Handle errors (invalid ID, todo not found, database errors, etc.)
    res.status(500).json({ error: err.message });
  }
});

/**
 * EXPORT ROUTER
 * This makes all our routes available to be used in the main server file
 */
module.exports = router;

/**
 * HOW THESE ROUTES WORK WITH FRONTEND:
 * 
 * 1. Frontend makes HTTP request to one of these endpoints
 * 2. Express router matches the URL and HTTP method to the correct function
 * 3. Function processes the request (validates data, talks to database)
 * 4. Function sends response back to frontend (success data or error message)
 * 5. Frontend receives response and updates the UI accordingly
 * 
 * EXAMPLE REQUEST FLOW:
 * Frontend: "POST /api/todos with { title: 'Learn React' }"
 * Backend: "Create new todo in database"
 * Backend: "Send created todo back: { _id: '...', title: 'Learn React', completed: false }"
 * Frontend: "Add new todo to the list on screen"
 */
