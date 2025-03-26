const { providerRegister, providerLogin, providerLogout, serviceAdd, serviceUpdate, serviceView, serviceDelete, getOrders, allProviderServiceView, getProviderProfile, updateProviderPassword, updateProviderPhone } = require('../controllers/providerController')
const { upload } = require('../middleware/multer')
const authProvider = require('../middleware/providerAuth')

const providerRoutes=require('express').Router()

providerRoutes.post('/register',upload.single("document"),providerRegister)
providerRoutes.post('/login',providerLogin)
providerRoutes.post('/logout',providerLogout)
providerRoutes.post('/service',authProvider,upload.array("images"),serviceAdd)
providerRoutes.put('/service/:serviceId',authProvider,upload.array("images"),serviceUpdate)
providerRoutes.get('/service/:id',authProvider,serviceView)
providerRoutes.get('/allservices',authProvider,allProviderServiceView)
providerRoutes.delete('/service/:id',authProvider,serviceDelete)

//profile
providerRoutes.get("/profile",authProvider,getProviderProfile)
providerRoutes.put("/change-password",authProvider,updateProviderPassword)
providerRoutes.put("/update-phone",authProvider,updateProviderPhone)










module.exports=providerRoutes
