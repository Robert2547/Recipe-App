import { FormEvent, useEffect, useRef, useState } from "react";
import "./App.css";
import * as api from "./api";
import { Recipe } from "./types";
import RecipeCard from "./components/RecipeCard";
import RecipeModal from "./components/RecipeModal";
type Tabs = "search" | "favourites";

const App = () => {
  const [searchTerm, setSearchTerm] = useState<string>(""); // Using <string> is a good pratice to define the type of the state
  const [recipes, setRecipes] = useState<Recipe[]>([]); //<Recipe[]> create a types of array
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null); // There might not be a selected recipe, so the type is Recipe | null
  const pageNumber = useRef(1); //useRef allow you to keep current value without re-rendering the component
  const [selectedTab, setSelectedTab] = useState<Tabs>(); //SelectedTab can only be "search" or "favourites"
  const [favouriteRecipes, setFavouriteRecipes] = useState<Recipe[]>([]); // The favourite recipes state is an array of Recipe objects

  const addFavouriteRecipe = async (recipe: Recipe) => {
    try {
      await api.addFavouriteRecipe(recipe);
      setFavouriteRecipes([...favouriteRecipes, recipe]); // ... copies the current array, then we add the new recipe to the end
    } catch (error) {
      console.error(error);
    }
  };

  const removeFavouriteRecipe = async (recipe: Recipe) => {
    try {
      await api.removeFavouriteRecipe(recipe);
      const updatedRecipes = favouriteRecipes.filter(
        (favRecipe) => recipe.id !== favRecipe.id
      ); // Return the new array without the removed recipe
      setFavouriteRecipes(updatedRecipes); // Update the state with the new array
    } catch (error) {
      console.error(error);
    }
  };
  // Fetch favourite recipes when the app loads
  useEffect(() => {
    const fetchFavouriteRecipes = async () => {
      try {
        const favouriteRecipes = await api.getFavouriteRecipes();
        setFavouriteRecipes(favouriteRecipes.results); // Update the state with the favourite recipes
      } catch (error) {
        console.error(error);
      }
    };

    fetchFavouriteRecipes();
  }, []);

  const handleSearchSubmit = async (event: FormEvent) => {
    event.preventDefault(); // Prevent the default form submission behavior, which would cause a page reload
    try {
      const recipes = await api.searchRecipes(searchTerm, 1);
      setRecipes(recipes.results); // This will update the state and trigger a re-render
      pageNumber.current = 1; // Reset the page number to 1
    } catch (error) {
      console.error(error);
    }
  };

  const handleViewMoreClick = async () => {
    const nextPage = pageNumber.current + 1;
    try {
      const nextRecipes = await api.searchRecipes(searchTerm, nextPage);
      setRecipes([...recipes, ...nextRecipes.results]); // Create a new array with the current recipes and the next recipes, then update the state(re-render the component)
      pageNumber.current = nextPage; // Update the current page number
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div className="tabs">
        <h1 onClick={() => setSelectedTab("search")}> Recipe Search</h1>
        <h1 onClick={() => setSelectedTab("favourites")}> Favourites </h1>
      </div>
      {/* Render the search tab only if the selected tab is "search" */}
      {selectedTab === "search" && (
        <>
          <form onSubmit={(event) => handleSearchSubmit(event)}>
            <input
              type="text"
              required
              placeholder="Enter a search term..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            ></input>
            <button type="submit">Submit</button>
          </form>
          {recipes.map((recipe) => {
            const isFavourite = favouriteRecipes.some(
              (favRecipe) => recipe.id === favRecipe.id
            ); // Check if the recipe is in the favourite recipes array

            return (
              <RecipeCard
                recipe={recipe}
                onClick={() => setSelectedRecipe(recipe)}
                onFavouriteButtonClick={
                  isFavourite ? removeFavouriteRecipe : addFavouriteRecipe
                }
                isFavourite={isFavourite}
              />
            );
          })}

          <button className="view-more-button" onClick={handleViewMoreClick}>
            View More
          </button>
        </>
      )}
      {/* Render the favourites tab only if the selected tab is "favourites" */}
      {selectedTab === "favourites" && (
        <div>
          {favouriteRecipes.map((recipe) => (
            <RecipeCard
              recipe={recipe}
              onClick={() => setSelectedRecipe(recipe)}
              onFavouriteButtonClick={removeFavouriteRecipe}
              isFavourite={true}
            />
          ))}
        </div>
      )}
      {/* Render the RecipeModal component only if there is a selected recipe */}
      {selectedRecipe ? (
        <RecipeModal
          recipeId={selectedRecipe.id.toString()}
          onClose={() => setSelectedRecipe(null)}
        />
      ) : null}
    </div>
  );
};

export default App;
