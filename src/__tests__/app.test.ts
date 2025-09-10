import 'source-map-support/register';
import { app } from "../db/app.js";
import connection from "../db/connection.js";
import { seed } from "../db/seeds/seed.js";
import request from "supertest";
import endpointsJson from "../endpoints.json";
import * as testData from "../db/data/test-data/index.js";
import type {
    Ingredient,
    MealPlanRecipe,
    MealPlan,
    RecipeIngredient,
    RecipeTag,
    Recipe,
    ShoppingListIngredient,
    ShoppingList,
    Tag,
    UserFavouriteRecipe, 
    User
} from "../types/index.js";

beforeEach(async () => {
    await seed(testData);
});

afterAll(async () => {
    await connection.end();
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

describe("GET /api/tags", () => {
    test("200: responds with an array of tag objects, with the appropriate properties and status code", () => {
        return request(app)
        .get("/api/tags")
        .expect(200)
        .then((response) => {
            const { tags } = response.body as {
                tags: Tag[]
            }
            expect(Array.isArray(tags)).toBe(true);
            expect(tags.length).toBe(7);
            tags.forEach((tag) => {
                expect(tag).toHaveProperty("tag_id", expect.any(Number));
                expect(tag).toHaveProperty("tag_name", expect.any(String));
                expect(tag).toHaveProperty("tag_slug", expect.any(String));
                expect(tag).toHaveProperty("tag_created_at", expect.any(String));
                expect(tag).toHaveProperty("tag_last_updated_at", expect.any(String));
            });
        });
    });
});

describe("GET /api/recipes", () => {
    test("200: responds with an array of recipe objects, with the appropriate properties and status code", () => {
        return request(app)
        .get("/api/recipes")
        .expect(200)
        .then((response) => {
            const { recipes } = response.body as {
                recipes: Recipe[]
            }
            expect(Array.isArray(recipes)).toBe(true);
            expect(recipes.length).toBe(4);
            recipes.forEach((recipe) => {
                expect(recipe).toHaveProperty("recipe_id", expect.any(Number));
                expect(recipe).toHaveProperty("recipe_name", expect.any(String));
                expect(recipe).toHaveProperty("recipe_slug", expect.any(String));
                expect(recipe).toHaveProperty("instructions", expect.any(String));
                expect(recipe).toHaveProperty("prep_time", expect.any(Number));
                expect(recipe).toHaveProperty("cook_time", expect.any(Number));
                expect(recipe).toHaveProperty("votes", expect.any(Number));
                expect(recipe).toHaveProperty("servings", expect.any(Number));
                expect(recipe).toHaveProperty("recipe_created_by", expect.any(String));
                expect(recipe).toHaveProperty("recipe_created_at", expect.any(String));
                expect(recipe).toHaveProperty("recipe_last_updated_at", expect.any(String));
                expect(recipe).toHaveProperty("recipe_img_url", expect.any(String));
                expect(recipe).toHaveProperty("difficulty", expect.any(Number));
                expect(recipe).toHaveProperty("is_recipe_public", expect.any(Boolean));
            });
        });
    });
});