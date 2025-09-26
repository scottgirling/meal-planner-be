import { NextFunction, Request, Response } from "express";
import { findRecipeById } from "../models/findRecipeById";
import { AdditionalRecipeInfo } from "../types";

export const getRecipe = async (
    request: Request<{ recipe_id: string }>, 
    response: Response, 
    next: NextFunction
) => {
    const { recipe_id } = request.params;

    try {
        const recipe: AdditionalRecipeInfo = await findRecipeById(recipe_id);

        response.status(200).send({ recipe });
    } catch (error: unknown) {
        next(error);
    }
}