import { NextFunction, Request, Response } from "express";
import { checkRecipeExists } from "../utils/checkRecipeExists";
import { checkRecipeIsPublic } from "../utils/checkRecipeIsPublic";
import { removeRecipeById } from "../models/removeRecipeById";

export const deleteRecipe = (request: Request, response: Response, next: NextFunction) => {
    const { recipe_id } = request.params;

    checkRecipeExists(recipe_id)
    .catch((error) => {
        next(error);
    });

    checkRecipeIsPublic(recipe_id)
    .catch((error) => {
        next(error);
    });

    removeRecipeById(recipe_id)
    .then(() => {
        return response.status(204).send();
    })
    .catch((error) => {
        next(error);
    });
}