import { DBClient } from "../types/db-client.js";
import db from "../db/connection.js";
import { RecipeIngredient } from "../types/recipe-ingredient.js";

export const createRecipeIngredients = (recipe_id: string, ingredient_ids: number[], quantity: number[], unit: string[], client: DBClient = db) => {

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

    return client.query(`INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES ${positionalPlaceholders.join(", ")} RETURNING *`, queryParams)
    .then(({ rows } : { rows: RecipeIngredient[] }) => {
        return rows;
    });
}