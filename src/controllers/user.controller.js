import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import bcrypt from "bcrypt"
import { Op } from "sequelize";

const registerUser = asyncHandler( async(req,res)=>{
    const {username, email, password} = req.body;

    if(!username || !email || !password){
        throw new ApiError(400,"fields are missing")
    }

    const user = await User.findOne({where: {
        [Op.or]: [
            {username: username},
            {email: email}
        ]
    } })

    if(user){
        throw new ApiError(409,"User already exist witht this email or username")
    }

    const hashedPassword = await bcrypt.hash(password, 10);

   const newUser = await User.create({
        username,
        email,
        password:hashedPassword
    })

    const newUserObj = newUser.toJSON()

    delete newUserObj.password

    res.status(201).json({
        message: "success",
        data: newUser
    })

} )

export {registerUser}