import type { NextFunction, Request, Response } from "express";

import express from "express";

export const app = express();

import cors from "cors";
app.use(cors());