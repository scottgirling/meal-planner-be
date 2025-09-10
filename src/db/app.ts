import type { NextFunction, Request, Response } from "express";

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