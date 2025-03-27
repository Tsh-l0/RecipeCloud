const axios = require('axios');

const getAllRecipes = (req, res) => {
  res.json([
    {
      id: 1,
      title: 'Spaghetti Aglio e Olio',
      ingredients: ['spaghetti', 'garlic', 'olive oil', 'chili flakes'],
      time: '15 min',
    },
    {
      id: 2,
      title: 'Quick Egg Fried Rice',
      ingredients: ['rice', 'eggs', 'soy sauce', 'green onions'],
      time: '20 min',
    },
  ]);
};

const searchRecipes = async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ error: 'Query parameter "q" is required' });
  }

  try {
    const response = await axios.get(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${q}`
    );

    const meals = response.data.meals;

    if (!meals) {
      return res.status(404).json({ message: 'No recipes found' });
    }

    const simplified = meals.map((meal) => ({
      id: meal.idMeal,
      title: meal.strMeal,
      category: meal.strCategory,
      area: meal.strArea,
      thumbnail: meal.strMealThumb,
      instructions: meal.strInstructions,
      tags: meal.strTags ? meal.strTags.split(',') : [],
    }));

    res.json(simplified);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
};

module.exports = { getAllRecipes, searchRecipes };
