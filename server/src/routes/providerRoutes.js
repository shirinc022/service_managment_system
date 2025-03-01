const { providerRegister, providerLogin, providerLogout, serviceAdd, serviceUpdate, serviceView, serviceDelete } = require('../controllers/providerController')
const { upload } = require('../middleware/multer')
const authProvider = require('../middleware/providerAuth')

const providerRoutes=require('express').Router()

providerRoutes.post('/register',upload.single("document"),providerRegister)
providerRoutes.post('/login',providerLogin)
providerRoutes.post('/logout',providerLogout)
providerRoutes.post('/service',authProvider,upload.array("images"),serviceAdd)
providerRoutes.put('/service/:id',upload.array("images"),serviceUpdate)
providerRoutes.get('/service/:id',serviceView)
providerRoutes.delete('/service/:id',serviceDelete)

//order
// providerRoutes.get('/orders',orderView)











module.exports=providerRoutes
