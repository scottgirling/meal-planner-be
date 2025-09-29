import { DBClient } from "../types/db-client.js";
import db from "../db/connection.js";
import { Tag } from "../types/tag.js";
import { NotFoundError } from "../types/errors.js";

export const checkTagExists = async (tag: string, client: DBClient = db) => {

    const result = await client.query<Tag>(`
        SELECT * 
        FROM tags 
        WHERE tag_slug = $1
        `, [tag]
    );
    const [returnedTag] = result.rows;

    if (!returnedTag) {
        throw new NotFoundError("Tag does not exist.");
    }

    return returnedTag;
}