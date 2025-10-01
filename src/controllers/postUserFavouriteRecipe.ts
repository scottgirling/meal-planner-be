import { NextFunction, Request, Response } from "express";
import { InvalidRequestError } from "../types/errors";
import { checkUserExists } from "../utils/checkUserExists";
import { checkRecipeExists } from "../utils/checkRecipeExists";
import { createUserFavouriteRecipe } from "../models/createUserFavouriteRecipe";
import { UserFavouriteRecipe } from "../types";

export const postUserFavouriteRecipe = async (
    request: Request<{ user_id: string }, {}, { recipe_id: string }>, 
    response: Response, 
    next: NextFunction
) => {
    const { user_id } = request.params;
    const { recipe_id } = request.body;

    if (recipe_id === undefined) {
        throw new InvalidRequestError("Invalid request - missing field(s).");
    }

    try {
        await checkUserExists(user_id);
        await checkRecipeExists(recipe_id);

        const user_favourite_recipe: UserFavouriteRecipe = await createUserFavouriteRecipe(
            user_id,
            recipe_id
        );

        response.status(201).send({ user_favourite_recipe });
    } catch (error: unknown) {
        next(error);
    }
}