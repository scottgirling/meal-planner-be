import { DBClient } from "../types/db-client";
import db from "../db/connection.js";
import { ShoppingListIngredient } from "../types";

export const createShoppingListIngredient = async (
    newShoppingListId: number | undefined, 
    ingredients: ShoppingListIngredient[],
    client: DBClient = db, 
): Promise<ShoppingListIngredient[]> => {

    const positionalPlaceholders: string[] = [];
    const queryParams: (string | number)[] = [];

    ingredients.forEach((ingredient, index) => {
        const paramIndex = index * 4;
        positionalPlaceholders.push(`($${paramIndex + 1}, $${paramIndex + 2}, $${paramIndex + 3}, $${paramIndex + 4})`);
        queryParams.push(Number(newShoppingListId), ingredient.ingredient_id, ingredient.quantity, ingredient.unit)
    });

    const result = await client.query<ShoppingListIngredient>(`
        INSERT INTO shopping_list_ingredients (shopping_list_id, ingredient_id, quantity, unit) 
        VALUES ${positionalPlaceholders.join(", ")} 
        RETURNING *
        `, queryParams
    );
    const shopping_list_ingredients = result.rows;

    return shopping_list_ingredients;
}