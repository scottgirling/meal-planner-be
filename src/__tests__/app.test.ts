import 'source-map-support/register';
import db from "../db/connection.js";
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
    User,
    AdditionalRecipeInfo,
    UserMealPlanRecipe
} from "../types/index.js";

beforeEach(async () => {
    await db.query(`
        TRUNCATE recipes, recipe_tags, recipe_ingredients, meal_plan_recipes, user_favourite_recipes
        RESTART IDENTITY CASCADE;
    `);
    await seed(testData);
});

let num = 1;
afterEach(() => {
    console.log(`Test number ${num} complete.`);
    num++;
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

describe("GET /api/recipes/:recipe_id", () => {
    test("200: responds with an individual recipe object, with the appropriate properties (including from the 'users' table) and status code", () => {
        return request(app)
        .get("/api/recipes/1")
        .expect(200)
        .then((response) => {
            const { recipe } = response.body as {
                recipe: AdditionalRecipeInfo
            }
            const expectedOutput = {
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
                "is_recipe_public": true,
                "username": "alicej",
                "avatar_url": "https://example.com/avatars/alice.jpg",
            }
            expect(recipe).toEqual(expectedOutput);
        });
    });
    test("404: responds with an appropriate status code and error message when passed a valid but non-existent 'recipe_id'", () => {
        return request(app)
        .get("/api/recipes/12")
        .expect(404)
        .then((response) => {
            const { msg } = response.body as {
                msg: string
            }
            expect(msg).toBe("Recipe does not exist.");
        });
    });
    test("400: responds with an appropriate status code and error message when passed an invalid 'recipe_id'", () => {
        return request(app)
        .get("/api/recipes/one")
        .expect(400)
        .then((response) => {
            const { msg } = response.body as {
                msg: string
            }
            expect(msg).toBe("Invalid data type.");
        });
    });
});

describe("GET /api/recipes/:recipe_id/ingredients", () => {
    test("200: responds with an array of ingredient objects for the relevant recipe, as well as an appropriate status code", () => {
        return request(app)
        .get("/api/recipes/1/ingredients")
        .expect(200)
        .then((response) => {
            const { ingredients } = response.body as {
                ingredients: RecipeIngredient[]
            }
            const expectedOutput = [
                { "ingredient_name": "Spaghetti", "quantity": "400", "unit": "g" },
                { "ingredient_name": "Pancetta", "quantity": "150", "unit": "g" },
                { "ingredient_name": "Eggs", "quantity": "4", "unit": "pcs" },
                { "ingredient_name": "Parmesan Cheese", "quantity": "50", "unit": "g" },
                { "ingredient_name": "Black Pepper", "quantity": "1", "unit": "tsp" },
                { "ingredient_name": "Salt", "quantity": "0.5", "unit": "tsp" }
            ]
            expect(ingredients).toEqual(expectedOutput);
        });
    });
    test("404: responds with an appropriate status code and error message when passed a valid but non-existent 'recipe_id'", () => {
        return request(app)
        .get("/api/recipes/12/ingredients")
        .expect(404)
        .then((response) => {
            const { msg } = response.body as {
                msg: string
            }
            expect(msg).toBe("Recipe does not exist.");
        });
    });
    test("400: responds with an appropriate status code and error message when passed an invalid 'recipe_id'", () => {
        return request(app)
        .get("/api/recipes/one/ingredients")
        .expect(400)
        .then((response) => {
            const { msg } = response.body as {
                msg: string
            }
            expect(msg).toBe("Invalid data type.");
        });
    });
});

describe("GET /api/recipes/:recipe_id/tags", () => {
    test("200: responds with an array of tag objects for the relevant recipe, as well as an appropriate status code", () => {
        return request(app)
        .get("/api/recipes/3/tags")
        .expect(200)
        .then((response) => {
            const { tags } = response.body as {
                tags: Tag[]
            }
            const expectedOutput = [
                {
                    "tag_id": 3,
                    "tag_name": "Thai",
                    "tag_slug": "thai",
                    "tag_created_at": "2025-09-05T10:03:00.000Z",
                    "tag_last_updated_at": "2025-09-05T10:03:00.000Z"
                },
                {
                    "tag_id": 4,
                    "tag_name": "Curry",
                    "tag_slug": "curry",
                    "tag_created_at": "2025-09-05T10:04:00.000Z",
                    "tag_last_updated_at": "2025-09-05T10:04:00.000Z"
                }
            ]
            expect(tags).toEqual(expectedOutput);
        });
    });
    test("404: responds with an appropriate status code and error message when passed a valid but non-existent 'recipe_id'", () => {
        return request(app)
        .get("/api/recipes/12/tags")
        .expect(404)
        .then((response) => {
            const { msg } = response.body as {
                msg: string
            }
            expect(msg).toBe("Recipe does not exist.");
        });
    });
    test("400: responds with an appropriate status code and error message when passed an invalid 'recipe_id'", () => {
        return request(app)
        .get("/api/recipes/one/tags")
        .expect(400)
        .then((response) => {
            const { msg } = response.body as {
                msg: string
            }
            expect(msg).toBe("Invalid data type.");
        });
    });
});

describe("GET /api/users/:user_id", () => {
    test("200: responds with an individual user object, with the appropriate properties and status code", () => {
        return request(app)
        .get("/api/users/e8c0d1b2-7f9b-4b9a-b38a-1f2e6239c123")
        .expect(200)
        .then((response) => {
            const { user } = response.body as {
                user: User
            }
            const expectedOutput = {
                "user_id": "e8c0d1b2-7f9b-4b9a-b38a-1f2e6239c123",
                "user_name": "Alice Johnson",
                "username": "alicej",
                "email": "alice@example.com",
                "bio": "Food lover and amateur chef. Always exploring new cuisines.",
                "avatar_url": "https://example.com/avatars/alice.jpg",
                "user_created_at": "2025-07-12T10:15:30.000Z",
                "user_last_updated_at": "2025-09-01T08:00:00.000Z"
            }
            expect(user).toEqual(expectedOutput);
        });
    });
    test("404: responds with an appropriate status code and error message when passed a valid but non-existent 'user_id'", () => {
        return request(app)
        .get("/api/users/c5f2b8d6-3c5d-4d9f-b7c9-845b6a34f2c2")
        .expect(404)
        .then((response) => {
            const { msg } = response.body as {
                msg: string
            }
            expect(msg).toBe("User does not exist.");
        });
    });
    test("400: responds with an appropriate status code and error message when passed an invalid 'user_id'", () => {
        return request(app)
        .get("/api/users/scottgirling")
        .expect(400)
        .then((response) => {
            const { msg } = response.body as {
                msg: string
            }
            expect(msg).toBe("Invalid data type.");
        });
    });
});

describe("GET /api/users/:user_id/favourite_recipes", () => {
    test("200: responds with an array of recipe objects displaying the relevant user's favourite recipes, as well as an appropriate status code", () => {
        return request(app)
        .get("/api/users/e8c0d1b2-7f9b-4b9a-b38a-1f2e6239c123/favourite_recipes")
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
                },
                {
                    "recipe_id": 2,
                    "recipe_name": "Classic Pancakes",
                    "recipe_slug": "classic-pancakes",
                    "instructions": "Mix dry ingredients. Add milk and eggs. Cook on griddle until golden brown.",
                    "prep_time": 10,
                    "cook_time": 15,
                    "votes": 7,
                    "servings": 6,
                    "recipe_created_by": "5a7f5b89-df26-4c92-8f4e-9a2cbe742456",
                    "recipe_created_at": "2025-07-10T08:05:00.000Z",
                    "recipe_last_updated_at": "2025-08-30T11:42:00.000Z",
                    "recipe_img_url": "https://example.com/images/classic-pancakes.jpg",
                    "difficulty": 2,
                    "is_recipe_public": true
                },
                {
                    "recipe_id": 4,
                    "recipe_name": "Avocado Toast",
                    "recipe_slug": "avocado-toast",
                    "instructions": "Toast bread. Mash avocado with lemon juice, salt, and pepper. Spread on toast and serve.",
                    "prep_time": 5,
                    "cook_time": 0,
                    "votes": 3,
                    "servings": 2,
                    "recipe_created_by": "5a7f5b89-df26-4c92-8f4e-9a2cbe742456",
                    "recipe_created_at": "2025-09-01T07:30:00.000Z",
                    "recipe_last_updated_at": "2025-09-04T13:00:00.000Z",
                    "recipe_img_url": "https://example.com/images/avocado-toast.jpg",
                    "difficulty": 1,
                    "is_recipe_public": true
                }
            ]
            expect(recipes.length).toBe(3);
            expect(recipes).toEqual(expectedOutput);
        });
    });
    test("200: responds with an empty array and an appropriate status code when passed a valid 'user_id' but no 'favourites' currently exist on it", () => {
        return request(app)
        .get("/api/users/5a7f5b89-df26-4c92-8f4e-9a2cbe742456/favourite_recipes")
        .expect(200)
        .then((response) => {
            const { recipes } = response.body as {
                recipes: Recipe[]
            }
            expect(recipes.length).toBe(0);
            expect(recipes).toEqual([]);
        });
    });
    test("404: responds with an appropriate status code and error message when passed a valid but non-existent 'user_id'", () => {
        return request(app)
        .get("/api/users/c5f2b8d6-3c5d-4d9f-b7c9-845b6a34f2c2/favourite_recipes")
        .expect(404)
        .then((response) => {
            const { msg } = response.body as {
                msg: string
            }
            expect(msg).toBe("User does not exist.");
        });
    });
    test("400: responds with an appropriate status code and error message when passed an invalid 'user_id'", () => {
        return request(app)
        .get("/api/users/scottgirling/favourite_recipes")
        .expect(400)
        .then((response) => {
            const { msg } = response.body as {
                msg: string
            }
            expect(msg).toBe("Invalid data type.");
        });
    });
});

