import { NextFunction, Request, Response } from "express";
import { checkUserExists } from "../utils/checkUserExists";
import { checkShoppingListExists } from "../utils/checkShoppingListExists";
import { removeUserShoppingList } from "../models/removeUserShoppingList";

export const deleteUserShoppingList = async (
    request: Request<{ user_id: string, shopping_list_id: string }>, 
    response: Response, 
    next: NextFunction
) => {
    const {
        user_id, 
        shopping_list_id
    } = request.params;

    try {
        await checkUserExists(user_id);
        await checkShoppingListExists(shopping_list_id);
        await removeUserShoppingList(user_id, shopping_list_id)

        response.status(204).send();

    } catch (error) {
        next(error);
    }
}