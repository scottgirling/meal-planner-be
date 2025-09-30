import { NextFunction, Request, Response } from "express";
import { RecipeTagBody } from "../types/req-body/RecipeTagBody";
import { createRecipeTag } from "../models/createRecipeTag";
import { RecipeTag } from "../types";

export const postRecipeTag = async (
    request: Request<{}, {}, RecipeTagBody>, 
    response: Response, 
    next: NextFunction
) => {
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

    try {
        const recipe_tags: RecipeTag[] = await createRecipeTag(
            recipe_id,
            tag_ids
        );

        response.status(201).send({ recipe_tags });
    } catch (error: unknown) {
        next(error);
    }
}