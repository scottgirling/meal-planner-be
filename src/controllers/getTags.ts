import { NextFunction, Request, Response } from "express";
import { selectTags } from "../models/selectTags.js";
import { Tag } from "../types/tag.js";

export const getTags = (request: Request, response: Response, next: NextFunction) => {
    selectTags()
    .then((tags: Tag[]) => {
        response.status(200).send({ tags });
    });
}