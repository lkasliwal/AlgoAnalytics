const express=require('express')
const Router=express.Router()
const User = require('../models/user')

//this api is used for 
Router.post('/user/signup',async(req,res)=>{
    const user = new User(req.body);
    console.log(user);
    console.log("Signup");
    try{
        // console.log("Hello")
        await user.save();
        // console.log(2);
        const token = await user.generateAuthToken();
        // console.log(3);

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



module.exports=Router;