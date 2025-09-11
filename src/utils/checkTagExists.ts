import db from "../db/connection.js";
import { Tag } from "../types/tag.js";

export const checkTagExists = (tag: string) => {
    return db.query("SELECT * FROM tags WHERE tag_slug = $1", [tag])
    .then(({ rows } : { rows: Tag[] }) => {
        if (!rows.length) {
            return Promise.reject({ status: 404, msg: "Tag does not exist." });
        }
    });
}