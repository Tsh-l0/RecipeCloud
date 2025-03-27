const express = require('express');
const cors = require('cors');
const app = express();

// Use PORT from environment or default to 3000
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const recipeRoutes = require('./routes/recipes');
const authRoutes = require('./routes/auth');

// API Endpoints
app.use('/api/recipes', recipeRoutes);
app.use('/api', authRoutes);

// Root Test Route
app.get('/', (req, res) => {
  res.send('RecipeCloud backend is up 🌐🍲');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});