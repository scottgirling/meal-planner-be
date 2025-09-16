import { NextFunction, Request, Response } from "express";
import { createTag } from "../models/createTag";
import { Tag } from "../types";

export const postTag = (request: Request, response: Response, next: NextFunction) => {
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

    createTag(tag_name, tag_slug)
    .then((tag: Tag) => {
        return response.status(201).send({ tag });
    })
    .catch((error: Error) => {
        next(error);
    });
}