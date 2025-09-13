import db from "../db/connection.js";
import { Tag } from "../types/tag.js";

export const findTagsByRecipeId = (recipe_id: string) => {
    return db.query("SELECT tags.* FROM recipe_tags JOIN tags ON recipe_tags.tag_id = tags.tag_id WHERE recipe_tags.recipe_id = $1", [recipe_id])
    .then(({ rows } : { rows: Tag[] }) => {
        if (!rows.length) {
            return Promise.reject({ status: 404, msg: "Recipe does not exist." });
        }
        return rows;
    });
}