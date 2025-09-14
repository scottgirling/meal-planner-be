import { NextFunction, Request, Response } from "express";
import { createRecipe } from "../models/createRecipe";

export const postRecipe = (request: Request, response: Response, next: NextFunction) => {
    const { recipe_name } = request.body;

    createRecipe()
}