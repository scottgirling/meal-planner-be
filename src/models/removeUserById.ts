import { DBClient } from "../types/db-client.js";
import db from "../db/connection.js";
import { User } from "@supabase/supabase-js";

export const removeUserById = async (
    user_id: string,
    client: DBClient = db
): Promise<User> => {

    const result = await client.query<User>(`
        DELETE FROM users 
        WHERE user_id = $1 
        RETURNING *
        `, [user_id]
    );
    const [removedUser] = result.rows;

    return removedUser;
}