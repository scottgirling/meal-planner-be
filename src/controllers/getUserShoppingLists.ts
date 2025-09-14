import { NextFunction, Request, Response } from "express";
import { findShoppingListsByUserId } from "../models/findShoppingListsByUserId";
import { ShoppingListIngredient } from "../types";
import { checkUserExists } from "../utils/checkUserExists";

export const getUserShoppingLists = (request: Request, response: Response, next: NextFunction) => {
    const { user_id } = request.params;

    checkUserExists(user_id)
    .catch((error: Error) => {
        next(error);
    });

    findShoppingListsByUserId(user_id)
    .then((items: ShoppingListIngredient[]) => {
        return response.status(200).send({ items });
    })
    .catch((error: Error) => {
        next(error);
    });
}