import { addUser } from "../database/userFunction.js";
import { validateValues } from "../helpers/authUtils.js";

const handleRegistration = async (req, res) => {
    const data = req.body;
    const headers = req.headers;

    (()=>{
        if (!headers["content-type"] || headers["content-type"] != "application/json") {
            res.status(400).json({ error: "Invalid or missing headers!", message: "Content-Type should be application/json" });
            return;
        }
    })();

    const missingKey = validateValues(["email", "username", "password"], data);

    if (missingKey) {
        res.status(401).json({ error: `Missing key: ${missingKey}!` });
        return;
    }

    try {
        const result = await addUser(data);
        res.status(200).json({user: {
            username: result["username"],
            email: result["email"],
            userId: result["userId"]
        }}).end();
        return;
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error!" });
        return;
    }
};

export {handleRegistration}