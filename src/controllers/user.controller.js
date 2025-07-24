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

export { registerUser, loginUser }