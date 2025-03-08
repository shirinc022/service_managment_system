// const { loginUser } = require('../controllers/loginController')
const { getServices } = require('../controllers/providerController')
const adminRoutes = require('./adminRoutes')
const customerRoutes = require('./custometRoutes')
const orderRoutes = require('./orderRoutes')
const providerRoutes = require('./providerRoutes')
const reviewRoutes = require('./reviewRoutes')



const router=require('express').Router()

router.use('/admin',adminRoutes)
router.use('/provider',providerRoutes)
router.use('/customer',customerRoutes)
router.use('/order',orderRoutes)
router.use('/review',reviewRoutes)





router.get('/services',getServices)
// router.post('/login',loginUser)



module.exports=router