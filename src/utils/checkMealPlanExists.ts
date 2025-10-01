import { DBClient } from "../types/db-client.js";
import db from "../db/connection.js";
import { MealPlan } from "../types/meal-plan.js";
import { NotFoundError } from "../types/errors.js";

export const checkMealPlanExists = async (
    meal_plan_id: string,
    client: DBClient = db
): Promise<MealPlan> => {
    
    const result = await client.query<MealPlan>(`
        SELECT * 
        FROM meal_plans 
        WHERE meal_plan_id = $1
        `, [meal_plan_id]
    );
    const [mealPlan] = result.rows;

    if (!mealPlan) {
        throw new NotFoundError("Meal Plan does not exist.");
    }

    return mealPlan;
}