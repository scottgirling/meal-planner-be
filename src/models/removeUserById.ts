import { User } from "@supabase/supabase-js";
import db from "../db/connection.js";

export const removeUserById = (user_id: string) => {
    return db.query("DELETE FROM users WHERE user_id = $1 RETURNING *", [user_id])
    .then(({ rows } : { rows: User[] }) => {
        return rows[0];
    });
}