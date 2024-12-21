import { addUser, checkUser } from "../database/userFunction.js";
import { validateValues } from "../helpers/authUtils.js";
import validator from 'validator';
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";

configDotenv();

const verifyHeaders = (headers, res) => {
    if (!headers["content-type"] || headers["content-type"] != "application/json") {
        res.status(400).json({ error: "Invalid or missing headers!", message: "Content-Type should be application/json" });
        return;
    }
}

const handleRegistration = async (req, res) => {
    const data = req.body;
    const headers = req.headers;

    verifyHeaders(headers, res);

    const missingKey = validateValues(["email", "username", "password"], data);

    if (missingKey) {
        res.status(401).json({ error: `Missing key: ${missingKey}!` });
        return;
    }

    try {
        const result = await addUser(data);
        res.status(200).json({
            user: {
                username: result["username"],
                email: result["email"],
                userId: result["userId"]
            }
        }).end();
        return;
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error!" });
        return;
    }
};

const handleLogin = async (req, res) => {
    const data = req.body;
    const header = req.headers;

    verifyHeaders(header, res);

    const missingKey = validateValues(["identifier", "password"], data);

    if (missingKey) {
        res.status(401).json({ error: `Missing key: ${missingKey}!` });
        return;
    }

    const keyType = validator.isEmail(data["identifier"]) ? "email" : "username";

    try {
        const [users] = await checkUser(keyType, data["identifier"]);
        const user = users[0];

        if (!user) {
            res.status(400).json({ error: `A user with this ${keyType} doesn't exits!` }).end();
            return;
        }

        const result = await argon2.verify(user["password"], data["password"]);

        if (result) {
            const token = jwt.sign({ 
                username: user["username"], 
                email: user["email"], 
                userId: user["userId"] 
            }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRATION
            });
        
            res.cookie("token", token, {
                httpOnly: true,
                secure: true,
                maxAge: 3600000,
                sameSite: "strict",
                path: "/",
            });

            res.status(200).json({
                success: true,
                message: "Authentication successful",
                user: {
                    username: user.username,
                    email: user.email,
                    userId: user["userId"]
                },
            }).end();
            return;
        }        

        res.status(400).json({ error: "Password is wrong!" }).end();
        return;
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error!" });
        return;
    }
}


const handleUsers = async (req, res) => {
    res.status(200).json({ message: "ok!" }).end();
    return;
}

export { handleRegistration, handleLogin, handleUsers }