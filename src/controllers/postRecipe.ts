import { NextFunction, Request, Response } from "express";
import { PostRecipeBody } from "../types/req-body/PostRecipeBody";
import { createRecipe } from "../models/createRecipe";
import { Recipe } from "../types";

export const postRecipe = async (
    request: Request<{}, {}, PostRecipeBody>, 
    response: Response, 
    next: NextFunction
) => {
    const { 
        recipe_name, 
        recipe_slug, 
        instructions, 
        prep_time, 
        cook_time, 
        servings, 
        recipe_created_by, 
        recipe_img_url, 
        difficulty, 
        is_recipe_public 
    } = request.body;

    try {
        const recipe: Recipe = await createRecipe(
            recipe_name, 
            recipe_slug, 
            instructions, 
            prep_time, 
            cook_time, 
            servings, 
            recipe_created_by, 
            recipe_img_url, 
            difficulty, 
            is_recipe_public
        );

        response.status(201).send({ recipe });
    } catch (error: unknown) {
        next(error);
    }
}