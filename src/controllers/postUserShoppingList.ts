import { NextFunction, Request, Response } from "express";
import { UserShoppingListBody } from "../types/req-body/UserShoppingListBody.js";
import { PoolClient } from "pg";
import db from "../db/connection.js";
import { checkUserExists } from "../utils/checkUserExists.js";
import { checkRecipeExists } from "../utils/checkRecipeExists.js";
import { createUserShoppingList } from "../models/createUserShoppingList";
import { findIngredientsForShoppingList } from "../models/findIngredientsForShoppingList.js";
import { createShoppingListIngredient } from "../models/createShoppingListIngredient.js";
import { ShoppingList } from "../types/shopping-list.js";
import { RecipeIngredient } from "../types/recipe-ingredient.js";
import { ShoppingListIngredient } from "../types/shopping-list-ingredient.js";

export const postUserShoppingList = async (
    request: Request<{ user_id: string }, {}, UserShoppingListBody>, 
    response: Response, 
    next: NextFunction
) => {
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

    let client: PoolClient | undefined;

    try {
        await checkUserExists(user_id);
        await Promise.all(recipe_ids.map(recipe => checkRecipeExists(recipe)));

        client = await db.connect();
        client.query("BEGIN");

        const shopping_list: ShoppingList = await createUserShoppingList(user_id, meal_plan_id, client);
        newShoppingListId = shopping_list.shopping_list_id;

        const ingredients: RecipeIngredient[] = await findIngredientsForShoppingList(recipe_ids, client);

        const shopping_list_ingredients: ShoppingListIngredient[] = await createShoppingListIngredient(newShoppingListId, ingredients, client);

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