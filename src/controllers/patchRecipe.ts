import { NextFunction, Request, Response } from "express";
import { PoolClient } from "pg";
import db from "../db/connection.js";
import { PatchRecipeBody } from "../types/req-body/PatchRecipeBody.js";
import { InvalidRequestError } from "../types/errors.js";
import { checkRecipeExists } from "../utils/checkRecipeExists";
import { checkRecipeIsPublic } from "../utils/checkRecipeIsPublic";
import { updateRecipeById } from "../models/updateRecipeById";
import { removeRecipeIngredient } from "../models/removeRecipeIngredient.js";
import { createRecipeIngredients } from "../models/createRecipeIngredients.js";

export const patchRecipe = async (
    request: Request<{ recipe_id: string }, {}, PatchRecipeBody>, 
    response: Response, 
    next: NextFunction
) => {
    const { recipe_id } = request.params;
    const { 
        recipe_name,
        instructions,
        prep_time,
        cook_time,
        servings,
        recipe_img_url,
        difficulty,
        is_recipe_public,
        ingredientsToRemove,
        ingredientsToAdd,
        quantitiesToAdd,
        unitsToAdd
    } = request.body;

    if (!Object.entries(request.body).length) {
        throw new InvalidRequestError ("Invalid request - missing field(s).");
    }

    let client: PoolClient | undefined;

    try {
        client = await db.connect();
        client.query("BEGIN");

        await checkRecipeExists(recipe_id, client);
        await checkRecipeIsPublic(recipe_id, client);
        
        const updatedRecipe = await updateRecipeById(
            recipe_id, 
            recipe_name, 
            instructions, 
            prep_time, 
            cook_time, 
            servings, 
            recipe_img_url, 
            difficulty, 
            is_recipe_public, 
            client
        );

        const removedIngredients = await removeRecipeIngredient(
            recipe_id, 
            ingredientsToRemove, 
            client
        );
        
        const addedIngredients = await createRecipeIngredients(
            recipe_id, 
            ingredientsToAdd, 
            quantitiesToAdd, 
            unitsToAdd, 
            client
        );

        await client.query("COMMIT");

        response.status(200).send({ 
            updatedRecipe, 
            removedIngredients,
            addedIngredients
        });
    } catch (error) {
        if (client) {
            await client.query("ROLLBACK");
        }
        next(error);
    } finally {
        if (client) client.release();
    }
}