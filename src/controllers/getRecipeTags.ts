import { NextFunction, Request, Response } from "express";
import { findTagsByRecipeId } from "../models/findTagsByRecipeId";
import { Tag } from "../types";

export const getRecipeTags = async (
    request: Request<{ recipe_id: string }>, 
    response: Response, 
    next: NextFunction
) => {
    const { recipe_id } = request.params;

    try {
        const tags: Tag[] = await findTagsByRecipeId(recipe_id);
        
        response.status(200).send({ tags });
    } catch (error: unknown) {
        next(error);
    }
}