import { PoolClient } from "pg"
import { ShoppingList } from "../types"

export const createUserShoppingList = (client: PoolClient, user_id: string, meal_plan_id: number) => {
    return client.query("INSERT INTO shopping_lists (shopping_list_created_by, meal_plan_id) VALUES ($1, $2) RETURNING *", [user_id, meal_plan_id])
    .then(({ rows } : { rows: ShoppingList[] }) => {
        return rows[0];
    });
}