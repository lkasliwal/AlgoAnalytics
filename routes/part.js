const express=require('express')
const Router=express.Router()
const User = require('../models/user')
const axios = require('axios');
const apiEndpoint = process.env.Select_Part_API_ENDPOINT;

Router.get('/api/operator/selectpart',async(req,res)=>{
    try{
        const part_name = req.body.part_name;
        const data = {
            name: part_name
          };
        apiEndpoint=apiEndpoint+part_name;
        var part_ok_not_ok="";
        axios.get(apiEndpoint)
        .then(response => {
            part_ok_not_ok=response.data;
        })
        .catch(error => {
            console.log(error);
        });

//         const part = await Part.findOne({part_name});
        res.status(200).send(part_ok_not_ok);
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
