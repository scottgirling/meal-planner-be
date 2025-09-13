import { NextFunction, Request, Response } from "express";
import { findIngredientsByRecipeId } from "../models/findIngredientsByRecipeId";
import { RecipeIngredient } from "../types";

export const getRecipeIngredients = (request: Request, response: Response, next:NextFunction) => {
    const { recipe_id } = request.params;
    findIngredientsByRecipeId(recipe_id)
    .then((ingredients: RecipeIngredient[]) => {
        response.status(200).send({ ingredients });
    })
    .catch((error: Error) => {
        next(error);
    });
}