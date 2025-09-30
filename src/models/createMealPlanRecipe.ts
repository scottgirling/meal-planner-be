import { DBClient } from "../types/db-client.js";
import db from "../db/connection.js";
import { MealPlanRecipe } from "../types/meal-plan-recipe.js";

export const createMealPlanRecipe = async (
    newMealPlanId: number | undefined, 
    recipe_ids: string[], 
    scheduled_dates: string[],
    client: DBClient = db, 
): Promise<MealPlanRecipe[]> => {

    const positionalPlaceholders: string[] = [];
    const queryParams: (string | number)[] = [];

    recipe_ids.forEach((recipe_id, index) => {
        const paramIndex = index * 3;
        positionalPlaceholders.push(`($${paramIndex + 1}, $${paramIndex + 2}, $${paramIndex + 3})`);
        queryParams.push(Number(newMealPlanId), recipe_id, scheduled_dates[index]);
    });

    const result = await client.query<MealPlanRecipe>(`
        INSERT INTO meal_plan_recipes (meal_plan_id, recipe_id, scheduled_date) 
        VALUES ${positionalPlaceholders.join(", ")} 
        RETURNING *
        `, queryParams
    );
    const meal_plan_recipes = result.rows;

    return meal_plan_recipes;
}