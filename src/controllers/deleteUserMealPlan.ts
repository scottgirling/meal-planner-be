import { NextFunction, Request, Response } from "express";
import { checkUserExists } from "../utils/checkUserExists";
import { checkMealPlanExists } from "../utils/checkMealPlanExists";
import { removeUserMealPlan } from "../models/removeUserMealPlan";

export const deleteUserMealPlan = async (request: Request, response: Response, next: NextFunction) => {
    const {
        user_id, 
        meal_plan_id
    } = request.params;

    try {
        await checkUserExists(user_id);
        await checkMealPlanExists(meal_plan_id);
        await removeUserMealPlan(user_id, meal_plan_id);

        return response.status(204).send();

    } catch (error) {
        next(error);
    }
}