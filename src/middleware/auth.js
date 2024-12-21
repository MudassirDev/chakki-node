import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        res.status(401).json({ message: 'Unauthorized: No token provided' });
        return;
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            res.status(403).json({ message: 'Unauthorized: Invalid token' }).end();
            return;
        }

        req.user = decoded;
        next();
    });
};


export {authMiddleware}