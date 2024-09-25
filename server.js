require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes'); // Import task routes
const auth = require('./middleware/authMiddleware');
const cors = require('cors'); // Import cors here


const app = express();
const PORT = process.env.PORT || 5000;

//Configure CORS to allow requests from your frontend
app.use(cors({
    origin: 'https://tkapfrdus.netlify.app/', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    credentials: true,  
  }));

app.options('*', cors());

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the Task Manager API!');
});

app.use('/api/users', userRoutes); // User routes
app.use('/api/tasks', taskRoutes); // Task routes

// Start the server
app.listen(PORT, () => {
  console.log(`Server running http://localhost:${PORT}/`);
});
