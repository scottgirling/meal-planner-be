import { NextFunction, Request, Response } from "express";
import { selectUserFavouriteRecipes } from "../models/selectUserFavouriteRecipes"
import { Recipe } from "../types";
import { checkUserExists } from "../utils/checkUserExists";

export const getUserFavouriteRecipes = (request: Request, response: Response, next: NextFunction) => {
    const { user_id } = request.params;

    checkUserExists(user_id)
    .catch((error: Error) => {
        next(error);
    })

    selectUserFavouriteRecipes(user_id)
    .then((recipes: Recipe[]) => {
        return response.status(200).send({ recipes });
    })
    .catch((error: Error) => {
        next(error);
    });
}