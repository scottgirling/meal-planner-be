import { DBClient } from "../types/db-client";
import db from "../db/connection.js";
import { RecipeIngredient } from "../types"

export const findIngredientsForShoppingList = async (
    recipe_ids: string[],
    client: DBClient = db
): Promise<RecipeIngredient[]> => {

    const result = await client.query<RecipeIngredient>(`
        SELECT ingredient_id, SUM(quantity) AS quantity, unit 
        FROM recipe_ingredients 
        WHERE recipe_id IN (${recipe_ids.join(", ")}) 
        GROUP BY ingredient_id, unit
        `
    );
    const ingredients = result.rows;

    return ingredients;
}