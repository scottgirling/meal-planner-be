import { NextFunction, Request, Response } from "express";
import { TagBody } from "../types/req-body/TagBody";
import { createTag } from "../models/createTag";
import { Tag } from "../types";

export const postTag = async (
    request: Request<{}, {}, TagBody>, 
    response: Response, 
    next: NextFunction
) => {
    const {
        tag_name, 
        tag_slug
    } = request.body;

    if (
        (typeof tag_name !== "string" && tag_name !== undefined) || 
        (typeof tag_slug !== "string" && tag_slug !== undefined)
    ) {
        return Promise.reject({ status: 400, msg: "Invalid data type." });
    }

    try {
        const tag: Tag = await createTag(
            tag_name,
            tag_slug
        );

        response.status(201).send({ tag });
    } catch (error: unknown) {
        next(error);
    }
}