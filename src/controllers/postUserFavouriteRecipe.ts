import { NextFunction, Request, Response } from "express";
import { createUserFavouriteRecipe } from "../models/createUserFavouriteRecipe";
import { UserFavouriteRecipe } from "../types";
import { checkUserExists } from "../utils/checkUserExists";
import { checkRecipeExists } from "../utils/checkRecipeExists";

export const postUserFavouriteRecipe = (request: Request, response: Response, next: NextFunction) => {
    const {
        user_id,
        recipe_id
    } = request.body;

    if (
        user_id === undefined ||
        recipe_id === undefined
    ) {
        return Promise.reject({ status: 400, msg: 'Invalid request - missing field(s).' });
    }

    checkUserExists(user_id)
    .catch((error: Error) => {
        next(error);
    });

    checkRecipeExists(recipe_id)
    .catch((error: Error) => {
        next(error);
    });

    createUserFavouriteRecipe(user_id, recipe_id)
    .then((user_favourite_recipe: UserFavouriteRecipe) => {
        return response.status(201).send({ user_favourite_recipe });
    })
    .catch((error: Error) => {
        next(error);
    });
}