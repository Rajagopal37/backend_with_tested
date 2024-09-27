// routes/taskRoutes.js
const express = require('express');
const Task = require('../models/Task');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

// Create a new task (Protected)
router.post('/', auth, async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      user: req.user.id, // Assign the task to the authenticated user
    });
    await task.save();
    res.status(201).json(task);
    alert("Task Created Successfully")
  } catch (error) {
    res.status(400).json({ message: 'Error creating task', error });
  }
});

// Get all tasks for authenticated user (Protected)
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error });
  }
});

// Update a task by ID (Protected)
router.put('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task || task.user.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Task not found or unauthorized' });
    }

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTask);
    alert("Task Updated Successfully")
  } catch (error) {
    res.status(400).json({ message: 'Error updating task', error });
  }
});

// Delete a task by ID (Protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    console.log("Task ID to delete:", req.params.id);
    console.log("Authenticated user ID:", req.user.id);
    
    const task = await Task.findById(req.params.id);

    if (!task) {
      console.log("Task not found");
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.user.toString() !== req.user.id) {
      console.log("Unauthorized user");
      return res.status(403).json({ message: 'Unauthorized to delete this task' });
    }

    await task.remove();
    console.log("Task deleted successfully");
    alert("Task deleted successfully");
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(400).json({ message: 'Error deleting task', error });
  }
});

module.exports = router;
