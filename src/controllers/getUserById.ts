import { NextFunction, Request, Response } from "express";
import { selectUserById } from "../models/selectUserById";
import { User } from "../types";

export const getUserById = (request: Request, response: Response, next: NextFunction) => {
    const { user_id } = request.params;
    selectUserById(user_id)
    .then((user: User) => {
        return response.status(200).send({ user });
    })
    .catch((error: Error) => {
        next(error);
    });
}