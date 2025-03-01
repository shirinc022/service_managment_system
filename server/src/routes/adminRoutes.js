const { adminLogin, adminRegister, adminLogout, adminVerifyProvider } = require('../controllers/adminController')
const authAdmin = require('../middleware/adminAuth')

const adminRoutes=require('express').Router()

adminRoutes.post('/register',adminRegister)
adminRoutes.post('/login',adminLogin)
adminRoutes.post('/logout',adminLogout)
adminRoutes.put('/verify/:providerId',authAdmin,adminVerifyProvider)



module.exports=adminRoutes