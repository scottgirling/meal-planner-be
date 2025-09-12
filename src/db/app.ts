import type { NextFunction, Request, Response } from "express";
import { CustomError } from "../types/custom-error";

import express from "express";
import cors from "cors";

export const app = express();

import { getEndpoints } from "../controllers/getEndpoints";
import { getTags } from "../controllers/getTags";
import { getRecipes } from "../controllers/getRecipes";
import { getRecipeById } from "../controllers/getRecipeById";
import { getIngredientsByRecipeId } from "../controllers/getIngredientsByRecipeId";
import { getTagsByRecipeId } from "../controllers/getTagsByRecipeId";
import { getUserById } from "../controllers/getUserById";

app.use(cors());

app.get("/api", getEndpoints);
app.get("/api/tags", getTags);
app.get("/api/recipes", getRecipes);
app.get("/api/recipes/:recipe_id", getRecipeById);
app.get("/api/recipes/:recipe_id/ingredients", getIngredientsByRecipeId);
app.get("/api/recipes/:recipe_id/tags", getTagsByRecipeId);
app.get("/api/users/:user_id", getUserById);

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