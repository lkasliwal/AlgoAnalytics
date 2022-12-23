const mongoose=require('mongoose');

mongoose.connect("mongodb://localhost:27017/DefectDetection").then(()=>{
   console.log("mongodb is connected")
}).catch((e)=>{
   console.log("connection failed")
})


module.exports=mongoose;

