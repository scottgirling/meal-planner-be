import { NextFunction, Request, Response } from "express";
import { PatchUserBody } from "../types/req-body/PatchUserBody";
import { InvalidRequestError } from "../types/errors";
import { checkUserExists } from "../utils/checkUserExists";
import { updateUserById } from "../models/updateUserById";

export const patchUser = async (
    request: Request<{ user_id: string }, {}, PatchUserBody>, 
    response: Response, 
    next: NextFunction
) => {
    const { user_id } = request.params;
    const {
        user_name,
        username,
        email,
        bio,
        avatar_url
    } = request.body;

    if (!Object.entries(request.body).length) {
        throw new InvalidRequestError("Invalid request - missing field(s).");
    }

    try {
        await checkUserExists(user_id);
        const user = await updateUserById(
            user_id, 
            user_name, 
            username, 
            email, 
            bio, 
            avatar_url
        );

        response.status(200).send({ user });
        
    } catch (error) {
        next(error);
    }
}