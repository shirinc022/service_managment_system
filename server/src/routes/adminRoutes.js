const { adminLogin, adminRegister, adminLogout, adminVerifyProvider, getCustomers, getProviders, getOrdersView, adminRejectProvider, getAdminProfile, updateAdminProfile, changeAdminPassword, getAdminReviews } = require('../controllers/adminController')

const authAdmin = require('../middleware/adminAuth')

const adminRoutes=require('express').Router()

adminRoutes.post('/register',adminRegister)
adminRoutes.post('/login',adminLogin)
adminRoutes.post('/logout',adminLogout)
adminRoutes.put('/verify/:providerId',authAdmin,adminVerifyProvider)
adminRoutes.put('/reject/:providerId',authAdmin,adminRejectProvider)



adminRoutes.get('/customers',authAdmin,getCustomers)
adminRoutes.get('/providers',authAdmin,getProviders)
adminRoutes.get('/orders',authAdmin,getOrdersView)


adminRoutes.get("/profile", authAdmin, getAdminProfile);
adminRoutes.put("/profile/update", authAdmin, updateAdminProfile);
adminRoutes.put("/profile/change-password", authAdmin, changeAdminPassword);
adminRoutes.get("/reviews", authAdmin, getAdminReviews);




module.exports=adminRoutes