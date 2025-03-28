const express = require('express')
const cors = require('cors')
require('dotenv').config()
const connectDB = require('./src/config/db')
const router = require('./src/routes/router')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const { paymentWebhook } = require('./src/controllers/paymentController')

const app = express()
connectDB()

// Webhook should receive raw body for Stripe signature verification
app.post('/webhook', bodyParser.raw({ type: 'application/json' }), paymentWebhook)

// Apply JSON middleware **after** defining the webhook
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))

app.get('/', (req, res) => {
    res.send('Welcome to my project')
})
app.use('/', router)

const port = process.env.PORT
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
