const express=require('express')
const cors =require('cors')
require('dotenv').config()
const connectDB=require('./src/config/db')
const router = require('./src/routes/router')
var cookieParser = require('cookie-parser')
const bodyParser=require('body-parser')

const { paymentWebhook } = require('./src/controllers/paymentController')





const app = express()
connectDB()
app.post('/webhook', bodyParser.raw({ type: 'application/json' }),paymentWebhook);
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true
}))

app.get('/',(req,res)=>{
    res.send('welcome to my project')
})
app.use('/',router)


const port=process.env.PORT
app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
})