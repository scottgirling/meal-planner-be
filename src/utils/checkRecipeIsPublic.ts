import { DBClient } from "../types/db-client.js";
import db from "../db/connection.js";
import { Recipe } from "../types/recipe.js";
import { ForbiddenError } from "../types/errors.js";

export const checkRecipeIsPublic = async (
    recipe_id: string, 
    client: DBClient = db
): Promise<Recipe> => {

    const result = await client.query<Recipe>(`
        SELECT * 
        FROM recipes 
        WHERE is_recipe_public = false AND recipe_id = $1
        `, [recipe_id]
    );
    const [recipe] = result.rows;


    if (!recipe) {
        throw new ForbiddenError("Forbidden request - unable to amend/remove public recipes.");
    }

    return recipe;
}