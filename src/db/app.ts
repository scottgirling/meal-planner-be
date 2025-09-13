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

app.use(cors());

app.get("/api", getEndpoints);
app.get("/api/tags", getTags);
app.get("/api/recipes", getRecipes);
app.get("/api/recipes/:recipe_id", getRecipe);
app.get("/api/recipes/:recipe_id/ingredients", getRecipeIngredients);
app.get("/api/recipes/:recipe_id/tags", getRecipeTags);
app.get("/api/users/:user_id", getUser);
app.get("/api/users/:user_id/favourite_recipes", getUserFavouriteRecipes);
app.get("/api/users/:user_id/meal_plans", getUserMealPlans);

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
})