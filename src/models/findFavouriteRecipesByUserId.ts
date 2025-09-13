import db from "../db/connection.js";
import { Recipe } from "../types/recipe.js";

export const findFavouriteRecipesByUserId = (user_id: string) => {
    return db.query("SELECT recipes.* FROM recipes JOIN user_favourite_recipes ON recipes.recipe_id = user_favourite_recipes.recipe_id WHERE user_favourite_recipes.user_id = $1", [user_id])
    .then(({ rows } : { rows: Recipe[] }) => {
        return rows;
    });
}