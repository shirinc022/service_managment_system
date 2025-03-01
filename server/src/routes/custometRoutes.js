const { customerRegister, customerLogin, customerLogout } = require('../controllers/customerController')


const customerRoutes=require('express').Router()

customerRoutes.post('/register',customerRegister)
customerRoutes.post('/login',customerLogin)
customerRoutes.post('/logout',customerLogout)
//orders
// customerRoutes.get('/orders',orderView)
//review
// customerRoutes.post('/review/:order_id',addReview)
// customerRoutes.put('/review/:order_id',editReview)
// customerRoutes.delete('/review/:order_id',deleteReview)








module.exports=customerRoutes
