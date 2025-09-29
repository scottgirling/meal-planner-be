import db from "../db/connection.js";
import { DBClient } from "../types/db-client.js";
import { Tag } from "../types/tag.js";

export const findAllTags = async (client: DBClient = db): Promise<Tag[]> => {

    const result = await client.query<Tag>(`
        SELECT *
        FROM tags
        `
    );
    const tags = result.rows;

    return tags;
}