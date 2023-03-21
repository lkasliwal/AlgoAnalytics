const express = require('express')
const Router = express.Router()
const User = require('../models/user')
const axios = require('axios');
const sendError = require('../utils/helper');

const fetchDataFromDjango = async (URL) => {
    try {
        console.log("inside fetchDataFromDjango");
        var result = await fetch(URL);
        return result;
    } catch (e) {
        console.log(e);
    }
}

Router.post('/api/operator/selectpart', async (req, res) => {
    try {
        console.log("inside select part ", req.body.part_name);
        const apiEndpoint = process.env.SELECT_PART_API_ENDPOINT;
        const part_name = req.body.part_name;
        const fullUrl = `${apiEndpoint}/${part_name}`;
        console.log({ apiEndpoint }, { fullUrl }, {part_name});

        var result = fetchDataFromDjango(fullUrl);
        // result = await result.json();
        if (!result) console.log("fetchDataFromDjango result is null");
        console.log({ result });
        res.status(200).json({ part_name });

        // var part_ok_not_ok = "";
        // axios.get(apiEndpoint)
        //     .then(response => {
        //         part_ok_not_ok = response.data;
        //     })
        //     .catch(error => {
        //         console.log(error);
        //     });
    }
    catch (e) {
        res.status(401).send(e);
    }
})

Router.get('/systemstatus', async (req, res) => {
    var obj = {
        "conveyor": "Green",
        "lights": "red",
        "sensors": "red"
    }
    res.send(obj);
})
module.exports = Router;
