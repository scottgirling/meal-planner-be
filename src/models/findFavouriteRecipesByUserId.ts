import { DBClient } from "../types/db-client.js";
import db from "../db/connection.js";
import { Recipe } from "../types/recipe.js";

export const findFavouriteRecipesByUserId = async (user_id: string, client: DBClient = db): Promise<Recipe[]> => {

    const result = await client.query<Recipe>(`
        SELECT recipes.* 
        FROM recipes 
        JOIN user_favourite_recipes 
        ON recipes.recipe_id = user_favourite_recipes.recipe_id 
        WHERE user_favourite_recipes.user_id = $1
        `, [user_id]
    );
    const recipes = result.rows;

    return recipes;
}