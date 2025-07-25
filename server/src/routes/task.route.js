import { Router } from "express";
import { create,
    getAllTasks,
    getTaskDetails,
    deleteTask,
    updateTask
} from "../controllers/task.controller.js";
import { verifyUser } from "../middlewares/auth.middleware.js";
const taskRouter = Router()

taskRouter.route("/create").post(verifyUser,create)
taskRouter.route("/getAllTasks").get(verifyUser,getAllTasks)
taskRouter.route("/getTaskDetails/:taskId").get(verifyUser,getTaskDetails)
taskRouter.route("/delete").delete(verifyUser,deleteTask)
taskRouter.route("/update").patch(verifyUser,updateTask)
export {taskRouter}