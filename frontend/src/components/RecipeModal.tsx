import { useEffect, useState } from "react";
import { RecipeSummary } from "../types";
import * as api from "../api";

interface Props {
  recipeId: string;
}

const RecipeModal = ({ recipeId }: Props) => {
  const [recipeSummary, setRecipesSummary] = useState<RecipeSummary>();

  //This useEffect will run every time the recipeId changes, and fetch the new recipe summary
  useEffect(() => {
    const fetchRecipeSummary = async () => {
      try {
        const summaryRecipe = await api.getRecipeSummary(recipeId);
        setRecipesSummary(summaryRecipe);
      } catch (error) {
        console.error(error);
      }
    };

    fetchRecipeSummary();
  }, [recipeId]);

  if (!recipeSummary) {
    return <></>;
  }

  return (
    <>
      <div className="overlay"></div>
      <div className="modal">
        <div className="modal-content">
          <div className="modal-header">
            <h2>{recipeSummary?.title}</h2>
            <span className="close-btn">&times;</span>
          </div>
          <p dangerouslySetInnerHTML={{ __html: recipeSummary?.summary }}></p>
        </div>
      </div>
    </>
  );
};

export default RecipeModal;
