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
    describe("Queries", () => {
        describe("sort_by", () => {
            test("200: responds with an array of recipe objects sorted by a valid column with an appropriate status code", () => {
                return request(app)
                .get("/api/recipes?sort_by=prep_time")
                .expect(200)
                .then((response) => {
                    const { recipes } = response.body as {
                        recipes: Recipe[]
                    }
                    expect(recipes[0].prep_time).toBe(20);
                    expect(recipes[1].prep_time).toBe(15);
                    expect(recipes[2].prep_time).toBe(10);
                    expect(recipes[3].prep_time).toBe(5);
                });
            });
            test("200: responds with an array of recipe objects sorted by a default column ('votes') when one is not specifically selected, as well as an appropriate status code", () => {
                return request(app)
                .get("/api/recipes")
                .expect(200)
                .then((response) => {
                    const { recipes } = response.body as {
                        recipes: Recipe[]
                    }
                    expect(recipes[0].votes).toBe(7);
                    expect(recipes[1].votes).toBe(4);
                    expect(recipes[2].votes).toBe(3);
                    expect(recipes[3].votes).toBe(2);
                });
            });
            test("400: responds with an appropriate status code and error message when sorted by an invalid, non-existent column", () => {
                return request(app)
                .get("/api/recipes?sort_by=servings")
                .expect(400)
                .then((response) => {
                    const { msg } = response.body as {
                        msg: string
                    }
                    expect(msg).toBe("Invalid 'Sort By' or 'Order' query.");
                });
            });
        });
        describe("order", () => {
            test("200: responds with an ordered array of recipe objects given the 'order' query, as well as an appropriate status code", () => {
                return request(app)
                .get("/api/recipes?sort_by=votes&order=asc")
                .expect(200)
                .then((response) => {
                    const { recipes } = response.body as {
                        recipes: Recipe[]
                    }
                    expect(recipes[0].votes).toBe(2);
                    expect(recipes[1].votes).toBe(3);
                    expect(recipes[2].votes).toBe(4);
                    expect(recipes[3].votes).toBe(7);
                });
            });
            test("200: responds with an ordered array of recipe objects by a default value ('desc') when one is not specifically selected, as well as an appropriate status code", () => {
                return request(app)
                .get("/api/recipes?sort_by=votes")
                .expect(200)
                .then((response) => {
                    const { recipes } = response.body as {
                        recipes: Recipe[]
                    }
                    expect(recipes[0].votes).toBe(7);
                    expect(recipes[1].votes).toBe(4);
                    expect(recipes[2].votes).toBe(3);
                    expect(recipes[3].votes).toBe(2);
                });
            });
            test("200: responds with an appropriate status code and error message when ordered by an invalid, non-existent value", () => {
                return request(app)
                .get("/api/recipes?order=high-to-low")
                .expect(400)
                .then((response) => {
                    const { msg } = response.body as {
                        msg: string
                    }
                    expect(msg).toBe("Invalid 'Sort By' or 'Order' query.")
                });
            });
        });
        describe("filters", () => {
            describe("tags", () => {
                test("200: responds with a filtered array of event objects according to the 'tag' query, as well as an appropriate status code", () => {
                    return request(app)
                    .get("/api/recipes?tag=italian")
                    .expect(200)
                    .then((response) => {
                        const { recipes } = response.body as {
                            recipes: Recipe[]
                        }
                        const expectedOutput = [
                            {
                                "recipe_id": 1,
                                "recipe_name": "Spaghetti Carbonara",
                                "recipe_slug": "spaghetti-carbonara",
                                "instructions": "Boil pasta. Cook pancetta. Mix eggs and cheese. Combine everything and serve.",
                                "prep_time": 15,
                                "cook_time": 20,
                                "votes": 4,
                                "servings": 4,
                                "recipe_created_by": "e8c0d1b2-7f9b-4b9a-b38a-1f2e6239c123",
                                "recipe_created_at": "2025-08-15T14:23:00.000Z",
                                "recipe_last_updated_at": "2025-09-01T09:15:00.000Z",
                                "recipe_img_url": "https://example.com/images/spaghetti-carbonara.jpg",
                                "difficulty": 3,
                                "is_recipe_public": true
                            }
                        ]
                        expect(recipes.length).toBe(1);
                        expect(recipes).toEqual(expectedOutput);
                    });
                });
                test("200: responds with a filtered array of recipes objects according to the 'tag' queries when two or more are selected at the same time, as well as an appropriate status code", () => {
                    return request(app)
                    .get("/api/recipes?tag=italian&tag=healthy")
                    .expect(200)
                    .then((response) => {
                        const { recipes } = response.body as {
                            recipes: Recipe[]
                        }
                        expect(recipes.length).toBe(2)
                    });
                });
                test("200: responds with an empty array and an appropriate status code when passed a valid 'tag' query but no recipes currently exist on it", () => {
                    return request(app)
                    .get("/api/recipes?tag=vegetarian")
                    .expect(200)
                    .then((response) => {
                        const { recipes } = response.body as {
                            recipes: Recipe[]
                        }
                        expect(recipes.length).toBe(0);
                    });
                });
                test("404: responds with an appropriate status code and error message when passed a valid but non-existent 'tag' query", () => {
                    return request(app)
                    .get("/api/recipes?tag=pasta")
                    .expect(404)
                    .then((response) => {
                        const { msg } = response.body as {
                            msg: string
                        }
                        expect(msg).toBe("Tag does not exist.");
                    });
                });
            });
        });
    });
    describe("Pagination", () => {
        describe("limit", () => {
            test("200: responds with an array of recipe objects according to the 'limit' query, as well as an appropriate status code", () => {
                return request(app)
                .get("/api/recipes?limit=2")
                .expect(200)
                .then((response) => {
                    const { recipes } = response.body as {
                        recipes: Recipe[]
                    }
                    expect(recipes.length).toBe(2);
                });
            });
            test("200: responds with an array of recipe objects according to a default 'limit' query value (20) when one is not specifically selected, as well as an appropriate status code", () => {
                return request(app)
                .get("/api/recipes")
                .expect(200)
                .then((response) => {
                    const { recipes } = response.body as {
                        recipes: Recipe[]
                    }
                    expect(recipes.length).toBe(4);
                });
            });
            test("400: responds with an appropriate status code and error message when passed an invalid 'limit' query value", () => {
                return request(app)
                .get("/api/recipes?limit=two")
                .expect(400)
                .then((response) => {
                    const { msg } = response.body as {
                        msg: string
                    }
                    expect(msg).toBe("Invalid data type.");
                });
            });
        });
        describe("p", () => {
            test("200: responds with an array of recipe objects according to the 'p' query, as well as an appropriate status code", () => {
                return request(app)
                .get("/api/recipes?limit=2&p=2")
                .expect(200)
                .then((response) => {
                    const { recipes } = response.body as {
                        recipes: Recipe[]
                    }
                    expect(recipes.length).toBe(2);
                    expect(recipes[0].votes).toBe(3);
                    expect(recipes[1].votes).toBe(2);
                });
            });
            test("200: responds with an array of recipe objects according to a default 'p' query value ('1') when one is not specifically selected, as well as an appropriate status code", () => {
                return request(app)
                .get("/api/recipes?limit=2")
                .expect(200)
                .then((response) => {
                    const { recipes } = response.body as {
                        recipes: Recipe[]
                    }
                    expect(recipes.length).toBe(2);
                    expect(recipes[0].votes).toBe(7);
                    expect(recipes[1].votes).toBe(4);
                });
            });
            test("400: responds with an appropriate status code and error message when passed an invalid 'p' query value", () => {
                return request(app)
                .get("/api/recipes?p=three")
                .expect(400)
                .then((response) => {
                    const { msg } = response.body as {
                        msg: string
                    }
                    expect(msg).toBe("Invalid data type.");
                });
            });
            test("404: responds with an appropriate status code and error message when passed a valid but non-existent 'p' query value", () => {
                return request(app)
                .get("/api/recipes?p=45")
                .expect(404)
                .then((response) => {
                    const { msg } = response.body as {
                        msg: string
                    }
                    expect(msg).toBe("Page does not exist.");
                });
            });
        });
    });
});