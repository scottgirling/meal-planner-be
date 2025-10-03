import { DBClient } from "../types/db-client";
import db from "../db/connection.js";
import { RecipeIngredient } from "../types";
import { checkIngredientExistsOnRecipe } from "../utils/checkIngredientExistsOnRecipe";

export const removeRecipeIngredient = async (
    recipe_id: string, 
    ingredientsToRemove: number[], 
    client: DBClient = db
): Promise<RecipeIngredient[] | undefined> => {
    
    if (!ingredientsToRemove || !ingredientsToRemove.length) {
        return;
    }

    const positionalPlaceholders: string[] = [];
    const queryParams: (string| number)[] = [];
    queryParams.push(recipe_id);

    ingredientsToRemove.forEach((ingredient, index) => {
        const paramIndex = index + 2;
        positionalPlaceholders.push(`$${paramIndex}`);
        queryParams.push(ingredient);
    });

    await checkIngredientExistsOnRecipe(positionalPlaceholders, queryParams, client);

    const result = await client.query<RecipeIngredient>(`
        DELETE FROM recipe_ingredients 
        WHERE recipe_id = $1 
        AND ingredient_id IN (${positionalPlaceholders.join(", ")}) 
        RETURNING *
        `, queryParams
    );
    const removedRecipeIngredients = result.rows;

    return removedRecipeIngredients;
}