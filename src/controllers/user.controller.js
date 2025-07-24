import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import bcrypt from "bcrypt"
import { Op } from "sequelize";

const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        throw new ApiError(400, "fields are missing")
    }

    const user = await User.findOne({
        where: {
            [Op.or]: [
                { username: username },
                { email: email }
            ]
        }
    })

    if (user) {
        throw new ApiError(409, "User already exist witht this email or username")
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
        username,
        email,
        password: hashedPassword
    })

    const newUserObj = newUser.toJSON()

    delete newUserObj.password

    res.status(201).json({
        message: "success",
        data: newUser
    })

})

const generateRefreshAndAccessToken = async(user)=>{
    const refreshToken = await user.generateRefreshToken()
    const accessToken = await user.generateAccessToken()

    return {refreshToken, accessToken}
}
const loginUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    if (!username && !email) {
        throw new ApiError(400, "Provide atleast one thing i.e username or email")
    }

    if (!password) {
        throw new ApiError(400, "Password is missing")
    }
    let whereCondition = [];

    if (username) {
        whereCondition.push({ username });
    }

    if (email) {
        whereCondition.push({ email });
    }

    const user = await User.findOne({
        where: {
            [Op.or]: whereCondition
        }
    });

    if (!user) {
        throw new ApiError(404, "User not found with this email or username")
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password)


    if (!isPasswordCorrect) {
        throw new ApiError(401, "Invalid email or password")
    }

    const {accessToken, refreshToken} = await generateRefreshAndAccessToken(user)

    user.refreshToken = refreshToken
    await user.save()
    const responseData = {
        id: user.id,
        username,
        email,
        accessToken,
        refreshToken
    }
    res.status(200).json({
        message: "success",
        data: responseData
    })
})

const getUserProfile = asyncHandler( async(req,res)=>{
    const {userId} = req.params
    
    if(!userId){
        throw new ApiError(400,"User ID is missing")
    }

    const user = await User.findByPk(userId)

    if(!user){
        throw new ApiError(404,"User not found")
    }

    const userObj = user.toJSON()

    delete userObj.password;

    res.status(200).json({
        message: "success",
        data: userObj
    })
} )

const updateUserProfile = asyncHandler( async(req,res)=>{
    const {userId,username, email, currentPassword, newPassword} = req.body

    if(!userId){
        throw new ApiError(400,"User ID is missing")
    }
    if(!username && !email && !currentPassword){
        throw new ApiError(400,"Please provide atleast one field to update")
    }

    let fieldsToUpdate = {}

    if(username){
        fieldsToUpdate.username = username
    }
    if(email){
        fieldsToUpdate.email = email
    }
    if(currentPassword){
        if(!newPassword){
            throw new ApiError(400,"New password field is missing")
        }
        fieldsToUpdate.password = newPassword
    }

    const user = await User.findOne({where:{
        id: userId
    }})

    if(!user){
        throw new ApiError(404,"User not found with this email or username")
    }

    const isPasswordCorrect = await user.isPasswordCorrect(currentPassword)

    if(!isPasswordCorrect){
        throw new ApiError(401,"Current password is invalid")
    }

    if(fieldsToUpdate.username){
        user.username = username
    }
    if(fieldsToUpdate.email){
        user.email = email
    }
    if(fieldsToUpdate.password){
        const hashedPassword = await bcrypt.hash(newPassword,10)
        user.password = hashedPassword
    }

    await user.save()

    res.status(200).json({
        message: "success"
    })
} )

export { registerUser, loginUser, getUserProfile, updateUserProfile }