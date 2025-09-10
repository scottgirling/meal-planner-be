import 'source-map-support/register';
import { app } from "../db/app.js";
import connection from "../db/connection.js";
import { seed } from "../db/seeds/seed.js";
import request from "supertest";
import endpointsJson from "../endpoints.json";
import * as testData from "../db/data/test-data/index.js";

beforeEach(() => {
    return seed(testData);
});

afterAll(() => {
    return connection.end();
});

describe("GET /api", () => {
    test("200: responds with an object documenting each endpoint - including a description, example path and example response", () => {
        return request(app)
        .get("/api")
        .expect(200)
        .then((response) => {
            const { endpoints } = response.body as { endpoints: typeof endpointsJson }
            expect(endpoints).toEqual(endpointsJson);
        });
    });
});