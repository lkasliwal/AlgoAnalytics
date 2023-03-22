const express = require('express')
const Router = express.Router()
const User = require('../models/user')
const axios = require('axios');
const sendError = require('../utils/helper');
const parts = require('../models/parts');
const constants = require('../constants/constants');


const fetchDataFromDjango = async (URL) => {
    try {
        console.log("inside fetchDataFromDjango");
        var result = await fetch(URL);
        return result;
    } catch (e) {
        console.log(e);
    }
}

const printResultDetails = (result) => {
    console.log("result.body = ", result.body);
    console.log("result.timingInfo = ", result.timingInfo);
    console.log("result.headersList = ", result.headersList);
    console.log("result.urlList = ", result.urlList);
}

// Router.post('/api/operator/selectpart', async (req, res) => {
//     try {
//         console.log("inside select part ", req.body.part_name);
//         const apiEndpoint = process.env.SELECT_PART_API_ENDPOINT;
//         const part_name = req.body.part_name;
//         const fullUrl = `${apiEndpoint}/${part_name}`;
//         console.log({ apiEndpoint }, { fullUrl }, { part_name });
//         var result = await fetchDataFromDjango(fullUrl);
//         // result = await result.json();
//         if (!result) console.log("fetchDataFromDjango result is null");
//         console.log({result});
//         printResultDetails(result);
//         res.status(200).json({ part_name });
//     }
//     catch (e) {
//         res.status(401).send(e);
//     }
// })

Router.post('/api/operator/selectpart', async (req, res) => {
    try {
        console.log("inside select part ", req.body.part_name);
        const part_name = req.body.part_name;
        const apiEndpoint = process.env.SELECT_PART_API_ENDPOINT;
        const fullUrl = `${apiEndpoint}/${part_name}`;
        console.log({ apiEndpoint }, { fullUrl }, { part_name });
        axios.get(fullUrl)
            .then(response => {
                console.log("selectpart response.data = ", response.data);
                if (!response || !response.data) {
                    return sendError(res, "response is null", 400);
                }
                if (response.data.conveyor == false) {
                    
                } else {
                    constants.part_ok += response.data.ok;
                    constants.part_not_ok += response.data.nok;
                    console.log(constants.part_ok, " ", constants.part_not_ok);
                }
            })
            .catch(error => {
                console.log("selectpart error = ", error);
            });
        res.status(200).json({ part_name });
    } catch (e) {
        res.status(401).send(e);
    }
})

Router.post('/api/operator/get-part-info-by-date', async (req, res) => {
    try {
        console.log("inside get-part-info-by-date");
        var date = req.body.current_date;
        console.log({ date });
        console.log("typeof(date) = ", typeof (date));
        const part_date = await parts.find({ "part_details": { date } });
        console.log({ part_date });
        res.status(200).json({
            status: 'success', data: {
                parts: data
            }
        });
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

Router.post('/api/admin/deletepart', async (req, res) => {
    try {
        console.log("inside deletepart");
        var part_name = req.body.part_name;
        const part = await parts.deleteOne({ part_name });
        console.log({ part });
        if (part.deletedCount == 0) {
            return sendError(res, "Part does not exist", 208);
        }
        return res.status(200).json({
            status: 'success',
            data: null
        });
    }
    catch (e) {
        res.status(400).json({
            status: 'fail',
            error: e
        });
    }
}),

module.exports = Router;
