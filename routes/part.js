const express=require('express')
const Router=express.Router()
const User = require('../models/user')
const axios = require('axios');
const apiEndpoint = process.env.Select_Part_API_ENDPOINT;

Router.post('/api/operator/selectpart',async(req,res)=>{
    try{
        console.log("inside select part ", req.body);
        const part_name = req.body.part_name;
        if (!part_name) {
            console.log("no part_name");
        }
        const data = {
            name: part_name
          };
        axios.get(apiEndpoint,{params:data})
        .then(response => {
            // part_ok_not_ok=response.data
            // console.log(response.data);
        })
        .catch(error => {
            console.log(error);
        });

        const part = await Part.findOne({part_name});
        res.status(200).json({part_name});
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