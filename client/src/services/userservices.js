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
