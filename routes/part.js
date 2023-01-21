const express = require('express');
const Router = express.Router();
const Part = require('../models/parts');

Router.post('/addpart',async(req,res)=>{
    const part = new Part(req.body);
    try{
        await part.save();
        res.status(200).send({part});
    }
    catch(e){
        res.status(400).send(e);
    }
})

Router.get('/totalpart',async(req,res)=>{
    try{
        var parts = await Part.find();
        console.log(parts)
        var totalOk=0,totalNok=0;
        for (var part=0;part<parts.length;part++){
            console.log(part)
            totalOk += parts[part].part_ok;
            totalNok += parts[part].part_not_ok;
        }
        var total = totalOk+totalNok;
        const obj = {
            "total":total,
            "part_ok":totalOk,
            "part_not_ok":totalNok,
            "parts":parts
        }
        res.send(obj);
    }
    catch(e){
        res.status(401).send(e);
    }
})

Router.get('/selectpart',async(req,res)=>{
    try{
        const part_name = req.body.part_name;
        const part = await Part.findOne({part_name});
        res.status(200).send(part);
    }
    catch(e){
        res.status(401).send(e);
    }
})
module.exports = Router;