import db from "../connection.js";
import format from "pg-format";

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
} from "../../types/index";

export const seed = (
    { 
        testIngredients, 
        testMealPlanRecipes, 
        testMealPlans, 
        testRecipeIngredients, 
        testRecipeTags, 
        testRecipes, 
        testShoppingListIngredients, 
        testShoppingLists, 
        testTags, 
        testUserFavouriteRecipes, 
        testUsers,
    } : { 
        testIngredients: Ingredient[], 
        testMealPlanRecipes: MealPlanRecipe[], 
        testMealPlans: MealPlan[], 
        testRecipeIngredients: RecipeIngredient[], 
        testRecipeTags: RecipeTag[], 
        testRecipes: Recipe[], 
        testShoppingListIngredients: ShoppingListIngredient[], 
        testShoppingLists: ShoppingList[], 
        testTags: Tag[], 
        testUserFavouriteRecipes: UserFavouriteRecipe[], 
        testUsers: User[] 
    }
) => {
    return db.query("DROP TABLE IF EXISTS shopping_list_ingredients")
    .then(() => {
        return db.query("DROP TABLE IF EXISTS meal_plan_recipes")
    })
    .then(() => {
        return db.query("DROP TABLE IF EXISTS user_favourite_recipes")
    })
    .then(() => {
        return db.query("DROP TABLE IF EXISTS recipe_ingredients")
    })
    .then(() => {
        return db.query("DROP TABLE IF EXISTS recipe_tags")
    })
    .then(() => {
        return db.query("DROP TABLE IF EXISTS shopping_lists")
    })
    .then(() => {
        return db.query("DROP TABLE IF EXISTS meal_plans")
    })
    .then(() => {
        return db.query("DROP TABLE IF EXISTS recipes")
    })
    .then(() => {
        return db.query("DROP TABLE IF EXISTS ingredients")
    })
    .then(() => {
        return db.query("DROP TABLE IF EXISTS users")
    })
    .then(() => {
        return db.query("DROP TABLE IF EXISTS tags")
    })
    .then(() => {
        const tagsTablePromise = db.query(`CREATE TABLE tags (
            tag_id SERIAL PRIMARY KEY,
            tag_name VARCHAR NOT NULL,
            tag_slug VARCHAR NOT NULL,
            tag_created_at TIMESTAMP DEFAULT NOW(),
            tag_last_updated_at TIMESTAMP DEFAULT NOW()
        )`);

        const usersTablePromise = db.query(`CREATE TABLE users (
            user_id uuid PRIMARY KEY,
            user_name VARCHAR NOT NULL,
            username VARCHAR NOT NULL,
            email VARCHAR NOT NULL,
            bio TEXT,
            avatar_url VARCHAR,
            user_created_at TIMESTAMP DEFAULT NOW(),
            user_last_updated_at TIMESTAMP DEFAULT NOW()
        )`);

        return Promise.all([tagsTablePromise, usersTablePromise]);
    })
    .then(() => {
        return db.query(`CREATE TABLE ingredients (
            ingredient_id SERIAL PRIMARY KEY,
            ingredient_name VARCHAR NOT NULL,
            ingredient_slug VARCHAR NOT NULL,
            ingredient_created_at TIMESTAMP DEFAULT NOW(),
            ingredient_last_updated_at TIMESTAMP DEFAULT NOW(),
            ingredient_created_by uuid,
            FOREIGN KEY (ingredient_created_by) REFERENCES users(user_id) ON DELETE SET NULL
        )`);
    })
    .then(() => {
            return db.query(`CREATE TABLE recipes (
            recipe_id SERIAL PRIMARY KEY,
            recipe_name VARCHAR NOT NULL,
            recipe_slug VARCHAR NOT NULL,
            instructions TEXT NOT NULL,
            prep_time INT NOT NULL,
            cook_time INT NOT NULL,
            votes INT DEFAULT 0,
            servings INT NOT NULL,
            recipe_created_by uuid,
            recipe_created_at TIMESTAMP DEFAULT NOW(),
            recipe_last_updated_at TIMESTAMP DEFAULT NOW(),
            recipe_img_url VARCHAR,
            difficulty INT NOT NULL,
            is_recipe_public BOOLEAN DEFAULT TRUE,
            FOREIGN KEY (recipe_created_by) REFERENCES users(user_id) ON DELETE SET NULL
        )`);
    })
    .then(() => {
        return db.query(`CREATE TABLE meal_plans (
            meal_plan_id SERIAL PRIMARY KEY,
            meal_plan_created_by uuid NOT NULL, 
            meal_plan_created_at TIMESTAMP DEFAULT NOW(),
            meal_plan_last_updated_at TIMESTAMP DEFAULT NOW(),
            FOREIGN KEY (meal_plan_created_by) REFERENCES users(user_id) ON DELETE CASCADE
        )`);
    })
    .then(() => {
        const shoppingListsTablePromise = db.query(`CREATE TABLE shopping_lists (
            shopping_list_id SERIAL PRIMARY KEY,
            shopping_list_created_by uuid NOT NULL, 
            shopping_list_created_at TIMESTAMP DEFAULT NOW(),
            shopping_list_last_updated_at TIMESTAMP DEFAULT NOW(),
            meal_plan_id INT REFERENCES meal_plans(meal_plan_id) NOT NULL,
            FOREIGN KEY (shopping_list_created_by) REFERENCES users(user_id) ON DELETE CASCADE
        )`);

        const recipeTagsTablePromise = db.query(`CREATE TABLE recipe_tags (
            recipe_id INT NOT NULL,
            tag_id INT NOT NULL,
            PRIMARY KEY (recipe_id, tag_id),
            FOREIGN KEY (recipe_id) REFERENCES recipes(recipe_id) ON DELETE CASCADE,
            FOREIGN KEY (tag_id) REFERENCES tags(tag_id) ON DELETE CASCADE
        )`);

        return Promise.all([shoppingListsTablePromise, recipeTagsTablePromise]);
    })
    .then(() => {
        return db.query(`CREATE TABLE recipe_ingredients (
            recipe_ingredient_id SERIAL PRIMARY KEY,
            recipe_id INT NOT NULL,
            ingredient_id INT NOT NULL,
            quantity NUMERIC NOT NULL,
            unit VARCHAR NOT NULL,
            FOREIGN KEY (recipe_id) REFERENCES recipes(recipe_id) ON DELETE CASCADE,
            FOREIGN KEY (ingredient_id) REFERENCES ingredients(ingredient_id) ON DELETE CASCADE
        )`);
    })
    .then(() => {
        return db.query(`CREATE TABLE user_favourite_recipes (
            user_id uuid NOT NULL,
            recipe_id INT NOT NULL,
            PRIMARY KEY (user_id, recipe_id),
            FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
            FOREIGN KEY (recipe_id) REFERENCES recipes(recipe_id) ON DELETE CASCADE
        )`)
    })
    .then(() => {
        const mealPlanRecipesTablePromise = db.query(`CREATE TABLE meal_plan_recipes (
            meal_plan_recipe_id SERIAL PRIMARY KEY,
            meal_plan_id INT NOT NULL,
            recipe_id INT NOT NULL,
            scheduled_date DATE,
            FOREIGN KEY (meal_plan_id) REFERENCES meal_plans(meal_plan_id) ON DELETE CASCADE,
            FOREIGN KEY (recipe_id) REFERENCES recipes(recipe_id) ON DELETE CASCADE
        )`);

        const shoppingListIngredientsTablePromise = db.query(`CREATE TABLE shopping_list_ingredients (
            shopping_list_ingredient_id SERIAL PRIMARY KEY,
            shopping_list_id INT NOT NULL,
            ingredient_id INT REFERENCES ingredients(ingredient_id) NOT NULL,
            quantity NUMERIC NOT NULL,
            unit VARCHAR NOT NULL,
            is_checked_off BOOLEAN DEFAULT FALSE,
            FOREIGN KEY (shopping_list_id) REFERENCES shopping_lists(shopping_list_id) ON DELETE CASCADE
        )`);

        return Promise.all([mealPlanRecipesTablePromise, shoppingListIngredientsTablePromise]);
    })
    .then(() => {
        const insertTagsQueryString = format(
            `INSERT INTO tags (tag_name, tag_slug, tag_created_at, tag_last_updated_at) VALUES %L`, testTags.map(({ tag_name, tag_slug, tag_created_at, tag_last_updated_at }) => [tag_name, tag_slug, tag_created_at, tag_last_updated_at])
        );

        const tagsPromise = db.query(insertTagsQueryString);

        const insertUsersQueryString = format(
            `INSERT INTO users (user_id, user_name, username, email, bio, avatar_url, user_created_at, user_last_updated_at) VALUES %L`, testUsers.map(({ user_id, user_name, username, email, bio, avatar_url, user_created_at, user_last_updated_at }) => [user_id, user_name, username, email, bio, avatar_url, user_created_at, user_last_updated_at])
        );

        const usersPromise = db.query(insertUsersQueryString);

        return Promise.all([tagsPromise, usersPromise]);
    })
    .then(() => {
        const insertIngredientsQueryString = format(
            `INSERT INTO ingredients (ingredient_name, ingredient_slug, ingredient_created_at, ingredient_last_updated_at, ingredient_created_by) VALUES %L`, testIngredients.map(({ ingredient_name, ingredient_slug, ingredient_created_at, ingredient_last_updated_at, ingredient_created_by }) => [ingredient_name, ingredient_slug, ingredient_created_at, ingredient_last_updated_at, ingredient_created_by])
        );

        const ingredientsPromise = db.query(insertIngredientsQueryString);

        const insertRecipesQueryString = format(
            `INSERT INTO recipes (recipe_name, recipe_slug, instructions, prep_time, cook_time, votes, servings, recipe_created_by, recipe_created_at, recipe_last_updated_at, recipe_img_url, difficulty, is_recipe_public) VALUES %L`, testRecipes.map(({ recipe_name, recipe_slug, instructions, prep_time, cook_time, votes, servings, recipe_created_by, recipe_created_at, recipe_last_updated_at, recipe_img_url, difficulty, is_recipe_public }) => [ recipe_name, recipe_slug, instructions, prep_time, cook_time, votes, servings, recipe_created_by, recipe_created_at, recipe_last_updated_at, recipe_img_url, difficulty, is_recipe_public])
        );

        const recipesPromise = db.query(insertRecipesQueryString);

        const insertMealPlansQueryString = format(
            `INSERT INTO meal_plans (meal_plan_created_by, meal_plan_created_at, meal_plan_last_updated_at) VALUES %L`, testMealPlans.map(({ meal_plan_created_by, meal_plan_created_at, meal_plan_last_updated_at }) => [meal_plan_created_by, meal_plan_created_at, meal_plan_last_updated_at])
        );

        const mealPlansPromise = db.query(insertMealPlansQueryString);

        return Promise.all([ingredientsPromise, recipesPromise, mealPlansPromise]);
    })
    .then(() => {
        const insertShoppingListsQueryString = format(
            `INSERT INTO shopping_lists (shopping_list_created_by, shopping_list_created_at, shopping_list_last_updated_at, meal_plan_id) VALUES %L`, testShoppingLists.map(({ shopping_list_created_by, shopping_list_created_at, shopping_list_last_updated_at, meal_plan_id }) => [shopping_list_created_by, shopping_list_created_at, shopping_list_last_updated_at, meal_plan_id])
        );

        const shoppingListsPromise = db.query(insertShoppingListsQueryString);

        const insertRecipeTagsQueryString = format(
            `INSERT INTO recipe_tags (recipe_id, tag_id) VALUES %L`, testRecipeTags.map(({ recipe_id, tag_id }) => [recipe_id, tag_id])
        );

        const recipeTagsPromise = db.query(insertRecipeTagsQueryString);

        const insertRecipeIngredientsQueryString = format(
            `INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES %L`, testRecipeIngredients.map(({ recipe_id, ingredient_id, quantity, unit }) => [recipe_id, ingredient_id, quantity, unit])
        );

        const recipeIngredientsPromise = db.query(insertRecipeIngredientsQueryString);

        const insertUserFavouriteRecipesQueryString = format(
            `INSERT INTO user_favourite_recipes (user_id, recipe_id) VALUES %L`, testUserFavouriteRecipes.map(({ user_id, recipe_id }) => [ user_id, recipe_id])
        );

        const userFavouriteRecipesPromise = db.query(insertUserFavouriteRecipesQueryString);

        const insertMealPlanRecipesQueryString = format(
            `INSERT INTO meal_plan_recipes (meal_plan_id, recipe_id, scheduled_date) VALUES %L`, testMealPlanRecipes.map(({ meal_plan_id, recipe_id, scheduled_date }) => [meal_plan_id, recipe_id, scheduled_date])
        );

        const mealPlanRecipesPromise = db.query(insertMealPlanRecipesQueryString);

        return Promise.all([shoppingListsPromise, recipeTagsPromise, recipeIngredientsPromise, userFavouriteRecipesPromise, mealPlanRecipesPromise]);
    })
    .then(() => {
        const insertShoppingListIngredientsQueryString = format(
            `INSERT INTO shopping_list_ingredients (shopping_list_id, ingredient_id, quantity, unit, is_checked_off) VALUES %L`, testShoppingListIngredients.map(({ shopping_list_id, ingredient_id, quantity, unit, is_checked_off }) => [shopping_list_id, ingredient_id, quantity, unit, is_checked_off])
        );

        return db.query(insertShoppingListIngredientsQueryString);
    });
}