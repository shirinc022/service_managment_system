const { createBill, getBillByOrder } = require('../controllers/billController')
const authProvider = require('../middleware/providerAuth')

const billRoutes=require('express').Router()



billRoutes.post('/newbill/:orderId',authProvider,createBill)
billRoutes.get('/getbill/:orderId',getBillByOrder)





module.exports=billRoutes



// // 📌 Create a new bill
// router.post("/create", createBill);

// // 📌 Get all bills for a service provider
// router.get("/provider/:providerId", getBillsByProvider);

// // 📌 Get all bills for a customer
// router.get("/customer/:customerId", getBillsByCustomer);

// // 📌 Update payment status
// router.put("/update-payment/:billId", updatePaymentStatus);