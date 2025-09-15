import { NextFunction, Request, Response } from "express";
import { createRecipe } from "../models/createRecipe";
import { Recipe } from "../types";

export const postRecipe = (request: Request, response: Response, next: NextFunction) => {
    const { 
        recipe_name, 
        recipe_slug, 
        instructions, 
        prep_time, 
        cook_time, 
        votes, 
        servings, 
        recipe_created_by, 
        recipe_created_at, 
        recipe_last_updated_at, 
        recipe_img_url, 
        difficulty, 
        is_recipe_public 
    } = request.body;

    createRecipe(
        recipe_name, 
        recipe_slug, 
        instructions, 
        prep_time, 
        cook_time, 
        votes, 
        servings, 
        recipe_created_by, 
        recipe_created_at, 
        recipe_last_updated_at, 
        recipe_img_url, 
        difficulty, 
        is_recipe_public
    )
    .then((recipe: Recipe) => {
        return response.status(201).send({ recipe });
    })
    .catch((error: Error) => {
        next(error);
    });
}