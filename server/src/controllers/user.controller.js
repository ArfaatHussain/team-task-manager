import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import bcrypt from "bcrypt"
import { Team } from "../models/team.model.js";
import { Task } from "../models/task.model.js";
import { Op } from "sequelize";

const getUserProfile = asyncHandler(async (req, res) => {
    const { userId } = req.params

    if (!userId) {
        throw new ApiError(400, "User ID is missing")
    }

    const user = await User.findByPk(userId)

    if (!user) {
        throw new ApiError(404, "User not found")
    }

    const userObj = user.toJSON()

    delete userObj.password;

    res.status(200).json({
        message: "success",
        data: userObj
    })
})

const updateUserProfile = asyncHandler(async (req, res) => {
    const { userId, username, email, currentPassword, newPassword } = req.body

    if (!userId) {
        throw new ApiError(400, "User ID is missing")
    }
    if (!username && !email && !currentPassword) {
        throw new ApiError(400, "Please provide atleast one field to update")
    }

    let fieldsToUpdate = {}

    if (username) {
        fieldsToUpdate.username = username
    }
    if (email) {
        fieldsToUpdate.email = email
    }
    if (currentPassword) {
        if (!newPassword) {
            throw new ApiError(400, "New password field is missing")
        }
        fieldsToUpdate.password = newPassword
    }

    const user = await User.findOne({
        where: {
            id: userId
        }
    })

    if (!user) {
        throw new ApiError(404, "User not found with this email or username")
    }

    const isPasswordCorrect = await user.isPasswordCorrect(currentPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(401, "Current password is invalid")
    }

    if (fieldsToUpdate.username) {
        user.username = username
    }
    if (fieldsToUpdate.email) {
        user.email = email
    }
    if (fieldsToUpdate.password) {
        const hashedPassword = await bcrypt.hash(newPassword, 10)
        user.password = hashedPassword
    }

    await user.save()

    res.status(200).json({
        message: "success"
    })
})

const getAllUnassignedUsers = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    // Step 1: Fetch all teams created by user
    const teams = await Team.findAll({
        where: { createdBy: userId },
        attributes: ['id'],
    });

    if (teams.length === 0) {
        return res.status(200).json({
            message: 'success',
            data: [],
        });
    }

    // Step 2: Fetch all assigned users in a single query
    const createdTeamsIds = teams.map((team) => team.id);

    const assignedUsers = await User.findAll({
        where: {
            teamId: {
                [Op.in]: createdTeamsIds, 
            },
        },
        attributes: ['id'],
    });

    const assignedUsersIds = assignedUsers.map((user) => user.id);

    // Step 3: Fetch users who are not assigned to any of these teams
    const unassignedUsers = await User.findAll({
        where: {
            id: {
                [Op.notIn]: assignedUsersIds, 
            },
        },
        attributes: ['id', 'username', 'email'], 
    });

    res.status(200).json({
        message: 'success',
        data: unassignedUsers,
    });
});


const getTeams = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        throw new ApiError(400, "User ID is missing");
    }

    const teams = await User.findAll({
        where: { id: userId },
        include: [
            {
                model: Team,
                as: 'createdTeams',
            },
        ],
    });

    if (!teams || teams.length === 0 || teams[0].createdTeams.length === 0) {
        throw new ApiError(404, "No teams created by this user");
    }

    res.status(200).json({
        message: "success",
        teams: teams[0].createdTeams,
    });
});


const getEnrolledTeam = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        throw new ApiError(400, "User ID is missing");
    }

    const team = await User.findOne({
        where: { id: userId },
        include: [
            {
                model: Team,
                as: 'memberOf',
            }
        ],
    });

    const teamWithCreator = await Team.findOne({
        where: { id: team.memberOf.id },
        include: [{
            model: User,
            as: 'creator',
            attributes: ['id', 'username', 'email']
        }]
    })

    if (!team || team.memberOf == null) {
        throw new ApiError(404, "Not enrolled in any team");
    }


    res.status(200).json({
        message: "success",
        team: teamWithCreator
    });
});



export { getUserProfile, updateUserProfile, getAllUnassignedUsers, getTeams, getEnrolledTeam }