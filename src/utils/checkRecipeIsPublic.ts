import db from "../db/connection.js";
import { Recipe } from "../types/recipe.js";

export const checkRecipeIsPublic = (recipe_id: string) => {
    return db.query("SELECT * FROM recipes WHERE is_recipe_public = 'false' AND recipe_id = $1", [recipe_id])
    .then(({ rows } : { rows: Recipe[] }) => {
        if (!rows.length) {
            return Promise.reject({ status: 400, msg: "Invalid request - public recipes cannot be removed." });
        }
    });
}