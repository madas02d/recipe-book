

// searchByIngredient function from your original code
function searchByIngredient(ingredient) {
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`)
        .then(response => response.json())
        .then(data => {
            console.log(data.meals); // Moved inside the .then() block
            displaySearchResults(data.meals);
        })
        .catch(error => console.error('Error fetching data:', error));
}

function displaySearchResults(recipes) {
    const searchContainer = document.getElementById('search-Container');

    // Ensure the container exists
    if (!searchContainer) {
        console.error('Error: search-Container element not found.');
        return;
    }

    searchContainer.innerHTML = ''; // Clear previous results

    recipes.forEach(recipe => {
        const recipeDiv = document.createElement('div');
        recipeDiv.classList.add('recipe');
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
            getRecipeDetails(mealId); // Call the function with the meal ID
        });
    });
}