describe("GET /api/users/:user_id/meal_plans", () => {
    test("200: responds with an array of recipe objects (with each recipe belonging to a user's unique 'meal_plan') for the relevant user, as well as an appropriate status code", () => {
        return request(app)
        .get("/api/users/e8c0d1b2-7f9b-4b9a-b38a-1f2e6239c123/meal_plans")
        .expect(200)
        .then((response) => {
            const { meal_plans } = response.body as {
                meal_plans: UserMealPlanRecipe[]
            }
            const expectedOutput = [
                {
                    "meal_plan_id": 1,
                    "scheduled_date": "2025-10-10",
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
                },
                {
                    "meal_plan_id": 1,
                    "scheduled_date": "2025-10-11",
                    "recipe_id": 2,
                    "recipe_name": "Classic Pancakes",
                    "recipe_slug": "classic-pancakes",
                    "instructions": "Mix dry ingredients. Add milk and eggs. Cook on griddle until golden brown.",
                    "prep_time": 10,
                    "cook_time": 15,
                    "votes": 7,
                    "servings": 6,
                    "recipe_created_by": "5a7f5b89-df26-4c92-8f4e-9a2cbe742456",
                    "recipe_created_at": "2025-07-10T08:05:00.000Z",
                    "recipe_last_updated_at": "2025-08-30T11:42:00.000Z",
                    "recipe_img_url": "https://example.com/images/classic-pancakes.jpg",
                    "difficulty": 2,
                    "is_recipe_public": true
                }
            ]
            expect(meal_plans.length).toBe(2);
            expect(meal_plans).toEqual(expectedOutput);
        });
    });
    test("200: responds with an empty array and an appropriate status code when passed a valid 'user_id' but no 'meal_plans' currently exist on it", () => {
        return request(app)
        .get("/api/users/91b7c7e4-3f65-4c1e-92ad-6e4a734fced7/meal_plans")
        .expect(200)
        .then((response) => {
            const { meal_plans } = response.body as {
                meal_plans: UserMealPlanRecipe[]
            }
            expect(meal_plans.length).toBe(0);
            expect(meal_plans).toEqual([]);
        });
    });
    test("404: responds with an appropriate status code and error message when passed a valid but non-existent 'user_id'", () => {
        return request(app)
        .get("/api/users/c5f2b8d6-3c5d-4d9f-b7c9-845b6a34f2c2/meal_plans")
        .expect(404)
        .then((response) => {
            const { msg } = response.body as {
                msg: string
            }
            expect(msg).toBe("User does not exist.");
        });
    });
    test("400: responds with an appropriate status code and error message when passed an invalid 'user_id'", () => {
        return request(app)
        .get("/api/users/scottgirling/meal_plans")
        .expect(400)
        .then((response) => {
            const { msg } = response.body as {
                msg: string
            }
            expect(msg).toBe("Invalid data type.");
        });
    });
});

