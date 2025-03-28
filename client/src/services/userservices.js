import { axiosInstance } from "../axios/axiosInstance"



export const listServices = () =>{
    return axiosInstance.get('/services')
}

export const listSingleService = (serviceId) =>{
    return axiosInstance.get(`/service/${serviceId}`)
}

export const adminLogin = (data) =>{
    return axiosInstance.post('/admin/login',data)
}


export const providerLogin = (data) =>{
    return axiosInstance.post('/provider/login',data)
}


export const customerLogin = (data) =>{
    return axiosInstance.post('/customer/login',data)
}

export const adminSignup = (data) =>{
    return axiosInstance.post('/admin/register',data)
}


export const providerSignup = (data) =>{
    return axiosInstance.post('/provider/register',data)
}


export const customerSignup = (data) =>{
    return axiosInstance.post('/customer/register',data)
}
// customer verification
export const customerVerified = (token) =>{
    return axiosInstance.post(`/customer/verify/${token}`)
}

export const customerLogout = () =>{
    return axiosInstance.post('/customer/logout')
}

export const providerLogout = () =>{
    return axiosInstance.post('/provider/logout')
}

export const adminLogout = () =>{
    return axiosInstance.post('/admin/logout')
}

//Admin Dashboard
export const adminGetCustomers = () =>{
    return axiosInstance.get('/admin/customers')
}

export const adminGetProviders = () =>{
    return axiosInstance.get('/admin/providers')
}

export const adminVerifyProvider = (providerId) =>{
    return axiosInstance.put(`/admin/verify/${providerId}`)
}


export const adminRejectProvider = (providerId) =>{
    return axiosInstance.put(`/admin/reject/${providerId}`)
}


export const adminGetOrders = () =>{
    return axiosInstance.get('/admin/orders')
}

//Provider Dashboard

export const providerGetServices = () =>{
    return axiosInstance.get('/provider/allservices')
}


export const providerDeleteService = (serviceId) =>{
    return axiosInstance.delete(`/provider/service/${serviceId}`)
}

export const providerAddService = (data) =>{
    return axiosInstance.post('/provider/service',data)
}

export const providerUpdateService = (serviceId,data) =>{
    return axiosInstance.put(`/provider/service/${serviceId}`,data)
}


export const providerGetOneService = (serviceId) =>{
    return axiosInstance.get(`/provider/service/${serviceId}`)
}


export const providerAllOrders = () =>{
    return axiosInstance.get('/order/orderview')
}

export const providerAcceptOrder = (orderId) =>{
    return axiosInstance.post(`/order/acceptorder/${orderId}`)
}

export const providerRejectOrder = (orderId) =>{
    return axiosInstance.post(`/order/rejectorder/${orderId}`)
}


export const providerCompletedOrder = (orderId) =>{
    return axiosInstance.post(`/order/completedorder/${orderId}`)
}


// Customer order

export const customerAllOrder = () =>{
    return axiosInstance.get('/order/allrequests')
}


export const customerDeleteOrder = (orderId) =>{
    return axiosInstance.delete(`/order/deleterequest/${orderId}`)
}

//customer book now request
export const customerOrderRequest = (serviceId,data) =>{
    return axiosInstance.post(`/order/request/${serviceId}`,data)
}


//provider bill generation after completing service
export const providerBillGeneration = (orderId,data) =>{
    return axiosInstance.post(`/bill/newbill/${orderId}`,data)
}

// update bill stautus in order model to bill sent
export const providerBillsent = (orderId) =>{
    return axiosInstance.put(`order/billstatus/${orderId}`)
}

//get bill by OrderId
export const getBill = (orderId) =>{
    return axiosInstance.get(`/bill/getbill/${orderId}`)
}


// stripe payment
export const makePaymentOnStripe = (body) =>{
    return axiosInstance.post('/payment/checkout',body)
}


// submit review
export const customerSubmitReview = (orderId,data) =>{
    return axiosInstance.post(`/review/postreview/${orderId}`,data)
}

// get reviews in product detail page
export const listSingleServiceReview = (serviceId) =>{
    return axiosInstance.get(`/review/serviceReviews/${serviceId}`)
}

// customer get review
export const customerGetReviews = () =>{
    return axiosInstance.get('/review/customerReview')
}

export const customerUpdateReview = (reviewId,data) =>{
    return axiosInstance.put(`/review/customerUpdateReview/${reviewId}`,data)
}

export const customerdeleteReview = (reviewId) =>{
    return axiosInstance.delete(`/review/customerDeleteReview/${reviewId}`)
}

//customer profile

export const getCustomerProfile = () =>{
    return axiosInstance.get('/customer/profile')
}

export const updateCustomerPassword = (data) =>{
    return axiosInstance.put('/customer/change-password',data)
}

//provider profile

export const getProviderProfile = () =>{
    return axiosInstance.get('/provider/profile')
}

export const updateProviderPassword = (data) =>{
    return axiosInstance.put('/provider/change-password',data)
}

export const updateProviderPhone  = (data) =>{
    return axiosInstance.put('/provider/update-phone',data)
}

// provider reviews

export const providerGetReviews = () =>{
    return axiosInstance.get('/review/providerReview')
}

// admin profile

export const adminGetProfile = () =>{
    return axiosInstance.get('/admin/profile')
}

export const adminChangePassword = (data) =>{
    return axiosInstance.put('/admin/profile/change-password',data)
}

export const adminUpdateProfile = (data) =>{
    return axiosInstance.put('/admin/profile/update',data)
}

// contact
export const contact = (data) =>{
    return axiosInstance.post('/contact',data)
}

