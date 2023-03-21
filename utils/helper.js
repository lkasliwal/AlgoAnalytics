const sendError=(res,error,statusCode=401)=>{
    res.status(statusCode).json({status: 'fail', error})
}

module.exports=sendError