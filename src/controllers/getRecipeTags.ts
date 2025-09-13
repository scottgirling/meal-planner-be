import { NextFunction, Request, Response } from "express";
import { findTagsByRecipeId } from "../models/findTagsByRecipeId";
import { Tag } from "../types";

export const getRecipeTags = (request: Request, response: Response, next: NextFunction) => {
    const { recipe_id } = request.params;
    findTagsByRecipeId(recipe_id)
    .then((tags: Tag[]) => {
        return response.status(200).send({ tags });
    })
    .catch((error: Error) => {
        next(error);
    });
}