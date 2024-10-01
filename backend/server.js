const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config({ path: './backend.env' }); 

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Debugging log for MongoDB URI
console.log('MongoDB URI:', process.env.MONGO_URI);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Define routes
app.get('/', (req, res) => {
  res.send('Welcome to the backend!');
});

// User model
const User = require('./models/User');

// Signup Route
app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const newUser = new User({ name, email, password });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Add password verification logic here (e.g., bcrypt)
    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
