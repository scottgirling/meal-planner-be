import { NextFunction, Request, Response } from "express";
import { createIngredient } from "../models/createIngredient";
import { Ingredient } from "../types";
import { checkUserExists } from "../utils/checkUserExists";

export const postIngredient = (request: Request, response: Response, next: NextFunction) => {
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

    checkUserExists(ingredient_created_by)
    .catch((error: Error) => {
        next(error);
    });

    createIngredient(
        ingredient_name, 
        ingredient_slug, 
        ingredient_created_by
    )
    .then((ingredient: Ingredient) => {
        return response.status(201).send({ ingredient} );
    })
    .catch((error: Error) => {
        next(error);
    });
}