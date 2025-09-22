import db from "../db/connection.js";
import { MealPlan } from "../types/meal-plan.js";

export const checkMealPlanExists = (meal_plan_id: string) => {
    return db.query("SELECT * FROM meal_plans WHERE meal_plan_id = $1", [meal_plan_id])
    .then(({ rows } : { rows: MealPlan[] }) => {
        if (!rows.length) {
            return Promise.reject({ status: 404, msg: "Meal Plan does not exist." });
        }
    });
}