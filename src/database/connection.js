import mysql from "mysql2";
import { configDotenv } from "dotenv";

configDotenv();

const pool = mysql.createPool({
    user: process.env.MYSQL_USER,
    host: process.env.MYSQL_HOST,
    database: process.env.MYSQL_DATABASE,
    password: process.env.MYSQL_PASS
}).promise();

export {pool};