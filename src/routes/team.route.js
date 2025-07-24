import { Router } from "express";
import { createTeam, getTeams, getTeamDetails, addUser, deleteTeam, updateTeam, removeUser } from "../controllers/team.controller.js";
const teamRouter = Router()

teamRouter.route("/create").post(createTeam)
teamRouter.route("/getTeams").get(getTeams)
teamRouter.route("/getDetails/:teamId").get(getTeamDetails)
teamRouter.route("/addUser").post(addUser)
teamRouter.route("/delete").delete(deleteTeam)
teamRouter.route("/update").patch(updateTeam)
teamRouter.route("/removeUser").delete(removeUser)
export {teamRouter}