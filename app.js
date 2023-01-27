const express=require('express')
const app=express()
require('./dbConnection/mongoose')
const userRouter =require('./routes/user')
const partRouter = require('./routes/part');
const adminRouter = require('./routes/admin')
app.use(express.json())
app.use(userRouter);
app.use(partRouter);
app.use(adminRouter);

app.listen(4000,()=>{
    console.log(`listion on port no 4000`)
})
