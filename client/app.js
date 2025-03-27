// I'm keeping track of the currently logged-in user here
let currentUser = null;

// This is the base URL for my backend API endpoints
const apiBase = 'http://localhost:3000/api';

async function register() {
  // I grab the values from the registration input fields
  const username = document.getElementById('reg-username').value;
  const password = document.getElementById('reg-password').value;

  // If the user didn’t fill both fields, I stop and alert them
  if (!username || !password) return alert("Please fill in both fields.");

  // I send the user details to my backend to register them
  const res = await fetch(`${apiBase}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  // I parse the response and show a message based on it
  const data = await res.json();
  alert(data.message || data.error);
}

async function login() {
  // I get login input values from the DOM
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;

  // Again, if fields are empty, I stop and notify the user
  if (!username || !password) return alert("Please fill in both fields.");

  // I send a POST request to log the user in
  const res = await fetch(`${apiBase}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  // I check the result and either log the user in or show an error
  const data = await res.json();

  if (res.ok) {
    currentUser = data.user.username; // I store who’s logged in
    alert('Login successful!');
  } else {
    alert(data.error);
  }
}

async function searchRecipes() {
  // I grab whatever the user typed into the search bar
  const query = document.getElementById('search-query').value;
  if (!query) return alert("Enter a search term!");

  // I hit my own backend which talks to MealDB for recipe results
  const res = await fetch(`${apiBase}/recipes/search?q=${query}`);
  const recipes = await res.json();

  // I clear out the results container before adding new content
  const apiResults = document.getElementById('api-results');
  apiResults.innerHTML = '';

  // I loop through the recipes and build mini cards for each one
  recipes.forEach(recipe => {
    const card = document.createElement('div');
    card.innerHTML = `
      <img src="${recipe.thumbnail}" alt="${recipe.title}" class="recipe-img" />
      <h4>${recipe.title}</h4>
      <p><strong>Category:</strong> ${recipe.category}</p>
      <p>${recipe.instructions}</p>
      <button onclick='saveFavourite(${JSON.stringify(recipe)})'>Save</button>
    `;
    apiResults.appendChild(card); // I drop it into the DOM
  });

  // I do a mock scrape result just as a placeholder
  const scrapedResults = document.getElementById('scraped-results');
  scrapedResults.innerHTML = '';

  const scraped = {
    title: `Scraped ${query} Recipe`,
    category: "Scraped",
    instructions: "This is a placeholder. Replace with real scraped data.",
    time: "30 min"
  };

  // I show this fake scraped recipe for now until I plug in real scraping
  const card = document.createElement('div');
  card.innerHTML = `
    <h4>${scraped.title}</h4>
    <p><strong>Category:</strong> ${scraped.category}</p>
    <p>${scraped.instructions}</p>
    <button onclick='saveFavourite(${JSON.stringify(scraped)})'>Save</button>
  `;
  scrapedResults.appendChild(card);
}

async function saveFavourite(recipe) {
  // I check if someone’s logged in before saving anything
  if (!currentUser) return alert('Please log in first.');

  // I send the selected recipe to the backend to save under the user's name
  const res = await fetch(`${apiBase}/favourites`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: currentUser, recipe })
  });

  // I notify the user if the save worked or if it failed
  const data = await res.json();
  alert(data.message || data.error);
}

async function loadFavourites() {
  // Again, I check if we’ve got a user logged in
  if (!currentUser) return alert('Please log in first.');

  // I fetch that user's saved favourites from the backend
  const res = await fetch(`${apiBase}/favourites?username=${currentUser}`);
  const data = await res.json();

  // I clear the list before populating it
  const list = document.getElementById('fave-list');
  list.innerHTML = '';

  // I loop through the saved recipes and add them as list items
  data.favourites.forEach(fav => {
    const item = document.createElement('li');
    item.textContent = fav.title;
    list.appendChild(item);
  });
}