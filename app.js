const express=require('express')
const app=express()
require('./dbConnection/mongoose')
const adminRouter =require('./routes/admin')
app.use(express.json())
app.use(adminRouter)


app.listen(4000,()=>{
    console.log(`listion on port no 4000`)
})
