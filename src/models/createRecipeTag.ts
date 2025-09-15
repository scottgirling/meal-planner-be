import db from "../db/connection.js";
import { RecipeTag } from "../types/recipe-tag.js";

export const createRecipeTag = (recipe_id: number, tag_ids: number[]) => {
    const positionalPlaceholders: string[] = [];
    const queryParams: number[] = [];

    tag_ids.forEach((tag_id, index) => {
        const paramIndex = index * 2;
        positionalPlaceholders.push(`($${paramIndex + 1}, $${paramIndex + 2})`)
        queryParams.push(recipe_id, tag_id);
    })

    return db.query(`INSERT INTO recipe_tags (recipe_id, tag_id) VALUES ${positionalPlaceholders.join(", ")} RETURNING *`, queryParams)
    .then(({ rows } : { rows: RecipeTag[] }) => {
        return rows;
    });
}