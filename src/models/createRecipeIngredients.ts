import { DBClient } from "../types/db-client.js";
import db from "../db/connection.js";
import { RecipeIngredient } from "../types/recipe-ingredient.js";

export const createRecipeIngredients = async (recipe_id: string, ingredient_ids: number[], quantity: number[], unit: string[], client: DBClient = db) => {

    if (!ingredient_ids || !ingredient_ids.length) {
        return;
    }

    const positionalPlaceholders: string[] = [];
    const queryParams: (string | number)[] = [];

    ingredient_ids.forEach((ingredient_id, index) => {
        const paramIndex = index * 4;
        positionalPlaceholders.push(`($${paramIndex + 1}, $${paramIndex + 2}, $${paramIndex + 3}, $${paramIndex + 4})`);
        queryParams.push(recipe_id, ingredient_id, quantity[index], unit[index]);
    });

    try {
        const result: { rows: RecipeIngredient[] } = await client.query(`INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES ${positionalPlaceholders.join(", ")} RETURNING *`, queryParams);
        const { rows } = result;

        return rows;
    } catch (error) {
        throw error;
    }
}