describe("GET /api/users/:user_id/shopping_lists", () => {
    test("200: responds with an array of shopping list ingredient objects (with each ingredient belonging to a user's unique 'shopping_list', as well as an appropriate status code", () => {
        return request(app)
        .get("/api/users/e8c0d1b2-7f9b-4b9a-b38a-1f2e6239c123/shopping_lists")
        .expect(200)
        .then((response) => {
            const { items } = response.body as {
                items: ShoppingListIngredient[]
            }
            const expectedOutput = [
                {
                    "shopping_list_ingredient_id": 1,
                    "shopping_list_id": 1,
                    "ingredient_id": 1,
                    "quantity": "400",
                    "unit": "g",
                    "is_checked_off": false,
                    "meal_plan_id": 1,
                    "ingredient_name": "Spaghetti"
                },
                {
                    "shopping_list_ingredient_id": 2,
                    "shopping_list_id": 1,
                    "ingredient_id": 2,
                    "quantity": "150",
                    "unit": "g",
                    "is_checked_off": false,
                    "meal_plan_id": 1,
                    "ingredient_name": "Pancetta"
                },
                {
                    "shopping_list_ingredient_id": 3,
                    "shopping_list_id": 1,
                    "ingredient_id": 3,
                    "quantity": "4",
                    "unit": "pcs",
                    "is_checked_off": false,
                    "meal_plan_id": 1,
                    "ingredient_name": "Eggs"
                },
                {
                    "shopping_list_ingredient_id": 4,
                    "shopping_list_id": 1,
                    "ingredient_id": 4,
                    "quantity": "50",
                    "unit": "g",
                    "is_checked_off": false,
                    "meal_plan_id": 1,
                    "ingredient_name": "Parmesan Cheese"
                },
                {
                    "shopping_list_ingredient_id": 5,
                    "shopping_list_id": 1,
                    "ingredient_id": 5,
                    "quantity": "1",
                    "unit": "tsp",
                    "is_checked_off": false,
                    "meal_plan_id": 1,
                    "ingredient_name": "Black Pepper"
                },
                {
                    "shopping_list_ingredient_id": 6,
                    "shopping_list_id": 1,
                    "ingredient_id": 6,
                    "quantity": "0.5",
                    "unit": "tsp",
                    "is_checked_off": false,
                    "meal_plan_id": 1,
                    "ingredient_name": "Salt"
                },
                {
                    "shopping_list_ingredient_id": 7,
                    "shopping_list_id": 1,
                    "ingredient_id": 7,
                    "quantity": "200",
                    "unit": "g",
                    "is_checked_off": false,
                    "meal_plan_id": 1,
                    "ingredient_name": "All-purpose Flour"
                },
                {
                    "shopping_list_ingredient_id": 8,
                    "shopping_list_id": 1,
                    "ingredient_id": 8,
                    "quantity": "2",
                    "unit": "tsp",
                    "is_checked_off": false,
                    "meal_plan_id": 1,
                    "ingredient_name": "Baking Powder"
                }
            ]
            expect(items.length).toBe(8);
            expect(items).toEqual(expectedOutput);
        });
    });
    test("200: responds with an empty array and an appropriate status code when passed a valid 'user_id' but no 'shopping_lists' currently exist on it", () => {
        return request(app)
        .get("/api/users/91b7c7e4-3f65-4c1e-92ad-6e4a734fced7/shopping_lists")
        .expect(200)
        .then((response) => {
            const { items } = response.body as {
                items: ShoppingListIngredient[]
            }
            expect(items.length).toBe(0);
            expect(items).toEqual([]);
        });
    });
    test("404: responds with an appropriate status code and error message when passed a valid but non-existent 'user_id'", () => {
        return request(app)
        .get("/api/users/c5f2b8d6-3c5d-4d9f-b7c9-845b6a34f2c2/shopping_lists")
        .expect(404)
        .then((response) => {
            const { msg } = response.body as {
                msg: string
            }
            expect(msg).toBe("User does not exist.");
        });
    });
    test("400: responds with an appropriate status code and error message when passed an invalid 'user_id", () => {
        return request(app)
        .get("/api/users/scottgirling/shopping_lists")
        .expect(400)
        .then((response) => {
            const { msg } = response.body as {
                msg: string
            }
            expect(msg).toBe("Invalid data type.");
        });
    });
});

