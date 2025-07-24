import { Router } from "express";
import { createTeam, getTeams } from "../controllers/team.controller.js";
const teamRouter = Router()

teamRouter.route("/create").post(createTeam)
teamRouter.route("/getTeams").get(getTeams)
export {teamRouter}