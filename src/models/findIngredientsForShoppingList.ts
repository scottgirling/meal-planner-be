import { PoolClient } from "pg"
import { RecipeIngredient } from "../types"

export const findIngredientsForShoppingList = (client: PoolClient, recipe_ids: number[]) => {
    return client.query(`SELECT ingredient_id, SUM(quantity) AS quantity, unit FROM recipe_ingredients WHERE recipe_id IN (${recipe_ids.join(", ")}) GROUP BY ingredient_id, unit`)
    .then(({ rows } : { rows: RecipeIngredient[] }) => {
        return rows;
    });
}