describe("POST /api/recipes", () => {
    test("201: responds with the newly created recipe, with the appropriate properties and status code", () => {
        return request(app)
        .post("/api/recipes")
        .expect(201)
        .send({
            "recipe_name": "Grilled Chicken Salad",
            "recipe_slug": "grilled-chicken-salad",
            "instructions": "Grill chicken. Chop vegetables. Mix dressing. Combine and serve chilled.",
            "prep_time": 20,
            "cook_time": 15,
            "votes": 0,
            "servings": 2,
            "recipe_created_by": "e8c0d1b2-7f9b-4b9a-b38a-1f2e6239c123",
            "recipe_img_url": "https://example.com/images/grilled-chicken-salad.jpg",
            "difficulty": 2,
            "is_recipe_public": true
        })
        .then((response) => {
            const { recipe } = response.body as {
                recipe: Recipe
            }
            expect(recipe).toHaveProperty("recipe_id", 5);
            expect(recipe).toHaveProperty("recipe_name", "Grilled Chicken Salad");
            expect(recipe).toHaveProperty("recipe_slug", "grilled-chicken-salad");
            expect(recipe).toHaveProperty("instructions", "Grill chicken. Chop vegetables. Mix dressing. Combine and serve chilled.");
            expect(recipe).toHaveProperty("prep_time", 20);
            expect(recipe).toHaveProperty("cook_time", 15);
            expect(recipe).toHaveProperty("votes", 0);
            expect(recipe).toHaveProperty("servings", 2);
            expect(recipe).toHaveProperty("recipe_created_by", "e8c0d1b2-7f9b-4b9a-b38a-1f2e6239c123");
            expect(recipe).toHaveProperty("recipe_img_url", "https://example.com/images/grilled-chicken-salad.jpg");
            expect(recipe).toHaveProperty("difficulty", 2);
            expect(recipe).toHaveProperty("is_recipe_public", true);
            expect(recipe).toHaveProperty("recipe_created_at", expect.any(String));
            expect(recipe).toHaveProperty("recipe_last_updated_at", expect.any(String));
            expect(Object.entries(recipe).length).toBe(14);
        });
    });
    test("201: responds with the newly created recipe object when the 'recipe_img_url' has been omitted from the request body, as well as an appropriate status code", () => {
        return request(app)
        .post("/api/recipes")
        .expect(201)
        .send({
            "recipe_name": "Grilled Chicken Salad",
            "recipe_slug": "grilled-chicken-salad",
            "instructions": "Grill chicken. Chop vegetables. Mix dressing. Combine and serve chilled.",
            "prep_time": 20,
            "cook_time": 15,
            "votes": 0,
            "servings": 2,
            "recipe_created_by": "e8c0d1b2-7f9b-4b9a-b38a-1f2e6239c123",
            "difficulty": 2,
            "is_recipe_public": true
        })
        .then((response) => {
            const { recipe } = response.body as {
                recipe: Recipe
            }
            expect(recipe.recipe_img_url).toBeNull();
        });
    });
    test("400: responds with an appropriate status code and error message when the request body does not contain the correct fields", () => {
        return request(app)
        .post("/api/recipes")
        .expect(400)
        .send({
            "recipe_name": "Grilled Chicken Salad"
        })
        .then((response) => {
            const { msg } = response.body as {
                msg: string
            }
            expect(msg).toBe("Invalid request - missing field(s).");
        });
    });
    test("400: responds with an appropriate status code and error message when the request body contains the correct fields but one or more field contain an invalid data type", () => {
        return request(app)
        .post("/api/recipes")
        .expect(400)
        .send({
            "recipe_name": "Grilled Chicken Salad",
            "recipe_slug": "grilled-chicken-salad",
            "instructions": "Grill chicken. Chop vegetables. Mix dressing. Combine and serve chilled.",
            "prep_time": 20,
            "cook_time": 15,
            "votes": 0,
            "servings": "two",
            "recipe_created_by": "e8c0d1b2-7f9b-4b9a-b38a-1f2e6239c123",
            "recipe_img_url": "https://example.com/images/grilled-chicken-salad.jpg",
            "difficulty": 2,
            "is_recipe_public": true
        })
        .then((response) => {
            const { msg } = response.body as {
                msg: string
            }
            expect(msg).toBe("Invalid data type.");
        });
    });
});

describe("POST /api/recipe_tags", () => {
    test("201: responds with the newly created recipe-tag entry when a single tag is added to a recipe, as well as an appropriate status code", () => {
        return request(app)
        .post("/api/recipe_tags")
        .expect(201)
        .send({
            "recipe_id": 1,
            "tag_ids": [6]
        })
        .then((response) => {
            const { recipe_tags } = response.body as {
                recipe_tags: RecipeTag
            }
            const expectedOutput = [
                {
                    "recipe_id": 1,
                    "tag_id": 6
                }
            ]
            expect(recipe_tags).toEqual(expectedOutput);
        });
    });
    test("201: responds with the newly created recipe-tag entries when more than one tag is added to a recipe, as well as an appropriate status code", () => {
        return request(app)
        .post("/api/recipe_tags")
        .expect(201)
        .send({
            "recipe_id": 1,
            "tag_ids": [2, 3, 4]
        })
        .then((response) => {
            const { recipe_tags } = response.body as {
                recipe_tags: RecipeTag[]
            }
            const expectedOutput = [
                {
                    "recipe_id": 1,
                    "tag_id": 2
                },
                {
                    "recipe_id": 1,
                    "tag_id": 3
                },
                {
                    "recipe_id": 1,
                    "tag_id": 4
                }
            ]
            expect(recipe_tags).toEqual(expectedOutput);
        });
    });
    test("400: responds with an appropriate status code and error message when the request body does not contain the correct fields", () => {
        return request(app)
        .post("/api/recipe_tags")
        .expect(400)
        .send({
            "recipe_id": 1
        })
        .then((response) => {
            const { msg } = response.body as {
                msg: string
            }
            expect(msg).toBe("Invalid request - missing field(s).");
        });
    });
    test("400: responds with an appropriate status code and error message when the request body contains the correct fields but one or more field contain an invalid data type", () => {
        return request(app)
        .post("/api/recipe_tags")
        .expect(400)
        .send({
            "recipe_id": 1, 
            "tag_ids": 6
        })
        .then((response) => {
            const { msg } = response.body as {
                msg: string
            }
            expect(msg).toBe("Invalid data type.");
        });
    });
    test("400: responds with an appropriate status code and error message when the 'tag_ids' field is an empty array", () => {
        return request(app)
        .post("/api/recipe_tags")
        .expect(400)
        .send({
            "recipe_id": 1,
            "tag_ids": []
        })
        .then((response) => {
            const { msg } = response.body as {
                msg: string
            }
            expect(msg).toBe("Incomplete data.");
        });
    });
    test("404: responds with an appropriate status code and error message when the request body contains a valid but non-existent 'recipe' or 'tag' id", () => {
        return request(app)
        .post("/api/recipe_tags")
        .expect(404)
        .send({
            "recipe_id": 1,
            "tag_ids": [11, 12]
        })
        .then((response) => {
            const { msg } = response.body as {
                msg: string
            }
            expect(msg).toBe("Invalid request - one or more ID not found.");
        });
    });
});

