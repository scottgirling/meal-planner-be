import db from "../db/connection.js";
import { AdditionalRecipeInfo } from "../types/additional-recipe-info.js";

export const selectRecipeById = (recipe_id: string) => {
    return db.query("SELECT recipes.*, users.username, users.avatar_url FROM recipes JOIN users ON recipes.recipe_created_by = users.user_id WHERE recipes.recipe_id = $1", [recipe_id])
    .then(({ rows } : { rows: AdditionalRecipeInfo[] }) => {
        if (!rows.length) {
            return Promise.reject({ status: 404, msg: "Recipe does not exist." });
        }
        return rows[0];
    });
}