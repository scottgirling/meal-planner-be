import { NextFunction, Request, Response } from "express";
import { findUserById } from "../models/findUserById";
import { User } from "../types";

export const getUser = (request: Request, response: Response, next: NextFunction) => {
    const { user_id } = request.params;
    findUserById(user_id)
    .then((user: User) => {
        return response.status(200).send({ user });
    })
    .catch((error: Error) => {
        next(error);
    });
}