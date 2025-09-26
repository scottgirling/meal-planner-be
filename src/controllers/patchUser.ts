import { NextFunction, Request, Response } from "express";
import { checkUserExists } from "../utils/checkUserExists";
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

    if (!Object.entries(request.body).length) {
        throw {
            status: 400,
            msg: "Invalid request - missing field(s)."
        }
    }

    try {
        await checkUserExists(user_id);
        const user = await updateUserById(user_id, user_name, username, email, bio, avatar_url);

        return response.status(200).send({ user });
        
    } catch (error) {
        next(error);
    }
}