import { DBClient } from "../types/db-client.js";
import db from "../db/connection.js";
import { Recipe } from "../types/recipe.js";

export const removeRecipeById = async (
    recipe_id: string,
    client: DBClient = db
): Promise<Recipe> => {

    const result = await client.query<Recipe>(`
        DELETE FROM recipes 
        WHERE recipe_id = $1 
        RETURNING *
        `, [recipe_id]
    );
    const [removedRecipe] = result.rows;

    return removedRecipe;
}