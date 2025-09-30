import { DBClient } from "../types/db-client.js";
import db from "../db/connection.js";
import { UserFavouriteRecipe } from "../types/user-favourite-recipe.js";

export const createUserFavouriteRecipe = async (
    user_id: string, 
    recipe_id: string,
    client: DBClient = db
): Promise<UserFavouriteRecipe> => {

    const result = await client.query<UserFavouriteRecipe>(`
        INSERT INTO user_favourite_recipes (user_id, recipe_id) 
        VALUES ($1, $2) 
        RETURNING *
        `, [user_id, recipe_id]
    );
    const user_favourite_recipe = result.rows[0];

    return user_favourite_recipe;
}