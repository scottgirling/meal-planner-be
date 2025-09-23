import db from "../db/connection.js";
import { Recipe } from "../types/recipe.js";

export const updateRecipeById = (recipe_id: string, recipe_name: string, instructions: string, prep_time: number, cook_time: number, servings: number, recipe_img_url: string, difficulty: number, is_recipe_public: boolean) => {

    let queryValues = [];

    let sqlQuery = "UPDATE recipes SET recipe_last_updated_at = CURRENT_TIMESTAMP";

    if (recipe_name) {
        queryValues.push(recipe_name);
        sqlQuery += `, recipe_name = $${queryValues.length}`;
        const recipeSlug = recipe_name.split(" ").join("-").toLowerCase();
        queryValues.push(recipeSlug);
        sqlQuery += `, recipe_slug = $${queryValues.length}`;
    }

    if (instructions) {
        queryValues.push(instructions);
        sqlQuery += `, instructions = $${queryValues.length}`;
    }

    if (prep_time) {
        queryValues.push(prep_time);
        sqlQuery += `, prep_time = $${queryValues.length}`;
    }

    if (cook_time) {
        queryValues.push(cook_time);
        sqlQuery += `, cook_time = $${queryValues.length}`;
    }

    if (servings) {
        queryValues.push(servings);
        sqlQuery += `, servings = $${queryValues.length}`;
    }

    if (recipe_img_url) {
        queryValues.push(recipe_img_url);
        sqlQuery += `, recipe_img_url = $${queryValues.length}`;
    }

    if (difficulty) {
        queryValues.push(difficulty);
        sqlQuery += `, difficulty = $${queryValues.length}`;
    }

    if (is_recipe_public) {
        queryValues.push(is_recipe_public);
        sqlQuery += `, is_recipe_public = $${queryValues.length}`;
    }

    queryValues.push(recipe_id);
    sqlQuery += ` WHERE is_recipe_public = false AND recipe_id = $${queryValues.length} RETURNING *`;

    return db.query(sqlQuery, queryValues)
    .then(({ rows } : { rows: Recipe[] }) => {
        return rows[0];
    });
}