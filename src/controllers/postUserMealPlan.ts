import { NextFunction, Request, Response } from "express";
import { UserMealPlanBody } from "../types/req-body/UserMealPlanBody.js";
import { PoolClient } from "pg";
import db from "../db/connection.js";
import { createUserMealPlan } from "../models/createUserMealPlan";
import { createMealPlanRecipe } from "../models/createMealPlanRecipe";
import { checkUserExists } from "../utils/checkUserExists";
import { checkRecipeExists } from "../utils/checkRecipeExists.js";
import { formatDate } from "../utils/formatDate";

export const postUserMealPlan = async (
    request: Request<{ user_id: string }, {}, UserMealPlanBody>, 
    response: Response, 
    next: NextFunction
) => {
    const { user_id } = request.params;
    const {
        recipe_ids, 
        scheduled_dates
    } = request.body;

    if (
        recipe_ids === undefined ||
        scheduled_dates === undefined
    ) {
        return Promise.reject({ status: 400, msg: "Invalid request - missing field(s)." });
    }

    if (
        !Array.isArray(recipe_ids) ||
        !Array.isArray(scheduled_dates)
    ) {
        return Promise.reject({ status: 400, msg: "Invalid data type." });
    }

    let newMealPlanId: (number | undefined) = 0;

    let client: PoolClient | undefined;

    try {
        await checkUserExists(user_id);
        await Promise.all(recipe_ids.map(recipe => checkRecipeExists(recipe)));

        client = await db.connect();
        client.query("BEGIN");

        const meal_plan = await createUserMealPlan(
            user_id,
            client
        );
        newMealPlanId = meal_plan.meal_plan_id;

        const meal_plan_recipes = await createMealPlanRecipe(
            newMealPlanId, 
            recipe_ids, 
            scheduled_dates,
            client);
        
        const formatted_meal_plan_recipes = meal_plan_recipes.map((recipe) => {
            return {
                ...recipe,
                scheduled_date: formatDate(recipe.scheduled_date)
            }
        });

        await client.query("COMMIT");

        return response.status(201).send({ formatted_meal_plan_recipes });
    } catch (error) {
        if (client) {
            await client.query("ROLLBACK");
        }
        next(error);
    } finally {
        if (client) client.release();
    }
}