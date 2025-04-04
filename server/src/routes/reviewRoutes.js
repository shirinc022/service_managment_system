const { postReview, viewCustomerReview, updateReview, deleteReview, getProviderReviews, listSingleServiceReview, viewAllReviewsForAdmin } = require('../controllers/reviewController')
const authAdmin = require('../middleware/adminAuth')
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
reviewRoutes.get('/allReview',authAdmin,viewAllReviewsForAdmin)



module.exports=reviewRoutes

