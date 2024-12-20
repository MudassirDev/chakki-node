import { addUser, checkUser } from "../database/userFunction.js";
import { validateValues } from "../helpers/authUtils.js";
import validator from 'validator';

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
        res.status(200).json({user: result}).end();
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

        res.status(200).json({user: user}).end();
        return;
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error!" });
        return;
    }
}

export {handleRegistration, handleLogin }