const { isValidObjectId } = require("mongoose");
const passwordResetToken = require("../models/passwordResetToken");
const sendError = require("../utils/helper");

const isValidResetPasswordToken=async(req,res,next)=>{
    const {userId,token}=req.body;

    // console.log(token)
    //if(!token) return sendError(res,'token not found')

    if(!token.trim()||!isValidObjectId(userId)) return sendError(res,'Invalid request')

    const resetToken=await passwordResetToken.findOne({owner:userId});
    if(!resetToken) return sendError(res,'unauthorized access,invalid token!')
    const match=await resetToken.compareToken(token)
    if(!match) return sendError(res,'invalid token')
     req.resetToken=resetToken
    next()
   
}

module.exports=isValidResetPasswordToken