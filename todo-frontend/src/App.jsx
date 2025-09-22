// Import React and its hooks for managing component state and lifecycle
import React, { useState, useEffect } from "react";
// Import our custom API functions that communicate with the backend server
import {
  apiGetTodos,    // Function to fetch all todos from server
  apiCreateTodo,  // Function to create a new todo on server
  apiUpdateTodo,  // Function to update an existing todo on server
  apiDeleteTodo,  // Function to delete a todo from server
} from "./api";
// Import our custom CSS styles for the todo app
import "./App.css";

/**
 * Main Todo App Component
 * This is the main component that renders the entire todo application
 * It manages all the state and handles user interactions
 */
export default function App() {
  // STATE VARIABLES (these store data that can change over time)
  
  // Array to store all todo items fetched from the database
  const [todos, setTodos] = useState([]);

  // String to store what the user types in the "add new todo" input field
  const [title, setTitle] = useState("");

  // Boolean to show/hide loading message while we fetch data from server
  const [loading, setLoading] = useState(true);

  // Stores the ID of the todo that user is currently editing (null = no editing)
  const [editingId, setEditingId] = useState(null);

  // Stores the new text when user is editing a todo
  const [editedTitle, setEditedTitle] = useState("");

  // COMPONENT LIFECYCLE
  // useEffect runs when component first loads (mounts) - like a "start up" function
  // The empty array [] means "only run this once when component starts"
  useEffect(() => {
    fetchTodos(); // Get all todos from database when app starts
  }, []);

  // FUNCTIONS (these handle user actions and server communication)
  
  /**
   * Fetches all todos from the backend server
   * This is an async function because it waits for server response
   */
  const fetchTodos = async () => {
    try {
      // Call our API function to get todos from server
      const response = await apiGetTodos();
      // Update our local state with the todos from server
      setTodos(response.data);
    } catch (error) {
      // If something goes wrong, log the error to console
      console.error("Failed to load todos:", error);
    } finally {
      // Whether success or error, stop showing "Loading..." message
      setLoading(false);
    }
  }

  /**
   * Handles adding a new todo when user submits the form
   * @param {Event} e - The form submit event
   */
  async function handleAddTodo(e) {
    // Prevent the form from reloading the page (default browser behavior)
    e.preventDefault();
    
    // Check if input is empty or just spaces - if so, do nothing
    if (!title.trim()) return;

    try {
      // Send the new todo to our backend server
      const response = await apiCreateTodo(title.trim());
      
      // Add the new todo to the TOP of our list using spread operator
      // [response.data, ...todos] means "new todo first, then all existing todos"
      setTodos([response.data, ...todos]);
      
      // Clear the input field so user can type a new todo
      setTitle("");
    } catch (error) {
      // If server request fails, show error in console
      console.error("Failed to add todo:", error);
    }
  }

  /**
   * Toggles a todo between completed and not completed
   * @param {Object} todo - The todo object to toggle
   */
  async function handleToggle(todo) {
    try {
      // Send update to server - flip the completed status
      // If todo.completed is true, make it false (and vice versa)
      const response = await apiUpdateTodo(todo._id, {
        completed: !todo.completed,
      });
      
      // Update our local todo list with the updated todo from server
      // map() goes through each todo and replaces the one that matches the ID
      setTodos((prev) =>
        prev.map((t) => (t._id === response.data._id ? response.data : t))
      );
    } catch (error) {
      console.error("Failed to update todo:", error);
    }
  }

  /**
   * Deletes a todo permanently
   * @param {string} id - The unique ID of the todo to delete
   */
  async function handleDelete(id) {
    try {
      // Tell the server to delete this todo
      await apiDeleteTodo(id);
      
      // Remove the todo from our local list
      // filter() keeps all todos EXCEPT the one with matching ID
      setTodos((prev) => prev.filter((t) => t._id !== id));
    } catch (error) {
      console.error("Failed to delete todo:", error);
    }
  }

  /**
   * Puts a todo into "edit mode" - shows input field instead of text
   * @param {Object} todo - The todo object to start editing
   */
  function startEditing(todo) {
    // Remember which todo we're editing by storing its ID
    setEditingId(todo._id);
    // Pre-fill the edit input with the current todo text
    setEditedTitle(todo.title);
  }

  /**
   * Cancels editing and goes back to normal view
   */
  function cancelEditing() {
    // Clear the editing state - no todo is being edited
    setEditingId(null);
    // Clear the edit input field
    setEditedTitle("");
  }

  /**
   * Saves the edited todo text to the server
   * @param {string} id - The ID of the todo being edited
   */
  async function saveEditedTodo(id) {
    // Don't save if the input is empty or just spaces
    if (!editedTitle.trim()) return;

    try {
      // Send the updated title to the server
      const response = await apiUpdateTodo(id, {
        title: editedTitle.trim(),
      });
      
      // Update our local todo list with the new title
      setTodos((prev) =>
        prev.map((t) => (t._id === id ? response.data : t))
      );
      
      // Exit edit mode and clear edit input
      cancelEditing();
    } catch (error) {
      console.error("Failed to edit todo:", error);
    }
  }

  // RENDER (what the user sees on screen)
  return (
    <div className="todo-container">
      {/* App title with emoji */}
      <h1 className="app-title">📝 Bala's Todo App</h1>

      {/* Form to add new todo - onSubmit runs when user presses Enter or clicks Add */}
      <form onSubmit={handleAddTodo} className="add-todo-form">
        <input
          className="todo-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)} // Update state when user types
          placeholder="What needs to be done?"
        />
        <button type="submit" className="add-btn">Add Todo</button>
      </form>

      {/* CONDITIONAL RENDERING - show different content based on app state */}
      {loading ? (
        // Show this while we're fetching todos from server
        <div className="message">Loading todos...</div>
      ) : todos.length === 0 ? (
        // Show this if we have no todos yet
        <div className="message">No todos yet. Add one above! 🚀</div>
      ) : (
        // Show the actual todo list if we have todos
        <ul className="todo-list">
          {/* 
            map() creates a new <li> element for each todo in our array
            Each todo needs a unique 'key' prop for React to track changes efficiently
          */}
          {todos.map((todo) => (
            <li key={todo._id} className="todo-item">
              {/* Left side: checkbox and todo text/edit input */}
              <div className="todo-content">
                {/* Checkbox to mark todo as complete/incomplete */}
                <input
                  type="checkbox"
                  className="todo-checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggle(todo)} // Toggle when clicked
                />

                {/* 
                  CONDITIONAL RENDERING: Show either edit input OR todo text
                  If this todo's ID matches editingId, show input field
                  Otherwise, show the todo text
                */}
                {editingId === todo._id ? (
                  // EDIT MODE: Show input field for editing
                  <input
                    className="edit-input"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    placeholder="Edit your todo..."
                    autoFocus // Automatically focus when editing starts
                  />
                ) : (
                  // NORMAL MODE: Show todo text
                  <span
                    className={`todo-text ${todo.completed ? 'completed' : ''}`}
                  >
                    {todo.title}
                  </span>
                )}
              </div>

              {/* Right side: action buttons (Edit/Delete OR Save/Cancel) */}
              <div className="todo-actions">
                {editingId === todo._id ? (
                  // EDIT MODE: Show Save and Cancel buttons
                  <>
                    <button 
                      className="btn save-btn"
                      onClick={() => saveEditedTodo(todo._id)}
                    >
                      ✓ Save
                    </button>
                    <button 
                      className="btn cancel-btn"
                      onClick={cancelEditing}
                    >
                      ✕ Cancel
                    </button>
                  </>
                ) : (
                  // NORMAL MODE: Show Edit and Delete buttons
                  <>
                    <button 
                      className="btn edit-btn"
                      onClick={() => startEditing(todo)}
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      className="btn delete-btn"
                      onClick={() => handleDelete(todo._id)}
                    >
                      🗑️ Delete
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
