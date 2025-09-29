import db from "../db/connection.js";
import { DBClient } from "../types/db-client.js";
import { Tag } from "../types/tag.js";
import { NotFoundError } from "../types/errors.js";

export const findTagsByRecipeId = async (recipe_id: string, client: DBClient = db): Promise<Tag[]> => {

    const result = await client.query<Tag>(`
        SELECT tags.* 
        FROM recipe_tags 
        JOIN tags 
        ON recipe_tags.tag_id = tags.tag_id 
        WHERE recipe_tags.recipe_id = $1
        `, [recipe_id]
    );
    const tags = result.rows;

    if (!tags.length) {
        throw new NotFoundError("Recipe does not exist.");
    }

    return tags;
}