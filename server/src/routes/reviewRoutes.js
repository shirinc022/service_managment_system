const { postReview, viewCustomerReview, updateReview, deleteReview, getProviderReviews } = require('../controllers/reviewController')
const authCustomer = require('../middleware/customerAuth')
const authProvider = require('../middleware/providerAuth')

const reviewRoutes=require('express').Router()


reviewRoutes.post('/postreview/:orderId',authCustomer,postReview)
reviewRoutes.get('/customerReview',authCustomer,viewCustomerReview)
reviewRoutes.put('/customerUpdateReview/:reviewId',authCustomer,updateReview)
reviewRoutes.delete('/customerDeleteReview/:reviewId',authCustomer,deleteReview)


//get provider review
reviewRoutes.get('/providerReview',authProvider,getProviderReviews)
// reviewRoutes.get('/allReview',authAdmin,viewCustomerReview)



module.exports=reviewRoutes

