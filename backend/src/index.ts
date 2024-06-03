import express from "express";
import cors from "cors";
import * as RecipeAPI from "./recipe-api";
require("dotenv").config();
import { PrismaClient } from "@prisma/client";

const app = express();
const prismaClient = new PrismaClient(); // Use to interact with the database

//Middleware
app.use(express.json()); // Convert body of request into JSON
app.use(cors()); // Secruity measure to prevent cross-origin requests

// Routes

// Search for recipes from the API
app.get("/api/recipes/search", async (req, res) => {
  const searchTerm = req.query.searchTerm as string; // Get the search term from the query string
  const page = req.query.page as string; // Get the page from the query string
  const results = await RecipeAPI.searchRecipes(searchTerm, parseInt(page));

  return res.json(results); // Return the results as JSON
});
// Get recipe summary from the API
app.get("/api/recipes/:id/summary", async (req, res) => {
  const id = req.params.id; // Get the recipe ID from the URL
  const summary = await RecipeAPI.getRecipeSummary(id);

  return res.json(summary); // Return the summary as JSON
});

// Create favourite recipe in the database
app.post("/api/recipes/favourite", async (req, res) => {
  const recipeId = req.body.recipeId; // Get the recipe ID from the request body
  try {
    const favouriteRecipe = await prismaClient.favouriteRecipes.create({
      data: {
        recipeId: recipeId,
      },
    });

    return res.status(201).json(favouriteRecipe); // Return the favourite recipe as JSON, 201 success status code
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: "Failed to favourite recipe" });
  }
});

// Get all favourite recipes from the database
app.get("/api/recipes/favourite", async (req, res) => {
  try {
    const recipes = await prismaClient.favouriteRecipes.findMany(); // Get all favourite recipes from the database
    const recipeIds = recipes.map((recipe) => recipe.recipeId.toString()); // Convert recipeId values to strings

    const favourites = await RecipeAPI.getFavouriteRecipesByIDS(recipeIds); // Get the favourite recipes from the API
    return res.json(favourites); // Return the favourite recipes as JSON
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: "Failed to get favourite recipes" });
  }
});

// Delete favourite recipe from the database
app.delete("/api/recipes/favourite", async (req, res) => {
  const recipeId = req.body.recipeId;
  try {
    await prismaClient.favouriteRecipes.delete({
      where: {
        recipeId: recipeId,
      },
    }); // Delete the favourite recipe from the database based on the recipeId

    return res.status(204).send(); // Return 204 status code for new content
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: "Failed to delete favourite recipe" });
  }
});

// Start the server on port 5001
app.listen(5001, () => {
  console.log("Server is running on port 5001");
});
