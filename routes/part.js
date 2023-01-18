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
        var totalOk,totalNok;
        for (var part in parts){
            totalOk += part.part_ok;
            totalNok += part.part_not_ok;
        }
        var total = totalOk+totalNok;
        const obj = {
            "total":total,
            "part_ok":part_ok,
            "part_not_ok":part_not_ok,
            "parts":parts
        }
        res.send(obj);
    }
    catch(e){
        res.status(401).send(e);
    }
})

module.exports = Router;