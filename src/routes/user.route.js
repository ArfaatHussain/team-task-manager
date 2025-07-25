import { Router } from "express";
import { getUserProfile, updateUserProfile, getAllUnassignedUsers } from "../controllers/user.controller.js";
import { verifyUser } from "../middlewares/auth.middleware.js";
const userRouter = Router()

// userRouter.route("/register").post(registerUser)

// userRouter.route("/login").post(loginUser)

userRouter.route("/getUserProfile/:userId").get(verifyUser,getUserProfile)

userRouter.route("/updateUserProfile").patch(verifyUser,updateUserProfile)

userRouter.route("/getAllUnassignedUsers").get(verifyUser,getAllUnassignedUsers)

// userRouter.route("/logout").post(verifyUser, logoutUser)

// userRouter.route("/refreshToken").get()

export {userRouter}