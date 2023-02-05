const express=require('express')
const app=express()
require('./dbConnection/mongoose')
const userRouter =require('./routes/user')
const operatorRouter = require('./routes/operator');
const adminRouter = require('./routes/admin')
const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(userRouter);
app.use(operatorRouter);
app.use(adminRouter);

app.listen(4000,()=>{
    console.log(`listion on port no 4000`)
})
