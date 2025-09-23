import { NextFunction, Request, Response } from "express";
import { updateRecipeById } from "../models/updateRecipeById";

export const patchRecipe = async (request: Request, response: Response, next: NextFunction) => {
    const { recipe_id } = request.params;
    const { 
        recipe_name,
        instructions,
        prep_time,
        cook_time,
        servings,
        recipe_img_url,
        difficulty,
        is_recipe_public
    } = request.body;

    try {
        const recipe = await updateRecipeById(recipe_id, recipe_name, instructions, prep_time, cook_time, servings, recipe_img_url, difficulty, is_recipe_public);

        return response.status(200).send({ recipe });
    } catch {
    }
}