describe("POST /api/tags", () => {
    test("201: responds with the newly created 'tag' object, as well as an appropriate status code", () => {
        return request(app)
        .post("/api/tags")
        .expect(201)
        .send({
            "tag_name": "Stir Fry",
            "tag_slug": "stir-fry"
        })
        .then((response) => {
            const { tag } = response.body as {
                tag: Tag
            }
            expect(tag).toHaveProperty("tag_name", "Stir Fry");
            expect(tag).toHaveProperty("tag_slug", "stir-fry");
            expect(tag).toHaveProperty("tag_created_at", expect.any(String));
            expect(tag).toHaveProperty("tag_last_updated_at", expect.any(String));
            expect(Object.entries(tag).length).toBe(5);
        });
    });
    test("400: responds with an appropriate status code and error message when the request body does not contain the correct fields", () => {
        return request(app)
        .post("/api/tags")
        .expect(400)
        .send({ 
            "tag_name": "Stir Fry"
        })
        .then((response) => {
            const { msg } = response.body as {
                msg: string
            }
            expect(msg).toBe("Invalid request - missing field(s).");
        });
    });
    test("400: responds with an appropriate status code and error message when the request body contains the correct fields but one or more field contain an invalid data type", () => {
        return request(app)
        .post("/api/tags")
        .expect(400)
        .send({
            "tag_name": "Stir Fry",
            "tag_slug": 4
        })
        .then((response) => {
            const { msg } = response.body as {
                msg: string
            }
            expect(msg).toBe("Invalid data type.");
        });
    });
});

describe("POST /api/recipe_ingredients", () => {
    test("201: responds with the newly created recipe-ingredient entry when a single ingredient is added to a recipe, as well as an appropriate status code", () => {
        return request(app)
        .post("/api/recipe_ingredients")
        .expect(201)
        .send({ 
            "recipe_id": 3,
            "ingredient_ids": [21],
            "quantity": [3],
            "unit": ["slices"]
        })
        .then((response) => {
            const { recipe_ingredients } = response.body as {
                recipe_ingredients: RecipeIngredient[]
            }
            const expectedOutput = [
                {
                    "recipe_ingredient_id": 26,
                    "recipe_id": 3, 
                    "ingredient_id": 21, 
                    "quantity": "3", 
                    "unit": "slices" 
                }
            ]
            expect(recipe_ingredients).toEqual(expectedOutput);
        });
    });
    test("201: responds with the newly created recipe-ingredient entries when more than one ingredient is added to a recipe, as well as an appropriate status code", () => {
        return request(app)
        .post("/api/recipe_ingredients")
        .expect(201)
        .send({
            "recipe_id": 3,
            "ingredient_ids": [21, 23],
            "quantity": [3, 1],
            "unit": ["slices", "tbsp"]
        })
        .then((response) => {
            const { recipe_ingredients } = response.body as {
                recipe_ingredients: RecipeIngredient[]
            }
            const expectedOutput = [
                {
                    "recipe_ingredient_id": 26,
                    "recipe_id": 3, 
                    "ingredient_id": 21, 
                    "quantity": "3", 
                    "unit": "slices" 
                },
                {
                    "recipe_ingredient_id": 27,
                    "recipe_id": 3, 
                    "ingredient_id": 23, 
                    "quantity": "1", 
                    "unit": "tbsp" 
                }
            ]
            expect(recipe_ingredients).toEqual(expectedOutput);
        });
    });
    test("400: responds with an appropriate status code and error message when the request body does not contain the correct fields", () => {
        return request(app)
        .post("/api/recipe_ingredients")
        .expect(400)
        .send({
            "recipe_id": 3,
            "ingredient_ids": [21],
            "quantity": [3]
        })
        .then((response) => {
            const { msg } = response.body as {
                msg: string
            }
            expect(msg).toBe("Invalid request - missing field(s).");
        });
    });
    test("400: responds with an appropriate status code and error message when the request body contains the correct fields but one or more field contain an invalid data type", () => {
        return request(app)
        .post("/api/recipe_ingredients")
        .expect(400)
        .send({
            "recipe_id": 3,
            "ingredient_ids": 21,
            "quantity": [3],
            "unit": ["slices"]
        })
        .then((response) => {
            const { msg } = response.body as {
                msg: string
            }
            expect(msg).toBe("Invalid data type.");
        });
    });
    test("400: responds with an appropriate status code and error message when the 'ingredient_ids' field is an empty array", () => {
        return request(app)
        .post("/api/recipe_ingredients")
        .expect(400)
        .send({
            "recipe_id": 3,
            "ingredient_ids": [],
            "quantity": [3],
            "unit": ["slices"]
        })
        .then((response) => {
            const { msg } = response.body as {
                msg: string
            }
            expect(msg).toBe("Incomplete data.");
        });
    });
    test("404: responds with an appropriate status code and error message when the request body contains a valid but non-existent 'recipe' or 'ingredient' id", () => {
        return request(app)
        .post("/api/recipe_ingredients")
        .expect(404)
        .send({
            "recipe_id": 3,
            "ingredient_ids": [50],
            "quantity": [3],
            "unit": ["slices"]
        })
        .then((response) => {
            const { msg } = response.body as {
                msg: string
            }
            expect(msg).toBe("Invalid request - one or more ID not found.");
        });
    });
});

