import { DBClient } from "../types/db-client";
import db from "../db/connection.js";
import { RecipeIngredient } from "../types";

export const removeRecipeIngredient = (recipe_id: string, ingredientsToRemove: number[], client: DBClient = db) => {
    
    if (!ingredientsToRemove || !ingredientsToRemove.length) {
        return;
    }

    const positionalPlaceholders: string[] = [];
    const queryParams: (string| number)[] = [];
    queryParams.push(recipe_id);

    ingredientsToRemove.forEach((ingredient, index) => {
        const paramIndex = index + 2;
        positionalPlaceholders.push(`$${paramIndex}`);
        queryParams.push(ingredient);
    });

    return client.query(`DELETE FROM recipe_ingredients WHERE recipe_id = $1 AND ingredient_id IN (${positionalPlaceholders.join(", ")}) RETURNING *`, queryParams)
    .then(({ rows } : { rows: RecipeIngredient[] }) => {
        return rows;
    });
}