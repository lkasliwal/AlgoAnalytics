const user = require('../models/admin');
const User=require('../models/admin')


const createUser= async (req,res)=>{
    
    const {name,email,password}=req.body;

    const alreadyExist=await User.findOne({email})
    if(alreadyExist){
        return res.json({"error":" user already exist"})
    }
    const newUser=new User({name,email,password});

    await newUser.save();

    res.json({user:newUser})
}
module.exports=createUser
