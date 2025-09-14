import db from "../db/connection.js";
import { ShoppingListIngredient } from "../types/shopping-list-ingredient.js";

export const findShoppingListsByUserId = (user_id: string) => {
    return db.query("SELECT shopping_list_ingredients.*, shopping_lists.meal_plan_id, ingredients.ingredient_name FROM shopping_lists JOIN shopping_list_ingredients ON shopping_lists.shopping_list_id = shopping_list_ingredients.shopping_list_id JOIN ingredients ON shopping_list_ingredients.ingredient_id = ingredients.ingredient_id WHERE shopping_lists.shopping_list_created_by = $1", [user_id])
    .then(({ rows } : { rows: ShoppingListIngredient[] }) => {
        return rows;
    });
}