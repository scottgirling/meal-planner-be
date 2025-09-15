import db from "../db/connection.js";
import { Tag } from "../types/tag.js";

export const createTag = (tag_name: string, tag_slug: string) => {
    return db.query("INSERT INTO tags (tag_name, tag_slug) VALUES ($1, $2) RETURNING *", [tag_name, tag_slug])
    .then(({ rows } : { rows: Tag[] }) => {
        return rows[0];
    });
}