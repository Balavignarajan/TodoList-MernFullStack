/**
 * API COMMUNICATION FILE
 * This file handles all communication between our React frontend and Node.js backend
 * It uses axios library to make HTTP requests (GET, POST, PUT, DELETE)
 */

// Import axios - a popular library for making HTTP requests
import axios from 'axios';

/**
 * Create an axios instance with default configuration
 * This is like creating a "template" for all our API calls
 */
const axiosInstance = axios.create({
  // Base URL: where our backend server is running
  // If VITE_API_URL environment variable exists, use it; otherwise use localhost:5000
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  
  // Default headers sent with every request
  headers: {
    'Content-Type': 'application/json', // Tell server we're sending JSON data
  },
});

/**
 * GET REQUEST - Fetch all todos from the server
 * @returns {Promise} Promise that resolves to server response with todos array
 */
export const apiGetTodos = () => {
  // Makes GET request to: http://localhost:5000/api/todos
  return axiosInstance.get('/api/todos');
};

/**
 * POST REQUEST - Create a new todo on the server
 * @param {string} title - The text content of the new todo
 * @returns {Promise} Promise that resolves to server response with created todo
 */
export const apiCreateTodo = (title) => {
  // Makes POST request to: http://localhost:5000/api/todos
  // Sends: { title: "user's todo text" }
  return axiosInstance.post('/api/todos', { title });
};

/**
 * PUT REQUEST - Update an existing todo on the server
 * @param {string} id - The unique ID of the todo to update
 * @param {Object} updates - Object containing fields to update (e.g., {completed: true})
 * @returns {Promise} Promise that resolves to server response with updated todo
 */
export const apiUpdateTodo = (id, updates) => {
  // Makes PUT request to: http://localhost:5000/api/todos/[todo-id]
  // Sends: updates object (like {completed: true} or {title: "new text"})
  return axiosInstance.put(`/api/todos/${id}`, updates);
};

/**
 * DELETE REQUEST - Remove a todo from the server
 * @param {string} id - The unique ID of the todo to delete
 * @returns {Promise} Promise that resolves to server response confirming deletion
 */
export const apiDeleteTodo = (id) => {
  // Makes DELETE request to: http://localhost:5000/api/todos/[todo-id]
  return axiosInstance.delete(`/api/todos/${id}`);
};

/**
 * HOW THESE FUNCTIONS WORK:
 * 
 * 1. Each function returns a Promise (async operation)
 * 2. In our React components, we use 'await' to wait for the server response
 * 3. If successful, we get back data from the server
 * 4. If there's an error (network issue, server error), the Promise rejects
 * 
 * EXAMPLE USAGE:
 * const response = await apiGetTodos();
 * console.log(response.data); // Array of todos from server
 */
