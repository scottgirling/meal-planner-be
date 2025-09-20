import { NextFunction, Request, Response } from "express";
import { PoolClient } from "pg";
import db from "../db/connection.js";
import { createUserShoppingList } from "../models/createUserShoppingList";
import { findIngredientsForShoppingList } from "../models/findIngredientsForShoppingList.js";
import { createShoppingListIngredient } from "../models/createShoppingListIngredient.js";
import { checkUserExists } from "../utils/checkUserExists.js";
import { checkRecipeExists } from "../utils/checkRecipeExists.js";

export const postUserShoppingList = async (request: Request, response: Response, next: NextFunction) => {
    const { user_id } = request.params;
    const { 
        meal_plan_id, 
        recipe_ids
    } = request.body;

    if (
        meal_plan_id === undefined ||
        recipe_ids === undefined
    ) {
        return Promise.reject({ status: 400, msg: "Invalid request - missing field(s)." });
    }

    if (!Array.isArray(recipe_ids)) {
        return Promise.reject({ status: 400, msg: "Invalid data type." });
    }

    let newShoppingListId: (number | undefined) = 0;

    checkUserExists(user_id)
    .catch((error) => {
        next(error);
    });

    recipe_ids.forEach((recipe_id) => {
        checkRecipeExists(recipe_id)
        .catch((error) => {
            next(error);
        });
    });

    let client: PoolClient | undefined;

    try {
        client = await db.connect();
        client.query("BEGIN");

        const shopping_list = await createUserShoppingList(client, user_id, meal_plan_id);
        newShoppingListId = shopping_list.shopping_list_id;

        const ingredients = await findIngredientsForShoppingList(client, recipe_ids);

        const shopping_list_ingredients = await createShoppingListIngredient(client, newShoppingListId, ingredients);

        await client.query("COMMIT");

        return response.status(201).send({ shopping_list_ingredients });
    } catch (error) {
        if (client) {
            await client.query("ROLLBACK");
        }
        next(error);
    } finally {
        if (client) client.release();
    }
}