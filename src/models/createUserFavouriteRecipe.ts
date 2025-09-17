import db from "../db/connection.js";
import { UserFavouriteRecipe } from "../types/user-favourite-recipe.js";

export const createUserFavouriteRecipe = (user_id: string, recipe_id: number) => {
    return db.query("INSERT INTO user_favourite_recipes (user_id, recipe_id) VALUES ($1, $2) RETURNING *", [user_id, recipe_id])
    .then(({ rows } : { rows: UserFavouriteRecipe[] }) => {
        return rows[0];
    });
}