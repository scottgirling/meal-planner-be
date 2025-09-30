import { NextFunction, Request, Response } from "express";
import { findMealPlansByUserId } from "../models/findMealPlansByUserId";
import { UserMealPlanRecipe } from "../types";
import { checkUserExists } from "../utils/checkUserExists";

export const getUserMealPlans = async (
    request: Request<{ user_id: string }>, 
    response: Response, 
    next: NextFunction
) => {
    const { user_id } = request.params;

    try {
        await checkUserExists(user_id);

        const meal_plans: UserMealPlanRecipe[] = await findMealPlansByUserId(user_id);

        response.status(200).send({ meal_plans });
    } catch (error: unknown) {
        next(error);
    }
}