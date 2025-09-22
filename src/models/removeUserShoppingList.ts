import db from "../db/connection.js";
import { ShoppingListIngredient } from "../types/shopping-list-ingredient.js";
import { ShoppingList } from "../types/shopping-list.js";

export const removeUserShoppingList = (user_id: string, shopping_list_id: string) => {
    return db.query("DELETE FROM shopping_lists WHERE shopping_list_created_by = $1 AND shopping_list_id = $2 RETURNING *", [user_id, shopping_list_id])
    .then(({ rows } : { rows: ShoppingList[] }) => {
        return rows[0];
    });
}