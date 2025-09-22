import db from "../db/connection.js";
import { ShoppingList } from "../types/shopping-list.js";

export const checkShoppingListExists = (shopping_list_id: string) => {
    return db.query("SELECT * FROM shopping_lists WHERE shopping_list_id = $1", [shopping_list_id])
    .then(({ rows } : { rows: ShoppingList[] }) => {
        if (!rows.length) {
            return Promise.reject({ status: 404, msg: "Shopping List does not exist." });
        }
    });
}