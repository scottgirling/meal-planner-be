import db from "../db/connection.js";
import { RecipeIngredient } from "../types/recipe-ingredient.js";

export const findIngredientsByRecipeId = (recipe_id: string) => {
    return db.query("SELECT ingredients.ingredient_name, recipe_ingredients.quantity, recipe_ingredients.unit FROM recipe_ingredients JOIN ingredients ON recipe_ingredients.ingredient_id = ingredients.ingredient_id WHERE recipe_ingredients.recipe_id = $1", [recipe_id])
   .then(({ rows } : { rows: RecipeIngredient[] }) => {
        if (!rows.length) {
            return Promise.reject({ status: 404, msg: "Recipe does not exist." });
        }
        return rows;
   });
}