import { Router } from "express";
import { create,
    getAllTasks,
    getTaskDetails,
    deleteTask,
    updateTask,
    getAllUnassignedTasks,
    assignTask,
    getAllAssignedTasks,
    getAllCreatedTasks
} from "../controllers/task.controller.js";
import { verifyUser } from "../middlewares/auth.middleware.js";
const taskRouter = Router()

taskRouter.route("/create").post(verifyUser,create)
taskRouter.route("/getAllTasks").get(verifyUser,getAllTasks)
taskRouter.route("/getTaskDetails/:taskId").get(verifyUser,getTaskDetails)
taskRouter.route("/delete").delete(verifyUser,deleteTask)
taskRouter.route("/update").patch(verifyUser,updateTask)

taskRouter.route("/getAllUnassignedTasks/:userId").get(verifyUser,getAllUnassignedTasks)

taskRouter.route("/assignTask").patch(verifyUser,assignTask)

taskRouter.route("/getAllAssignedTasks/:userId").get(verifyUser,getAllAssignedTasks)

taskRouter.route("/getAllCreatedTasks/:userId").get(verifyUser,getAllCreatedTasks )

export {taskRouter}