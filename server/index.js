const express = require('express');
const cors = require('cors'); // ✅ CORS added
const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // ✅ CORS middleware
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
  console.log(`Server running at http://localhost:${PORT}`);
});
