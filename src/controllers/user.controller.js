import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import bcrypt from "bcrypt"

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
    const users = await User.findAll()

    if (users.length == 0) {
        throw new ApiError(404, "No users yet")
    }

    const unassignedUsers = users.filter((user) => user.teamId === null)

    if(unassignedUsers.length == 0){
        throw new ApiError(404, "No unassigned users found")
    }

    res.status(200).json({
        message: "success",
        data: unassignedUsers
    })
})

export { getUserProfile, updateUserProfile, getAllUnassignedUsers }