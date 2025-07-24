import { Team } from "../models/team.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTeam = asyncHandler( async(req,res)=>{
    const {name, creatorId} = req.body;

    if(!name || !creatorId){
        throw new ApiError(400,"provide all fields")
    } 

    const isTeamExist = await Team.findOne({where: {name: name}})

    if(isTeamExist){
        throw new ApiError(409,"Team already exist with this name")
    }

    await Team.create({
        name,
        createdBy: creatorId
    })

    res.status(201).json({
        message: "success"
    })
} )

export {createTeam}