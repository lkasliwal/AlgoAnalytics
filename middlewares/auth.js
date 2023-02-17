const jwt = require("jsonwebtoken");
const  sendError  = require("../utils/helper");
const User = require("../models/user");

module.exports= isAuth = async (req, res, next) => {
  const token = req.headers?.authorization;
  console.log(token)
 if(!token) return sendError(res, "Invalid token!")
  const jwtToken = token.split("Bearer ")[1];
  
  if (!jwtToken) return sendError(res, "Invalid token !");
  //console.log(jwtToken)
  const decode = jwt.verify(jwtToken, process.env.JWT_SECRET);
  const { userId } = decode;

  const user = await User.findById(userId);
  if (!user) return sendError(res, "unauthorized access!");

  req.user = user;

  next();
};

module.exports= isAdmVerify= async (req,res,next)=>{

  const token = req.headers?.authorization;
  
 if(!token) return sendError(res, "Invalid token!")

  const jwtToken = token.split("Bearer ")[1];
  
  if (!jwtToken) return sendError(res, "Invalid token !");
  
  const decode = jwt.verify(jwtToken, process.env.JWT_SECRET);
  const { userId } = decode;

  const user = await User.findById(userId);
  if(user.role !=='admin') return sendError(res,"unauthorized access for user!");
  

    next();
}


