import { Team } from "../models/team.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTeam = asyncHandler(async (req, res) => {
    const { name, creatorId } = req.body;

    if (!name || !creatorId) {
        throw new ApiError(400, "provide all fields")
    }

    const isTeamExist = await Team.findOne({ where: { name: name } })

    if (isTeamExist) {
        throw new ApiError(409, "Team already exist with this name")
    }

    await Team.create({
        name,
        createdBy: creatorId
    })

    res.status(201).json({
        message: "success"
    })
})

const getTeams = asyncHandler(async (req, res) => {
    const teams = await Team.findAll({
        include: [
            {
                model: User,
                as: 'creator',
                attributes: ['id','username', 'email']
            }
        ]
    });

    if (!teams) {
        throw new ApiError(404, "No teams created yet.")
    }

    res.status(200).json({
        message: "success",
        data: teams
    })
})

const getTeamDetails = asyncHandler(async (req, res) => {
    const { teamId } = req.params;

    if (!teamId) {
        throw new ApiError(400, "Team ID is missing");
    }
    const team = await Team.findAll({
        where: { id: teamId },
        include: [{
            model: User,
            as: "members",
            attributes: ['id', 'username', 'email']
        }]
    })

    if (!team) {
        throw new ApiError(404, "Team not found")
    }
    

    res.status(200).json({
        message: "success",
        data: team
    })

})

const addUser = asyncHandler(async (req, res) => {
    const { userId, teamId } = req.body;

    if (!userId || !teamId) {
        throw new ApiError(400, "Provide all fields")
    }

    const user = await User.findByPk(userId)

    if (user.teamId == teamId) {
        throw new ApiError(409, "User is already a member of this team");
    }
    if(user.teamId != null ){
        throw new ApiError(409,"User is already in another team")
    }
    user.teamId = teamId
    await user.save()

    res.status(200).json({
        message: "success"
    })

})

const deleteTeam = asyncHandler( async(req,res)=>{
    const {teamId,creatorId} = req.body

    if(!teamId || !creatorId){
        throw new ApiError(400,"Provide all fields")
    }

    const team = await Team.findByPk(teamId)
    if(!team){
        throw new ApiError(404,"Team not found")
    }

    if(team.createdBy != creatorId){
        throw new ApiError(401,"Only team creator can delete it")
    }

    await Team.destroy({
        where: {id: teamId}
    })

    res.status(200).json({
        message: "success"
    })

} )

export { createTeam, getTeams, getTeamDetails, addUser, deleteTeam }