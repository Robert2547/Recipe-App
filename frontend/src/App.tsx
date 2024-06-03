import { FormEvent, useState } from "react";
import "./App.css";
import * as api from "./api";
import { Recipe } from "./types";
import RecipeCard from "./components/RecipeCard";

const App = () => {
  const [searchTerm, setSearchTerm] = useState<string>(""); // Using <string> is a good pratice to define the type of the state
  const [recipes, setRecipes] = useState<Recipe[]>([]); //<Recipe[]> create a types of array

  const handleSearchSubmit = async (event: FormEvent) => {
    event.preventDefault(); // Prevent the default form submission behavior, which would cause a page reload
    try {
      const recipes = await api.searchRecipes(searchTerm, 1);
      setRecipes(recipes.results); // This will update the state and trigger a re-render
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
        <RecipeCard recipe={recipe} />
      ))}
    </div>
  );
};

export default App;
