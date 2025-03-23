const { paymentFunction, paymentWebhook } = require('../controllers/paymentController')
const authCustomer = require('../middleware/customerAuth')
const express = require('express');
const paymentRoutes = express.Router()

paymentRoutes.post('/checkout',authCustomer,paymentFunction)
paymentRoutes.post('/webhook', express.raw({ type: 'application/json' }), paymentWebhook);



module.exports=paymentRoutes