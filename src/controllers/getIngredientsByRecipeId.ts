import { NextFunction, Request, Response } from "express";
import { selectIngredientsByRecipeId } from "../models/selectIngredientsByRecipeId";
import { RecipeIngredient } from "../types";

export const getIngredientsByRecipeId = (request: Request, response: Response, next:NextFunction) => {
    const { recipe_id } = request.params;
    selectIngredientsByRecipeId(recipe_id)
    .then((ingredients: RecipeIngredient[]) => {
        response.status(200).send({ ingredients });
    })
    .catch((error: Error) => {
        next(error);
    });
}