/**
 * TODO DATA MODEL
 * This file defines the structure of a todo item in our MongoDB database
 * It's like creating a "blueprint" or "template" for how todos should look
 */

// Import mongoose to create database schemas and models
const mongoose = require('mongoose');

/**
 * DEFINE TODO SCHEMA
 * A schema defines the structure and rules for documents in MongoDB
 * Think of it as defining the "columns" in a traditional database table
 */
const TodoSchema = new mongoose.Schema({
  // Title field: the actual todo text (e.g., "Buy groceries")
  title: { 
    type: String,      // Must be text
    required: true     // Cannot be empty - every todo must have a title
  },
  
  // Completed field: whether the todo is done or not
  completed: { 
    type: Boolean,     // Must be true or false
    default: false     // New todos start as "not completed"
  },
}, { 
  // Schema options
  timestamps: true     // Automatically add 'createdAt' and 'updatedAt' fields
});

/**
 * WHAT TIMESTAMPS DOES:
 * When timestamps: true is set, MongoDB automatically adds:
 * - createdAt: when the todo was first created
 * - updatedAt: when the todo was last modified
 * 
 * So our final todo document looks like:
 * {
 *   _id: "unique-id-here",
 *   title: "Buy groceries",
 *   completed: false,
 *   createdAt: "2024-01-15T10:30:00.000Z",
 *   updatedAt: "2024-01-15T10:30:00.000Z"
 * }
 */

/**
 * CREATE AND EXPORT MODEL
 * A model is like a "factory" that creates documents based on the schema
 * We can use this model to create, read, update, and delete todos
 */
module.exports = mongoose.model('Todo', TodoSchema);

/**
 * HOW THIS MODEL IS USED:
 * 
 * In other files, we import this model and use it like:
 * 
 * const Todo = require('./models/todo');
 * 
 * // Create a new todo
 * const newTodo = new Todo({ title: "Learn Node.js" });
 * await newTodo.save();
 * 
 * // Find all todos
 * const allTodos = await Todo.find();
 * 
 * // Update a todo
 * await Todo.findByIdAndUpdate(id, { completed: true });
 * 
 * // Delete a todo
 * await Todo.findByIdAndDelete(id);
 */