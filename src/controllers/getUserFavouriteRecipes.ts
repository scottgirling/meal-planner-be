import { NextFunction, Request, Response } from "express";
import { checkUserExists } from "../utils/checkUserExists";
import { findFavouriteRecipesByUserId } from "../models/findFavouriteRecipesByUserId"
import { Recipe } from "../types";

export const getUserFavouriteRecipes = async (
    request: Request<{ user_id: string }>, 
    response: Response, 
    next: NextFunction
) => {
    const { user_id } = request.params;

    try {
        await checkUserExists(user_id);
        const recipes: Recipe[] = await findFavouriteRecipesByUserId(user_id);

        response.status(200).send({ recipes });
    } catch (error: unknown) {
        next(error);
    }
}