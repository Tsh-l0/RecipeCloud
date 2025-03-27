const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

const usersPath = path.join(__dirname, '../../data/users.json');

const registerUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ error: 'Username and password are required' });

  const users = JSON.parse(fs.readFileSync(usersPath));

  const userExists = users.find((u) => u.username === username);
  if (userExists)
    return res.status(409).json({ error: 'Username already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword, favourites: [] });

  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));

  res.status(201).json({ message: 'User registered successfully' });
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  const users = JSON.parse(fs.readFileSync(usersPath));
  const user = users.find((u) => u.username === username);

  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

  res.status(200).json({ message: 'Login successful', user: { username } });
};

const saveFavourite = (req, res) => {
  const { username, recipe } = req.body;

  if (!username || !recipe)
    return res.status(400).json({ error: 'Username and recipe are required' });

  const users = JSON.parse(fs.readFileSync(usersPath));
  const userIndex = users.findIndex((u) => u.username === username);

  if (userIndex === -1)
    return res.status(404).json({ error: 'User not found' });

  users[userIndex].favourites = users[userIndex].favourites || [];
  users[userIndex].favourites.push(recipe);

  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
  res.status(200).json({ message: 'Recipe saved to favourites' });
};

const getFavourites = (req, res) => {
  const { username } = req.query;

  if (!username)
    return res.status(400).json({ error: 'Username is required' });

  const users = JSON.parse(fs.readFileSync(usersPath));
  const user = users.find((u) => u.username === username);

  if (!user)
    return res.status(404).json({ error: 'User not found' });

  res.json({ favourites: user.favourites || [] });
};

module.exports = {
  registerUser,
  loginUser,
  saveFavourite,
  getFavourites
};
