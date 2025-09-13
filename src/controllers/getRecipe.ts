import { NextFunction, Request, Response } from "express";
import { findRecipeById } from "../models/findRecipeById";
import { AdditionalRecipeInfo } from "../types";

export const getRecipe = (request: Request, response: Response, next: NextFunction) => {
    const { recipe_id } = request.params;
    findRecipeById(recipe_id)
    .then((recipe: AdditionalRecipeInfo) => {
        response.status(200).send({ recipe });
    })
    .catch((error: Error) => {
        next(error);
    });
}