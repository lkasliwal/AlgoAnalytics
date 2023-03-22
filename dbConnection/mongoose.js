const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/DefectDetection").then(() => {
   console.log("mongodb is connected")
}).catch((e) => {
   console.log("mongodb connection failed")
})

module.exports = mongoose;

