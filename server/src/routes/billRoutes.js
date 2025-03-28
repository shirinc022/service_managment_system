const { createBill, getBillByOrder, getAllPayments, getProviderPayments, getAdminPayments, getCustomerPayments } = require('../controllers/billController')
const authAdmin = require('../middleware/adminAuth')
const authCustomer = require('../middleware/customerAuth')
const authProvider = require('../middleware/providerAuth')

const billRoutes=require('express').Router()



billRoutes.post('/newbill/:orderId',authProvider,createBill)
billRoutes.get('/getbill/:orderId',getBillByOrder)


// payment in admin dashboard
billRoutes.get('/adminpayments',authAdmin,getAdminPayments)

// payment in provider dashboard
billRoutes.get('/providerpayments',authProvider,getProviderPayments)

// payment in customer dashboard
billRoutes.get('/customerpayments',authCustomer,getCustomerPayments)




module.exports=billRoutes



// // 📌 Create a new bill
// router.post("/create", createBill);

// // 📌 Get all bills for a service provider
// router.get("/provider/:providerId", getBillsByProvider);

// // 📌 Get all bills for a customer
// router.get("/customer/:customerId", getBillsByCustomer);

// // 📌 Update payment status
// router.put("/update-payment/:billId", updatePaymentStatus);