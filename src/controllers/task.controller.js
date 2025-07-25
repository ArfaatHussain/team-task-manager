import { Task } from "../models/task.model.js";
import { Team } from "../models/team.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const create = asyncHandler( async(req,res)=>{

    const {title,description,dueDate, teamId, assignedTo} = req.body;

    if(!title || !description || !dueDate || !teamId || !assignedTo){
        throw new ApiError(400,"Provide all fields")
    }

    const team = await Team.findByPk(teamId)
    if(!team){
        throw new ApiError(404,"Team not found")
    }

    const user = await User.findByPk(assignedTo)
    if(!user){
         throw new ApiError(404,"User not found") 
    }

    if(user.teamId == null){
        throw new ApiError(400,"User is not in the team")
    }
    if(user.teamId !== teamId){
        throw new ApiError(400,"User is in another team")
    }

    await Task.create({
        title,
        description,
        dueDate: new Date(dueDate) ,
        teamId,
        assignedTo
    })

    res.status(201).json({
        message: "success"
    })
} )

export {create}