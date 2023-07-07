const User = require("../models/userModel")
const jwt = require("jsonwebtoken")
const asyncHandler = require("express-async-handler")

const authMiddleWare = asyncHandler(
    async (req,res,next) =>{
        let token;
        if(req?.headers?.authorization?.startsWith("Bearer")){
            token = req.headers.authorization.split(" ")[1]
            try{
                if(token){
                    const decoded = jwt.verify(token,process.env.JWT_SECRET)
                    const user = await User.findById(decoded?.id)
                    req.user = user
                    next()
                }
            }
            catch(error)
            {
                throw new Error("S'il vous plait veillez vous connecter") 
            }
        }
        else{
            throw new Error("Token no found in header")
        }

    }
)


const isAdmin = asyncHandler(
    async (req,res,next) =>{
         const {contact} = req.user
         const adminUser = await User.findOne({contact:contact})
         if(adminUser.role === "admin")
         {
               next()
         }
         else{
             throw new Error("vous n'etes pas un administrateur") 
         }
    }
)
module.exports = {authMiddleWare,isAdmin}