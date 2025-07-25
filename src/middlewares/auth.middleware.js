import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
const verifyUser = asyncHandler(async (req, res, next) => {
    const accessToken = req.cookies.accessToken || req.headers["authorization"]?.replace("bearer ", "")

    if (!accessToken) {
        throw new ApiError(401, "Access token is missing")
    }
    let decodedToken;
    try {
        decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    } catch (error) {
        if(error.name == "TokenExpiredError"){
            throw new ApiError(401,"Access Token expired")
        }
        else{
            throw new ApiError(401, "Access token invalid");
        }
    }

    const user = await User.findByPk(decodedToken.id)

    if (!user) {
        throw new ApiError(401, "User not found for this token")
    }

    req.user = user

    next()
})

export { verifyUser }