export const searchRecipes = async (searchTerm: string, page: number) => {
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    throw new Error("API key is missing!");
  }

  const url = new URL("https://api.spoonacular.com/recipes/complexSearch");
  const queryParams = {
    apiKey, // Another way to write apiKey: apiKey
    query: searchTerm,
    number: "10", // How many recipes from request
    offset: (page * 10).toString(), // Offset for pagination
  };

  // Add query parameters to the URL
  url.search = new URLSearchParams(queryParams).toString();

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error searching for recipes: ", error);
  }
};

export const getRecipeSummary = async (id: string) => {
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    throw new Error("API key is missing!");
  }

  const url = new URL(`https://api.spoonacular.com/recipes/${id}/summary`);
  const queryParams = {
    apiKey,
  };

  url.search = new URLSearchParams(queryParams).toString();

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error getting recipe summary: ", error);
  }
};

export const getFavouriteRecipesByIDS = async (ids: string[]) => {
  const url = new URL("https://api.spoonacular.com/recipes/informationBulk");
  if (!process.env.API_KEY) throw new Error("API key is missing!");
  const params = {
    apiKey: process.env.API_KEY,
    ids: ids.join(","), //Convert array into a string and separate with commas
  };

  url.search = new URLSearchParams(params).toString();

  const searchResponse = await fetch(url);
  const json = await searchResponse.json();
  return { results: json };
};
