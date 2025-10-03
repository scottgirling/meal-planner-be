import { DBClient } from "../types/db-client.js";
import db from "../db/connection.js";
import { RecipeIngredient } from "../types/recipe-ingredient.js";
import { NotFoundError } from "../types/errors.js";

export const findIngredientsByRecipeId = async (
    recipe_id: string,
    client: DBClient = db
): Promise<RecipeIngredient[]> => {

    const result = await client.query<RecipeIngredient>(`
        SELECT ingredients.ingredient_name, recipe_ingredients.quantity, recipe_ingredients.unit FROM recipe_ingredients 
        JOIN ingredients 
        ON recipe_ingredients.ingredient_id = ingredients.ingredient_id 
        WHERE recipe_ingredients.recipe_id = $1
        `, [recipe_id]
    );
    const ingredients = result.rows;

    if (!ingredients.length) {
        throw new NotFoundError("Recipe does not exist.");
    }

    return ingredients;
}