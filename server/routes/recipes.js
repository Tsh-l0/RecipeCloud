const express = require('express');
const router = express.Router();
const { getAllRecipes, searchRecipes } = require('../controllers/recipeController');

// GET all recipes (dummy data)
router.get('/', getAllRecipes);

// GET recipes from external API by search query
router.get('/search', searchRecipes);

module.exports = router;
