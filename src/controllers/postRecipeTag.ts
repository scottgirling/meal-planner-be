import { NextFunction, Request, Response } from "express";
import { createRecipeTag } from "../models/createRecipeTag";
import { RecipeTag } from "../types";

export const postRecipeTag = (request: Request, response: Response, next: NextFunction) => {
    const { 
        recipe_id, 
        tag_ids 
    } = request.body;

    if (tag_ids === undefined) {
        return Promise.reject({ status: 400, msg: "Invalid request - missing field(s)." });
    }

    if (!Array.isArray(tag_ids)) {
        return Promise.reject({ status: 400, msg: "Invalid data type." });
    }

    createRecipeTag(recipe_id, tag_ids)
    .then((recipe_tags: RecipeTag[]) => {
        return response.status(201).send({ recipe_tags });
    })
    .catch((error: Error) => {
        next(error);
    });
}