const express=require('express')
const Router=express.Router()
const User = require('../models/user');
const Part = require('../models/parts');
const isAdmVerify = require('../middlewares/auth');
const isAuth = require('../middlewares/auth');
//const {isAuth,isAdmin} = require('../middlewares/auth');

Router.post('/api/admin/addpart',isAuth,isAdmVerify,async(req,res)=>{
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

        if(req){
            console.log("request from frontend")
        }
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

Router.get('/api/admin/selectpart',async(req,res)=>{
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
        const users = await User.find({verified:false},{name:1,_id:0,email:1});
        res.send(users);
    }
    catch(e){
        res.status(400).send(e);
    }
}),

Router.put('/userverify',async(req,res)=>{
    try{
        const user = await User.findOneAndUpdate({name:req.body.name,email:req.body.email},{verified:true,role:req.body.role});
        res.send({'message':'User verified'});
    }
    catch(e){
        res.status(401).send(e);
    }
})
module.exports=Router;