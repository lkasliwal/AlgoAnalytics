const express=require('express')
const Router=express.Router()
const User = require('../models/user')

Router.post('/user/signup',async(req,res)=>{
    const user = new User(req.body);
    console.log("Signup");
    try{
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({user,token});
    }
    catch(e){
        res.status(400).send(e);
    }
})

Router.post('/user/login',async (req,res)=>{
    try{
        const user = await User.findByCredentials(req.body.email,req.body.password);
        const token = await user.generateAuthToken();
        res.send({user,token});
    }
    catch(e){   
        res.status(404).send(e);
    }
})

Router.get('/users',async(req,res)=>{
    try{
        const users = await User.find({verified:false},{name:1});
        res.send(users);
    }
    catch(e){
        res.status(400).send(e);
    }
}),

Router.put('/userverify',async(req,res)=>{
    try{
        const user = await User.findOneAndUpdate({name:req.body.name},{verified:true,role:req.body.role});
        res.send({'message':'User verified'});
    }
    catch(e){
        res.status(401).send(e);
    }
})
module.exports=Router;