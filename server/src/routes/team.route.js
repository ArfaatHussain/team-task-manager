import { Router } from "express";
import { createTeam, getTeams, getTeamDetails, addUser, deleteTeam, updateTeam, removeUser, getMembers } from "../controllers/team.controller.js";
import { verifyUser } from "../middlewares/auth.middleware.js";
const teamRouter = Router()

teamRouter.route("/create").post(verifyUser,createTeam)
teamRouter.route("/getTeams").get(verifyUser,getTeams)
teamRouter.route("/getDetails/:teamId").get(verifyUser,getTeamDetails)
teamRouter.route("/addUser").post(verifyUser,addUser)
teamRouter.route("/delete").delete(verifyUser,deleteTeam)
teamRouter.route("/update").patch(verifyUser,updateTeam)
teamRouter.route("/removeUser").delete(verifyUser,removeUser)

teamRouter.route("/getMembers/:teamId").get(verifyUser,getMembers )
export {teamRouter}