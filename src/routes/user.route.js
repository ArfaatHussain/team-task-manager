import { Router } from "express";
import { registerUser, loginUser, getUserProfile, updateUserProfile } from "../controllers/user.controller.js";

const userRouter = Router()

userRouter.route("/register").post(registerUser)

userRouter.route("/login").post(loginUser)

userRouter.route("/getUserProfile/:userId").get(getUserProfile)

userRouter.route("/updateUserProfile").patch(updateUserProfile)

export {userRouter}