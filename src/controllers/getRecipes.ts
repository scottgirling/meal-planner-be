import { NextFunction, Request, Response } from "express";
import { selectRecipes } from "../models/selectRecipes";
import { Recipe } from "../types";
import { checkTagExists } from "../utils/checkTagExists";

export const getRecipes = (request: Request, response: Response, next: NextFunction) => {
    const { sort_by, order, tag, limit, p } = request.query as {
        sort_by?: string;
        order?: string;
        tag?: string;
        limit?: number;
        p?: number
    };

    if (tag) {
        if (Array.isArray(tag)) {
            tag.forEach((tag) => {
                checkTagExists(tag)
                .catch((error: Error) => {
                    next(error);
                });
            });
        } else {
            checkTagExists(tag)
            .catch((error: Error) => {
                next(error);
            });
        }
    }

    selectRecipes(sort_by, order, tag, limit, p)
    .then((recipes: Recipe[]) => {
        return response.status(200).send({ recipes });
    })
    .catch((error: Error) => {
        next(error);
    });
}