const { postReview, viewCustomerReview, updateReview, deleteReview, getProviderReviews, listSingleServiceReview } = require('../controllers/reviewController')
const authCustomer = require('../middleware/customerAuth')
const authProvider = require('../middleware/providerAuth')

const reviewRoutes=require('express').Router()


reviewRoutes.post('/postreview/:orderId',authCustomer,postReview)
reviewRoutes.get('/customerReview',authCustomer,viewCustomerReview)
reviewRoutes.put('/customerUpdateReview/:reviewId',authCustomer,updateReview)
reviewRoutes.delete('/customerDeleteReview/:reviewId',authCustomer,deleteReview)


// to get all reviews of single service
reviewRoutes.get('/serviceReviews/:serviceId',listSingleServiceReview)


//get provider review
reviewRoutes.get('/providerReview',authProvider,getProviderReviews)
// reviewRoutes.get('/allReview',authAdmin,viewCustomerReview)



module.exports=reviewRoutes

