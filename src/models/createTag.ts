import { DBClient } from "../types/db-client.js";
import db from "../db/connection.js";
import { Tag } from "../types/tag.js";

export const createTag = async (
    tag_name: string, 
    tag_slug: string,
    client: DBClient = db
): Promise<Tag> => {

    const result = await client.query<Tag>(`
        INSERT INTO tags (tag_name, tag_slug) 
        VALUES ($1, $2) 
        RETURNING *
        `, [tag_name, tag_slug]
    );
    const tag = result.rows[0];

    return tag;
}