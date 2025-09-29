import { NextFunction, Request, Response } from "express";
import { findAllTags } from "../models/findAllTags.js";
import { Tag } from "../types/tag.js";

export const getTags = async (request: Request, response: Response, next: NextFunction) => {

    try {
        const tags: Tag[] = await findAllTags();

        response.status(200).send({ tags });
    } catch (error: unknown) {
        next(error);
    }
}