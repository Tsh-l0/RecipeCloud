const express = require('express');
const cors = require('cors');
const app = express();

// Use PORT from environment or default to 3000
const PORT = process.env.PORT || 3000;

// Whitelist your frontend URL
const allowedOrigins = ['https://recipecloud-0.onrender.com']; // <- your Render static frontend

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// Middleware
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