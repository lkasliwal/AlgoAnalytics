const express=require('express')
const Router=express.Router()
const User = require('../models/user')

Router.post('/user/signup',async(req,res)=>{
    const user = new User(req.body);
    console.log(user);
    console.log("Signup");
    try{
        console.log("Hello")
        await user.save();
        // await user.generateAuthToken();
        res.status(201).send();
    }
    catch(e){
        res.status(400).send(e);
    }
})

Router.get('/user/login',async (req,res)=>{
    try{
        const user = await User.findByCredentials(req.body.email,req.body.password);
        const token = await user.generateAuthToken();
        res.status(201).send();
    }
    catch(e){   
        res.status(404).send(e);
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