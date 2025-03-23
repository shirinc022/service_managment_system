

const { getOrders, placeOrder, acceptOrder, rejectOrder, customerOrderView, deleteOrder, completedOrder, updateBillStatus } = require('../controllers/orderController')
const authCustomer = require('../middleware/customerAuth')
const authProvider = require('../middleware/providerAuth')

const orderRoutes=require('express').Router()
//customer order handle
orderRoutes.post('/request/:serviceId',authCustomer,placeOrder)
orderRoutes.get('/allrequests',authCustomer,customerOrderView)
orderRoutes.delete('/deleterequest/:orderId',authCustomer,deleteOrder)
//provider order handle
orderRoutes.get('/orderview',authProvider,getOrders)
orderRoutes.post('/acceptorder/:orderId',authProvider,acceptOrder)
orderRoutes.post('/rejectorder/:orderId',authProvider,rejectOrder)
orderRoutes.post('/completedorder/:orderId',authProvider,completedOrder)
orderRoutes.put('/billstatus/:orderId',authProvider,updateBillStatus)











module.exports=orderRoutes
