import { DBClient } from "../types/db-client";
import db from "../db/connection.js";
import { ShoppingList } from "../types"

export const createUserShoppingList = async (
    user_id: string, 
    meal_plan_id: number,
    client: DBClient = db
): Promise<ShoppingList> => {

    const result = await client.query<ShoppingList>(`
        INSERT INTO shopping_lists (shopping_list_created_by, meal_plan_id) 
        VALUES ($1, $2) 
        RETURNING *
        `, [user_id, meal_plan_id]
    );
    const shopping_list = result.rows[0];

    return shopping_list;
}