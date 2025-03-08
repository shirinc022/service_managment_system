const { adminLogin, adminRegister, adminLogout, adminVerifyProvider, getCustomers, getProviders, getOrdersView } = require('../controllers/adminController')

const authAdmin = require('../middleware/adminAuth')

const adminRoutes=require('express').Router()

adminRoutes.post('/register',adminRegister)
adminRoutes.post('/login',adminLogin)
adminRoutes.post('/logout',adminLogout)
adminRoutes.put('/verify/:providerId',authAdmin,adminVerifyProvider)


adminRoutes.get('/customers',authAdmin,getCustomers)
adminRoutes.get('/providers',authAdmin,getProviders)
adminRoutes.get('/orders',authAdmin,getOrdersView)





module.exports=adminRoutes