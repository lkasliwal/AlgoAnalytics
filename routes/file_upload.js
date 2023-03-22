const express = require('express')
const Router = express.Router()
const multer = require('multer');
const AdmZip = require('adm-zip');

// Set up file upload middleware using multer
const upload = multer({ dest: 'uploads/' });

// Define a route to handle file uploads
Router.post('/api/upload', upload.single('file'), (req, res) => {
  // Get the path to the uploaded file
  const filePath = req.file.path;
  // Create a new instance of the AdmZip class
  const zip = new AdmZip(filePath);
  // Extract the contents of the zip file to a new folder
  zip.extractAllTo('../uploads/extracted', /*overwrite*/ true);
  // Send a response back to the client
  res.json({ message: 'File uploaded and extracted successfully' });
});