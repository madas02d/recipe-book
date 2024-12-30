import { getWeatherData } from "./weather.js";
getWeatherData()
const darkModeToggle = document.getElementById('dark-mode-toggle');
const recipesContainer = document.querySelector('.recipes');
const searchContainer = document.getElementById('search-Container');
searchContainer.innerHTML =''
const toggle = document.getElementById('dark-mode-toggle')

darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('darkMode', 'enabled');
        toggle.textContent =''
        toggle.textContent ='Light Mode'
    } else {
        localStorage.setItem('darkMode', 'disabled');
        toggle.textContent =''
        toggle.textContent ='Dark Mode'
    }
});

if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark-mode');
            toggle.textContent =''
        toggle.textContent ='Light Mode'
}

// Function to fetch and display recipes
 const randomMeals = async ()=>{
    try {
        const res = await fetch("https://www.themealdb.com/api/json/v1/1/categories.php")
        const result = await res.json()
        console.log(result);
        displayRecipes(result.categories)
    } catch (error) {
        console.log(error.message);
    }
}

function displayRecipes(recipes) {
    // const recipesContainer = document.getElementById('index-container');
    recipesContainer.innerHTML = ''; 

    recipes.forEach(recipe => {
        const recipeDiv = document.createElement('div');
        recipeDiv.classList.add('recipe-card');
        recipeDiv.innerHTML = `
            <img src="${recipe.strCategoryThumb
            }" alt="${recipe.strMeal}">
            <h3>${recipe.strCategory
            }</h3>
            <p>${recipe.strCategoryDescription
            }</p>
        `;
        recipesContainer.appendChild(recipeDiv);
    });
  recipesContainer.addEventListener('click', function(e) {

        const card = e.target.closest('.recipe-card'); // Get the closest recipe card
    
        if (card) {
            const mealName = card.querySelector('h3').textContent; 

            console.log(mealName);
            recipesContainer.innerHTML = ''
            searchByIngredient(mealName)
        }
    });
        
}

randomMeals()
//***************************************************************** */


function searchByIngredient(ingredient) {
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`)
        .then(response => response.json())
        .then(data => {
            if (data.meals === null) {
                console.error("Felching failed:", 'Sorry Not Data Found!!!!');
                searchContainer.innerHTML =`<h2>Felching Data failed: 'Sorry Not Data Found!!!!'</h2>`

            } else {
                console.log(data); 
                displaySearchResults(data.meals);
            }
          })
        .catch(error => console.error('Error fetching data:', error));
}

function displaySearchResults(recipes) {

    searchContainer.innerHTML = ''; // Clear previous results

    recipes.forEach(recipe => {
        const recipeDiv = document.createElement('div');
        recipeDiv.classList.add('search-recipe');
        recipeDiv.innerHTML = `
            <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
            <h3>${recipe.strMeal}</h3>
            <button class="detail-btn" data-id="${recipe.idMeal}">Details</button>
        `;
        searchContainer.appendChild(recipeDiv);
    });

    // Add event listeners to buttons after the elements are created
    document.querySelectorAll('.detail-btn').forEach(button => {
        button.addEventListener('click', function() {
            const mealId = this.getAttribute('data-id');
            getRecipeDetails(mealId);
        });
    });
}


//***************************************************************** */

// Function to fetch recipe details by mealId
function getRecipeDetails(mealId) {
    console.log(mealId);
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
        .then(response => response.json())
        .then(data => displayRecipeDetails(data.meals[0]))
        .catch(error => console.error('Error fetching data:', error));
}

// Function to display recipe details in the designated div
function displayRecipeDetails(recipe) {
    const recipeDetailsDiv = document.getElementById('recipe-details');
    recipeDetailsDiv.innerHTML = '';

    // Show the recipe details div if it's hidden
    if (recipeDetailsDiv.style.display === 'none' || recipeDetailsDiv.style.display === '') {
        recipeDetailsDiv.style.display = 'block';
    }
    recipeDetailsDiv.innerHTML = `
        <span id="close-details" style="cursor: pointer; float: right; font-size: 20px;">&times;</span>
        <h2>${recipe.strMeal}</h2>
        <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
        <p>${recipe.strInstructions}</p>
        <h4>Ingredients:</h4>
        <ul>
            ${getIngredientsList(recipe).map(ingredient => `<li>${ingredient}</li>`).join('')}
        </ul>
        <button class="saveTF-btn" data-id="${recipe.idMeal}">Save to Favorites</button>
    `;

    // Close recipe details when the close button is clicked
    document.getElementById('close-details').addEventListener('click', function() {
        recipeDetailsDiv.style.display = 'none';
    });

    // Add event listener to the save button
    document.querySelector('.saveTF-btn').addEventListener('click', function() {
        const mealId = this.getAttribute('data-id');
        saveToFavorites(mealId);
    });
}


// Function to get the ingredients list for the recipe
function getIngredientsList(recipe) {
    let ingredients = [];
    for (let i = 1; i <= 20; i++) {
        let ingredient = recipe[`strIngredient${i}`];
        let measure = recipe[`strMeasure${i}`];
        if (ingredient) {
            ingredients.push(`${measure} ${ingredient}`);
        }
    }
    return ingredients;
}

// Function to save a recipe to favorites in localStorage
function saveToFavorites(mealId) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (!favorites.includes(mealId)) {
        favorites.push(mealId);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        alert('Recipe saved to favorites!');
    } else {
        alert('Recipe is already in favorites.');
    }
}

// Function to load and display favorite recipes one by one
function loadFavorites() {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    if (favorites.length === 0) {
        alert('No favorites saved.');
        return;
    }

    let currentIndex = 0; 

    // Function to display the current favorite recipe
    function showFavorite(index) {
        getRecipeDetails(favorites[index]); // Fetch and display the recipe details
    }

    // Initial display of the first favorite recipe
    showFavorite(currentIndex);

    // Handle next and previous buttons
    document.getElementById('next-btn').addEventListener('click', function () {
        currentIndex = (currentIndex + 1) % favorites.length; // Wrap around if at the end
        showFavorite(currentIndex);
    });

    document.getElementById('prev-btn').addEventListener('click', function () {
        currentIndex = (currentIndex - 1 + favorites.length) % favorites.length; // Wrap around if at the beginning
        showFavorite(currentIndex);
    });
}


// Function to handle "Favorites" nav click and load favorite recipes
function getFavorites() {
    document.getElementById('favorites-nav').addEventListener('click', () => {
        loadFavorites();
    });
}

// Event listener for DOMContentLoaded to set up necessary event handlers
document.addEventListener('DOMContentLoaded', () => {
    getFavorites(); 
});

// Event listener for home link to reload or reset the page (consider using section toggling)
document.getElementById('home-link').addEventListener('click', function(event) {
    location.reload(); 
});

document.getElementById('new-favorites-nav').addEventListener('click', () => {
    location.reload();
    localStorage.clear()
});


