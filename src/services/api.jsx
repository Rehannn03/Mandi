import axios from 'axios';
import { data } from 'react-router';

const api=axios.create({
    baseURL:`${import.meta.env.VITE_BACKEND_URL}/api/v1`,
    withCredentials:true,
    headers:{
        'Content-Type':'application/json',
    }
})
// const token=localStorage.getItem('token');
// if(token){
//     api.defaults.headers.common['Authorization']=`Bearer ${token}`;
// }
api.interceptors.request.use((config)=>{
    const token=localStorage.getItem('token');
    if(token){
        config.headers['Authorization']=`Bearer ${token}`
    }
    return config
},
(error)=>{
    return Promise.reject(error)})
export const authService={
    login: async(email,password)=>{
        try {
            const response=await api.post('/user/login',{email,password});
            if(response.data.statusCode===200){
                localStorage.setItem('token',response.data.message.token)
                return response.data
            }
            else {
                {console.log(response.message)}
                return response.error
            }
        } catch (error) {
            throw error.response?.data || error
        }
    },

    logout:async ()=>{
        try {
            const response=await api.get('/user/logout')
            if(response.data.statusCode===200){
                localStorage.removeItem('token')
                delete api.defaults.headers.common['Authorization']
                return 'success'
            }
        } catch (error) {
            throw error.response?.data || error
        }
    },

    getInfo: async()=>{
        try {
            const response=await api.get('/user/getInfo')
            if(response.data.statusCode===200){
                return response.data
            }
        } catch (error) {
            throw error.response?.data || error
        }
    }
}

export const adminService={
    addUser:async (userData)=>{
        try {
            const response=await api.post('/user/addUser',userData)
            if(response.data.statusCode===200){
                return response.data
            }
        } catch (error) {
            throw error.response?.data || error
        }
    },
    addDukaandar:async(data)=>{
        try {
           const response=await api.post('/user/addDukaandar',data)
              if(response.data.statusCode===200){
                return response.data
              } 
        } catch (error) {
            throw error.response?.data || error
        }
    },
    addBepari:async(data)=>{
        try {
            const response=await api.post('/user/addBepari',data)
            if(response.data.statusCode===200){
                return response.data
            }
        } catch (error) {
            throw error.response?.data || error
        }
    },
    prevLedger:async()=>{
        try {
            const response=await api.get('/ledger/getLedgersDate')
            if(response.data.statusCode===200){
                return response.data
            }
        } catch (error) {
            throw error.response?.data || error
        }
    },
    getLedgerByDate:async(date)=>{
        try {
            const response=await api.get(`/ledger/getLedger/${date+'T00:00:00.000+00:00'}`)
            if(response.data.statusCode===200){
                return response.data
            }
        } catch (error) {
            throw error.response?.data || error
        }
    },
    getDukaandar:async()=>{
        try {
            const response=await api.get('/user/viewDukaandars')
            if(response.data.statusCode===200){
                return response.data
            }
        } catch (error) {
            throw error.response?.data || error
        }
    },
    addInflow:async(data)=>{
        try {
            const response=await api.post('/ledger/addInflow',data)
            if(response.data.statusCode===201){
                return response.data
            }
        } catch (error) {
            throw error.response?.data || error
        }
    },
    addOutflow:async(data)=>{
        try {
            const response=await api.post('/ledger/addOutflow',data)
            if(response.data.statusCode===200){
                return response.data
            }
        } catch (error) {
            throw error.response?.data || error
        }
    },
    getDukaandarKhata:async(id)=>{
        try {
            const response=await api.get(`/dukaandar/getKhataByDukaandar/${id}`)
            if(response.data.statusCode===200){
                return response.data
            }
        } catch (error) {
            throw error.response?.data || error
        }
    },
    getBepari:async()=>{
        try {
            const response=await api.get('/user/viewBeparis')
            if(response.data.statusCode===200){
                return response.data
            }
        } catch (error) {
            throw error.response?.data || error
        }
    },
    getBepariKhata:async(id)=>{
        try {
            const response=await api.get(`/bepari/getKhataByBepari/${id}`)
            if(response.data.statusCode===200){
                return response.data
            }
        } catch (error) {
            throw error.response?.data || error
        }
    },
    addKhata:async(data)=>{
        try {
            const response=await api.post('/bepari/addKhata',data)
            if(response.data.statusCode===201){
                return response.data
            }
        } catch (error) {
            throw error.response?.data || error
        }
    },
    getDukaandarDates:async(id)=>{
        try {
            const response=await api.get(`/dukaandar/getKhataDates/${id}`)
            if(response.data.statusCode===200){
                return response.data
            }
        } catch (error) {
            throw error.response?.data || error
        }
    },
    getBepariDates:async(id)=>{
        try {
            const response=await api.get(`/bepari/getKhataDates/${id}`)
            if(response.data.statusCode===200){
                return response.data
            }
        } catch (error) {
            throw error.response?.data || error
        }
    }
}