const { getServices } = require('../controllers/providerController')
const adminRoutes = require('./adminRoutes')
const customerRoutes = require('./custometRoutes')
const providerRoutes = require('./providerRoutes')



const router=require('express').Router()

router.use('/admin',adminRoutes)
router.use('/provider',providerRoutes)
router.use('/customer',customerRoutes)
router.get('/services',getServices)



module.exports=router