import express from "express"
import cors from 'cors';
import cookieParser from "cookie-parser";

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json())

app.use(cookieParser())

import { userRouter } from "./routes/user.route.js";
import { teamRouter } from "./routes/team.route.js";
import { taskRouter } from "./routes/task.route.js";

app.use("/user",userRouter)
app.use("/team",teamRouter)
app.use("/task",taskRouter)

export {app}