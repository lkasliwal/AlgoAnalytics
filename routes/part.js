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

const getCurrentDate = () => {
    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let currentDate = `${day}-${month}-${year}`;
    console.log({ currentDate });
    return currentDate;
}

const getCurrentPart = async (part_name) => {
    const currentPart = await parts.findOne({ part_name: part_name });
    return currentPart;
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

Router.post('/api/parts/selectpart', async (req, res) => {
    try {
        console.log("inside /api/parts/selectpart", req.body.part_name);
        const part_name = req.body.part_name;
        const apiEndpoint = process.env.SELECT_PART_API_ENDPOINT;
        const fullUrl = `${apiEndpoint}/${part_name}`;
        console.log({ apiEndpoint }, { fullUrl }, { part_name });
        axios.get(fullUrl)
            .then(async (response) => {
                console.log("selectpart response.data = ", response.data);
                if (!response || !response.data) {
                    return sendError(res, "response is null", 400);
                }
                constants.part_ok += response.data.ok;
                constants.part_not_ok += response.data.nok;
                console.log(constants.part_ok, " ", constants.part_not_ok);
                // Enable this line to test for storing datewise part details manually 
                response.data.conveyor = false;
                if (response.data.conveyor == false) {
                    const currentDate = getCurrentDate();
                    let currentPart = await parts.findOne({ part_name: part_name });
                    console.log({ currentPart });
                    currentPart.part_ok += constants.part_ok;
                    currentPart.part_not_ok += constants.part_not_ok;
                    var datewiseData = {
                        "part_date": currentDate,
                        "part_ok_total": constants.part_ok,
                        "part_not_ok_total": constants.part_not_ok
                    };
                    currentPart.part_details_datewise.push(datewiseData);
                    await currentPart.save();
                    constants.part_ok = 0, constants.part_not_ok = 0;
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

Router.post('/api/parts/get-part-info-by-date', async (req, res) => {
    try {
        console.log("inside /api/parts/get-part-info-by-date");
        const part_date = req.body.date;
        console.log({ part_date });
        // console.log("typeof(part_date) = ", typeof (part_date));
        const partData = await parts.find(
            { part_details_datewise: [{ part_date }] }
        );
        console.log({ partData });
        if (partData == {}) {
            res.status(204).json({
                status: 'success',
                data: null
            });
        } else {
            res.status(200).json({
                status: 'success',
                data: {
                    partData
                }
            });
        }

    }
    catch (e) {
        res.status(401).send(e);
    }
})

Router.get('/api/operator/systemstatus', async (req, res) => {
    var obj = {
        "conveyor": "Green",
        "lights": "red",
        "sensors": "red"
    }
    res.send(obj);
})

Router.post('/api/admin/deletepart', async (req, res) => {
    try {
        console.log("inside /api/admin/deletepart");
        var part_name = req.body.part_name;
        const part = await parts.deleteOne({ part_name });
        console.log({ part });
        if (part.deletedCount == 0) {
            return sendError(res, "Part does not exist", 208);
        }
        res.status(200).json({
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
})

module.exports = Router;
