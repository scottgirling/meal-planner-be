import { DBClient } from "../types/db-client.js";
import db from "../db/connection.js";
import { Recipe } from "../types/recipe.js";

export const checkRecipeExists = (recipe_id: string, client: DBClient = db) => {
    return client.query("SELECT * FROM recipes WHERE recipe_id = $1", [recipe_id])
    .then(({ rows } : { rows: Recipe[] }) => {
        if (!rows.length) {
            return Promise.reject({ status: 404, msg: "Recipe does not exist." });
        }
    });
}