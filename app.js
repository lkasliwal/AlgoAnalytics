const express = require('express')
const app = express()

require('express-async-errors')
require('dotenv').config()
require('./dbConnection/mongoose')

const partRouter = require('./routes/part');
const adminRouter = require('./routes/admin')
const userRoute = require('./routes/user')
const morgan = require('morgan')
const errorHandler = require('./middlewares/errorHandler')
const cors = require('cors')

// const { fetchData } = require('./routes/django-api');
// fetchData()

app.use(cors())
app.use(express.json())
app.use('/api/user', userRoute)
app.use(errorHandler)
app.use(partRouter);
app.use(adminRouter);

// app.use(django)

app.listen(4000, () => {
    console.log(`listening on port no 4000`);
})
