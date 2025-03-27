import requests

def search_meal(query):
    url = f'https://www.themealdb.com/api/json/v1/1/search.php?s={query}'
    response = requests.get(url)

    if response.status_code == 200:
        data = response.json()
        meals = data.get('meals')

        if meals:
            meal = meals[0]  # take the first result
            print("📌 Title:", meal.get('strMeal'))
            print("🕒 Category:", meal.get('strCategory'))
            print("🌍 Region:", meal.get('strArea'))
            print("📋 Ingredients:")
            for i in range(1, 21):
                ingredient = meal.get(f'strIngredient{i}')
                measure = meal.get(f'strMeasure{i}')
                if ingredient and ingredient.strip():
                    print(f"  - {ingredient} — {measure}")
            print("📖 Instructions:", meal.get('strInstructions'))
        else:
            print("No meals found for that search.")
    else:
        print("❌ Failed to fetch from TheMealDB API.")

# Example usage
search_meal("chicken")  # change "chicken" to anything like "beef", "lasagna", etc.
