import { DBClient } from "../types/db-client.js";
import db from "../db/connection.js";
import { RecipeIngredient } from "../types/recipe-ingredient.js";
import { NotFoundError } from "../types/errors.js";

export const checkIngredientExistsOnRecipe = async (
    positionalPlaceholders: string[], 
    queryParams: (string | number)[], 
    client: DBClient = db
): Promise<RecipeIngredient[]> => {

    const result = await client.query<RecipeIngredient>(`
        SELECT * 
        FROM recipe_ingredients 
        WHERE recipe_id = $1 AND ingredient_id IN (${positionalPlaceholders.join(", ")})
        `, queryParams
    );
    const recipeIngredients = result.rows;

    if (recipeIngredients.length < positionalPlaceholders.length) {
        throw new NotFoundError("One or more ingredient not found on this recipe.");
    }

    return recipeIngredients;
}