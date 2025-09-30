import { NextFunction, Request, Response } from "express";
import { createIngredient } from "../models/createIngredient";
import { Ingredient } from "../types";
import { checkUserExists } from "../utils/checkUserExists";
import { IngredientBody } from "../types/req-body/IngredientBody";

export const postIngredient = async (
    request: Request<{}, {}, IngredientBody>, 
    response: Response, 
    next: NextFunction
) => {
    const { 
        ingredient_name,
        ingredient_slug,
        ingredient_created_by
    } = request.body;

    if (ingredient_created_by === undefined) {
        return Promise.reject({ status: 400, msg: 'Invalid request - missing field(s).' });
    }

    if (
        (typeof ingredient_name !== "string" && ingredient_name !== undefined) || 
        (typeof ingredient_slug !== "string" && ingredient_slug !== undefined)
    ) {
        return Promise.reject({ status: 400, msg: "Invalid data type." });
    }

    try {
        await checkUserExists(ingredient_created_by);

        const ingredient: Ingredient = await createIngredient(
            ingredient_name,
            ingredient_slug,
            ingredient_created_by
        );

        response.status(201).send({ ingredient });
    } catch (error: unknown) {
        next(error);
    }
}