const express=require('express')
const Router=express.Router()
const User = require('../models/user')

Router.get('/api/operator/selectpart',async(req,res)=>{
    try{
        const part_name = req.body.part_name;
        const part = await Part.findOne({part_name});
        res.status(200).send(part);
    }
    catch(e){
        res.status(401).send(e);
    }
})

Router.get('/systemstatus',async(req,res)=>{
    var obj = {
        "conveyor":"Green",
        "lights":"red",
        "sensors":"red"
    }
    res.send(obj);
})
module.exports=Router;