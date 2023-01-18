const express=require('express')
const app=express()
require('./dbConnection/mongoose')
const adminRouter =require('./routes/admin')
const partRouter = require('./routes/part');
app.use(express.json())
app.use(adminRouter)
app.use(partRouter);


app.listen(4000,()=>{
    console.log(`listining on port no 4000`)
})
