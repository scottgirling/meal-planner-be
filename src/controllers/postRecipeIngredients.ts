import { NextFunction, Request, Response } from "express";
import { RecipeIngredientBody } from "../types/req-body/RecipeIngredientBody";
import { createRecipeIngredients } from "../models/createRecipeIngredients";
import { InvalidRequestError } from "../types/errors";

export const postRecipeIngredients = async (
    request: Request<{}, {}, RecipeIngredientBody>, 
    response: Response, 
    next: NextFunction
) => {
    const {
        recipe_id,
        ingredient_ids,
        quantity,
        unit
    } = request.body;

    if (
        ingredient_ids === undefined ||
        quantity === undefined ||
        unit === undefined
    ) {
        throw new InvalidRequestError("Invalid request - missing field(s).");
    }

    if (
        !Array.isArray(ingredient_ids) ||
        !Array.isArray(quantity) ||
        !Array.isArray(unit)
    ) {
        throw new InvalidRequestError("Invalid data type.");
    }

    try {
        if (ingredient_ids && ingredient_ids.length) {
            const recipe_ingredients = await createRecipeIngredients(
                recipe_id, 
                ingredient_ids, 
                quantity, 
                unit
            );

            return response.status(201).send({ recipe_ingredients });
        } 
        return Promise.reject({ status: 400, msg: "Incomplete data." });
    } catch (error) {
        next(error);
    }
}