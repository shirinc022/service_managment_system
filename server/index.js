const express=require('express')
require('dotenv').config()
const connectDB=require('./src/config/db')
const router = require('./src/routes/router')
var cookieParser = require('cookie-parser')
const cors =require('cors')



const app = express()
connectDB()
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))


app.use('/',router)


const port=process.env.PORT
app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
})