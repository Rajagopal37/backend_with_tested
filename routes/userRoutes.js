const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

// Signup Route
router.post('/signup', async (req, res) => {
  const { username, name, email, password } = req.body;
  
  try {
    // Check if username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, name, email, password: hashedPassword });

    // Save the new user
    await newUser.save();

    // Generate JWT Token
    // const token = jwt.sign({ id: newUser._id, username: newUser.username }, process.env.JWT_SECRET, { expiresIn: '30d' });
    const token = jwt.sign({ id: newUser._id, email: newUser.email }, process.env.JWT_SECRET, { expiresIn: '30d' });

    // Respond with user and token
    res.status(201).json({ user: newUser, token });
  } catch (error) {
    res.status(400).json({ message: 'Error creating user', error });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare passwords
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT Token
    // const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '30d' });
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '30d' });

    // Respond with user and token
    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
});

// Get all users (protected)
router.get('/', auth, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
});

module.exports = router;



// const express = require('express');
// const User = require('../models/User');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const auth = require('../middleware/authMiddleware');

// const router = express.Router();

// // Signup
// router.post('/signup', async (req, res) => {
//     const { username, name, email, password } = req.body;

//     try {
//       // Check if the username or email already exists
//       const existingUser = await User.findOne({ $or: [{ username }, { email }] });
//       if (existingUser) {
//         return res.status(400).json({ message: 'Username or email already exists' });
//       }
  
//       // Hash the password
//       const hashedPassword = await bcrypt.hash(password, 10);
//       const newUser = new User({ username, name, email, password: hashedPassword });
      
//       // Save the new user to the database
//       await newUser.save();
      
//       // Respond with the new user data
//       res.status(201).json(newUser);
//     } catch (error) {
//       res.status(400).json({ message: 'Error creating user', error });
//     }
//   });
  

// // Login
// router.post('/login', async (req, res) => {
//     const { username, password } = req.body;
    
//     // Log the login attempt
//     console.log("Login attempt:", { username, password });
  
//     try {
//       // Find the user by username
//       const user = await User.findOne({ username });
      
//       // Log the result of the user lookup
//       console.log("User found:", user);
  
//       if (!user) {
//         return res.status(401).json({ message: 'Invalid credentials' });
//       }
  
//       // Compare the password
//       const match = await bcrypt.compare(password, user.password);
//       if (!match) {
//         return res.status(401).json({ message: 'Invalid credentials' });
//       }
  
//       // Generate JWT
//       const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '30d' });
//       res.json({ token });
//     } catch (error) {
//       console.error("Error logging in:", error); // Log the error for debugging
//       res.status(500).json({ message: 'Error logging in', error });
//     }
//   });
  

// // Get all users (protected)
// router.get('/', auth, async (req, res) => {
//   try {
//     const users = await User.find();
//     res.json(users);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching users', error });
//   }
// });

// // Update user by ID (protected)
// router.put('/:id', auth, async (req, res) => {
//   try {
//     const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!updatedUser) {
//       return res.status(404).json({ message: 'User not found' });
//     }
//     res.json(updatedUser);
//   } catch (error) {
//     res.status(400).json({ message: 'Error updating user', error });
//   }
// });

// // Delete user by ID (protected)
// router.delete('/:id', auth, async (req, res) => {
//   try {
//     const deletedUser = await User.findByIdAndDelete(req.params.id);
//     if (!deletedUser) {
//       return res.status(404).json({ message: 'User not found' });
//     }
//     res.json({ message: 'User deleted successfully' });
//   } catch (error) {
//     res.status(400).json({ message: 'Error deleting user', error });
//   }
// });

// //Sign out
// router.post('/logout', auth, async (req, res) => {
//     // Logic to invalidate the token (e.g., store it in a blacklist)
//     res.json({ message: 'Successfully logged out' });
// });

// module.exports = router;
