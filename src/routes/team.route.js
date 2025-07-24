import { Router } from "express";
import { createTeam, getTeams, getTeamDetails, addUser } from "../controllers/team.controller.js";
const teamRouter = Router()

teamRouter.route("/create").post(createTeam)
teamRouter.route("/getTeams").get(getTeams)
teamRouter.route("/getDetails/:teamId").get(getTeamDetails)
teamRouter.route("/addUser").post(addUser)
export {teamRouter}