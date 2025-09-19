import { PoolClient } from "pg";
import { ShoppingListIngredient } from "../types";

export const createShoppingListIngredient = (client: PoolClient, newShoppingListId: number | undefined, ingredients: ShoppingListIngredient[]) => {

    const positionalPlaceholders: string[] = [];
    const queryParams: (string | number)[] = [];

    ingredients.forEach((ingredient, index) => {
        const paramIndex = index * 4;
        positionalPlaceholders.push(`($${paramIndex + 1}, $${paramIndex + 2}, $${paramIndex + 3}, $${paramIndex + 4})`);
        queryParams.push(Number(newShoppingListId), ingredient.ingredient_id, ingredient.quantity, ingredient.unit)
    });

    return client.query(`INSERT INTO shopping_list_ingredients (shopping_list_id, ingredient_id, quantity, unit) VALUES ${positionalPlaceholders.join(", ")} RETURNING *`, queryParams)
    .then(({ rows } : { rows: ShoppingListIngredient[] }) => {
        return rows;
    });
}