import { NextFunction, Request, Response } from "express";
import { RecipeTagBody } from "../types/req-body/RecipeTagBody";
import { InvalidRequestError } from "../types/errors";
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
        throw new InvalidRequestError("Invalid request - missing field(s).");
    }

    if (!Array.isArray(tag_ids)) {
        throw new InvalidRequestError("Invalid data type.");
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