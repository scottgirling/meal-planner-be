import db from "../db/connection.js";
import { Ingredient } from "../types/ingredient.js";

export const createIngredient = (
    ingredient_name: string, 
    ingredient_slug: string, 
    ingredient_created_by: string
) => {
    return db.query("INSERT INTO ingredients (ingredient_name, ingredient_slug, ingredient_created_by) VALUES ($1, $2, $3) RETURNING *", [ingredient_name, ingredient_slug, ingredient_created_by])
    .then(({ rows } : { rows: Ingredient[] }) => {
        return rows[0];
    });
}