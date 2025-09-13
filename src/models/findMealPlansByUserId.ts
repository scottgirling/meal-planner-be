import db from "../db/connection.js";
import { UserMealPlanRecipe } from "../types/user-meal-plan-recipe.js";

export const findMealPlansByUserId = (user_id: string) => {
    return db.query("SELECT meal_plan_recipes.meal_plan_id, meal_plan_recipes.scheduled_date::text, recipes.* FROM meal_plans JOIN meal_plan_recipes ON meal_plans.meal_plan_id = meal_plan_recipes.meal_plan_id JOIN recipes ON meal_plan_recipes.recipe_id = recipes.recipe_id WHERE meal_plans.meal_plan_created_by = $1", [user_id])
    .then(({ rows } : { rows: UserMealPlanRecipe[] }) => {
        return rows;
    })
}