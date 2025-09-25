import { NextFunction, Request, Response } from "express";
import { updateUserById } from "../models/updateUserById";

export const patchUser = async (request: Request, response: Response, next: NextFunction) => {
    const { user_id } = request.params;
    const {
        user_name,
        username,
        email,
        bio,
        avatar_url
    } = request.body;

    try {
        const user = await updateUserById(user_id, user_name, username, email, bio, avatar_url);

        return response.status(200).send({ user });
        
    } catch (error) {

    }
}