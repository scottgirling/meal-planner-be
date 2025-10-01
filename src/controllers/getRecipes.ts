import { NextFunction, Request, Response } from "express";
import { RecipeQueryParams } from "../types/RecipeQueryParams";
import { checkTagExists } from "../utils/checkTagExists";
import { findAllRecipes } from "../models/findAllRecipes";
import { Recipe } from "../types";

export const getRecipes = async (
    request: Request<{}, {}, {}, RecipeQueryParams>, 
    response: Response, 
    next: NextFunction
) => {
    const { 
        sort_by, 
        order, 
        tag, 
        limit, 
        p 
    } = request.query;

    let parsedLimit: number | undefined;
    let parsedP: number | undefined;

    if (typeof limit === "string") {
        parsedLimit = limit ? parseInt(limit) : undefined;
    }

    if (typeof p === "string") {
        parsedP = p ? parseInt(p) : undefined;
    }

    
    try {
        if (tag) {
            if (typeof tag === "string") {
                await checkTagExists(tag);
            }
            else if (Array.isArray(tag) && tag.every(t => typeof t === "string")) {
                await Promise.all(tag.map(t => checkTagExists(t)));
            }
        }

        if (
            (typeof sort_by === "string" || sort_by === undefined) &&
            (typeof order === "string" || order === undefined) &&
            (typeof tag === "string" || (Array.isArray(tag) && tag.every(t => typeof t === "string")) || tag === undefined) &&
            (typeof parsedLimit === "number" || parsedLimit === undefined) &&
            (typeof parsedP === "number" || parsedP === undefined)
        ) {
            const recipes: Recipe[] = await findAllRecipes(sort_by, order, tag, parsedLimit, parsedP);

            response.status(200).send({ recipes });
        }
    } catch (error: unknown) {
        next(error);
    }
}