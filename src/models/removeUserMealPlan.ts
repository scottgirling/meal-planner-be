import { DBClient } from "../types/db-client.js";
import db from "../db/connection.js";
import { MealPlan } from "../types/meal-plan.js";

export const removeUserMealPlan = async (
    user_id: string, 
    meal_plan_id: string,
    client: DBClient = db
): Promise<MealPlan> => {

    const result = await client.query<MealPlan>(`
        DELETE FROM meal_plans 
        WHERE meal_plan_created_by = $1 
        AND meal_plan_id = $2 
        RETURNING *
        `, [user_id, meal_plan_id]
    );
    const [removedMealPlan] = result.rows;

    return removedMealPlan;
}