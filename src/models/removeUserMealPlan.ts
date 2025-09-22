import db from "../db/connection.js";
import { MealPlan } from "../types/meal-plan.js";

export const removeUserMealPlan = (user_id: string, meal_plan_id: string) => {
    return db.query("DELETE FROM meal_plans WHERE meal_plan_created_by = $1 AND meal_plan_id = $2 RETURNING *", [user_id, meal_plan_id])
    .then(({ rows } : { rows: MealPlan[] }) => {
        return rows[0];
    });
}