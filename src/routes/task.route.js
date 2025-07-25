import { Router } from "express";
import { create

} from "../controllers/task.controller.js";
const taskRouter = Router()

taskRouter.route("/create").post(create)

export {taskRouter}