import { DBClient } from "../types/db-client.js";
import db from "../db/connection.js";
import { RecipeIngredient } from "../types/recipe-ingredient.js";

export const checkIngredientExistsOnRecipe = async (positionalPlaceholders: string[], queryParams: (string | number)[], client: DBClient = db) => {

    try {
        const result: { rows: RecipeIngredient[] } = await client.query(`SELECT * FROM recipe_ingredients WHERE recipe_id = $1 AND ingredient_id IN (${positionalPlaceholders.join(", ")})`, queryParams);
        const { rows } = result;

        if (rows.length < positionalPlaceholders.length) {
            throw {
                status: 404,
                msg: "One or more ingredient not found on this recipe."
            }
        }
    } catch (error) {
        throw error;
    }
}