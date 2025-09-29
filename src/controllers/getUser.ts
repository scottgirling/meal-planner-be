import { NextFunction, Request, Response } from "express";
import { findUserById } from "../models/findUserById";
import { User } from "../types";

export const getUser = async (
    request: Request<{ user_id: string }>, 
    response: Response, 
    next: NextFunction
) => {
    const { user_id } = request.params;

    try {
        const user: User = await findUserById(user_id);

        response.status(200).send({ user });
    } catch (error: unknown) {
        next(error);
    }
}