import { DBClient } from "../types/db-client.js";
import db from "../db/connection.js";
import { UserFavouriteRecipe } from "../types/user-favourite-recipe.js";

export const removeUserFavouriteRecipe = async (
    user_id: string, 
    recipe_id: string,
    client: DBClient = db
): Promise<UserFavouriteRecipe> => {

    const result = await client.query<UserFavouriteRecipe>(`
        DELETE FROM user_favourite_recipes 
        WHERE user_id = $1 
        AND recipe_id = $2 
        RETURNING *
        `, [user_id, recipe_id]
    );
    const [removedFavouriteRecipe] = result.rows;

    return removedFavouriteRecipe;
}