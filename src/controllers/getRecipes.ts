import { NextFunction, Request, Response } from "express";
import { selectRecipes } from "../models/selectRecipes";
import { Recipe } from "../types";

export const getRecipes = (request: Request, response: Response, next: NextFunction) => {
    selectRecipes()
    .then((recipes: Recipe[]) => {
        return response.status(200).send({ recipes });
    });
}