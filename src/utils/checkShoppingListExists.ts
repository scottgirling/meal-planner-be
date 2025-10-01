import { DBClient } from "../types/db-client.js";
import db from "../db/connection.js";
import { ShoppingList } from "../types/shopping-list.js";
import { NotFoundError } from "../types/errors.js";

export const checkShoppingListExists = async (
    shopping_list_id: string,
    client: DBClient = db
): Promise<ShoppingList> => {

    const result = await client.query<ShoppingList>(`
        SELECT * 
        FROM shopping_lists 
        WHERE shopping_list_id = $1
        `, [shopping_list_id]
    );
    const [shoppingList] = result.rows;

    if (!shoppingList) {
        throw new NotFoundError("Shopping List does not exist.");
    }

    return shoppingList;
}