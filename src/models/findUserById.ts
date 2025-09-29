import { DBClient } from "../types/db-client.js";
import db from "../db/connection.js";
import { User } from "../types/user.js";
import { NotFoundError } from "../types/errors.js";

export const findUserById = async (user_id: string, client: DBClient = db): Promise<User> => {

    const result = await client.query<User>(`
        SELECT * 
        FROM users 
        WHERE user_id = $1
        `, [user_id]
    );
    const user = result.rows[0];
    
    if (!user) {
        throw new NotFoundError("User does not exist.");
    }

    return user;
}