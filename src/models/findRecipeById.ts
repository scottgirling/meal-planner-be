import db from "../db/connection.js";
import { AdditionalRecipeInfo } from "../types/additional-recipe-info.js";
import { NotFoundError } from "../types/errors.js";

export const findRecipeById = async (recipe_id: string): Promise<AdditionalRecipeInfo> => {
    
    const result = await db.query<AdditionalRecipeInfo>(`
        SELECT recipes.*, users.username, users.avatar_url 
        FROM recipes 
        JOIN users 
        ON recipes.recipe_created_by = users.user_id 
        WHERE recipes.recipe_id = $1
        `, [recipe_id]
    );
    const recipe = result.rows[0];

    if (!recipe) {
        throw new NotFoundError("Recipe does not exist.");
    }

    return recipe;
}