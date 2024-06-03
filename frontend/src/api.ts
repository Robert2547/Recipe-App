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
