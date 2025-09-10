import type { NextFunction, Request, Response } from "express";

import { getEndpoints } from "../controllers/getEndpoints";

import express from "express";

export const app = express();

import cors from "cors";
app.use(cors());

app.get("/api", getEndpoints);