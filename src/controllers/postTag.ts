import { NextFunction, Request, Response } from "express";
import { createTag } from "../models/createTag";
import { Tag } from "../types";

export const postTag = (request: Request, response: Response, next: NextFunction) => {
    const {
        tag_name, 
        tag_slug
    } = request.body;

    createTag(tag_name, tag_slug)
    .then((tag: Tag) => {
        return response.status(201).send({ tag });
    });
}