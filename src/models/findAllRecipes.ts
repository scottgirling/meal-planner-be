import { DBClient } from "../types/db-client.js";
import db from "../db/connection.js";
import { InvalidRequestError, NotFoundError } from "../types/errors.js";
import { Recipe } from "../types/recipe.js";

export const findAllRecipes = async (
    sort_by: string = "votes", 
    order: string = "desc", 
    tag: string | string[] | undefined, 
    limit: number = 20, 
    p: number = 1, 
    client: DBClient = db
): Promise<Recipe[]> => {

    const validSortBy = [
        "prep_time", 
        "cook_time", 
        "votes", 
        "created_at", 
        "difficulty"
    ];
    const validOrder = ["asc", "desc"];
    const offset = (p - 1) * limit;
    let filterQueries: string[] | undefined = [];

    if (!validSortBy.includes(sort_by) || !validOrder.includes(order)) {
        throw new InvalidRequestError("Invalid 'Sort By' or 'Order' query.");
    }

    let sqlQuery = `
        SELECT DISTINCT recipes.* 
        FROM recipes 
        JOIN recipe_tags 
        ON recipes.recipe_id = recipe_tags.recipe_id 
        JOIN tags 
        ON recipe_tags.tag_id = tags.tag_id
        WHERE recipes.is_recipe_public = true
    `;

    if (tag) {
        if (Array.isArray(tag)) {
            filterQueries.push(tag[0])
            tag.shift();
            sqlQuery += ` AND tags.tag_slug = $${filterQueries.length}`;
    
            tag.forEach((tag) => {
                filterQueries.push(tag);
                sqlQuery += ` OR tags.tag_slug = $${filterQueries.length}`;
            });
        } else {
            filterQueries.push(tag);
            sqlQuery += ` AND tags.tag_slug = $${filterQueries.length}`;
        }
    }

    sqlQuery += ` 
       ORDER BY ${sort_by} ${order} 
       LIMIT ${limit} 
       OFFSET ${offset}
    `;

    const result = await client.query<Recipe>(sqlQuery, filterQueries);
    const recipes = result.rows;

    if (p > 1 && !recipes.length) {
        throw new NotFoundError("Page does not exist.");
    }

    return recipes;
}