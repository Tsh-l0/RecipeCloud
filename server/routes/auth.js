const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  saveFavourite,
  getFavourites
} = require('../controllers/authController');

// Auth Routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Favourites Routes
router.post('/favourites', saveFavourite);
router.get('/favourites', getFavourites);

module.exports = router;
