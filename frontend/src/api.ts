import { Recipe } from "./types";

export const searchRecipes = async (searchTerm: string, page: number) => {
  const baseUrl = new URL("http://localhost:5001/api/recipes/search");
  baseUrl.searchParams.append("searchTerm", searchTerm);
  baseUrl.searchParams.append("page", page.toString());

  const response = await fetch(baseUrl);
  if (!response.ok) {
    throw new Error(
      "Failed to fetch recipes during searchRecipes: " + response.statusText
    );
  }
  return response.json();
};

export const getRecipeSummary = async (id: string) => {
  const url = new URL(`http://localhost:5001/api/recipes/${id}/summary`);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      "Failed to fetch recipe summary during getRecipeSummary: " +
        response.statusText
    );
  }

  return response.json();
};

export const getFavouriteRecipes = async () => {
  const url = new URL("http://localhost:5001/api/recipes/favourite");
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      "Failed to fetch favourite recipes during getFavouriteRecipes: " +
        response.statusText
    );
  }

  return response.json();
};

export const addFavouriteRecipes = async (recipe: Recipe) => {
  const url = new URL("http://localhost:5001/api/recipes/favourite");
  const body = {
    recipeId: recipe.id,
  };
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Tell the server we are sending JSON
    },
    body: JSON.stringify(body), // Convert the body to a JSON string
  });

  if (!response.ok) {
    throw new Error(
      "Failed to add favourite recipe during addFavouriteRecipes: " +
        response.statusText
    );
  }
};
