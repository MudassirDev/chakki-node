import { pool } from "./connection.js";
import { hashPassword } from "../helpers/authUtils.js";

await pool.query(`
    CREATE TABLE IF NOT EXISTS users(
        userId CHAR(36) PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP);`);

const addUser = async ({email, username, password}) => {
    const query = `INSERT INTO users (userId, email, username, password) VALUES (UUID(), ?, ?, ?)`;
    let hashedPassword = null;

    try {
        hashedPassword = await hashPassword(password);
    } catch (error) {
        throw new Error(error);
    }

    try {
        await pool.query(query, [email, username, hashedPassword]);
        const [result] = await checkUser("email", email);
        return result[0];
    } catch (error) {
        throw new Error(error);
    }
};

const checkUser = async (key, value) => {
    const query = `SELECT userId, username, email, password FROM users WHERE ${key} = ? LIMIT 1`;
    try {
        const result = pool.query(query, [value]);
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

export {addUser, checkUser};