import { PoolClient } from "pg";
import { MealPlan } from "../types/meal-plan.js";

export const createUserMealPlan = (client: PoolClient, user_id: string) => {
    return client.query("INSERT INTO meal_plans (meal_plan_created_by) VALUES ($1) RETURNING *", [user_id])
    .then(({ rows } : { rows: MealPlan[] }) => {
        return rows[0];
    });
}