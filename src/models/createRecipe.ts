import { DBClient } from "../types/db-client.js";
import db from "../db/connection.js";
import { Recipe } from "../types/recipe.js";

export const createRecipe = async (
    recipe_name: string, 
    recipe_slug: string, 
    instructions: string, 
    prep_time: number, 
    cook_time: number, 
    servings: number, 
    recipe_created_by: string, 
    recipe_img_url: string, 
    difficulty: number, 
    is_recipe_public: boolean,
    client: DBClient = db
): Promise<Recipe> => {

    const result = await client.query<Recipe>(`
        INSERT INTO recipes 
        (recipe_name, recipe_slug, instructions, prep_time, cook_time, servings, recipe_created_by, recipe_img_url, difficulty, is_recipe_public) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
        RETURNING *
        `, [recipe_name, recipe_slug, instructions, prep_time, cook_time, servings, recipe_created_by, recipe_img_url, difficulty, is_recipe_public]
    );

    const recipe = result.rows[0];

    return recipe;
}