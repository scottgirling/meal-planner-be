import db from "../db/connection.js";
import { Recipe } from "../types/recipe.js";

export const removeRecipeById = (recipe_id: string) => {
    return db.query("DELETE FROM recipes WHERE recipe_id = $1 RETURNING *", [recipe_id])
    .then(({ rows } : { rows: Recipe[] }) => {
        return rows[0];
    });
}