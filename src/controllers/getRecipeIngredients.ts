import { NextFunction, Request, Response } from "express";
import { findIngredientsByRecipeId } from "../models/findIngredientsByRecipeId";
import { RecipeIngredient } from "../types";

export const getRecipeIngredients = async (
    request: Request<{ recipe_id: string }>, 
    response: Response, 
    next:NextFunction
) => {
    const { recipe_id } = request.params;

    try {
        const ingredients: RecipeIngredient[] = await findIngredientsByRecipeId(recipe_id);

        response.status(200).send({ ingredients });
    } catch (error: unknown) {
        next(error);
    }
}