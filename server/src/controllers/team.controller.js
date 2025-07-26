import { Team } from "../models/team.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTeam = asyncHandler(async (req, res) => {
    const { name, description, creatorId } = req.body;

    if (!name || !creatorId) {
        throw new ApiError(400, "Please provide both 'name' and 'creatorId'");
    }

    const team = await Team.create({
        name,
        createdBy: creatorId,
        description: description || null
    });

    res.status(201).json({
        message: "Team created successfully",
        team
    });
});


const getTeams = asyncHandler(async (req, res) => {
    const teams = await Team.findAll({
        include: [
            {
                model: User,
                as: 'creator',
                attributes: ['id', 'username', 'email']
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

    if (team.length === 0) {
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
    if (user.teamId != null) {
        throw new ApiError(409, "User is already in another team")
    }
    user.teamId = teamId
    await user.save()

    res.status(200).json({
        message: "success"
    })

})

const deleteTeam = asyncHandler(async (req, res) => {
    const { teamId, creatorId } = req.body

    if (!teamId || !creatorId) {
        throw new ApiError(400, "Provide all fields")
    }

    const team = await Team.findByPk(teamId)
    if (!team) {
        throw new ApiError(404, "Team not found")
    }

    if (team.createdBy != creatorId) {
        throw new ApiError(401, "Only team creator can delete it")
    }

    await Team.destroy({
        where: { id: teamId }
    })

    res.status(200).json({
        message: "success"
    })

})

const updateTeam = asyncHandler(async (req, res) => {
    const { creatorId, teamId, name } = req.body

    if (!creatorId || !teamId || !name) {
        throw new ApiError(400, "Provide all fields")
    }

    const team = await Team.findByPk(teamId)

    if (!team) {
        throw new ApiError(404, "Team not found")
    }

    if (team.createdBy != creatorId) {
        throw new ApiError(401, "Only team creator can update it.")
    }

    team.name = name;
    await team.save()

    res.status(200).json({
        message: "success"
    })
})

const removeUser = asyncHandler(async (req, res) => {
    const { teamId, userId, creatorId } = req.body

    if (!teamId || !userId || !creatorId) {
        throw new ApiError(400, "Provide all fields")
    }

    const team = await Team.findOne({
        where: { id: teamId },
        include: [{
            model: User,
            as: 'creator',
            attributes: ['id', 'username', 'email']
        },
        {
            model: User,
            as: 'members',
            attributes: ['id', 'username']
        }
        ]
    })

    if (team.creator.id != creatorId) {
        throw new ApiError(401, "Only creator can remove user")
    }

    const isUserToBeRemovedExist = team.members.some((member) => member.id == userId)

    if (!isUserToBeRemovedExist) {
        throw new ApiError(404, "User not found in this team")
    }

    const user = await User.findByPk(userId);
    user.teamId = null;
    await user.save();


    res.status(200).json({
        message: "success",
    })

})

const getMembers = asyncHandler(async(req,res)=>{
    const {teamId} = req.params;

    const team = await Team.findOne({
        where: {id: teamId},
        include: [
            {
                model: User,
                as: 'members',
                attributes: ['id','username','email']
            }
        ]
    })

    if(!team){
        throw new ApiError(404,"Team not found")
    }

    if(team.members.length == 0){
        throw new ApiError(404,"No members in this team")
    }

    res.status(200).json({
        message: "success",
        members: team.members
    })
})

export { createTeam, getTeams, getTeamDetails, addUser, deleteTeam, updateTeam, removeUser, getMembers }