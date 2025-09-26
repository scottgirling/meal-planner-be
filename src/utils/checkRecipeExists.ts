import { DBClient } from "../types/db-client.js";
import db from "../db/connection.js";
import { Recipe } from "../types/recipe.js";
import { NotFoundError } from "../types/errors.js";

export const checkRecipeExists = async (recipe_id: string, client: DBClient = db): Promise<Recipe> => {

    const result = await client.query<Recipe>(`
        SELECT *
        FROM recipes
        WHERE recipe_id = $1
        `, [recipe_id]
    );
    const [recipe] = result.rows;

    if (!recipe) {
        throw new NotFoundError("Recipe does not exist.");
    }

    return recipe;
}