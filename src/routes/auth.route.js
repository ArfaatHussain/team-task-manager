import { Router } from "express";
import { refreshAccessToken, 
    loginUser, 
    logoutUser, 
    registerUser
 } from "../controllers/auth.controller.js";

const authRouter = Router()

authRouter.route("/refreshToken").post(refreshAccessToken)

authRouter.route("/login").post(loginUser)

authRouter.route("/register").post(registerUser)

authRouter.route("/logout").post(logoutUser)

export {authRouter}