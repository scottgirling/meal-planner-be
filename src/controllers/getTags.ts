import { NextFunction, Request, Response } from "express";
import { findAllTags } from "../models/findAllTags.js";
import { Tag } from "../types/tag.js";

export const getTags = (request: Request, response: Response, next: NextFunction) => {
    findAllTags()
    .then((tags: Tag[]) => {
        response.status(200).send({ tags });
    });
}