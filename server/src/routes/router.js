// const { loginUser } = require('../controllers/loginController')
const { contact } = require('../controllers/contactController')
const { getServices, getOneService } = require('../controllers/providerController')
const adminRoutes = require('./adminRoutes')
const billRoutes = require('./billRoutes')
const customerRoutes = require('./custometRoutes')
const orderRoutes = require('./orderRoutes')
const paymentRoutes = require('./paymentRoutes')
const providerRoutes = require('./providerRoutes')
const reviewRoutes = require('./reviewRoutes')



const router=require('express').Router()

router.use('/admin',adminRoutes)
router.use('/provider',providerRoutes)
router.use('/customer',customerRoutes)
router.use('/order',orderRoutes)
router.use('/review',reviewRoutes)
router.use('/bill',billRoutes)
router.use('/payment',paymentRoutes)





router.get('/services',getServices)
router.get('/service/:serviceId',getOneService)
router.post('/contact',contact)




module.exports=router