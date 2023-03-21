const express=require('express')
const Router=express.Router()
const User = require('../models/user');
const Part = require('../models/parts');
const isAdmVerify = require('../middlewares/auth');
const isAuth = require('../middlewares/auth');
const sendError = require('../utils/helper');

Router.post('/api/admin/addpart',async(req,res)=>{
    console.log("addpart request from frontend = ", req.body);
    const part = new Part(req.body);
    try{
        await part.save();
        res.status(200).send({part});
    }
    catch(e){
        res.status(400).send(e);
    }
})

Router.get('/api/admin/totalpart',async(req,res)=>{
    try{

        // if(req){
        //     console.log("request from frontend")
        // }
        var parts = await Part.find();


        //console.log(parts);
        //console.log("api is called")
        var totalOk=0,totalNok=0;

        parts.forEach((part)=> {
            totalOk += part.part_ok;
            totalNok += part.part_not_ok;
        });
        var total = totalOk+totalNok;
        const obj =
            {"total":total,
            "part_ok":totalOk,
            "part_not_ok":totalNok,
            "parts":parts
            }
        
            
        

        
      return  res.send(obj);
    }
    catch(e){
        res.status(401).send(e);
    }
})

Router.post('/api/admin/selectpart',async(req,res)=>{
    console.log("inside select part ", req.body.part_name);
    try{
        const part_name = req.body.part_name;
        const part = await Part.findOne({part_name});
        res.status(200).send(part);
    }
    catch(e){
        res.status(401).send(e);
    }
})

Router.get('/users',async(req,res)=>{
    try{
        const users = await User.find({adminVerified:false},{name:1,_id:0,email:1,role:1});
        res.send(users);
    }
    catch(e){
        res.status(400).send(e);
    }
}),

Router.put('/userverify',async(req,res)=>{
    try{
        const user = await User.findOneAndUpdate({name:req.body.name,email:req.body.email},{adminVerified:true,role:req.body.role});
        res.send({'message':'User verified'});
    }
    catch(e){
        res.status(401).send(e);
    }
})

Router.post('/api/admin/editrole',async(req,res)=>{
    try{
        console.log("inside editrole");
        var email = req.body.email, role = req.body.role;
        console.log({email}, {role});
        const user = await User.findOne({email});
        if (!user) {
            return sendError(res, "User does not exist with this email", 208);
        }
        user.role = req.body.role;
        await user.save();
        res.status(200).json({
            status: 'success', data: {
                user: user
            }
        });
    }
    catch(e){
        res.status(400).json({
            status: 'fail',
            error: {e}
        });
    }
}),

module.exports=Router;