import { NextFunction, Request, Response } from "express";
import { RecipeBody } from "../types/req-body/RecipeBody";
import { createRecipe } from "../models/createRecipe";
import { Recipe } from "../types";

export const postRecipe = async (
    request: Request<{}, {}, RecipeBody>, 
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