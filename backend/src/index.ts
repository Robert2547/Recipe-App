import express from "express";
import cors from "cors";
import * as RecipeAPI from "./recipe-api";
require('dotenv').config();

const app = express();

//Middleware
app.use(express.json()); // Convert body of request into JSON
app.use(cors()); // Secruity measure to prevent cross-origin requests

// Routes
app.get("/api/recipes/search", async (req, res) => {
  const searchTerm = req.query.searchTerm as string; // Get the search term from the query string
  const page = req.query.page as string; // Get the page from the query string
  const results = await RecipeAPI.searchRecipes(searchTerm, parseInt(page));

  return res.json(results); // Return the results as JSON
});

// Start the server on port 5001
app.listen(5001, () => {
  console.log("Server is running on port 5001");
});
