import db from "../db/connection.js";
import { UserFavouriteRecipe } from "../types/user-favourite-recipe.js";

export const removeUserFavouriteRecipe = (user_id: string, recipe_id: string) => {
    return db.query("DELETE FROM user_favourite_recipes WHERE user_id = $1 AND recipe_id = $2 RETURNING *", [user_id, recipe_id])
    .then(({ rows } : { rows: UserFavouriteRecipe[] }) => {
        return rows[0];
    });
}