describe("POST /api/ingredients", () => {
    test("201: responds with the newly created 'ingredient' object, as well as an appropriate status code", () => {
        return request(app)
        .post("/api/ingredients")
        .expect(201)
        .send({
            "ingredient_name": "Mushrooms",
            "ingredient_slug": "mushrooms",
            "ingredient_created_by": "e8c0d1b2-7f9b-4b9a-b38a-1f2e6239c123"
        })
        .then((response) => {
            const { ingredient } = response.body as {
                ingredient: Ingredient
            }
            expect(ingredient).toHaveProperty("ingredient_id", 24);
            expect(ingredient).toHaveProperty("ingredient_name", "Mushrooms");
            expect(ingredient).toHaveProperty("ingredient_slug", "mushrooms");
            expect(ingredient).toHaveProperty("ingredient_created_at", expect.any(String));
            expect(ingredient).toHaveProperty("ingredient_last_updated_at", expect.any(String));
            expect(ingredient).toHaveProperty("ingredient_created_by", "e8c0d1b2-7f9b-4b9a-b38a-1f2e6239c123");
            expect(Object.entries(ingredient).length).toBe(6);
        });
    });
    test("400: responds with an appropriate status code and error message when the request body does not contain the correct fields", () => {
        return request(app)
        .post("/api/ingredients")
        .expect(400)
        .send({
            "ingredient_name": "Mushrooms",
            "ingredient_slug": "mushrooms"
        })
        .then((response) => {
            const { msg } = response.body as {
                msg: string
            }
            expect(msg).toBe("Invalid request - missing field(s).");
        });
    });
    test("400: responds with an appropriate status code and error message when the request body contains the correct fields but one or more field contain an invalid data type", () => {
        return request(app)
        .post("/api/ingredients")
        .expect(400)
        .send({
            "ingredient_name": 4567,
            "ingredient_slug": 4567,
            "ingredient_created_by": "e8c0d1b2-7f9b-4b9a-b38a-1f2e6239c123"
        })
        .then((response) => {
            const { msg } = response.body as {
                msg: string
            }
            expect(msg).toBe("Invalid data type.");
        });
    });
    test("404: responds with an appropriate status code and error message when passed a valid but non-existent 'ingredient_created_by' value", () => {
        return request(app)
        .post("/api/ingredients")
        .expect(404)
        .send({
            "ingredient_name": "Mushrooms",
            "ingredient_slug": "mushrooms",
            "ingredient_created_by": "c5f2b8d6-3c5d-4d9f-b7c9-845b6a34f2c2"
        })
        .then((response) => {
            const { msg } = response.body as {
                msg: string
            }
            expect(msg).toBe("User does not exist.");
        });
    });
});

describe("POST /api/users/:user_id/favourite_recipes", () => {
    test("201: responds with the newly created 'user-favourite-recipe' entry, as well as an appropriate status code", () => {
        return request(app)
        .post("/api/users/e8c0d1b2-7f9b-4b9a-b38a-1f2e6239c123/favourite_recipes")
        .expect(201)
        .send({
            "recipe_id": 3
        })
        .then((response) => {
            const { user_favourite_recipe } = response.body as {
                user_favourite_recipe: UserFavouriteRecipe
            }
            const expectedOutput = {
                "user_id": "e8c0d1b2-7f9b-4b9a-b38a-1f2e6239c123",
                "recipe_id": 3
            }
            expect(user_favourite_recipe).toEqual(expectedOutput);
        });
    });
    test("409: responds with an appropriate status code and error message when passed data that already exists in the 'user_favourite_recipes' table (i.e. where a user 'favourites' a recipe they have already favourited", () => {
        return request(app)
        .post("/api/users/e8c0d1b2-7f9b-4b9a-b38a-1f2e6239c123/favourite_recipes")
        .expect(409)
        .send({
            "recipe_id": 4
        })
        .then((response) => {
            const { msg } = response.body as {
                msg: string
            }
            expect(msg).toBe("Identical data already exists in table.");
        });
    });
    test("400: responds with an appropriate status code and error message when the request body does not contain the correct fields", () => {
        return request(app)
        .post("/api/users/e8c0d1b2-7f9b-4b9a-b38a-1f2e6239c123/favourite_recipes")
        .expect(400)
        .send({})
        .then((response) => {
            const { msg } = response.body as {
                msg: string
            }
            expect(msg).toBe("Invalid request - missing field(s).");
        });
    });
    test("404: responds with an appropriate status code and error message when the request body contains a valid but non-existent 'user_id'", () => {
        return request(app)
        .post("/api/users/c5f2b8d6-3c5d-4d9f-b7c9-845b6a34f2c2/favourite_recipes")
        .expect(404)
        .send({
            "recipe_id": 1
        })
        .then((response) => {
            const { msg } = response.body as {
                msg: string
            }
            expect(msg).toBe("User does not exist.");
        });
    });
    test("404: responds with an appropriate status code and error message when the request body contains a valid but non-existent 'recipe_id'", () => {
        return request(app)
        .post("/api/users/e8c0d1b2-7f9b-4b9a-b38a-1f2e6239c123/favourite_recipes")
        .expect(404)
        .send({
            "recipe_id": 8
        })
        .then((response) => {
            const { msg } = response.body as {
                msg: string
            }
            expect(msg).toBe("Recipe does not exist.");
        });
    });
});

