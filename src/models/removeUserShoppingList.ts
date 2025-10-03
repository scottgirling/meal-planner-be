import db from "../db/connection.js";
import { DBClient } from "../types/db-client.js";
import { ShoppingList } from "../types/shopping-list.js";

export const removeUserShoppingList = async (
    user_id: string, 
    shopping_list_id: string,
    client: DBClient = db
): Promise<ShoppingList> => {

    const result = await client.query<ShoppingList>(`
        DELETE FROM shopping_lists 
        WHERE shopping_list_created_by = $1 
        AND shopping_list_id = $2 
        RETURNING *
        `, [user_id, shopping_list_id]
    );
    const [removedShoppingList] = result.rows;

    return removedShoppingList;
}