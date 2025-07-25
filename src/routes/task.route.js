import { Router } from "express";
import { create,
    getAllTasks,
    getTaskDetails,
    deleteTask,
    updateTask
} from "../controllers/task.controller.js";
const taskRouter = Router()

taskRouter.route("/create").post(create)
taskRouter.route("/getAllTasks").get(getAllTasks)
taskRouter.route("/getTaskDetails/:taskId").get(getTaskDetails)
taskRouter.route("/delete").delete(deleteTask)
taskRouter.route("/update").patch(updateTask)
export {taskRouter}