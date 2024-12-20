import express from "express";
import cookieParser from "cookie-parser";
import userRouter from "../routes/usersRoutes.js"

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use("/users", userRouter);

app.listen(8080, ()=> {
    console.log("Listening on the port :8080");
});