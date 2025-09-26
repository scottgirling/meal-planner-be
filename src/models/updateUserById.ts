import { DBClient } from "../types/db-client.js";
import db from "../db/connection.js";
import { User } from "@supabase/supabase-js";

export const updateUserById = async (user_id: string, user_name: string, username: string, email: string, bio: string, avatar_url: string, client: DBClient = db) => {
    
    try {
        let queryValues = [];

        let sqlQuery = "UPDATE users SET user_last_updated_at = CURRENT_TIMESTAMP";

        if (user_name) {
            queryValues.push(user_name);
            sqlQuery += `, user_name = $${queryValues.length}`;
        }

        if (username) {
            queryValues.push(username);
            sqlQuery += `, username = $${queryValues.length}`;
        }

        if (email) {
            queryValues.push(email);
            sqlQuery += `, email = $${queryValues.length}`;
        }

        if (bio) {
            queryValues.push(bio);
            sqlQuery += `, bio = $${queryValues.length}`;
        }

        if (avatar_url) {
            queryValues.push(avatar_url);
            sqlQuery += `, avatar_url = $${queryValues.length}`;
        }

        queryValues.push(user_id);
        sqlQuery += ` WHERE user_id = $${queryValues.length} RETURNING *`;

        const result: { rows: User[] } = await client.query(sqlQuery, queryValues);
        const { rows } = result;

        return rows[0];
    } catch (error) {
        throw error;
    }
}