const express=require('express')
const Router=express.Router()
const Admin = require('../models/admin')

Router.post('/admin/signup',async(req,res)=>{
    const admin = new Admin(req.body);
    try{
        await admin.save();
        const token = await admin.generateAuthToken();
        res.status(201).send({admin,token});
    }
    catch(e){
        res.status(400).send(e);
    }
})

Router.post('admin/login',async (req,res)=>{
    try{
        const admin = await Admin.findByCredentials(req.body.email,req.body.password);
        const token = await admin.generateAuthToken();
        res.send({user,token});
    }
    catch(e){   
        res.status(404).send(e);
    }
})

module.exports=Router;