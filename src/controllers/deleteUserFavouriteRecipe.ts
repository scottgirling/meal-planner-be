import { NextFunction, Request, Response } from "express";
import { checkUserExists } from "../utils/checkUserExists";
import { checkRecipeExists } from "../utils/checkRecipeExists";
import { removeUserFavouriteRecipe } from "../models/removeUserFavouriteRecipe";

export const deleteUserFavouriteRecipe = async (
    request: Request<{ user_id: string, recipe_id: string }>, 
    response: Response, 
    next: NextFunction
) => {
    const {
        user_id,
        recipe_id
    } = request.params;

    try {
        await checkUserExists(user_id);
        await checkRecipeExists(recipe_id);
        await removeUserFavouriteRecipe(user_id, recipe_id);

        response.status(204).send();

    } catch (error) {
        next(error);
    }
}