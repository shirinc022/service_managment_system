const { postReview } = require('../controllers/reviewController')
const authCustomer = require('../middleware/customerAuth')

const reviewRoutes=require('express').Router()


reviewRoutes.post('/postreview/:orderId',authCustomer,postReview)


module.exports=reviewRoutes

