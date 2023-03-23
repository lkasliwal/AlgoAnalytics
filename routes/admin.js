const express = require('express')
const Router = express.Router()
const User = require('../models/user');
const Part = require('../models/parts');
const isAdmVerify = require('../middlewares/auth');
const isAuth = require('../middlewares/auth');
const multer = require('multer');
const AdmZip = require('adm-zip');
const path = require('path');
const fs = require('fs');

// Define storage engine for Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // Get the custom name from the input field
    const part_name = req.body.part_name;

    // Generate a new filename that includes the custom name
    const filename = `${part_name}`;

    cb(null, filename);
  }
});

const upload = multer({ storage });

Router.post('/api/admin/addpart', upload.single('file'), async (req, res) => {

  const { part_name } = req.body;
  const path = req.file;

  console.log(part_name);
  console.log(path)
  const part = new Part({ part_name });
  try {
    await part.save();
    const filePath = req.file.path;
    // Create a new instance of the AdmZip class
    const zip = new AdmZip(filePath);
    const zipEntries = zip.getEntries();

    // iterate through each entry in the zip file and extract it to the specified location
    zipEntries.forEach(function (zipEntry) {
      const fileName = zipEntry.entryName;
      const outputPath = 'uploads/' + fileName;

      // create any necessary directories in the output path
      if (zipEntry.isDirectory) {
        fs.mkdirSync(outputPath, { recursive: true });
      } else {
        zip.extractEntryTo(zipEntry, 'uploads/', false, true);
      }
    });
    // Extract the contents of the zip file to a new folder
    // zip.extractAllTo('/uploads/extracted/',true);
    // Send a response back to the client



    const filePath1 = path.join(__dirname, 'uploads/', part_name); // Set the path to the file you want to delete

    fs.unlink(filePath1, (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log('File deleted successfully');
    });
    res.json({ message: 'File uploaded and extracted successfully' });
    // res.status(200).send({part});
  }
  catch (e) {

    res.status(400).send(e);
  }
})

Router.get('/api/admin/totalpart', async (req, res) => {
  try {

    // if(req){
    //     console.log("request from frontend")
    // }
    var parts = await Part.find();


    //console.log(parts);
    //console.log("api is called")
    var totalOk = 0, totalNok = 0;

    parts.forEach((part) => {
      totalOk += part.part_ok;
      totalNok += part.part_not_ok;
    });
    var total = totalOk + totalNok;
    const obj =
    {
      "total": total,
      "part_ok": totalOk,
      "part_not_ok": totalNok,
      "parts": parts
    }
    return res.send(obj);
  }
  catch (e) {
    res.status(401).send(e);
  }
})

Router.post('/api/admin/selectpart', async (req, res) => {
  console.log("inside /api/admin/selectpart ", req.body.part_name);
  try {
    const part_name = req.body.part_name;
    const part = await Part.findOne({ part_name });
    res.status(200).send(part);
  }
  catch (e) {
    res.status(401).send(e);
  }
})

Router.get('/users', async (req, res) => {
  try {
    const users = await User.find({ adminVerified: false }, { name: 1, _id: 0, email: 1 });
    res.send(users);
  }
  catch (e) {
    res.status(400).send(e);
  }
})

Router.put('/userverify', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate({ name: req.body.name, email: req.body.email }, { adminVerified: true, role: req.body.role });
    res.send({ 'message': 'User verified' });
  }
  catch (e) {
    res.status(401).send(e);
  }
})

module.exports = Router;