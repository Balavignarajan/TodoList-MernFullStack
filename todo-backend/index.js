/**
 * BACKEND SERVER - MAIN ENTRY POINT
 * This is the main server file that starts our Node.js backend application
 * It handles incoming requests from the frontend and connects to MongoDB database
 */

// Load environment variables from .env file (like database URL, port number)
require('dotenv').config();

// Import required packages (libraries)
const express = require('express');   // Web framework for creating API endpoints
const mongoose = require('mongoose'); // Library for connecting to MongoDB database
const cors = require('cors');         // Allows frontend (different port) to talk to backend

/**
 * CREATE EXPRESS APPLICATION
 * Think of this as creating a new web server that can handle requests
 */
const app = express();

/**
 * MIDDLEWARE SETUP
 * Middleware are functions that run BEFORE your route handlers
 * They process incoming requests and modify them if needed
 */

// Enable CORS - allows frontend (port 3000) to make requests to backend (port 5000)
// Without this, browsers block requests between different ports for security
app.use(cors());

// Parse JSON data from incoming requests
// When frontend sends JSON data, this converts it to JavaScript objects
app.use(express.json());

/**
 * ROUTES (API ENDPOINTS)
 * These define what happens when someone visits different URLs
 */

// Health check route - just to test if server is running
// When someone visits http://localhost:5000/ they get this message
app.get('/', (req, res) => res.send('Todo API is running! 🚀'));

// Import and use todo routes for all /api/todos requests
// This means all requests to /api/todos/* will be handled by the todo router
const todosRouter = require('./routes/todo');
app.use('/api/todos', todosRouter);

/**
 * SERVER CONFIGURATION
 */

// Get port number from environment variable, or use 5000 as default
const PORT = process.env.PORT || 5000;

/**
 * DATABASE CONNECTION AND SERVER STARTUP
 * Connect to MongoDB first, then start the server
 */
mongoose.connect(process.env.MONGO_URI, { 
  useNewUrlParser: true,    // Use new URL parser (recommended)
  useUnifiedTopology: true  // Use new connection management engine (recommended)
})
.then(() => {
  // If database connection successful, start the web server
  console.log('✅ Connected to MongoDB database');
  
  // Start listening for incoming requests on the specified port
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 API available at: http://localhost:${PORT}`);
  });
})
.catch(err => {
  // If database connection fails, show error and don't start server
  console.error('❌ MongoDB connection error:', err.message);
  console.log('💡 Make sure your MongoDB connection string is correct in .env file');
});