const { providerRegister, providerLogin, providerLogout, serviceAdd, serviceUpdate, serviceView, serviceDelete, getOrders } = require('../controllers/providerController')
const { upload } = require('../middleware/multer')
const authProvider = require('../middleware/providerAuth')

const providerRoutes=require('express').Router()

providerRoutes.post('/register',upload.single("document"),providerRegister)
providerRoutes.post('/login',providerLogin)
providerRoutes.post('/logout',providerLogout)
providerRoutes.post('/service',authProvider,upload.array("images"),serviceAdd)
providerRoutes.put('/service/:id',authProvider,upload.array("images"),serviceUpdate)
providerRoutes.get('/service/:id',authProvider,serviceView)
providerRoutes.delete('/service/:id',authProvider,serviceDelete)



//order
// providerRoutes.get('/orders',orderView)
// providerRoutes.put('/acceptOrder/:id', authProvider,acceptRequest);
// providerRoutes.put('/declineOrder/:id', authProvider, declineRequest);




module.exports=providerRoutes
