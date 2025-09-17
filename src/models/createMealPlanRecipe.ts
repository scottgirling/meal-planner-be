import { PoolClient } from "pg";
import { MealPlanRecipe } from "../types/meal-plan-recipe.js";

export const createMealPlanRecipe = (client: PoolClient, newMealPlanId: number | undefined, recipe_ids: number[], scheduled_dates: string[]) => {

    const positionalPlaceholders: string[] = [];
    const queryParams: (string | number)[] = [];

    recipe_ids.forEach((recipe_id, index) => {
        const paramIndex = index * 3;
        positionalPlaceholders.push(`($${paramIndex + 1}, $${paramIndex + 2}, $${paramIndex + 3})`);
        queryParams.push(Number(newMealPlanId), recipe_id, scheduled_dates[index]);
    });

    return client.query(`INSERT INTO meal_plan_recipes (meal_plan_id, recipe_id, scheduled_date) VALUES ${positionalPlaceholders.join(", ")} RETURNING *`, queryParams)
    .then(({ rows } : { rows: MealPlanRecipe[] }) => {
        return rows;
    });
}