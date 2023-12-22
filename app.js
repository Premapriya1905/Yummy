document.addEventListener('DOMContentLoaded', function () {
    const apiSearchUrl = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';

    const searchForm = document.querySelector('form');
    const searchInput = document.querySelector('.form-control');
    const searchedMealsContainer = document.getElementById('searchedmeals');
    const recipeModal = new bootstrap.Modal(document.getElementById('recipeModal'));

    searchForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const searchTerm = searchInput.value.trim();

        if (searchTerm !== '') {
            fetch(apiSearchUrl + searchTerm)
                .then(response => response.json())
                .then(data => {
                    displaySearchedMeals(data.meals);
                })
                .catch(error => {
                    console.error('Error fetching searched meals:', error);
                });
        }
    });

    function displaySearchedMeals(meals) {
        searchedMealsContainer.innerHTML = '';

        if (meals && meals.length > 0) {
            meals.forEach(meal => {
                const mealContainer = document.createElement('div');
                mealContainer.classList.add('meal-container');

                const mealImage = document.createElement('img');
                mealImage.src = meal.strMealThumb;
                mealImage.alt = meal.strMeal;

                const mealName = document.createElement('p');
                mealName.textContent = meal.strMeal;

                mealContainer.appendChild(mealImage);
                mealContainer.appendChild(mealName);

                mealContainer.addEventListener('click', function () {
                    fetchRecipeDetails(meal.idMeal); 
                });

                searchedMealsContainer.appendChild(mealContainer);
            });
        } else {
            searchedMealsContainer.textContent = 'No meals found.';
        }
    }

    function fetchRecipeDetails(mealId) {
        const apiRecipeUrl = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`;

        fetch(apiRecipeUrl)
            .then(response => response.json())
            .then(data => {
                if (data.meals && data.meals.length > 0) {
                    const recipe = data.meals[0];
                    const modalBody = document.getElementById('recipeModalBody');
                    modalBody.innerHTML = `
                        <h2>${recipe.strMeal}</h2>
                        <h3>Ingredients:</h3>
                        <ul>
                            <li>${recipe.strIngredient1}</li>
                            <li>${recipe.strIngredient2}</li>
                            <!-- Add more ingredients as needed -->
                        </ul>
                        <h3>Instructions:</h3>
                        <p>${recipe.strInstructions}</p>
                    `;
                    recipeModal.show();
                } else {
                    console.error('Error fetching recipe details.');
                }
            })
            .catch(error => {
                console.error('Error fetching recipe details:', error);
            });
    }
});

