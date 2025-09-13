import { Recipe } from "./recipe";

export interface UserMealPlanRecipe extends Recipe {
    meal_plan_id: number;
    scheduled_date: string
}