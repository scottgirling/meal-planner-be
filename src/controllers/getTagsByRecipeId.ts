import { NextFunction, Request, Response } from "express";
import { selectTagsByRecipeId } from "../models/selectTagsByRecipeId";
import { Tag } from "../types";

export const getTagsByRecipeId = (request: Request, response: Response, next: NextFunction) => {
    const { recipe_id } = request.params;
    selectTagsByRecipeId(recipe_id)
    .then((tags: Tag[]) => {
        return response.status(200).send({ tags });
    })
    .catch((error: Error) => {
        next(error);
    });
}