import { Router } from "express";
import { registerUser, loginUser, getUserProfile } from "../controllers/user.controller.js";

const userRouter = Router()

userRouter.route("/register").post(registerUser)

userRouter.route("/login").post(loginUser)

userRouter.route("/getUserProfile/:userId").get(getUserProfile)

export {userRouter}