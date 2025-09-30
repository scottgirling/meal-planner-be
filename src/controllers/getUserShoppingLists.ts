import { NextFunction, Request, Response } from "express";
import { findShoppingListsByUserId } from "../models/findShoppingListsByUserId";
import { ShoppingListIngredient } from "../types";
import { checkUserExists } from "../utils/checkUserExists";

export const getUserShoppingLists = async (
    request: Request<{ user_id: string }>, 
    response: Response, 
    next: NextFunction
) => {
    const { user_id } = request.params;

    try {
        await checkUserExists(user_id);

        const items: ShoppingListIngredient[] = await findShoppingListsByUserId(user_id);

        response.status(200).send({ items });
    } catch (error: unknown) {
        next(error);
    }
}