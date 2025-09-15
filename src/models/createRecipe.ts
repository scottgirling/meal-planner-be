import db from "../db/connection.js";
import { Recipe } from "../types/recipe.js";

export const createRecipe = (
    recipe_name: string, 
    recipe_slug: string, 
    instructions: string, 
    prep_time: number, 
    cook_time: number, 
    votes: number, 
    servings: number, 
    recipe_created_by: string, 
    recipe_created_at: string, 
    recipe_last_updated_at: string, 
    recipe_img_url: string, 
    difficulty: number, 
    is_recipe_public: boolean
) => {
    return db.query("INSERT INTO recipes (recipe_name, recipe_slug, instructions, prep_time, cook_time, votes, servings, recipe_created_by, recipe_created_at, recipe_last_updated_at, recipe_img_url, difficulty, is_recipe_public) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *", [recipe_name, recipe_slug, instructions, prep_time, cook_time, votes, servings, recipe_created_by, recipe_created_at, recipe_last_updated_at, recipe_img_url, difficulty, is_recipe_public])
    .then(({ rows } : { rows: Recipe[] }) => {
        return rows[0];
    });
}