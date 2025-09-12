import { NextFunction, Request, Response } from "express";
import { selectRecipeById } from "../models/selectRecipeById";
import { AdditionalRecipeInfo } from "../types";

export const getRecipeById = (request: Request, response: Response, next: NextFunction) => {
    const { recipe_id } = request.params;
    selectRecipeById(recipe_id)
    .then((recipe: AdditionalRecipeInfo) => {
        response.status(200).send({ recipe });
    })
    .catch((error: Error) => {
        next(error);
    });
}