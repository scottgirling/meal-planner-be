import db from "../db/connection.js";
import { Tag } from "../types/tag.js";

export const findAllTags = () => {
    return db.query("SELECT * FROM tags")
    .then(({ rows } : { rows: Tag[] }) => {
        return rows;
    });
}