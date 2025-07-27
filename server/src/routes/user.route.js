import { Router } from "express";
import { getUserProfile, updateUserProfile, getAllUnassignedUsers, getTeams, getEnrolledTeam } from "../controllers/user.controller.js";
import { verifyUser } from "../middlewares/auth.middleware.js";
const userRouter = Router()

userRouter.route("/getUserProfile/:userId").get(verifyUser,getUserProfile)

userRouter.route("/getTeams/:userId").get(verifyUser,getTeams)

userRouter.route("/updateUserProfile").patch(verifyUser,updateUserProfile)

userRouter.route("/getAllUnassignedUsers").get(verifyUser,getAllUnassignedUsers)

userRouter.route("/getEnrolledTeam/:userId").get(verifyUser,getEnrolledTeam)

export {userRouter}