import { Router } from "express";
import { createTeam } from "../controllers/team.controller.js";
const teamRouter = Router()

teamRouter.route("/create").post(createTeam)

export {teamRouter}