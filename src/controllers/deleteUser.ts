import { NextFunction, Request, Response } from "express";
import { checkUserExists } from "../utils/checkUserExists";
import { removeUserById } from "../models/removeUserById";

export const deleteUser = async (request: Request, response: Response, next: NextFunction) => {
    const { user_id } = request.params;
    
    try {
        await checkUserExists(user_id);
        await removeUserById(user_id);

        return response.status(204).send();

    } catch (error) {
        next(error);
    }
}