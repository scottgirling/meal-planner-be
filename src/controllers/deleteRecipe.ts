import { NextFunction, Request, Response } from "express";
import { checkRecipeExists } from "../utils/checkRecipeExists";
import { checkRecipeIsPublic } from "../utils/checkRecipeIsPublic";
import { removeRecipeById } from "../models/removeRecipeById";

export const deleteRecipe = async (
    request: Request<{ recipe_id: string }>, 
    response: Response, 
    next: NextFunction
) => {
    const { recipe_id } = request.params;
    
    try {
        await checkRecipeExists(recipe_id);
        await checkRecipeIsPublic(recipe_id);
        await removeRecipeById(recipe_id);

        return response.status(204).send();

    } catch (error) {
        next(error);
    }
}