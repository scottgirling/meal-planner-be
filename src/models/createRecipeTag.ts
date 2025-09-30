import { DBClient } from "../types/db-client.js";
import db from "../db/connection.js";
import { RecipeTag } from "../types/recipe-tag.js";

export const createRecipeTag = async (
    recipe_id: number, 
    tag_ids: number[],
    client: DBClient = db
): Promise<RecipeTag[]> => {
    const positionalPlaceholders: string[] = [];
    const queryParams: number[] = [];

    tag_ids.forEach((tag_id, index) => {
        const paramIndex = index * 2;
        positionalPlaceholders.push(`($${paramIndex + 1}, $${paramIndex + 2})`)
        queryParams.push(recipe_id, tag_id);
    });

    const result = await client.query<RecipeTag>(`
        INSERT INTO recipe_tags 
        (recipe_id, tag_id) 
        VALUES ${positionalPlaceholders.join(", ")} 
        RETURNING *
        `, queryParams
    );
    const recipe_tags = result.rows;

    return recipe_tags;
}