import { __dirname } from "../utils/paths.js";
import type { Config } from "../types/config.js";
import { Pool } from "pg";
import dotenv from "dotenv";

const ENV = process.env.NODE_ENV || "development";

dotenv.config({
    path: `${__dirname}/../../.env.${ENV}`
});

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
    throw new Error("PGDATABASE or DATABASE_URL not set");
}

const config: Config = {
    connectionString: undefined,
    max: undefined
};

if (ENV === "production") {
    config.connectionString = process.env.DATABASE_URL,
    config.max = 2
}

export default new Pool(config)