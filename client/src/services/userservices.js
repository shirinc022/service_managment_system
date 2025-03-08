import { axiosInstance } from "../axios/axiosInstance"



export const listServices = () =>{
    return axiosInstance.get('/services')
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