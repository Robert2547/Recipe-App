import { FormEvent, useRef, useState } from "react";
import "./App.css";
import * as api from "./api";
import { Recipe } from "./types";
import RecipeCard from "./components/RecipeCard";
import RecipeModal from "./components/RecipeModal";

const App = () => {
  const [searchTerm, setSearchTerm] = useState<string>(""); // Using <string> is a good pratice to define the type of the state
  const [recipes, setRecipes] = useState<Recipe[]>([]); //<Recipe[]> create a types of array
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null); // There might not be a selected recipe, so the type is Recipe | null
  const pageNumber = useRef(1); //useRef allow you to keep current value without re-rendering the component

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
      {recipes.map((recipe) => (
        <RecipeCard recipe={recipe} onClick={() => setSelectedRecipe(recipe)} />
      ))}

      <button className="view-more-button" onClick={handleViewMoreClick}>
        View More
      </button>

      {/* Render the RecipeModal component only if there is a selected recipe */}
      {selectedRecipe ? (
        <RecipeModal recipeId={selectedRecipe.id.toString()} onClose={() => setSelectedRecipe(null)} />
      ) : null}
    </div>
  );
};

export default App;
