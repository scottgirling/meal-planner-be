import { DBClient } from "../types/db-client.js";
import db from "../db/connection.js";
import { MealPlan } from "../types/meal-plan.js";

export const createUserMealPlan = async (
    user_id: string,
    client: DBClient = db, 
): Promise<MealPlan> => {

    const result = await client.query<MealPlan>(`
        INSERT INTO meal_plans (meal_plan_created_by) 
        VALUES ($1) 
        RETURNING *
        `, [user_id]
    );
    const meal_plan = result.rows[0];

    return meal_plan;
}