describe("POST /api/users/:user_id/meal_plans", () => {
    test("201: each new 'meal-plan-recipe' entry contains the newly created 'meal_plan_id', as well as an appropriate status code", () => {
        return request(app)
        .post("/api/users/e8c0d1b2-7f9b-4b9a-b38a-1f2e6239c123/meal_plans")
        .expect(201)
        .send({
            "recipe_ids": [1, 4],
            "scheduled_dates": ["2025-10-17", "2025-10-18"]
        })
        .then((response) => {
            const { formatted_meal_plan_recipes } = response.body as {
                formatted_meal_plan_recipes: MealPlanRecipe[]
            }
            formatted_meal_plan_recipes.forEach((entry) => {
                expect(entry.meal_plan_id).toBe(3);
            });
        });
    });
    test("201: responds with the newly created 'meal-plan-recipe' entries, as well as an appropriate status code", () => {
        return request(app)
        .post("/api/users/e8c0d1b2-7f9b-4b9a-b38a-1f2e6239c123/meal_plans")
        .expect(201)
        .send({
            "recipe_ids": [1, 4],
            "scheduled_dates": ["2025-10-17", "2025-10-18"]
        })
        .then((response) => {
            const { formatted_meal_plan_recipes } = response.body as {
                formatted_meal_plan_recipes: MealPlanRecipe[]
            }
            const expectedOutput = [
                {
                    "meal_plan_recipe_id": 5,
                    "meal_plan_id": 3,
                    "recipe_id": 1,
                    "scheduled_date": "2025-10-17"
                },
                {
                    "meal_plan_recipe_id": 6,
                    "meal_plan_id": 3,
                    "recipe_id": 4,
                    "scheduled_date": "2025-10-18"
                }
            ]
            expect(formatted_meal_plan_recipes).toEqual(expectedOutput);
        });
    });
    test("400: responds with an appropriate status code and error message when passed an invalid 'user_id'", () => {
        return request(app)
        .post("/api/users/scottgirling/meal_plans")
        .expect(400)
        .send({
            "recipe_ids": [1, 4],
            "scheduled_dates": ["2025-10-17", "2025-10-18"]
        })
        .then((response) => {
            const { msg } = response.body as {
                msg: string
            }
            expect(msg).toBe("Invalid data type.");
        });
    });
    test("404: responds with an appropriate status code and error message when passed a valid but non-existent 'user_id'", () => {
        return request(app)
        .post("/api/users/c5f2b8d6-3c5d-4d9f-b7c9-845b6a34f2c2/meal_plans")
        .expect(404)
        .send({
            "recipe_ids": [1, 4],
            "scheduled_dates": ["2025-10-17", "2025-10-18"]
        })
        .then((response) => {
            const { msg } = response.body as {
                msg: string
            }
            expect(msg).toBe("User does not exist.");
        });
    });
    test("400: responds with an appropriate status code and error message when the request body does not contain the correct fields", () => {
        return request(app)
        .post("/api/users/e8c0d1b2-7f9b-4b9a-b38a-1f2e6239c123/meal_plans")
        .expect(400)
        .send({
            "recipe_ids": [1, 4]
        })
        .then((response) => {
            const { msg } = response.body as {
                msg: string
            }
            expect(msg).toBe("Invalid request - missing field(s).");
        });
    });
    test("400: responds with an appropriate status code and error message when the request body contains the correct fields but one or more field contain an invalid data type", () => {
        return request(app)
        .post("/api/users/e8c0d1b2-7f9b-4b9a-b38a-1f2e6239c123/meal_plans")
        .expect(400)
        .send({
            "recipe_ids": 1,
            "scheduled_dates": ["2025-10-17"]
        })
        .then((response) => {
            const { msg } = response.body as {
                msg: string
            }
            expect(msg).toBe("Invalid data type.");
        });
    });
    test("400: responds with an appropriate status code and error message when the 'recipe_ids' or 'scheduled_dates' field is an empty array", () => {
        return request(app)
        .post("/api/users/e8c0d1b2-7f9b-4b9a-b38a-1f2e6239c123/meal_plans")
        .expect(400)
        .send({
            "recipe_ids": [],
            "scheduled_dates": []
        })
        .then((response) => {
            const { msg } = response.body as {
                msg: string
            }
            expect(msg).toBe("Incomplete data.");
        });
    });
    test("404: responds with an appropriate status code and error message when the request body contains a valid but non-existent 'recipe_id'", () => {
        return request(app)
        .post("/api/users/e8c0d1b2-7f9b-4b9a-b38a-1f2e6239c123/meal_plans")
        .expect(404)
        .send({
            "recipe_ids": [1, 14],
            "scheduled_dates": ["2025-10-17", "2025-10-18"]
        })
        .then((response) => {
            const { msg } = response.body as {
                msg: string
            }
            expect(msg).toBe("Recipe does not exist.");
        });
    });
});

