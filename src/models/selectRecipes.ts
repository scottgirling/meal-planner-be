import db from "../db/connection.js";
import { Recipe } from "../types/recipe.js";

export const selectRecipes = () => {
    return db.query("SELECT * FROM recipes")
    .then(({ rows } : { rows: Recipe[] }) => {
        return rows;
    });
}