import { NextFunction, Request, Response } from "express";
import { createRecipeIngredients } from "../models/createRecipeIngredients";
import { RecipeIngredient } from "../types";

export const postRecipeIngredients = (request: Request, response: Response, next: NextFunction) => {
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
        return Promise.reject({ status: 400, msg: 'Invalid request - missing field(s).' });
    }

    if (
        !Array.isArray(ingredient_ids) ||
        !Array.isArray(quantity) ||
        !Array.isArray(unit)
    ) {
        return Promise.reject({ status: 400, msg: "Invalid data type." });
    }

    createRecipeIngredients(recipe_id, ingredient_ids, quantity, unit)
    .then((recipe_ingredients: RecipeIngredient[]) => {
        return response.status(201).send({ recipe_ingredients });
    })
    .catch((error: Error) => {
        next(error);
    });
}