describe("POST /api/users/:user_id/shopping_lists", () => {
    test("201: each new 'shopping-list-ingredient' entry contains the newly created 'shopping_list_id', as well as an appropriate status code", () => {
        return request(app)
        .post("/api/users/e8c0d1b2-7f9b-4b9a-b38a-1f2e6239c123/shopping_lists")
        .expect(201)
        .send({
            meal_plan_id: 1,
            recipe_ids: [1, 2]
        })
        .then((response) => {
            const { shopping_list_ingredients } = response.body as {
                shopping_list_ingredients: ShoppingListIngredient[]
            }
            shopping_list_ingredients.forEach((ingredient) => {
                expect(ingredient.shopping_list_id).toBe(3);
            });
        });
    });
    test("201: responds with the newly created 'shopping-list-ingredient' entries, as well as an appropriate status code", () => {
        return request(app)
        .post("/api/users/e8c0d1b2-7f9b-4b9a-b38a-1f2e6239c123/shopping_lists")
        .expect(201)
        .send({
            meal_plan_id: 1,
            recipe_ids: [1, 2]
        })
        .then((response) => {
            const { shopping_list_ingredients } = response.body as {
                shopping_list_ingredients: ShoppingListIngredient[]
            }
            const expectedOutput = [
                {
                    "shopping_list_ingredient_id": 17,
                    "shopping_list_id": 3,
                    "ingredient_id": 1,
                    "quantity": "400",
                    "unit": "g",
                    "is_checked_off": false
                },
                {
                    "shopping_list_ingredient_id": 18,
                    "shopping_list_id": 3,
                    "ingredient_id": 2,
                    "quantity": "150",
                    "unit": "g",
                    "is_checked_off": false
                },
                {
                    "shopping_list_ingredient_id": 19,
                    "shopping_list_id": 3,
                    "ingredient_id": 3,
                    "quantity": "4",
                    "unit": "pcs",
                    "is_checked_off": false
                },
                {
                    "shopping_list_ingredient_id": 20,
                    "shopping_list_id": 3,
                    "ingredient_id": 4,
                    "quantity": "50",
                    "unit": "g",
                    "is_checked_off": false
                },
                {
                    "shopping_list_ingredient_id": 21,
                    "shopping_list_id": 3,
                    "ingredient_id": 5,
                    "quantity": "1",
                    "unit": "tsp",
                    "is_checked_off": false
                },
                {
                    "shopping_list_ingredient_id": 22,
                    "shopping_list_id": 3,
                    "ingredient_id": 6,
                    "quantity": "0.5",
                    "unit": "tsp",
                    "is_checked_off": false
                },
                {
                    "shopping_list_ingredient_id": 23,
                    "shopping_list_id": 3,
                    "ingredient_id": 7,
                    "quantity": "200",
                    "unit": "g",
                    "is_checked_off": false
                },
                {
                    "shopping_list_ingredient_id": 24,
                    "shopping_list_id": 3,
                    "ingredient_id": 8,
                    "quantity": "2",
                    "unit": "tsp",
                    "is_checked_off": false
                },
                { 
                    "shopping_list_ingredient_id": 25,
                    "shopping_list_id": 3,
                    "ingredient_id": 9, 
                    "quantity": "2", 
                    "unit": "tbsp", 
                    "is_checked_off": false
                },
                { 
                    "shopping_list_ingredient_id": 26,
                    "shopping_list_id": 3,
                    "ingredient_id": 10, 
                    "quantity": "300", 
                    "unit": "ml", 
                    "is_checked_off": false
                },
                { 
                    "shopping_list_ingredient_id": 27,
                    "shopping_list_id": 3,
                    "ingredient_id": 11, 
                    "quantity": "30", 
                    "unit": "g", 
                    "is_checked_off": false
                }
            ]
            expect(shopping_list_ingredients).toEqual(expectedOutput);
        });
    });
    test("400: responds with an appropriate status code and error message when passed an invalid 'user_id'", () => {
        return request(app)
        .post("/api/users/scottgirling/shopping_lists")
        .expect(400)
        .send({
            meal_plan_id: 1,
            recipe_ids: [1, 2]
        })
        .then((response) => {
            const { msg } = response.body as {
                msg: string
            }
            expect(msg).toBe("Invalid data type.");
        });
    });
    test("404: responds with an appropriate status code and error message when passed a valid but non-existent 'user_id'", () => {
        return request(app)
        .post("/api/users/c5f2b8d6-3c5d-4d9f-b7c9-845b6a34f2c2/shopping_lists")
        .expect(404)
        .send({
            meal_plan_id: 1,
            recipe_ids: [1, 2]
        })
        .then((response) => {
            const { msg } = response.body as {
                msg: string
            }
            expect(msg).toBe("User does not exist.");
        });
    });
    test("400: responds with an appropriate status code and error message when the request body does not contain the correct fields", () => {
        return request(app)
        .post("/api/users/e8c0d1b2-7f9b-4b9a-b38a-1f2e6239c123/shopping_lists")
        .expect(400)
        .send({
            meal_plan_id: 1
        })
        .then((response) => {
            const { msg } = response.body as {
                msg: string
            }
            expect(msg).toBe("Invalid request - missing field(s).");
        });
    });
    test("400: responds with an appropriate status code and error message when the request body contains the correct fields but one or more field contain an invalid data type", () => {
        return request(app)
        .post("/api/users/e8c0d1b2-7f9b-4b9a-b38a-1f2e6239c123/shopping_lists")
        .expect(400)
        .send({
            meal_plan_id: 1,
            recipe_ids: 1
        })
        .then((response) => {
            const { msg } = response.body as {
                msg: string
            }
            expect(msg).toBe("Invalid data type.");
        });
    });
    test("400: responds with an appropriate status code and error message when the 'recipe_ids' field is an empty array", () => {
        return request(app)
        .post("/api/users/e8c0d1b2-7f9b-4b9a-b38a-1f2e6239c123/shopping_lists")
        .expect(400)
        .send({
            meal_plan_id: 1,
            recipe_ids: []
        })
        .then((response) => {
            const { msg } = response.body as {
                msg: string
            }
            expect(msg).toBe("Incomplete data.");
        });
    });
    test("404: responds with an appropriate status code and error message when the request body contains a valid but non-existent 'recipe_id'", () => {
        return request(app)
        .post("/api/users/e8c0d1b2-7f9b-4b9a-b38a-1f2e6239c123/shopping_lists")
        .expect(404)
        .send({
            meal_plan_id: 1,
            recipe_ids: [1, 12]
        })
        .then((response) => {
            const { msg } = response.body as {
                msg: string
            }
            expect(msg).toBe("Recipe does not exist.");
        });
    });
});

describe("DELETE /api/recipes/:recipe_id", () => {
    test("204: removes the recipe object of the given 'recipe_id' when the 'is_recipe_public' field is 'false', as well as responding with an appropriate status code", () => {
        return request(app)
        .delete("/api/recipes/3")
        .expect(204);
    });
    test("400: responds with an appropriate status code and error message when the 'is_recipe_public' field is 'true' for the given recipe", () => {
        return request(app)
        .delete("/api/recipes/1")
        .expect(400)
        .then((response) => {
            const { msg } = response.body as {
                msg: string
            }
            expect(msg).toBe("Invalid request - public recipes cannot be removed.");
        });
    });
    test("400: responds with an appropriate status code and error message when passed an invalid 'recipe_id'", () => {
        return request(app)
        .delete("/api/recipes/one")
        .expect(400)
        .then((response) => {
            const { msg } = response.body as {
                msg: string
            }
            expect(msg).toBe("Invalid data type.");
        });
    });
    test("404: responds with an appropriate status code and error message when passed a valid but non-existent 'recipe_id'", () => {
        return request(app)
        .delete("/api/recipes/34")
        .expect(404)
        .then((response) => {
            const { msg } = response.body as {
                msg: string
            }
            expect(msg).toBe("Recipe does not exist.");
        });
    });
});

describe("DELETE /api/users/:user_id", () => {
    test("204: removes the user object of the given 'user_id' and responds with an appropriate status code", () => {
        return request(app)
        .delete("/api/users/e8c0d1b2-7f9b-4b9a-b38a-1f2e6239c123")
        .expect(204);
    });
    test("400: responds with an appropriate status code and error message when passed an invalid 'user_id'", () => {
        return request(app)
        .delete("/api/users/scottgirling")
        .expect(400)
        .then((response) => {
            const { msg } = response.body as {
                msg: string
            }
            expect(msg).toBe("Invalid data type.");
        });
    });
    test("404: responds with an appropriate status code and error message when passed a valid but non-existent 'user_id'", () => {
        return request(app)
        .delete("/api/users/c5f2b8d6-3c5d-4d9f-b7c9-845b6a34f2c2")
        .expect(404)
        .then((response) => {
            const { msg } = response.body as {
                msg: string
            }
            expect(msg).toBe("User does not exist.");
        });
    });
});