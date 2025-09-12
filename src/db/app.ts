import type { NextFunction, Request, Response } from "express";
import { CustomError } from "../types/custom-error";

import express from "express";
import cors from "cors";

export const app = express();

import { getEndpoints } from "../controllers/getEndpoints";
import { getTags } from "../controllers/getTags";
import { getRecipes } from "../controllers/getRecipes";

app.use(cors());

app.get("/api", getEndpoints);
app.get("/api/tags", getTags);
app.get("/api/recipes", getRecipes);

app.use((error: CustomError, request: Request, response: Response, next: NextFunction) => {
    if (error.status && error.msg) {
        response.status(error.status).send({ msg: error.msg });
    }
    next(error);
});

app.use((error: CustomError, request: Request, response: Response, next: NextFunction) => {
    if (error.code === "42703") {
        response.status(400).send({ msg: "Invalid data type." });
    }
})