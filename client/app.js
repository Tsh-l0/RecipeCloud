// I'm keeping track of the currently logged-in user here
let currentUser = null;

// ✅ This is the live base URL for your backend API endpoints
const apiBase = 'https://recipecloud.onrender.com/api';

async function register() {
  const username = document.getElementById('reg-username').value;
  const password = document.getElementById('reg-password').value;

  if (!username || !password) return alert("Please fill in both fields.");

  const res = await fetch(`${apiBase}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();
  alert(data.message || data.error);
}

async function login() {
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;

  if (!username || !password) return alert("Please fill in both fields.");

  const res = await fetch(`${apiBase}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();

  if (res.ok) {
    currentUser = data.user.username;
    alert('Login successful!');
  } else {
    alert(data.error);
  }
}

async function searchRecipes() {
  const query = document.getElementById('search-query').value;
  if (!query) return alert("Enter a search term!");

  const res = await fetch(`${apiBase}/recipes/search?q=${query}`);
  const recipes = await res.json();

  const apiResults = document.getElementById('api-results');
  apiResults.innerHTML = '';

  recipes.forEach(recipe => {
    const card = document.createElement('div');
    card.innerHTML = `
      <img src="${recipe.thumbnail}" alt="${recipe.title}" class="recipe-img" />
      <h4>${recipe.title}</h4>
      <p><strong>Category:</strong> ${recipe.category}</p>
      <p>${recipe.instructions}</p>
      <button onclick='saveFavourite(${JSON.stringify(recipe)})'>Save</button>
    `;
    apiResults.appendChild(card);
  });

  const scrapedResults = document.getElementById('scraped-results');
  scrapedResults.innerHTML = '';

  const scraped = {
    title: `Scraped ${query} Recipe`,
    category: "Scraped",
    instructions: "This is a placeholder. Replace with real scraped data.",
    time: "30 min"
  };

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
  if (!currentUser) return alert('Please log in first.');

  const res = await fetch(`${apiBase}/favourites`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: currentUser, recipe })
  });

  const data = await res.json();
  alert(data.message || data.error);
}

async function loadFavourites() {
  if (!currentUser) return alert('Please log in first.');

  const res = await fetch(`${apiBase}/favourites?username=${currentUser}`);
  const data = await res.json();

  const list = document.getElementById('fave-list');
  list.innerHTML = '';

  data.favourites.forEach(fav => {
    const item = document.createElement('li');
    item.textContent = fav.title;
    list.appendChild(item);
  });
}