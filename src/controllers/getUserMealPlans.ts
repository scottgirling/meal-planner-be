import { NextFunction, Request, Response } from "express";
import { findMealPlansByUserId } from "../models/findMealPlansByUserId";
import { UserMealPlanRecipe } from "../types";
import { checkUserExists } from "../utils/checkUserExists";

export const getUserMealPlans = (request: Request, response: Response, next: NextFunction) => {
    const { user_id } = request.params as {
        user_id: string
    };

    checkUserExists(user_id)
    .catch((error: Error) => {
        next(error);
    });

    findMealPlansByUserId(user_id)
    .then((meal_plans: UserMealPlanRecipe[]) => {
        return response.status(200).send({ meal_plans });
    })
    .catch((error: Error) => {
        next(error);
    });
}