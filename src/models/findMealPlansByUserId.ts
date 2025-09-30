import { DBClient } from "../types/db-client.js";
import db from "../db/connection.js";
import { UserMealPlanRecipe } from "../types/user-meal-plan-recipe.js";

export const findMealPlansByUserId = async (user_id: string, client: DBClient = db): Promise<UserMealPlanRecipe[]> => {

    const result = await client.query<UserMealPlanRecipe>(`
        SELECT meal_plan_recipes.meal_plan_id, meal_plan_recipes.scheduled_date::text, recipes.* 
        FROM meal_plans 
        JOIN meal_plan_recipes 
        ON meal_plans.meal_plan_id = meal_plan_recipes.meal_plan_id 
        JOIN recipes 
        ON meal_plan_recipes.recipe_id = recipes.recipe_id 
        WHERE meal_plans.meal_plan_created_by = $1
        `, [user_id]
    );
    const meal_plans = result.rows;

    return meal_plans;
}