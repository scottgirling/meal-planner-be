import type { NextFunction, Request, Response } from "express";
import { CustomError } from "../types/custom-error";

import express from "express";
import cors from "cors";

export const app = express();

import { getEndpoints } from "../controllers/getEndpoints";
import { getTags } from "../controllers/getTags";
import { getRecipes } from "../controllers/getRecipes";
import { getRecipe } from "../controllers/getRecipe";
import { getRecipeIngredients } from "../controllers/getRecipeIngredients";
import { getRecipeTags } from "../controllers/getRecipeTags";
import { getUser } from "../controllers/getUser";
import { getUserFavouriteRecipes } from "../controllers/getUserFavouriteRecipes";
import { getUserMealPlans } from "../controllers/getUserMealPlans";
import { getUserShoppingLists } from "../controllers/getUserShoppingLists";
import { postRecipe } from "../controllers/postRecipe";
import { postRecipeTag } from "../controllers/postRecipeTag";
import { postTag } from "../controllers/postTag";
import { postRecipeIngredients } from "../controllers/postRecipeIngredients";
import { postIngredient } from "../controllers/postIngredient";
import { postUserFavouriteRecipe } from "../controllers/postUserFavouriteRecipe";
import { postUserMealPlan } from "../controllers/postUserMealPlan";
import { postUserShoppingList } from "../controllers/postUserShoppingList";
import { deleteRecipe } from "../controllers/deleteRecipe";
import { deleteUser } from "../controllers/deleteUser";
import { deleteUserFavouriteRecipe } from "../controllers/deleteUserFavouriteRecipe";
import { deleteUserShoppingList } from "../controllers/deleteUserShoppingList";
import { deleteUserMealPlan } from "../controllers/deleteUserMealPlan";

app.use(cors());
app.use(express.json());

app.get("/api", getEndpoints);
app.get("/api/tags", getTags);
app.get("/api/recipes", getRecipes);
app.get("/api/recipes/:recipe_id", getRecipe);
app.get("/api/recipes/:recipe_id/ingredients", getRecipeIngredients);
app.get("/api/recipes/:recipe_id/tags", getRecipeTags);
app.get("/api/users/:user_id", getUser);
app.get("/api/users/:user_id/favourite_recipes", getUserFavouriteRecipes);
app.get("/api/users/:user_id/meal_plans", getUserMealPlans);
app.get("/api/users/:user_id/shopping_lists", getUserShoppingLists);
app.post("/api/recipes", postRecipe);
app.post("/api/recipe_tags", postRecipeTag);
app.post("/api/tags", postTag);
app.post("/api/recipe_ingredients", postRecipeIngredients);
app.post("/api/ingredients", postIngredient);
app.post("/api/users/:user_id/favourite_recipes", postUserFavouriteRecipe);
app.post("/api/users/:user_id/meal_plans", postUserMealPlan);
app.post("/api/users/:user_id/shopping_lists", postUserShoppingList);
app.delete("/api/recipes/:recipe_id", deleteRecipe);
app.delete("/api/users/:user_id", deleteUser);
app.delete("/api/users/:user_id/favourite_recipes/:recipe_id", deleteUserFavouriteRecipe);
app.delete("/api/users/:user_id/shopping_lists/:shopping_list_id", deleteUserShoppingList);
app.delete("/api/users/:user_id/meal_plans/:meal_plan_id", deleteUserMealPlan);

app.use((error: CustomError, request: Request, response: Response, next: NextFunction) => {
    if (error.status && error.msg) {
        response.status(error.status).send({ msg: error.msg });
    }
    next(error);
});

app.use((error: CustomError, request: Request, response: Response, next: NextFunction) => {
    if (error.code === "42703" || error.code === "22P02") {
        response.status(400).send({ msg: "Invalid data type." });
    }
    next(error);
});

app.use((error: CustomError, request: Request, response: Response, next: NextFunction) => {
    if (error.code === "23502") {
        response.status(400).send({ msg: "Invalid request - missing field(s)." });
    }
    next(error);
});

app.use((error: CustomError, request: Request, response: Response, next: NextFunction) => {
    if (error.code === "23503") {
        response.status(404).send({ msg: "Invalid request - one or more ID not found." });
    }
    next(error);
});

app.use((error: CustomError, request: Request, response: Response, next: NextFunction) => {
    if (error.code === "23505") {
        response.status(409).send({ msg: "Identical data already exists in table." });
    }
    next(error);
})

app.use((error: CustomError, request: Request, response: Response, next: NextFunction) => {
    if (error.code === "42601") {
        response.status(400).send({ msg: "Incomplete data." });
    }
});