import { Ingredient } from "../types/ingredient.js";
import db from "../db/connection.js";
import { DBClient } from "../types/db-client.js";

export const createIngredient = async (
    ingredient_name: string, 
    ingredient_slug: string, 
    ingredient_created_by: string,
    client: DBClient = db
): Promise<Ingredient> => {

    const result = await client.query<Ingredient>(`
        INSERT INTO ingredients 
        (ingredient_name, ingredient_slug, ingredient_created_by) 
        VALUES ($1, $2, $3) 
        RETURNING *
        `, [ingredient_name, ingredient_slug, ingredient_created_by]
    );
    const ingredient = result.rows[0];

    return ingredient;
}